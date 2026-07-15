from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import AssistantCallback, ConsultationInquiry
from .serializers import AssistantCallbackSerializer, ConsultationInquirySerializer

class CreateAssistantCallbackView(generics.CreateAPIView):
    """Endpoint for frontend Assistant Callback Form submission"""
    queryset = AssistantCallback.objects.all()
    serializer_class = AssistantCallbackSerializer
    permission_classes = [AllowAny]

class CreateConsultationInquiryView(generics.CreateAPIView):
    """Endpoint for main Consultation Form submission"""
    queryset = ConsultationInquiry.objects.all()
    serializer_class = ConsultationInquirySerializer
    permission_classes = [AllowAny]
