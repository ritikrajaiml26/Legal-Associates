from django.db import models

class AssistantCallback(models.Model):
    """Model for the 'Assistant to Message for Call' form."""
    name = models.CharField(max_length=255)
    mobile = models.CharField(max_length=15)
    address = models.TextField()
    is_attended = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.mobile}"

class ConsultationInquiry(models.Model):
    """Model for the main Consultation Form on the contact page."""
    CASE_TYPES = (
        ('civil', 'Civil - सिविल'),
        ('criminal', 'Criminal - क्रिमिनल'),
        ('matrimonial', 'Matrimonial - वैवाहिक मामले'),
        ('property', 'Property - संपत्ति मामले'),
        ('cheque_bounce', 'Cheque Bounce - चेक बाउंस'),
        ('other', 'Other - अन्य'),
    )
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=15)
    email = models.EmailField(blank=True, null=True)
    case_type = models.CharField(max_length=50, choices=CASE_TYPES)
    message = models.TextField()
    document = models.FileField(upload_to='inquiry_documents/', blank=True, null=True)
    is_attended = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Inquiry from {self.name} ({self.get_case_type_display()})"
