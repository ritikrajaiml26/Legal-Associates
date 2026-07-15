from django.shortcuts import render, get_object_or_404, redirect
from django.views.generic import TemplateView, ListView, DetailView, CreateView
from django.urls import reverse_lazy
from django.contrib import messages
from .models import PracticeArea, Advocate, FAQ, Testimonial, CaseStudy, CareerApplication
from apps.blog.models import BlogArticle

class HomeView(TemplateView):
    template_name = 'index.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['practice_areas'] = PracticeArea.objects.all()[:12]
        context['advocates'] = Advocate.objects.all()
        context['faqs'] = FAQ.objects.all()[:5]
        context['testimonials'] = Testimonial.objects.all()[:6]
        context['recent_articles'] = BlogArticle.objects.all()[:3]
        return context

class AboutView(TemplateView):
    template_name = 'about.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['advocates'] = Advocate.objects.all()
        return context

class PracticeAreaListView(ListView):
    model = PracticeArea
    template_name = 'practice_areas.html'
    context_object_name = 'practice_areas'

class PracticeAreaDetailView(DetailView):
    model = PracticeArea
    template_name = 'practice_area_detail.html'
    context_object_name = 'practice_area'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['other_practice_areas'] = PracticeArea.objects.exclude(id=self.object.id)[:6]
        context['case_studies'] = self.object.case_studies.all()
        return context

class AdvocateProfileView(DetailView):
    model = Advocate
    template_name = 'advocate_profile.html'
    context_object_name = 'advocate'

class CaseStudyListView(ListView):
    model = CaseStudy
    template_name = 'case_studies.html'
    context_object_name = 'case_studies'

class FAQListView(ListView):
    model = FAQ
    template_name = 'faqs.html'
    context_object_name = 'faqs'

    def get_queryset(self):
        queryset = super().get_queryset()
        query = self.request.GET.get('q')
        if query:
            queryset = queryset.filter(question__icontains=query) | queryset.filter(answer__icontains=query)
        return queryset

class TestimonialListView(ListView):
    model = Testimonial
    template_name = 'testimonials.html'
    context_object_name = 'testimonials'

class ContactView(TemplateView):
    template_name = 'contact.html'

class ConsultationBookingView(TemplateView):
    template_name = 'consultation_booking.html'

class CareersView(CreateView):
    model = CareerApplication
    template_name = 'careers.html'
    fields = ['name', 'email', 'phone', 'position', 'resume', 'cover_letter']
    success_url = reverse_lazy('core:careers')

    def form_valid(self, form):
        messages.success(self.request, "Your application has been submitted successfully. We will review it soon.")
        return super().form_valid(form)

    def form_invalid(self, form):
        messages.error(self.request, "Please correct the errors in the form and try again.")
        return super().form_invalid(form)

class PrivacyPolicyView(TemplateView):
    template_name = 'privacy_policy.html'

class DisclaimerView(TemplateView):
    template_name = 'disclaimer.html'

class TermsConditionsView(TemplateView):
    template_name = 'terms_conditions.html'

class CookiePolicyView(TemplateView):
    template_name = 'cookie_policy.html'
