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
            # First try local model, then fallback to HuggingFace
            model_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'ml_models')
            
            # Check if local model exists
            if os.path.exists(model_path) and os.path.isdir(model_path):
                print(f"Loading BERT model from {model_path}...")
                try:
                    cls._tokenizer = AutoTokenizer.from_pretrained(model_path)
                    cls._model = AutoModelForSequenceClassification.from_pretrained(model_path)
                    cls._model.eval()
                    print("BERT model loaded successfully from local path.")
                    return
                except Exception as e:
                    print(f"Could not load local model: {e}")
            
            # Fallback to HuggingFace model for fake news detection
            print("Loading BERT model from HuggingFace Hub...")
            try:
                model_name = "hamzab/roberta-fake-news-classification"
                cls._tokenizer = AutoTokenizer.from_pretrained(model_name)
                cls._model = AutoModelForSequenceClassification.from_pretrained(model_name)
                cls._model.eval()
                print("BERT model loaded successfully from HuggingFace.")
            except Exception as e:
                print(f"Error loading BERT model from HuggingFace: {e}")
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
            
            base_prompt = (
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
            
            # RAG ile prompt'u augment et
            augmented_prompt = RAGService.augment_prompt(text, base_prompt)
            
            response = model.generate_content(augmented_prompt)
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

import numpy as np
from sentence_transformers import SentenceTransformer
import faiss
import json
import os

class RAGService:
    _index = None
    _embedder = None
    _documents = None
    _initialized = False

    KNOWLEDGE_BASE = [
        "Clickbait headlines often use sensational language, all-caps words, and emotional triggers to get attention without providing substantial information.",
        "Fake news articles frequently lack credible sources, author information, or publication dates.",
        "Manipulated content includes edited images, videos, or quotes taken out of context to mislead viewers.",
        "Satire and parody sites use humor and exaggeration to comment on real events, but may be mistaken for real news.",
        "Misleading content uses real information but presents it in a misleading way, often through cherry-picking data or misrepresenting statistics.",

        "Credible news sources typically include multiple sources, expert quotes, and verifiable facts.",
        "Real news articles have clear author attributions, publication dates, and transparent correction policies.",
        "Fact-checking organizations like Snopes, FactCheck.org, and PolitiFact verify claims using primary sources.",

        "Excessive use of emotional language (fear, anger, outrage) without factual support is a common indicator of misinformation.",
        "Claims that seem too good or too bad to be true often require additional verification from trusted sources.",
        "Conspiracy theories typically lack credible evidence and rely on unverified anecdotes or speculation.",
        "Imposter content mimics legitimate news sources by using similar names, logos, or URLs to deceive readers.",

        "Viral social media posts often spread misinformation faster than corrections can reach the same audience.",
        "Bots and coordinated inauthentic behavior amplify false narratives on social media platforms.",
        "Posts with urgent calls to action ('Share before they delete this!') often indicate manipulative content.",

        "Reliable content typically presents balanced perspectives and acknowledges uncertainty where appropriate.",
        "Misinformation often uses absolute language ('always', 'never', 'everyone') without nuance.",
        "Lack of original reporting or investigation suggests content may be recycled or fabricated.",

        "Reverse image search can reveal if images have been used in different contexts or manipulated.",
        "Deepfakes and AI-generated content are increasingly sophisticated but often have subtle artifacts.",

        "Established news organizations have editorial standards, fact-checking processes, and accountability mechanisms.",
        "Anonymous or obscure sources without verifiable credentials should be treated with skepticism.",
        "Cross-referencing claims across multiple independent credible sources increases reliability.",

        "Old news stories reposted without context can mislead people about current events.",
        "Misinformation often emerges during breaking news events when information is still developing.",
    ]

    @classmethod
    def _initialize(cls):
        if cls._initialized:
            return

        try:
            print("Initializing RAG system...")

            if cls._documents is None:
                cls._documents = []

            if cls.KNOWLEDGE_BASE:
                cls._documents = cls.KNOWLEDGE_BASE.copy()
                print(f"Loaded {len(cls.KNOWLEDGE_BASE)} base documents")
            else:
                print("Warning: KNOWLEDGE_BASE is empty!")

            custom_count = cls._load_custom_documents()
            if custom_count and custom_count > 0:
                print(f"Loaded {custom_count} custom documents")

            if not cls._documents:
                print("ERROR: No documents in knowledge base!")
                cls._initialized = True
                return

            print("Loading embedding model (all-MiniLM-L6-v2)...")
            cls._embedder = SentenceTransformer('all-MiniLM-L6-v2')
            print("Embedding model loaded")

            print(f"Generating embeddings for {len(cls._documents)} documents...")
            embeddings = cls._embedder.encode(cls._documents, show_progress_bar=False)
            print("Embeddings generated")

            dimension = embeddings.shape[1]
            cls._index = faiss.IndexFlatL2(dimension)
            cls._index.add(embeddings.astype('float32'))
            print(f"FAISS index created (dimension: {dimension})")

            cls._initialized = True
            print(f"RAG system ready with {len(cls._documents)} documents!\n")

        except Exception as e:
            print(f"ERROR initializing RAG system: {e}")
            import traceback
            traceback.print_exc()
            cls._initialized = True

    @classmethod
    def _load_custom_documents(cls):
        try:
            custom_kb_path = os.path.join(
                os.path.dirname(os.path.dirname(__file__)),
                'custom_knowledge_base.json'
            )

            if os.path.exists(custom_kb_path):
                with open(custom_kb_path, 'r', encoding='utf-8') as f:
                    custom_docs = json.load(f)
                    if isinstance(custom_docs, list) and custom_docs:
                        valid_docs = [doc.strip() for doc in custom_docs if doc and isinstance(doc, str) and doc.strip()]
                        if valid_docs:
                            cls._documents.extend(valid_docs)
                            return len(valid_docs)
            return 0
        except Exception as e:
            print(f"Could not load custom documents: {e}")
            return 0

    @classmethod
    def add_document(cls, document):
        if not document or not isinstance(document, str):
            return

        cls._initialize()

        cls._documents.append(document)

        embedding = cls._embedder.encode([document])

        cls._index.add(embedding.astype('float32'))

        print(f"Added new document to knowledge base. Total: {len(cls._documents)}")

    @classmethod
    def add_documents_batch(cls, documents):
        if not documents or not isinstance(documents, list):
            return

        cls._initialize()

        valid_docs = [doc for doc in documents if doc and isinstance(doc, str)]

        if not valid_docs:
            return

        cls._documents.extend(valid_docs)

    @classmethod
    def retrieve_relevant_docs(cls, query, top_k=3):
        cls._initialize()

        if not cls._documents or cls._index is None:
            print("RAG system not properly initialized")
            return []

        top_k = min(top_k, len(cls._documents))

        query_embedding = cls._embedder.encode([query])

        distances, indices = cls._index.search(query_embedding.astype('float32'), top_k)

        relevant_docs = []
        for idx, distance in zip(indices[0], distances[0]):
            if idx < len(cls._documents):
                similarity = 1 / (1 + distance)
                relevant_docs.append({
                    'text': cls._documents[idx],
                    'score': float(similarity),
                    'distance': float(distance)
                })

        return relevant_docs

    @classmethod
    def get_relevant_context(cls, query, top_k=3, score_threshold=0.3):
        docs = cls.retrieve_relevant_docs(query, top_k)

        relevant = [doc for doc in docs if doc['score'] >= score_threshold]

        if not relevant:
            return "No highly relevant verified information found in knowledge base."

        context_parts = []
        for i, doc in enumerate(relevant, 1):
            context_parts.append(f"{i}. {doc['text']} (relevance: {doc['score']:.2f})")

        return "\n".join(context_parts)

    @classmethod
    def augment_prompt(cls, query, base_prompt, top_k=3):
        relevant_docs = cls.retrieve_relevant_docs(query, top_k)

        if not relevant_docs:
            return base_prompt

        context_items = [f"- {doc['text']}" for doc in relevant_docs]
        context = "\n".join(context_items)

        augmented_prompt = (
            f"Use the following verified information as context to improve your analysis:\n\n"
            f"[VERIFIED KNOWLEDGE BASE]\n"
            f"{context}\n"
            f"[END KNOWLEDGE BASE]\n\n"
            f"{base_prompt}"
        )

        return augmented_prompt

    @classmethod
    def save_knowledge_base(cls, filepath=None):
        if filepath is None:
            filepath = os.path.join(
                os.path.dirname(os.path.dirname(__file__)),
                'custom_knowledge_base.json'
            )

        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(cls._documents, f, indent=2, ensure_ascii=False)
            print(f"Knowledge base saved to {filepath}")
            return True
        except Exception as e:
            print(f"Error saving knowledge base: {e}")
            return False

    @classmethod
    def get_stats(cls):
        cls._initialize()

        return {
            'initialized': cls._initialized,
            'total_documents': len(cls._documents) if cls._documents else 0,
            'base_knowledge_count': len(cls.KNOWLEDGE_BASE),
            'custom_documents_count': (len(cls._documents) - len(cls.KNOWLEDGE_BASE)) if cls._documents else 0,
            'embedding_dimension': 384,
            'model': 'all-MiniLM-L6-v2',
            'index_ready': cls._index is not None
        }


