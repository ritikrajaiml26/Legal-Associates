from django.urls import path
from .views import (
    HomeView, AboutView, PracticeAreaListView, PracticeAreaDetailView,
    AdvocateProfileView, CaseStudyListView, FAQListView, TestimonialListView,
    ContactView, ConsultationBookingView, CareersView,
    PrivacyPolicyView, DisclaimerView, TermsConditionsView, CookiePolicyView
)

app_name = 'core'

urlpatterns = [
    path('', HomeView.as_view(), name='home'),
    path('about/', AboutView.as_view(), name='about'),
    path('practice-areas/', PracticeAreaListView.as_view(), name='practice_areas'),
    path('practice-areas/<slug:slug>/', PracticeAreaDetailView.as_view(), name='practice_area_detail'),
    path('advocates/<slug:slug>/', AdvocateProfileView.as_view(), name='advocate_profile'),
    path('case-studies/', CaseStudyListView.as_view(), name='case_studies'),
    path('faqs/', FAQListView.as_view(), name='faqs'),
    path('testimonials/', TestimonialListView.as_view(), name='testimonials'),
    path('contact/', ContactView.as_view(), name='contact'),
    path('book-consultation/', ConsultationBookingView.as_view(), name='book_consultation'),
    path('careers/', CareersView.as_view(), name='careers'),
    path('privacy-policy/', PrivacyPolicyView.as_view(), name='privacy_policy'),
    path('disclaimer/', DisclaimerView.as_view(), name='disclaimer'),
    path('terms-conditions/', TermsConditionsView.as_view(), name='terms_conditions'),
    path('cookie-policy/', CookiePolicyView.as_view(), name='cookie_policy'),
]
