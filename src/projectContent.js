// Public copy is drawn from the supplied project evidence. Pending personal
// contributions, outcomes and approval milestones are deliberately omitted.
export const projectTranslations = {};
const copy = (en, ar) => {
  projectTranslations[en] = ar;
  return en;
};
const shot = (src, en, ar) => ({ src, caption: copy(en, ar) });
export const verifiedProjects = [
  {
    id: "mycohort",
    number: "01",
    name: "MyCohort",
    category: "MOBILE · RESEARCH",
    type: "mobile",
    accent: "#b3c1a2",
    tagline: "Connecting people. Supporting research.",
    description: copy(
      "Mobile application work for The Malaysian Cohort during my internship at UMBI, UKM.",
      "عمل على تطبيق الهاتف لمشروع The Malaysian Cohort خلال تدريبي في UMBI بالجامعة الوطنية الماليزية.",
    ),
    tags: ["Mobile development", "Research", "TMC"],
    problem: copy(
      "The Malaysian Cohort needs digital services that support its research activities and participant experience.",
      "يحتاج مشروع The Malaysian Cohort إلى خدمات رقمية تدعم أنشطته البحثية وتجربة المشاركين.",
    ),
    solution: copy(
      "Mobile development is part of my TMC internship. Specific implemented modules and technologies will be added when their details are available.",
      "تطوير تطبيقات الهاتف جزء من تدريبي في TMC. ستُضاف تفاصيل الوحدات المنفّذة والتقنيات عند توفرها.",
    ),
    contribution: copy(
      "Internship involvement in the MyCohort mobile application.",
      "المشاركة خلال التدريب في العمل على تطبيق MyCohort للهاتف.",
    ),
    features: [
      copy(
        "Mobile application development in a healthcare research environment",
        "تطوير تطبيق هاتف ضمن بيئة أبحاث صحية",
      ),
    ],
    context: "UMBI / The Malaysian Cohort",
    status: "Internship project",
    screenshot: null,
    gallery: [],
    github: null,
    demo: null,
  },
  {
    id: "diacare",
    number: "02",
    name: "DIACARE",
    category: "MOBILE · HEALTHCARE",
    type: "health",
    accent: "#b7c4df",
    tagline: copy(
      "Daily records. A clearer picture.",
      "سجلات يومية. وصورة أوضح.",
    ),
    description: copy(
      "A Flutter Android app for diabetes self-management, combining glucose and meal logs, reminders, education and AI-assisted PDF reports.",
      "تطبيق Android مبني بـFlutter لمتابعة السكري ذاتيًا، يجمع سجلات السكر والوجبات والتذكيرات والتثقيف وتقارير PDF بمساعدة الذكاء الاصطناعي.",
    ),
    tags: [
      "Flutter",
      "Dart",
      "Supabase",
      "PostgreSQL",
      "Kotlin",
      "TypeScript",
      "Groq AI",
    ],
    dates: "May–Jul 2026",
    problem: copy(
      "Glucose readings, meals, reminders and educational information can become scattered across separate tools. Malaysian patients also need relevant food context and a history they can take to a consultation.",
      "قد تتوزع قراءات السكر والوجبات والتذكيرات والمعلومات التثقيفية بين أدوات مختلفة. ويحتاج المستخدمون في ماليزيا إلى معلومات غذائية مناسبة وسجل يمكن عرضه خلال الاستشارة.",
    ),
    solution: copy(
      "One patient account brings together daily records, Malaysian food suggestions, activity guidance, reminders and date-range reports. AI features provide educational chat, ingredient-based nutrition estimates and report summaries.",
      "يجمع حساب المريض السجلات اليومية واقتراحات الأطعمة الماليزية وإرشادات النشاط والتذكيرات وتقارير لفترة يحددها المستخدم. وتدعم ميزات الذكاء الاصطناعي المحادثة التثقيفية وتقدير القيم الغذائية من المكونات وتلخيص التقارير.",
    ),
    contribution: copy(
      "I designed and developed this individual final-year project: requirements, Flutter screens, Supabase integration, native Android reminders, AI backend functions, testing and documentation.",
      "صممت وطورت هذا المشروع الفردي للسنة النهائية، من المتطلبات وواجهات Flutter ودمج Supabase إلى تذكيرات Android الأصلية ودوال الذكاء الاصطناعي الخلفية والاختبار والتوثيق.",
    ),
    features: [
      copy(
        "Account authentication and patient-scoped cloud records",
        "تسجيل دخول وسجلات سحابية مستقلة لكل حساب",
      ),
      copy(
        "Glucose, meal, medication and activity tracking",
        "متابعة السكر والوجبات والأدوية والنشاط",
      ),
      copy(
        "Kotlin notification scheduling through a Flutter MethodChannel",
        "جدولة إشعارات Kotlin عبر Flutter MethodChannel",
      ),
      copy(
        "Malaysian food suggestions and ingredient-based AI estimates",
        "اقتراحات أطعمة ماليزية وتقديرات غذائية ذكية من المكونات",
      ),
      copy(
        "Educational chatbot and date-range PDF reports",
        "مساعد تثقيفي وتقارير PDF لفترة محددة",
      ),
      copy(
        "English, Bahasa Melayu and Arabic interface options",
        "خيارات واجهة بالإنجليزية والملايوية والعربية",
      ),
    ],
    learning: copy(
      "I learned to organize account-specific Flutter state, handle asynchronous cloud failures, integrate native Android functions and validate AI responses. Testing and documentation made requirements and implementation easier to trace.",
      "تعلمت تنظيم حالة Flutter لكل حساب، ومعالجة أخطاء العمليات السحابية، ودمج وظائف Android الأصلية والتحقق من استجابات الذكاء الاصطناعي. وساعدني الاختبار والتوثيق على ربط المتطلبات بالتنفيذ.",
    ),
    evidence: copy(
      "Saved verification logs from 13 July 2026 record 11 passing Flutter tests and no static-analysis issues. These are historical results for that tested version.",
      "تسجل ملفات التحقق المحفوظة بتاريخ 13 يوليو 2026 نجاح 11 اختبار Flutter وعدم وجود ملاحظات في التحليل الساكن. هذه نتائج تاريخية للنسخة التي اختُبرت حينها.",
    ),
    note: copy(
      "Completed academic Android application. AI outputs are educational estimates. Screenshots use demonstration content and may show earlier branding; no clinical certification or public store launch is claimed.",
      "تطبيق Android أكاديمي مكتمل. مخرجات الذكاء الاصطناعي تقديرات تثقيفية. تستخدم الصور بيانات توضيحية وقد تعرض هوية سابقة للتطبيق؛ ولا يُدّعى حصوله على اعتماد طبي أو إطلاقه في متجر عام.",
    ),
    context: "Individual final-year project · UKM",
    status: "Completed academic project",
    screenshot: "/projects/diacare-dashboard.webp",
    gallery: [
      shot(
        "/projects/diacare-dashboard.webp",
        "Dashboard with a labelled demonstration profile",
        "لوحة المتابعة بحساب توضيحي معلّم",
      ),
      shot(
        "/projects/diacare-meals.webp",
        "Malaysian food suggestions",
        "اقتراحات الأطعمة الماليزية",
      ),
      shot(
        "/projects/diacare-education.webp",
        "Diabetes education guide",
        "دليل التثقيف حول السكري",
      ),
      shot(
        "/projects/diacare-chat.webp",
        "Educational AI conversation",
        "محادثة تثقيفية مع الذكاء الاصطناعي",
      ),
    ],
    github: null,
    demo: null,
  },
  {
    id: "tmc-web",
    number: "03",
    name: "TMC Research & Publications",
    category: "WEB · RESEARCH",
    type: "research",
    accent: "#c1b2d4",
    tagline: "Making research easier to find.",
    description: copy(
      "A responsive React and TypeScript website presenting TMC research studies and publications through searchable, bilingual interfaces.",
      "موقع متجاوب مبني بـReact وTypeScript لعرض دراسات TMC ومنشوراته عبر واجهات ثنائية اللغة قابلة للبحث.",
    ),
    tags: ["React", "TypeScript", "Vite", "Tailwind CSS"],
    dates: "Sep–Oct 2026",
    problem: copy(
      "Visitors need a consistent way to discover cohort studies, explore project profiles and find original publication sources.",
      "يحتاج الزوار إلى طريقة واضحة لاكتشاف دراسات المشروع واستعراض ملفاتها والوصول إلى المصادر الأصلية للمنشورات.",
    ),
    solution: copy(
      "A static frontend organizes 22 research studies, 56 subprojects and 69 publication records, with keyword search, category/year filters and direct project navigation.",
      "تنظم واجهة أمامية ثابتة 22 دراسة بحثية و56 مشروعًا فرعيًا و69 سجل منشور، مع البحث بالكلمات وتصفيات الفئة والسنة وروابط مباشرة لملفات المشاريع.",
    ),
    contribution: copy(
      "I developed the website during my TMC internship, including the responsive interfaces, research and publication views, search/filter controls, bilingual interface controls and navigation.",
      "طورت الموقع خلال تدريبي في TMC، بما يشمل الواجهات المتجاوبة وصفحات الأبحاث والمنشورات وأدوات البحث والتصفية والتحكم في لغة الواجهة والتنقل.",
    ),
    features: [
      copy(
        "Research index with project profiles and category filters",
        "فهرس أبحاث مع ملفات المشاريع والتصفية حسب الفئة",
      ),
      copy(
        "Publication archive with source links and year/keyword filters",
        "أرشيف منشورات بروابط المصادر والتصفية بالسنة والكلمات",
      ),
      copy(
        "English and Bahasa Melayu interface switching",
        "تبديل لغة الواجهة بين الإنجليزية والملايوية",
      ),
      copy(
        "Direct links, browser Back/Forward and keyboard navigation",
        "روابط مباشرة وتنقل بلوحة المفاتيح ودعم الرجوع والتقدم في المتصفح",
      ),
    ],
    evidence: copy(
      "The supplied review confirms 22 studies and 69 publication records. Institutional research counts describe the site's content, not separate software projects I developed.",
      "تؤكد المراجعة المقدمة وجود 22 دراسة و69 سجل منشور. هذه الأعداد تخص المحتوى البحثي بالموقع، وليست مشاريع برمجية مستقلة طورتها.",
    ),
    note: copy(
      "Public presentation prototype. Institutional content approval, acceptance and migration to UKM WordPress remain separate milestones.",
      "نموذج عام للعرض. اعتماد المحتوى والقبول المؤسسي والنقل إلى WordPress في UKM مراحل مستقلة.",
    ),
    context: "TMC internship · UMBI, UKM",
    status: "Prototype delivered · review pending",
    screenshot: "/projects/tmc-research-home.webp",
    gallery: [
      shot(
        "/projects/tmc-research-home.webp",
        "Public prototype homepage",
        "الصفحة الرئيسية للنموذج العام",
      ),
      shot(
        "/projects/tmc-research-index.webp",
        "Research index",
        "فهرس الدراسات البحثية",
      ),
      shot(
        "/projects/tmc-research-publications.webp",
        "Publication archive",
        "أرشيف المنشورات",
      ),
    ],
    github:
      "https://github.com/a197193-creator/tmc-research-publications-20260915",
    demo: "https://tmc-research-publications-20260915.vercel.app/",
  },
  {
    id: "uwc",
    number: "04",
    name: "UMBI Wellness Centre Prototype",
    category: "WEB · BOOKING",
    type: "booking",
    accent: "#9fc3b9",
    tagline: copy("A clearer screening journey.", "رحلة أوضح للفحص الصحي."),
    description: copy(
      "A wellness-centre website prototype with screening package selection, demo appointment requests, a public tracker and a restricted staff workflow.",
      "نموذج موقع لمركز صحي يضم اختيار باقات الفحص وطلبات مواعيد تجريبية ومتتبعًا عامًا ومسار عمل مقيّدًا للموظفين.",
    ),
    tags: [
      "HTML",
      "CSS",
      "JavaScript",
      "Supabase",
      "PostgreSQL",
      "TypeScript",
      "PHP",
    ],
    dates: "Sep–Oct 2026",
    problem: copy(
      "Visitors need to compare screening options and communicate appointment preferences clearly. Staff need a controlled workflow to review requests and update their status.",
      "يحتاج الزوار إلى مقارنة خيارات الفحص وتحديد تفضيلات المواعيد بوضوح. ويحتاج الموظفون إلى مسار مضبوط لمراجعة الطلبات وتحديث حالتها.",
    ),
    solution: copy(
      "A guided catalogue and custom plan lead to validated demo requests. Stored requests connect the public tracking-code lookup with an authenticated, role-checked staff dashboard.",
      "يقود كتالوج منظم وخطة مخصصة إلى طلبات تجريبية يجري التحقق منها. ويربط تخزين الطلبات بين البحث العام برمز التتبع ولوحة موظفين محمية بتسجيل الدخول والصلاحيات.",
    ),
    contribution: copy(
      "TMC internship project for UMBI Wellness Centre. The prototype demonstrates public and staff workflows; individual module responsibilities are not yet listed.",
      "مشروع ضمن تدريب TMC لمركز UMBI الصحي. يعرض النموذج مسارات الزوار والموظفين، ولم تُدرج بعد المسؤوليات الفردية عن كل وحدة.",
    ),
    features: [
      copy(
        "Four proposed packages and a searchable 28-service catalogue",
        "أربع باقات مقترحة وكتالوج قابل للبحث يضم 28 خدمة ومسارًا",
      ),
      copy(
        "Custom plan pricing without duplicate component charges",
        "تسعير خطة مخصصة دون تكرار رسوم العناصر المشمولة",
      ),
      copy(
        "Malaysia-time appointment preferences and request tracking",
        "تفضيلات مواعيد بتوقيت ماليزيا وتتبع الطلبات",
      ),
      copy(
        "Authenticated staff actions, internal notes and audit history",
        "إجراءات موظفين محمية وملاحظات داخلية وسجل تدقيق",
      ),
      copy(
        "PDF/print summaries and responsive forms",
        "ملخصات PDF وطباعة ونماذج متجاوبة",
      ),
    ],
    note: copy(
      "Demonstration prototype awaiting acceptance. It does not reserve real UWC appointments or process real payments. Catalogue prices are proposed.",
      "نموذج تجريبي بانتظار القبول. لا يحجز مواعيد فعلية في UWC ولا يعالج مدفوعات حقيقية. أسعار الكتالوج مقترحة.",
    ),
    context: "TMC internship · UMBI Wellness Centre",
    status: "Prototype · acceptance pending",
    screenshot: "/projects/uwc-home.webp",
    gallery: [
      shot(
        "/projects/uwc-home.webp",
        "Public prototype homepage",
        "الصفحة الرئيسية للنموذج العام",
      ),
      shot(
        "/projects/uwc-packages.webp",
        "Proposed screening packages",
        "باقات الفحص المقترحة",
      ),
      shot(
        "/projects/uwc-plan.webp",
        "Custom screening plan",
        "خطة الفحص المخصصة",
      ),
    ],
    github: "https://github.com/a197193-creator/uwc-wellness-centre-prototype",
    demo: "https://uwc-wellness-centre-prototype.vercel.app/",
  },
  {
    id: "tmc-official",
    number: "05",
    name: "TMC Public Website Redesign",
    category: "WEB · RESEARCH",
    type: "research",
    accent: "#c1b2d4",
    tagline: copy(
      "Clearer paths to cohort information.",
      "مسارات أوضح للوصول إلى معلومات المشروع.",
    ),
    description: copy(
      "A seven-page presentation preview reorganizing TMC participant guidance, biobank resources, publications and news into a responsive public website.",
      "نسخة عرض من سبع صفحات تعيد تنظيم إرشادات مشاركي TMC وموارد البنك الحيوي والمنشورات والأخبار في موقع عام متجاوب.",
    ),
    tags: ["HTML", "CSS", "JavaScript", "PHP", "JSON", "CSV"],
    dates: "Sep–Oct 2026",
    problem: copy(
      "Public information was spread across legacy navigation and archives. Visitors needed clearer destinations while retaining authoritative sources and existing participant services.",
      "توزعت المعلومات العامة بين قوائم قديمة وأرشيفات متعددة. واحتاج الزوار إلى وجهات أوضح مع الحفاظ على المصادر الموثوقة والخدمات الحالية للمشاركين.",
    ),
    solution: copy(
      "Seven public destinations group existing information, with searchable directories, filterable archives, CSV indexes and a read-only PHP resource directory.",
      "تجمع سبع وجهات عامة المعلومات الحالية، مع أدلة قابلة للبحث وأرشيفات قابلة للتصفية وفهارس CSV ودليل موارد PHP للقراءة فقط.",
    ),
    contribution: copy(
      "During my TMC internship, I contributed to the redesign and development of this public website preview. Exact individual module ownership is still being documented.",
      "خلال تدريبي في TMC، ساهمت في إعادة تصميم وتطوير نسخة العرض العامة لهذا الموقع. ولا يزال توثيق المسؤولية الفردية عن الوحدات قيد الاستكمال.",
    ),
    features: [
      copy(
        "Seven responsive pages with shared navigation and branding",
        "سبع صفحات متجاوبة بتنقل وهوية بصرية موحدة",
      ),
      copy(
        "Participant guidance across 11 topics",
        "إرشادات للمشاركين موزعة على 11 موضوعًا",
      ),
      copy(
        "Searchable publication and news archives",
        "أرشيفات منشورات وأخبار قابلة للبحث",
      ),
      copy(
        "Resource indexes, CSV exports and original-source links",
        "فهارس موارد وتصدير CSV وروابط للمصادر الأصلية",
      ),
    ],
    note: copy(
      "Presentation preview, not a replacement for the official UKM website. Officer approval, UAT and official release remain separate milestones.",
      "نسخة للعرض، وليست بديلًا للموقع الرسمي في UKM. اعتماد المسؤولين واختبار القبول والإطلاق الرسمي مراحل مستقلة.",
    ),
    context: "TMC internship · UMBI, UKM",
    status: "Preview delivered · review pending",
    screenshot: "/projects/tmc-official-home.webp",
    gallery: [
      shot(
        "/projects/tmc-official-home.webp",
        "Presentation preview homepage",
        "الصفحة الرئيسية لنسخة العرض",
      ),
      shot(
        "/projects/tmc-official-participants.webp",
        "Participant guidance",
        "إرشادات المشاركين",
      ),
      shot("/projects/tmc-official-news.webp", "News archive", "أرشيف الأخبار"),
    ],
    github:
      "https://github.com/a197193-creator/tmc-official-website-preview/tree/codex/official-website-preview",
    demo: "https://tmc-official-website-preview.vercel.app/",
  },
];
Object.assign(projectTranslations, {
  "UMBI Wellness Centre Prototype": "نموذج مركز UMBI الصحي",
  "TMC Public Website Redesign": "إعادة تصميم موقع TMC العام",
  "Individual final-year project · UKM": "مشروع فردي للسنة النهائية · UKM",
  "Completed academic project": "مشروع أكاديمي مكتمل",
  "Prototype delivered · review pending": "نموذج مُسلّم · بانتظار المراجعة",
  "Prototype · acceptance pending": "نموذج تجريبي · بانتظار القبول",
  "Preview delivered · review pending": "نسخة عرض مُسلّمة · بانتظار المراجعة",
  "TMC internship · UMBI, UKM": "تدريب TMC · UMBI، UKM",
  "TMC internship · UMBI Wellness Centre": "تدريب TMC · مركز UMBI الصحي",
  "Project evidence": "أدلة المشروع",
  "Real project screenshots": "صور فعلية من المشروع",
  "Open screenshot": "افتح الصورة",
  "Email, LinkedIn or WhatsApp — choose what works for you.":
    "البريد أو LinkedIn أو WhatsApp — اختر الوسيلة المناسبة لك.",
  "Based in Kajang, Selangor, Malaysia · UTC+8":
    "أقيم في كاجانغ، سيلانغور، ماليزيا · UTC+8",
  "Internship location: Cheras, Selangor, Malaysia":
    "مقر التدريب: شيراس، سيلانغور، ماليزيا",
  "Expected graduation: August 2027. Learning by building, questioning and connecting ideas.":
    "التخرج المتوقع: أغسطس 2027. أتعلم بالبناء وطرح الأسئلة وربط الأفكار.",
  "Bachelor of Software Engineering with Honours (Information System Development)":
    "بكالوريوس هندسة البرمجيات مع مرتبة الشرف (تطوير نظم المعلومات)",
  "Leading university teams of 4–6 students, coordinating responsibilities and supporting planning and delivery.":
    "قيادة فرق جامعية من 4 إلى 6 طلاب، وتنسيق المسؤوليات ودعم التخطيط والتسليم.",
});
