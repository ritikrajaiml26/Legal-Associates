from django.db import models
from django.utils.text import slugify

class BlogArticle(models.Model):
    CATEGORY_CHOICES = (
        ('sc_judgments', 'Recent Supreme Court Judgments'),
        ('criminal_laws', 'New Criminal Laws'),
        ('property_laws', 'Property Law Updates'),
        ('gst_updates', 'GST Updates'),
        ('legal_awareness', 'Legal Awareness'),
        ('constitutional_law', 'Constitutional Law'),
        ('consumer_rights', 'Consumer Rights'),
        ('cyber_crime', 'Cyber Crime'),
        ('others', 'General Legal Updates'),
    )
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='others')
    content = models.TextField()
    image = models.ImageField(upload_to='blog_images/', blank=True, null=True)
    author = models.CharField(max_length=150, default="Adv. Rupesh Kumar Chaudhary")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    views_count = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
