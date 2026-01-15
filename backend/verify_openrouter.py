import sys
import os
import django

# Setup Django environment
sys.path.append('/home/kodevalsky/Programming/somad/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from api.services import OpenRouterService

def test_model(model_key):
    print(f"\nTesting {model_key}...")
    try:
        res = OpenRouterService.analyze_content(
            "The earth is flat and the moon is made of cheese.", 
            model_key=model_key
        )
        print(f"Verdict: {res.get('verdict')}")
        print(f"Confidence: {res.get('confidence')}")
        print(f"Summary: {res.get('summary')[:100]}...")
        if res.get('verdict') == "Error":
             print(f"Full Error Response: {res}")
    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    test_model("gemma")
    test_model("gpt-oss")
    test_model("deepseek")
