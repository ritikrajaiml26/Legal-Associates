from django.contrib import admin
from .models import AssistantCallback, ConsultationInquiry

@admin.register(AssistantCallback)
class AssistantCallbackAdmin(admin.ModelAdmin):
    list_display = ('name', 'mobile', 'is_attended', 'created_at')
    list_filter = ('is_attended', 'created_at')
    search_fields = ('name', 'mobile', 'address')
    actions = ['mark_as_attended']

    def mark_as_attended(self, request, queryset):
        queryset.update(is_attended=True)
    mark_as_attended.short_description = "Mark selected callbacks as attended"

@admin.register(ConsultationInquiry)
class ConsultationInquiryAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone', 'case_type', 'is_attended', 'created_at')
    list_filter = ('case_type', 'is_attended', 'created_at')
    search_fields = ('name', 'phone', 'email', 'message')
    actions = ['mark_as_attended']

    def mark_as_attended(self, request, queryset):
        queryset.update(is_attended=True)
    mark_as_attended.short_description = "Mark selected inquiries as attended"
