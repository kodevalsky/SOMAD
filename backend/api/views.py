from rest_framework.views import APIView
from rest_framework.response import Response
from .services import MockAnalyzer, RapidAPIService, BERTService, GeminiService

class HelloView(APIView):
    def get(self, request):
        return Response({"message": "Hello from Django!"})

class AnalyzeView(APIView):
    def post(self, request):
        text = request.data.get("text", "")
        url = request.data.get("url", "")
        background = request.data.get("background", "")
        source_category = request.data.get("sourceCategory", "")
        
        content_to_analyze = text
        
        fetch_error = None
        if url:
            fetched_text, error_msg = RapidAPIService.fetch_text_from_url(url)
            if fetched_text:
                content_to_analyze = fetched_text
            else:
                fetch_error = error_msg or "Unknown error"
                content_to_analyze = ""

        if content_to_analyze:
            try:
                bert_result = BERTService.predict(content_to_analyze)
            except Exception as e:
                print(f"BERT Error: {e}")
                bert_result = None

            context_info = f"Source Category: {source_category}, Background: {background}"
            
            gemini_result = GeminiService.analyze_content(
                content_to_analyze, 
                context_info, 
                labels=bert_result['labels'] if bert_result else None
            )
            
            gemini_summary = gemini_result.get('summary', "Summary unavailable.")
            radar_data = gemini_result.get('radar_data', [])

            mock_analyzer = MockAnalyzer()
            mock_result = mock_analyzer.analyze(content_to_analyze)
            
            result = {
                "verdict": bert_result["verdict"] if bert_result else mock_result["verdict"],
                "confidence": bert_result["confidence"] if bert_result else mock_result["confidence"],
                "summary": gemini_summary,
                "labels": bert_result["labels"] if bert_result else mock_result["labels"],
                "lime_importance": [], # Removed
                "lime_html": "", # Removed
                "radarData": radar_data if radar_data else mock_result["radarData"]
            }
            
        else:
            result = {
                "verdict": "Error",
                "confidence": 0.0,
                "summary": "Could not analyze content.",
                "labels": [],
                "lime_importance": [],
                "lime_html": "",
                "radarData": []
            }
        
        result['fetched_text'] = content_to_analyze
        if fetch_error:
            result['fetch_error'] = fetch_error
        
        return Response(result)
