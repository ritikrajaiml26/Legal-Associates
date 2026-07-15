from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import AssistantCallback, ConsultationInquiry

class ConsultationsAPITests(APITestCase):
    def test_create_assistant_callback_success(self):
        url = reverse('assistant_call_create')
        data = {
            'name': 'Amit Kumar',
            'mobile': '9876543210',
            'address': 'Patna, Bihar'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(AssistantCallback.objects.count(), 1)
        callback = AssistantCallback.objects.first()
        self.assertEqual(callback.name, 'Amit Kumar')
        self.assertEqual(callback.mobile, '9876543210')
        self.assertEqual(callback.address, 'Patna, Bihar')

    def test_create_assistant_callback_missing_fields(self):
        url = reverse('assistant_call_create')
        # name is missing
        data = {
            'mobile': '9876543210',
            'address': 'Patna, Bihar'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # mobile is empty
        data = {
            'name': 'Amit Kumar',
            'mobile': '',
            'address': 'Patna'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_consultation_inquiry_success(self):
        url = reverse('inquiry_create')
        data = {
            'name': 'Suresh Dev',
            'phone': '9988776655',
            'email': 'suresh@example.com',
            'case_type': 'civil',
            'message': 'Need advice on partition suit.'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ConsultationInquiry.objects.count(), 1)
        inquiry = ConsultationInquiry.objects.first()
        self.assertEqual(inquiry.name, 'Suresh Dev')
        self.assertEqual(inquiry.case_type, 'civil')
