from django.db import models
from django.utils.text import slugify

class PracticeArea(models.Model):
    title = models.CharField(max_length=150)
    slug = models.SlugField(unique=True, blank=True)
    short_description = models.TextField(help_text="Short teaser for homepage cards.")
    description = models.TextField(help_text="Detailed description for the practice area detail page.")
    icon_class = models.CharField(max_length=50, default="fa-gavel", help_text="FontAwesome class e.g., 'fa-gavel'")

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

class Advocate(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    designation = models.CharField(max_length=150, default="Advocate")
    qualification = models.CharField(max_length=255)
    experience = models.CharField(max_length=100)
    practice_areas = models.CharField(max_length=255, help_text="Comma-separated practice areas.")
    languages = models.CharField(max_length=255)
    bar_council_registration = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    linkedin_url = models.URLField(blank=True, null=True)
    photo = models.ImageField(upload_to='advocate_photos/', blank=True, null=True)
    bio = models.TextField(blank=True, null=True, help_text="Detailed biography of the advocate.")

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class FAQ(models.Model):
    question = models.CharField(max_length=255)
    answer = models.TextField()
    order = models.PositiveIntegerField(default=0, help_text="Order in which FAQs are displayed.")

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.question

class Testimonial(models.Model):
    client_name = models.CharField(max_length=255)
    case_or_designation = models.CharField(max_length=255, blank=True, null=True, help_text="e.g., 'Civil Client' or 'Business Owner'")
    review = models.TextField()
    rating = models.PositiveIntegerField(default=5, help_text="Rating out of 5 stars.")
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.client_name} - {self.rating} Stars"

class CaseStudy(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    practice_area = models.ForeignKey(PracticeArea, on_delete=models.SET_NULL, null=True, related_name='case_studies')
    client_type = models.CharField(max_length=150, help_text="e.g., 'Individual', 'Startup', 'Corporation'")
    description = models.TextField()
    outcome = models.TextField()

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

class CareerApplication(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=15)
    position = models.CharField(max_length=150)
    resume = models.FileField(upload_to='resumes/')
    cover_letter = models.TextField(blank=True, null=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Application from {self.name} for {self.position}"
