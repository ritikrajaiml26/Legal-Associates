from rest_framework import serializers
from .models import AssistantCallback, ConsultationInquiry

class AssistantCallbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssistantCallback
        fields = ['id', 'name', 'mobile', 'address', 'created_at']

    def validate(self, data):
        name = data.get('name', '').strip()
        mobile = data.get('mobile', '').strip()
        address = data.get('address', '').strip()
        if not name or not mobile or not address:
            raise serializers.ValidationError("Fill Name, Mobile and Address to submit callback request.")
        return data

class ConsultationInquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = ConsultationInquiry
        fields = ['id', 'name', 'phone', 'email', 'case_type', 'message', 'document', 'created_at']
