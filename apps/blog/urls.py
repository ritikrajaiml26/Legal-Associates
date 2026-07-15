from django.urls import path
from .views import BlogArticleListView, BlogArticleDetailView

app_name = 'blog'

urlpatterns = [
    path('', BlogArticleListView.as_view(), name='article_list'),
    path('<slug:slug>/', BlogArticleDetailView.as_view(), name='article_detail'),
]
