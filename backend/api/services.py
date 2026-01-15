import os

class RapidAPIService:
    RAPIDAPI_KEY = os.environ.get("RAPIDAPI_KEY")
    RAPIDAPI_HOST = "social-download-all-in-one.p.rapidapi.com"
    API_URL = "https://social-download-all-in-one.p.rapidapi.com/v1/social/autolink"

    @classmethod
    def fetch_text_from_url(cls, url):
        import requests
        
        payload = {"url": url}
        headers = {
            "x-rapidapi-key": cls.RAPIDAPI_KEY,
            "x-rapidapi-host": cls.RAPIDAPI_HOST,
            "Content-Type": "application/json"
        }

        try:
            response = requests.post(cls.API_URL, json=payload, headers=headers)
            if response.status_code == 200:
                data = response.json()
                if data.get('error'):
                    print(f"RapidAPI Logic Error: {data.get('message')}")
                    return None, data.get('message', 'Unknown API error')
                return data.get('title', ''), None
            else:
                print(f"RapidAPI Error: {response.status_code} - {response.text}")
                return None, f"HTTP Error {response.status_code}"
        except Exception as e:
            print(f"RapidAPI Script Error: {e}")
            return None, str(e)

class OpenRouterService:
    API_KEY = os.environ.get("OPENROUTER_API_KEY")
    BASE_URL = "https://openrouter.ai/api/v1"
    
    MODEL_MAP = {
        "deepseek": "tngtech/deepseek-r1t2-chimera:free",
        "gpt-oss": "openai/gpt-oss-120b:free",
        "gemma": "openai/gpt-oss-120b:free"
    }

    @classmethod
    def analyze_content(cls, text, context_info="", labels=None, model_key="gemma"):
        from openai import OpenAI
        import json
        import re

        if not text:
            return {
                "summary": "No text provided for analysis.",
                "radar_data": [],
                "labels": [],
                "verdict": "Unknown",
                "confidence": 0.0
            }

        try:
            client = OpenAI(
                api_key=cls.API_KEY,
                base_url=cls.BASE_URL
            )
            
            model_id = cls.MODEL_MAP.get(model_key, cls.MODEL_MAP["gemma"])
            
            prompt = (
                f"Analyze the following social media post text for potential misinformation.\n"
                f"Context: {context_info}\n"
                f"Text: {text}\n\n"
                f"Please provide a JSON response with three keys:\n"
                f"1. 'summary': A Markdown string with the following sections:\n"
                f"   - **Main Claims**: Briefly summarize the core claims.\n"
                f"   - **Is it true?**: Your assessment based on general knowledge.\n"
                f"   - **Indicators**: Why does it fit the predicted labels? (e.g., emotional language, lack of sources).\n"
                f"   - **Confidence**: How confident are you in this assessment?\n"
                f"   - **Disclosure**: A brief note that this is AI-generated ({model_key}).\n"
                f"2. 'metrics': An object with integer scores (0-100) for:\n"
                f"   - sensationability\n"
                f"   - controversy\n"
                f"   - conspiracy\n"
                f"   - absurdness\n"
                f"   - emotionality\n"
                f"3. 'labels': An object with float scores (0.0-1.0) for the following keys:\n"
                f"   - True\n"
                f"   - Satire/Parody\n"
                f"   - Misleading Content\n"
                f"   - Imposter Content\n"
                f"   - False\n"
                f"   - Manipulated Content\n\n"
                f"Return ONLY the valid JSON object. Do not include markdown formatting like ```json."
            )

            response = client.chat.completions.create(
                model=model_id,
                messages=[
                    {"role": "system", "content": "You are an expert misinformation analyst."},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"}
            )

            content = response.choices[0].message.content
            
            # Clean up potential markdown code blocks if not using json mode
            content = re.sub(r'```json\s*', '', content)
            content = re.sub(r'```', '', content)

            try:
                data = json.loads(content)
            except json.JSONDecodeError:
                # Fallback if not valid JSON
                data = {"summary": content}

            summary = data.get('summary', "Summary unavailable.")
            metrics = data.get('metrics', {})
            raw_labels = data.get('labels', {})

            radar_data = [
                { "subject": 'Sensationability', "A": metrics.get('sensationability', 0), "fullMark": 100 },
                { "subject": 'Controversy', "A": metrics.get('controversy', 0), "fullMark": 100 },
                { "subject": 'Conspiracy', "A": metrics.get('conspiracy', 0), "fullMark": 100 },
                { "subject": 'Absurdness', "A": metrics.get('absurdness', 0), "fullMark": 100 },
                { "subject": 'Emotionality', "A": metrics.get('emotionality', 0), "fullMark": 100 },
            ]

            # Process labels
            labels_list = []
            for name, value in raw_labels.items():
                labels_list.append({
                    "name": name,
                    "value": value,
                    "fill": "#ef4444" if name in ["False", "Manipulated Content", "Misleading Content", "Imposter Content"] else "#3b82f6"
                })
            labels_list.sort(key=lambda x: x['value'], reverse=True)
            
            # Determine verdict
            if labels_list:
                top_label = labels_list[0]
                verdict = top_label['name']
                confidence = top_label['value']
            else:
                verdict = "Unknown"
                confidence = 0.0

            return {
                "summary": summary,
                "radar_data": radar_data,
                "labels": labels_list,
                "verdict": verdict,
                "confidence": confidence
            }

        except Exception as e:
            print(f"OpenRouter API Error: {e}")
            return {
                "summary": f"AI Summary unavailable due to an error: {e}",
                "radar_data": [],
                "labels": [],
                "verdict": "Error",
                "confidence": 0.0
            }
