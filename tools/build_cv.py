"""Build the portfolio-matched CV from verified personal and project information."""
from pathlib import Path
from shutil import copyfile
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, KeepTogether

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'output/pdf/Fares-Mohamed-Elnagar-CV.pdf'
OUT.parent.mkdir(parents=True, exist_ok=True)
for name, filename in [('Segoe', 'segoeui.ttf'), ('SegoeBold', 'segoeuib.ttf'), ('Georgia', 'georgia.ttf')]:
    pdfmetrics.registerFont(TTFont(name, str(Path('C:/Windows/Fonts') / filename)))
pdfmetrics.registerFontFamily('Segoe', normal='Segoe', bold='SegoeBold', italic='Segoe', boldItalic='SegoeBold')

INK = '#F4F5F7'
MUTED = '#BCC6D2'
GOLD = '#F5C66A'
CYAN = '#40DFFF'
styles = {
    'name': ParagraphStyle('name', fontName='Georgia', fontSize=27, leading=31, textColor=colors.HexColor(GOLD), spaceAfter=4),
    'title': ParagraphStyle('title', fontName='SegoeBold', fontSize=12, leading=18, textColor=colors.HexColor(INK), spaceAfter=8),
    'body': ParagraphStyle('body', fontName='Segoe', fontSize=10.3, leading=15.2, textColor=colors.HexColor(INK), spaceAfter=6),
    'small': ParagraphStyle('small', fontName='Segoe', fontSize=9, leading=14, textColor=colors.HexColor(MUTED), spaceAfter=5),
    'section': ParagraphStyle('section', fontName='SegoeBold', fontSize=10, leading=15, textColor=colors.HexColor(CYAN), spaceBefore=10, spaceAfter=6),
    'item': ParagraphStyle('item', fontName='SegoeBold', fontSize=12, leading=17, textColor=colors.HexColor(GOLD), spaceAfter=4),
    'bullet': ParagraphStyle('bullet', fontName='Segoe', fontSize=10.3, leading=15.2, leftIndent=10, firstLineIndent=-10, textColor=colors.HexColor(INK), spaceAfter=4),
}
def p(text, kind='body'):
    return Paragraph(text, styles[kind])
def link(url, label):
    return f'<a href="{url}" color="{CYAN}">{label}</a>'
def section(label):
    return p(label.upper(), 'section')
def bullet(text):
    return p('- ' + text, 'bullet')

def backdrop(c, doc):
    w, h = A4
    c.saveState()
    c.setFillColor(colors.HexColor('#080B10'))
    c.rect(0, 0, w, h, fill=1, stroke=0)
    c.setFillColor(colors.HexColor('#101722'))
    c.rect(w - 140, 0, 140, h, fill=1, stroke=0)
    c.setStrokeColor(colors.HexColor('#192431'))
    c.setLineWidth(.3)
    for x in range(int(w)-125, int(w), 24):
        c.line(x, 55, x, h-55)
    c.setFillColor(colors.HexColor('#781E32'))
    c.rect(0, h-6, w, 6, fill=1, stroke=0)
    c.setStrokeColor(colors.HexColor(GOLD))
    c.setLineWidth(.8)
    c.line(28, 62, 28, h-39)
    c.setStrokeColor(colors.HexColor('#33404F'))
    c.line(43, 45, w-43, 45)
    c.setFillColor(colors.HexColor(MUTED))
    c.setFont('Segoe', 8)
    c.drawString(43, 29, 'FARES ELNAGAR  /  SOFTWARE ENGINEERING')
    c.drawRightString(w-43, 29, f'{doc.page:02d} / 02')
    c.restoreState()

story = [
    p('Fares Mohamed<br/>Ragab El-Nagar', 'name'),
    p('Software Engineering Student &amp; Developer', 'title'),
    p('Based in Kajang, Selangor, Malaysia  |  +60 18-298 9506', 'small'),
    p(link('mailto:sw.e.is.fares.mo@gmail.com', 'sw.e.is.fares.mo@gmail.com') + '  |  ' + link('https://www.linkedin.com/in/fares-elnagar-7ab187411/', 'LinkedIn') + '  |  ' + link('https://github.com/a197193-creator', 'GitHub'), 'small'),
    p(link('https://the-software-engineer-fares-mohamme.vercel.app/', 'View my portfolio and project evidence'), 'small'),
    section('Profile'),
    p('Software Engineering student at UKM, currently completing an internship with The Malaysian Cohort at UMBI. I build mobile and web applications with Flutter, React, Supabase and useful AI integrations, taking projects from requirements through implementation, testing and documentation.'),
    section('Internship'),
    p('Software Engineering Intern', 'item'),
    p('UMBI / The Malaysian Cohort (TMC), UKM', 'body'),
    p('3 Sep 2026 - 19 Jan 2027 (scheduled completion)<br/>Internship location: Cheras, Selangor, Malaysia', 'small'),
    bullet('Contributing to mobile and web development in healthcare research, including the MyCohort mobile application.'),
    bullet('Developed the TMC Research &amp; Publications website using React and TypeScript, with searchable research and publication content.'),
    bullet('Contributing to website and wellness-centre prototypes, with formal review and official release pending.'),
    section('Education'),
    p('Universiti Kebangsaan Malaysia (UKM)', 'item'),
    p('Bachelor of Software Engineering with Honours<br/>(Information System Development)'),
    p('Expected graduation: August 2027  |  CGPA: 3.33 / 4.00', 'small'),
    section('Technical skills'),
    p('<b>Mobile:</b> Flutter, Dart, Kotlin, Android Studio<br/><b>Web:</b> React, TypeScript, JavaScript, HTML, CSS, PHP<br/><b>Data &amp; AI:</b> Supabase, PostgreSQL, Auth, Storage, Edge Functions, Groq AI<br/><b>Engineering:</b> Java, OOP, requirements analysis, system design, software testing, debugging and technical documentation'),
    section('Leadership & languages'),
    p('Led university teams of 4-6 students, including the CareBridge academic hospital appointment application, coordinating responsibilities and delivery.'),
    p('<b>Arabic:</b> Native  |  <b>English:</b> Professional working proficiency', 'small'),
    PageBreak(),
    p('Selected work', 'name'),
    p('Practical software. Clear contribution. Real project evidence.', 'small'),
]

def project(title, meta, paragraphs, destination=None, label='Project preview'):
    items = [section(title), p(meta, 'small')]
    items.extend(bullet(text) for text in paragraphs)
    if destination:
        items.append(p(link(destination, label), 'small'))
    story.append(KeepTogether(items))

project('DIACARE', 'Individual final-year project, UKM  |  May - Jul 2026\n<br/>Flutter, Dart, Kotlin, Supabase, Groq AI', [
    'Independently designed and developed an Android diabetes self-management application, managing requirements, UI, database integration, testing and documentation.',
    'Combined glucose and meal records, Malaysian food context, activity guidance, medication reminders, education and date-range PDF reports.',
    'Integrated native Android reminders with Kotlin and educational AI chat, nutrition estimates and report summaries through backend functions.',
    'Completed academic application. AI responses provide educational support.',
], 'https://the-software-engineer-fares-mohamme.vercel.app/#projects', 'Screenshots and project details')
project('TMC Research & Publications', 'Internship project  |  Sep - Oct 2026\n<br/>React, TypeScript, Vite, Tailwind CSS', [
    'Developed a responsive website for browsing TMC studies, subprojects and publications, including search, filtering and original-source links.',
    'Organized institutional content in local TypeScript data. Frontend prototype delivered; review and WordPress migration pending.',
], 'https://tmc-research-publications-20260915.vercel.app/')
project('UMBI Wellness Centre Prototype', 'Internship project  |  Sep - Oct 2026\n<br/>HTML, CSS, JavaScript, PHP, Supabase', [
    'Contributed to a prototype for wellness packages, custom plans, appointment preferences and a restricted staff dashboard.',
    'Demo request and tracking flows; acceptance pending. No live payments or production booking service.',
], 'https://uwc-wellness-centre-prototype.vercel.app/')
project('TMC Public Website Redesign', 'Internship project  |  Sep - Oct 2026\n<br/>HTML, CSS, JavaScript, Tailwind CSS, PHP', [
    'Contributed to a seven-page website preview covering participant guidance, biobank information, news, resources and contact.',
    'Presentation preview delivered. Officer approval, UAT and official release remain separate milestones.',
], 'https://tmc-official-website-preview.vercel.app/')
project('MyCohort Mobile Application', 'The Malaysian Cohort, UMBI / UKM  |  Internship', [
    'Contributing to mobile application development for The Malaysian Cohort project.',
])

doc = SimpleDocTemplate(str(OUT), pagesize=A4, leftMargin=43, rightMargin=43, topMargin=37, bottomMargin=65,
                        title='Fares Mohamed Ragab El-Nagar - Software Engineering CV', author='Fares Mohamed Ragab El-Nagar',
                        subject='Software engineering, mobile and web development portfolio')
doc.build(story, onFirstPage=backdrop, onLaterPages=backdrop)
copyfile(OUT, ROOT / 'public/Fares-Mohamed-Elnagar-CV.pdf')
print(OUT)
