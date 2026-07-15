from django.views.generic import ListView, DetailView
from django.db.models import Q
from .models import BlogArticle

class BlogArticleListView(ListView):
    model = BlogArticle
    template_name = 'blog.html'
    context_object_name = 'articles'
    paginate_by = 6

    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.GET.get('category')
        query = self.request.GET.get('q')
        if category:
            queryset = queryset.filter(category=category)
        if query:
            queryset = queryset.filter(
                Q(title__icontains=query) | Q(content__icontains=query)
            )
        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['categories'] = BlogArticle.CATEGORY_CHOICES
        context['active_category'] = self.request.GET.get('category', '')
        context['search_query'] = self.request.GET.get('q', '')
        return context

class BlogArticleDetailView(DetailView):
    model = BlogArticle
    template_name = 'blog_detail.html'
    context_object_name = 'article'

    def get_object(self, queryset=None):
        obj = super().get_object(queryset)
        obj.views_count += 1
        obj.save(update_fields=['views_count'])
        return obj

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['recent_articles'] = BlogArticle.objects.exclude(id=self.object.id)[:3]
        return context
