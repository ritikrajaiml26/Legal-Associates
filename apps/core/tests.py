from django.test import TestCase
from django.urls import reverse
from .models import PracticeArea, Advocate, FAQ, Testimonial, CaseStudy

class CoreViewsTests(TestCase):
    def setUp(self):
        self.practice_area = PracticeArea.objects.create(
            title="Civil Law",
            short_description="Civil short description",
            description="Civil detailed description",
            icon_class="fa-gavel"
        )
        self.advocate = Advocate.objects.create(
            name="Rupesh Chaudhary",
            designation="Advocate",
            qualification="LL.B.",
            experience="10 years",
            practice_areas="Civil",
            languages="English, Hindi",
            bar_council_registration="BR/123",
            phone="1234567890",
            email="rupesh@example.com"
        )

    def test_home_page_status_code(self):
        url = reverse('core:home')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Rupesh Chaudhary")

    def test_about_page_status_code(self):
        url = reverse('core:about')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_practice_areas_page_status_code(self):
        url = reverse('core:practice_areas')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_practice_area_detail_page_status_code(self):
        url = reverse('core:practice_area_detail', args=[self.practice_area.slug])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Civil detailed description")

    def test_advocate_profile_page_status_code(self):
        url = reverse('core:advocate_profile', args=[self.advocate.slug])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Rupesh Chaudhary")
