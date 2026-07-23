from django.core.management.base import BaseCommand
from django.utils.text import slugify
from apps.core.models import PracticeArea, Advocate, FAQ, Testimonial, CaseStudy
from apps.blog.models import BlogArticle

class Command(BaseCommand):
    help = 'Seeds initial default data for LexRP Advocates & Consultants website.'

    def handle(self, *args, **options):
        self.stdout.write('Seeding data...')

        # 1. Practice Areas
        practice_areas_data = [
            {
                'title': 'CIVIL - सिविल',
                'icon_class': 'fa-gavel',
                'short_description': 'Handling all aspects of civil dispute, litigation, and property title suits.',
                'description': 'Our firm provides robust legal representation in all civil matters, including land and property title suits, division/partition suits, contract enforcement, and tenancy disputes. We represent clients before the Sub-divisional and District Courts, ensuring detailed verification of land records and registry details.'
            },
            {
                'title': 'CRIMINAL - क्रिमिनल',
                'icon_class': 'fa-shield-halved',
                'short_description': 'Defense representation, regular & anticipatory bail applications.',
                'description': 'We offer comprehensive criminal defense advocacy, representing clients from the filing of FIR to trials. Our services include regular bail, anticipatory bail, trials, appeals, revisions, and defense against malicious prosecutions under various sections of the penal code.'
            },
            {
                'title': 'CHEQUE BOUNCE - चेक बाउंस',
                'icon_class': 'fa-money-check-dollar',
                'short_description': 'Legal notices and litigation under Section 138 of the N.I. Act.',
                'description': 'Fast and effective legal action for cheque bounce disputes, representing both payees and drawees. We handle legal notice drafting, filing complaints in magistrates courts under Section 138, and defending against false claims.'
            },
            {
                'title': 'MATRIMONIAL MATTERS - वैवाहिक मामले',
                'icon_class': 'fa-people-roof',
                'short_description': 'Divorce, custody, maintenance, and family dispute resolution.',
                'description': 'Sensitive and practical guidance in family law, including mutual consent divorce, contested divorce, maintenance claims, child custody, and protection orders under domestic violence laws. We prioritize amicable settlements while aggressively protecting client rights in court.'
            },
            {
                'title': 'MARRIAGE REGISTRATION - विवाह पंजीकरण',
                'icon_class': 'fa-file-signature',
                'short_description': 'Legal compliance, verification, and registry certification.',
                'description': 'Complete assistance in legalizing marriage, including filing registrations under the Special Marriage Act or Hindu Marriage Act, document verification, scheduling registrar appointments, and obtaining certificates.'
            },
            {
                'title': 'WILLS - वसीयत',
                'icon_class': 'fa-file-lines',
                'short_description': 'Drafting, execution, registry, and probate validation of Wills.',
                'description': 'Secure your family\'s future by drafting clear, legally binding Wills. We assist in testamentary drafting, witness execution, registrar registration, and handling probate proceedings in civil courts.'
            },
            {
                'title': 'GIFTS - गिफ्ट (उपहार)',
                'icon_class': 'fa-gift',
                'short_description': 'Drafting and registry of Gift Deeds for property transfer.',
                'description': 'Assisting in transferring assets to loved ones through Gift Deeds. We handle the drafting of the gift deed, calculating stamp duty, coordinating registry office submissions, and updating title mutation.'
            },
            {
                'title': 'SUB-DIVISIONAL WORK - अनुमंडलीय कार्य',
                'icon_class': 'fa-building-columns',
                'short_description': 'Representation in SDM courts, boundary disputes, and revenue appeals.',
                'description': 'Dedicated representation before Sub-Divisional Magistrates (SDM) and revenue officers for land demarcation, boundary conflicts, partition appeals, and executive magistrate filings.'
            },
            {
                'title': 'COLLECTORATE WORK - कलेक्ट्रेट का काम',
                'icon_class': 'fa-briefcase',
                'short_description': 'Revenue court suits, license permits, and mutation appeals.',
                'description': 'Representation before the District Collector and Additional Collector courts for revenue disputes, mutation revisions, land acquisition compensation, ceiling disputes, and arms/explosive licenses.'
            },
            {
                'title': 'COMMISSIONERATE WORK - कमिश्नरेट का काम',
                'icon_class': 'fa-city',
                'short_description': 'Appellate representation at Commissioner level and administrative suits.',
                'description': 'Handling second appeals, revisions, and administrative disputes before the Divisional Commissioner court, especially in land revenue, service matters, and administrative actions.'
            },
            {
                'title': 'CLAIMS - दावे',
                'icon_class': 'fa-circle-dollar-to-slot',
                'short_description': 'Motor accident compensation, insurance disputes, and claims filings.',
                'description': 'Filing compensation claims before the Motor Accidents Claims Tribunal (MACT) for accident injuries or death. We also handle consumer forum disputes and insurance claim rejection litigation.'
            },
            {
                'title': 'LEGAL AID - कानूनी सहायता',
                'icon_class': 'fa-handshake-angle',
                'short_description': 'Pro-bono services and legal counseling for eligible citizens.',
                'description': 'Committed to social justice, we offer pro-bono legal consultation and representation to marginalized, distressed, and financially disadvantaged sections of society through the District Legal Services Authority (DLSA).'
            }
        ]

        pa_instances = {}
        for pa in practice_areas_data:
            obj, created = PracticeArea.objects.get_or_create(
                title=pa['title'],
                defaults={
                    'slug': slugify(pa['title']),
                    'icon_class': pa['icon_class'],
                    'short_description': pa['short_description'],
                    'description': pa['description']
                }
            )
            pa_instances[pa['title']] = obj
            if created:
                self.stdout.write(f"Created practice area: {pa['title']}")

        # 2. Advocates
        advocates_data = [
            {
                'name': 'RUPESH KUMAR CHAUDHARY',
                'designation': 'Advocate / Founder',
                'qualification': 'B.A., LL.B. (Bar Council of Bihar)',
                'experience': '15+ Years',
                'practice_areas': 'Civil, Criminal, Property, Matrimonial, Revenue, Claims',
                'languages': 'Hindi, English',
                'bar_council_registration': 'BR-Adv-9097/2022',
                'phone': '+91-9097578634',
                'email': 'advrupesh2022@gmail.com',
                'bio': 'Advocate Rupesh Kumar Chaudhary is a distinguished lawyer practicing at Civil Court, Motihari and the District Bar Association. With over 15 years of experience in representing clients across complex civil disputes, revenue matters, criminal trials, and familial conflicts, he has established a track record of ethical advocacy, thorough preparation, and successful resolution. He maintains sitting offices in Motihari Civil Court and permanent residency in Pipra Kothi, East Champaran, Bihar.'
            }
        ]

        for adv in advocates_data:
            obj, created = Advocate.objects.get_or_create(
                name=adv['name'],
                defaults={
                    'slug': slugify(adv['name']),
                    'designation': adv['designation'],
                    'qualification': adv['qualification'],
                    'experience': adv['experience'],
                    'practice_areas': adv['practice_areas'],
                    'languages': adv['languages'],
                    'bar_council_registration': adv['bar_council_registration'],
                    'phone': adv['phone'],
                    'email': adv['email'],
                    'bio': adv['bio']
                }
            )
            if created:
                self.stdout.write(f"Created advocate: {adv['name']}")

        # 3. FAQs
        faqs_data = [
            {
                'question': 'How much does a legal consultation cost?',
                'answer': 'Our initial consultation fees are transparent and depend on the complexity of the legal matter. Please message our assistant using the call form or contact us directly at +91-9097578634 for details.',
                'order': 1
            },
            {
                'question': 'How long will my civil case take?',
                'answer': 'The timeline of civil litigation depends entirely on court calendars, the nature of the dispute, filing requirements, and evidence complexity. LexRP Advocates is committed to resolving matters efficiently with active case management.',
                'order': 2
            },
            {
                'question': 'Can I consult online or over the phone?',
                'answer': 'Yes, we provide online legal consultations via audio/video calls or email for clients who are unable to visit our Motihari or Pipra Kothi offices.',
                'order': 3
            },
            {
                'question': 'Do you practice before the High Court?',
                'answer': 'Yes, we handle appeals, revisions, and writ petitions before the High Court of Patna in coordination with senior advocates.',
                'order': 4
            },
            {
                'question': 'How do I schedule an appointment?',
                'answer': 'You can schedule an appointment by calling us directly at +91-9097578634, texting us on WhatsApp, or submitting the Consultation Form on our Contact page.',
                'order': 5
            }
        ]

        for faq in faqs_data:
            obj, created = FAQ.objects.get_or_create(
                question=faq['question'],
                defaults={
                    'answer': faq['answer'],
                    'order': faq['order']
                }
            )
            if created:
                self.stdout.write(f"Created FAQ: {faq['question']}")

        # 4. Testimonials
        testimonials_data = [
            {
                'client_name': 'Ramesh Kumar Chaudhary',
                'case_or_designation': 'Property Suit Client, Motihari',
                'review': 'Advocate Rupesh resolved our family boundary dispute with absolute clarity. His title verification and court representation were highly professional.',
                'rating': 5
            },
            {
                'client_name': 'Vikash Kumar Prasad',
                'case_or_designation': 'Criminal Law Client',
                'review': 'Excellent bail defense. I am extremely satisfied with the responsiveness, strategic litigation advice, and absolute confidentiality maintained by the firm.',
                'rating': 5
            },
            {
                'client_name': 'Anjali Singh',
                'case_or_designation': 'Marriage Registry Client',
                'review': 'Helped us get our marriage registered and certified smoothly. The advocate explained all documentation requirements clearly at the start.',
                'rating': 5
            }
        ]

        for test in testimonials_data:
            obj, created = Testimonial.objects.get_or_create(
                client_name=test['client_name'],
                defaults={
                    'case_or_designation': test['case_or_designation'],
                    'review': test['review'],
                    'rating': test['rating']
                }
            )
            if created:
                self.stdout.write(f"Created testimonial for: {test['client_name']}")

        # 5. Case Studies
        case_studies_data = [
            {
                'title': 'Successful Partition Suit in East Champaran',
                'client_type': 'Individual Landowner',
                'practice_area_title': 'CIVIL - सिविल',
                'description': 'Represented a client in a complex division suit involving ancestral land in Pipra Kothi. Opposing parties disputed the ancestral share registry.',
                'outcome': 'The court ruled in favor of our client, granting the full requested partition share and updating the revenue mutation records.'
            },
            {
                'title': 'Anticipatory Bail in a Fabricated Property Case',
                'client_type': 'Local Business Owner',
                'practice_area_title': 'CRIMINAL - क्रिमिनल',
                'description': 'Filed for anticipatory bail under Section 438 of CrPC after false complaints of criminal trespass were lodged due to a commercial land dispute.',
                'outcome': 'Bail granted by the Sessions Court, Motihari, noting lack of prima facie evidence and the commercial nature of the conflict.'
            }
        ]

        for case in case_studies_data:
            pa_obj = pa_instances.get(case['practice_area_title'])
            obj, created = CaseStudy.objects.get_or_create(
                title=case['title'],
                defaults={
                    'slug': slugify(case['title']),
                    'practice_area': pa_obj,
                    'client_type': case['client_type'],
                    'description': case['description'],
                    'outcome': case['outcome']
                }
            )
            if created:
                self.stdout.write(f"Created case study: {case['title']}")

        # 6. Blog Articles
        articles_data = [
            {
                'title': 'Understanding Property Mutation & Land Registry in Bihar',
                'category': 'property_laws',
                'content': 'Land mutation (Dakhil-Kharij) is the process of updating land ownership records in government files. Under Bihar revenue rules, registering a sale deed alone does not complete the transfer of title. The buyer must apply for mutation at the Circle Office (CO). If rejected, mutation appeals can be filed before the DCLR and Revenue Additional Collector. Ensure all boundaries (Chauhaddi) match perfectly between the sale deed and the actual possession to avoid partition challenges later.',
                'author': 'Adv. Rupesh Kumar Chaudhary'
            },
            {
                'title': 'New Criminal Laws (BNS, BNSS, BSA): Key Changes Explained',
                'category': 'criminal_laws',
                'content': 'The Bharatiya Nyaya Sanhita (BNS), Bharatiya Nagarik Suraksha Sanhita (BNSS), and Bharatiya Sakshya Adhiniyam (BSA) have replaced the IPC, CrPC, and Indian Evidence Act. Key updates include the introduction of zero FIRs, timelines for investigations and bail applications, videography requirements during arrests, and new sections on cyber offenses and organized crime. Familiarizing yourself with these shifts is essential for safeguarding liberty and drafting bail petitions.',
                'author': 'Adv. Rupesh Kumar Chaudhary'
            }
        ]

        for art in articles_data:
            obj, created = BlogArticle.objects.get_or_create(
                title=art['title'],
                defaults={
                    'slug': slugify(art['title']),
                    'category': art['category'],
                    'content': art['content'],
                    'author': art['author']
                }
            )
            if created:
                self.stdout.write(f"Created article: {art['title']}")

        self.stdout.write(self.style.SUCCESS('Successfully seeded all LexRP Advocates database tables.'))
