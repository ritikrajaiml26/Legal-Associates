from django.urls import path
from .views import CreateAssistantCallbackView, CreateConsultationInquiryView

urlpatterns = [
    path('assistant-call/', CreateAssistantCallbackView.as_view(), name='assistant_call_create'),
    path('inquiry/', CreateConsultationInquiryView.as_view(), name='inquiry_create'),
]
