from django.urls import path
from .views import HelloView, AnalyzeView

urlpatterns = [
    path('hello/', HelloView.as_view(), name='hello'),
    path('analyze/', AnalyzeView.as_view(), name='analyze'),
]
