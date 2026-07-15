from django.contrib import admin
from .models import PracticeArea, Advocate, FAQ, Testimonial, CaseStudy, CareerApplication

@admin.register(PracticeArea)
class PracticeAreaAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'icon_class')
    search_fields = ('title', 'description', 'short_description')
    prepopulated_fields = {'slug': ('title',)}

@admin.register(Advocate)
class AdvocateAdmin(admin.ModelAdmin):
    list_display = ('name', 'designation', 'qualification', 'experience', 'email', 'phone')
    search_fields = ('name', 'qualification', 'practice_areas', 'email')
    list_filter = ('experience', 'languages')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ('question', 'order')
    search_fields = ('question', 'answer')
    list_editable = ('order',)

@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ('client_name', 'case_or_designation', 'rating', 'date')
    list_filter = ('rating', 'date')
    search_fields = ('client_name', 'review')

@admin.register(CaseStudy)
class CaseStudyAdmin(admin.ModelAdmin):
    list_display = ('title', 'practice_area', 'client_type')
    search_fields = ('title', 'description', 'outcome')
    list_filter = ('practice_area', 'client_type')
    prepopulated_fields = {'slug': ('title',)}

@admin.register(CareerApplication)
class CareerApplicationAdmin(admin.ModelAdmin):
    list_display = ('name', 'position', 'email', 'phone', 'submitted_at')
    list_filter = ('position', 'submitted_at')
    search_fields = ('name', 'email', 'phone', 'cover_letter')
    readonly_fields = ('submitted_at',)
