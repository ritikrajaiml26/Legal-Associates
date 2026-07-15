from django.contrib import admin
from .models import BlogArticle

@admin.register(BlogArticle)
class BlogArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'author', 'created_at', 'views_count')
    list_filter = ('category', 'created_at', 'author')
    search_fields = ('title', 'content', 'author')
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ('views_count',)
