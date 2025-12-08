import random

class MockAnalyzer:
    def analyze(self, text):
        labels = {
            "Truth": random.uniform(0.1, 0.9),
            "Lie": random.uniform(0.1, 0.9),
            "Manipulation": random.uniform(0.1, 0.9),
            "Sarcasm": random.uniform(0.1, 0.9),
            "Clickbait": random.uniform(0.1, 0.9),
        }
        
        total = sum(labels.values())
        labels = {k: v / total for k, v in labels.items()}

        words = text.split()
        lime_importance = []
        if words:
            selected_words = random.sample(words, min(len(words), 5))
            for word in selected_words:
                lime_importance.append({
                    "word": word,
                    "score": random.uniform(-0.5, 0.5)
                })
        else:
             lime_importance = [
                 {"word": "example", "score": 0.4},
                 {"word": "fake", "score": -0.3}
             ]

        verdict_score = random.random()
        if verdict_score > 0.7:
            verdict = "Mostly-True"
            confidence = random.uniform(0.8, 0.99)
        elif verdict_score > 0.4:
            verdict = "Mixed"
            confidence = random.uniform(0.5, 0.8)
        else:
            verdict = "Pants-Fire"
            confidence = random.uniform(0.7, 0.95)

        summary = (
            "This is a mocked AI summary of the text. "
            "The model detected potential misinformation patterns. "
            "Please verify with trusted sources."
        )

        lime_html = '<div style="font-family: monospace; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px; color: #e2e8f0;">'
        for item in lime_importance:
            color = "rgba(34, 197, 94, 0.4)" if item['score'] > 0 else "rgba(239, 68, 68, 0.4)"
            lime_html += f'<span style="background-color: {color}; padding: 0 2px; border-radius: 2px; margin: 0 2px;">{item["word"]}</span> '
        lime_html += '</div>'

        radar_data = [
            { "subject": 'Emotionality', "A": random.randint(50, 150), "fullMark": 150 },
            { "subject": 'Subjectivity', "A": random.randint(50, 150), "fullMark": 150 },
            { "subject": 'Polarity', "A": random.randint(50, 150), "fullMark": 150 },
            { "subject": 'Toxicity', "A": random.randint(50, 150), "fullMark": 150 },
            { "subject": 'Reliability', "A": random.randint(50, 150), "fullMark": 150 },
            { "subject": 'Factuality', "A": random.randint(50, 150), "fullMark": 150 },
        ]

        labels_list = [{"name": k, "value": v, "fill": "#ef4444" if k in ["Lie", "Manipulation", "Clickbait"] else "#3b82f6"} for k, v in labels.items()]
        labels_list.sort(key=lambda x: x['value'], reverse=True)

        return {
            "verdict": verdict,
            "confidence": confidence,
            "summary": summary,
            "labels": labels_list,
            "lime_importance": lime_importance,
            "lime_html": lime_html,
            "radarData": radar_data
        }

class RapidAPIService:
    RAPIDAPI_KEY = "4602cffd11mshf6aa58d728785ffp14d237jsn13562beb4dda"
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

from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import os

class BERTService:
    _model = None
    _tokenizer = None
    
    LABELS = {
        0: "True",
        1: "Satire/Parody",
        2: "Misleading Content",
        3: "Imposter Content",
        4: "False",
        5: "Manipulated Content"
    }

    @classmethod
    def _load_model(cls):
        if cls._model is None or cls._tokenizer is None:
            model_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'ml_models')
            
            print(f"Loading BERT model from {model_path}...")
            try:
                cls._tokenizer = AutoTokenizer.from_pretrained(model_path)
                cls._model = AutoModelForSequenceClassification.from_pretrained(model_path)
                cls._model.eval() # Set to evaluation mode
                print("BERT model loaded successfully.")
            except Exception as e:
                print(f"Error loading BERT model: {e}")
                raise e

    @classmethod
    def predict(cls, text):
        import torch
        
        if not text:
            return None
            
        cls._load_model()
        
        inputs = cls._tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
        
        with torch.no_grad():
            outputs = cls._model(**inputs)
            probabilities = torch.nn.functional.softmax(outputs.logits, dim=-1)
            
        top_prob, top_label_idx = torch.max(probabilities, dim=-1)
        top_label_idx = top_label_idx.item()
        top_prob = top_prob.item()
        
        sorted_probs, sorted_indices = torch.sort(probabilities, descending=True)
        first_prob = sorted_probs[0][0].item()
        second_prob = sorted_probs[0][1].item()
        
        if (first_prob - second_prob) <= 0.15:
            verdict = "Inconclusive"
        else:
            verdict = cls.LABELS.get(top_label_idx, "Unknown")
        
        labels_list = []
        for idx, label_name in cls.LABELS.items():
            prob = probabilities[0][idx].item()
            
            if prob < 0.01:
                prob = 0.0
            else:
                prob = round(prob, 3)
                
            labels_list.append({
                "name": label_name,
                "value": prob,
                "fill": "#ef4444" if label_name in ["False", "Manipulated Content", "Misleading Content", "Imposter Content"] else "#3b82f6"
            })
            
        labels_list.sort(key=lambda x: x['value'], reverse=True)
        
        return {
            "verdict": verdict,
            "confidence": round(top_prob, 3),
            "labels": labels_list
        }

class GeminiService:
    API_KEY = "AIzaSyA-88DnycdQewDunWzVb6_3DmNJVIvzC1o"
    
    @classmethod
    def analyze_content(cls, text, context_info="", labels=None):
        import google.generativeai as genai
        import json
        import re
        
        if not text:
            return {
                "summary": "No text provided for analysis.",
                "radar_data": []
            }
            
        try:
            genai.configure(api_key=cls.API_KEY)
            model = genai.GenerativeModel("gemma-3-27b-it")
            
            labels_str = ", ".join([f"{l['name']} ({l['value']:.2f})" for l in labels]) if labels else "N/A"
            
            prompt = (
                f"Analyze the following social media post text for potential misinformation.\n"
                f"Context: {context_info}\n"
                f"Model Predictions: {labels_str}\n"
                f"Text: {text}\n\n"
                f"Please provide a JSON response with two keys:\n"
                f"1. 'summary': A Markdown string with the following sections:\n"
                f"   - **Main Claims**: Briefly summarize the core claims.\n"
                f"   - **Is it true?**: Your assessment based on general knowledge.\n"
                f"   - **Indicators**: Why does it fit the predicted labels? (e.g., emotional language, lack of sources).\n"
                f"   - **Confidence**: How confident are you in this assessment?\n"
                f"   - **Disclosure**: A brief note that this is AI-generated.\n"
                f"2. 'metrics': An object with integer scores (0-100) for:\n"
                f"   - sensationability\n"
                f"   - controversy\n"
                f"   - conspiracy\n"
                f"   - absurdness\n"
                f"   - emotionality\n\n"
                f"Return ONLY the valid JSON object. Do not include markdown formatting like ```json."
            )
            
            response = model.generate_content(prompt)
            content = response.text
            
            content = re.sub(r'```json\s*', '', content)
            content = re.sub(r'```', '', content)
            
            data = json.loads(content)
            
            summary = data.get('summary', "Summary unavailable.")
            metrics = data.get('metrics', {})
            
            radar_data = [
                { "subject": 'Sensationability', "A": metrics.get('sensationability', 0), "fullMark": 100 },
                { "subject": 'Controversy', "A": metrics.get('controversy', 0), "fullMark": 100 },
                { "subject": 'Conspiracy', "A": metrics.get('conspiracy', 0), "fullMark": 100 },
                { "subject": 'Absurdness', "A": metrics.get('absurdness', 0), "fullMark": 100 },
                { "subject": 'Emotionality', "A": metrics.get('emotionality', 0), "fullMark": 100 },
            ]
            
            return {
                "summary": summary,
                "radar_data": radar_data
            }
            
        except Exception as e:
            print(f"Gemini API Error: {e}")
            return {
                "summary": "AI Summary unavailable due to an error (likely rate limit).",
                "radar_data": [
                    { "subject": 'Sensationability', "A": 0, "fullMark": 100 },
                    { "subject": 'Controversy', "A": 0, "fullMark": 100 },
                    { "subject": 'Conspiracy', "A": 0, "fullMark": 100 },
                    { "subject": 'Absurdness', "A": 0, "fullMark": 100 },
                    { "subject": 'Emotionality', "A": 0, "fullMark": 100 },
                ]
            }

