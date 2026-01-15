from rest_framework.views import APIView
from rest_framework.response import Response
from .services import RapidAPIService, OpenRouterService

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
            context_info = f"Source Category: {source_category}, Background: {background}"
            
            model_choice = request.data.get("model", "gemma")

            ai_result = OpenRouterService.analyze_content(
                content_to_analyze, 
                context_info,
                model_key=model_choice
            )
            
            # Pass the AI result directly, even if it contains errors
            result = ai_result
            
        else:
            result = {
                "verdict": "Error",
                "confidence": 0.0,
                "summary": "Could not analyze content.",
                "labels": [],
                "radar_data": []
            }
            

        
        result['fetched_text'] = content_to_analyze
        if fetch_error:
            result['fetch_error'] = fetch_error
        
        return Response(result)
