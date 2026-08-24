from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import KeepTogether, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


OUTPUT = "output/pdf/Garren-Dullas-Cloud-Platform-Resume.pdf"
ACCENT = colors.HexColor("#1769aa")
INK = colors.HexColor("#202124")
MUTED = colors.HexColor("#5f6368")
RULE = colors.HexColor("#d9e2ec")


def p(text, style):
    return Paragraph(text, style)


styles = getSampleStyleSheet()
name_style = ParagraphStyle(
    "Name", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=25,
    leading=28, textColor=INK, spaceAfter=2,
)
role_style = ParagraphStyle(
    "Role", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=10,
    leading=13, textColor=ACCENT, spaceAfter=4,
)
contact_style = ParagraphStyle(
    "Contact", parent=styles["Normal"], fontName="Helvetica", fontSize=8.5,
    leading=11, textColor=MUTED, alignment=TA_LEFT,
)
summary_style = ParagraphStyle(
    "Summary", parent=styles["Normal"], fontName="Helvetica", fontSize=9.2,
    leading=13, textColor=INK, spaceAfter=3,
)
section_style = ParagraphStyle(
    "Section", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=9.2,
    leading=11, textColor=ACCENT, spaceBefore=6, spaceAfter=4,
)
project_style = ParagraphStyle(
    "Project", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=10,
    leading=12, textColor=INK, spaceAfter=1,
)
date_style = ParagraphStyle(
    "Date", parent=styles["Normal"], fontName="Helvetica-Oblique", fontSize=8.3,
    leading=10, textColor=MUTED, spaceAfter=2,
)
body_style = ParagraphStyle(
    "Body", parent=styles["Normal"], fontName="Helvetica", fontSize=8.4,
    leading=11.2, textColor=INK, leftIndent=9, firstLineIndent=-7, spaceAfter=1.5,
)
sidebar_style = ParagraphStyle(
    "Sidebar", parent=styles["Normal"], fontName="Helvetica", fontSize=8.2,
    leading=11, textColor=INK, spaceAfter=3,
)
sidebar_label_style = ParagraphStyle(
    "SidebarLabel", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=8.2,
    leading=10, textColor=INK, spaceAfter=1,
)
small_style = ParagraphStyle(
    "Small", parent=styles["Normal"], fontName="Helvetica", fontSize=7.8,
    leading=10.2, textColor=INK, spaceAfter=2,
)


def section(title):
    return [p(title.upper(), section_style)]


def project(title, date, bullets):
    flow = [p(title, project_style), p(date, date_style)]
    flow.extend(p(f"- {bullet}", body_style) for bullet in bullets)
    flow.append(Spacer(1, 2))
    return flow


doc = SimpleDocTemplate(
    OUTPUT,
    pagesize=letter,
    rightMargin=0.58 * inch,
    leftMargin=0.58 * inch,
    topMargin=0.45 * inch,
    bottomMargin=0.42 * inch,
    title="Garren Dullas - Cloud and Platform Engineering Resume",
    author="Garren Dullas",
)

story = []

header_left = [
    p("Garren Dullas", name_style),
    p("Cloud / Platform Engineering", role_style),
    p("Information Technology student building and operating cloud-hosted backend systems. Hands-on with containerized services, deployment automation, identity, monitoring, and backend applications across Azure, DigitalOcean, and Oracle Cloud.", summary_style),
]
header_right = [
    p("Pasig City, Philippines", contact_style),
    p("0947 497 4843", contact_style),
    p("garrendullas@gmail.com", contact_style),
    p("github.com/Acteus", contact_style),
    p("acteus.github.io", contact_style),
]
header = Table([[header_left, header_right]], colWidths=[4.7 * inch, 2.05 * inch])
header.setStyle(TableStyle([
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("LEFTPADDING", (0, 0), (-1, -1), 0),
    ("RIGHTPADDING", (0, 0), (-1, -1), 0),
    ("TOPPADDING", (0, 0), (-1, -1), 0),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
]))
story.append(header)
story.append(Spacer(1, 7))

left = []
left.extend(section("Selected projects"))
left.extend(project("JobBoard-DevOps", "Cloud / DevOps Developer | October 2025", [
    "Architected a full-stack job platform and worked on its AWS-to-Azure deployment study for minimum-wage job seekers.",
    "Designed Azure Static Web Apps, Container Apps, and MySQL Flexible Server components with Docker, GitHub Actions, and ARM templates.",
    "Connected application delivery to cloud infrastructure through separated frontend/backend services and an automated container pipeline.",
]))
left.extend(project("GitHub -> Discord Bot", "Cloud / Backend Developer | 2026 - Present", [
    "Built a service that tracks repository updates for personal, group, and friends' projects.",
    "Deployed the service on Oracle Cloud using Podman, Quadlet, Caddy, and a secure HTTPS gateway.",
]))
left.extend(project("JRU Atlas", "Cloud / Full-Stack Developer | 2026 - Present", [
    "Developing a private accreditation workspace for university programs on DigitalOcean.",
    "Working across the application, background workers, and private language-processing service.",
]))
left.extend(project("LaborWise", "Cloud / Backend Developer | 2026 - Present", [
    "Developing a private Philippine employment-rights service with a web API and scheduled legal-source updates on Azure.",
]))

left.extend(section("Experience"))
left.extend(project("LGU Botolan, Botolan Municipal Hall, Zambales", "IT and Administrative Assistant | February - March 2023", [
    "Supported software and hardware troubleshooting, local network maintenance, and workstation setup.",
    "Managed records and clerical tasks while supporting day-to-day administrative operations.",
]))

right = []
right.extend(section("Core focus"))
right.extend([
    p("<b>Cloud:</b> Azure Container Apps, Azure Container Registry, DigitalOcean, Oracle Cloud", sidebar_style),
    p("<b>Operations:</b> Docker, Podman, GitHub Actions, Linux, Caddy, Quadlet, HTTP/TLS", sidebar_style),
    p("<b>Identity and monitoring:</b> Managed Identity, RBAC, Log Analytics", sidebar_style),
    p("<b>Backend:</b> Python, FastAPI, PHP, Laravel, SQL, MySQL, shell scripting", sidebar_style),
])
right.extend(section("Supporting experience"))
right.extend([
    p("JavaScript, TypeScript, React, Flutter, Firebase, TensorFlow, NLP, Streamlit, causal inference", sidebar_style),
])
right.extend(section("Education"))
right.extend([
    p("<b>Jose Rizal University</b>", sidebar_label_style),
    p("B.S. Information Technology", sidebar_style),
    p("Mandaluyong | August 2023 - Present", small_style),
    p("Expected graduation: 2027", small_style),
])
right.extend(section("Certifications"))
right.extend([
    p("CompTIA ITF+", sidebar_style),
    p("IT Specialist - Java", sidebar_style),
    p("IT Specialist - Databases", sidebar_style),
    p("Wadhwani - Job Ready: Employability Skills", sidebar_style),
])

columns = Table([[left, right]], colWidths=[4.75 * inch, 2.0 * inch])
columns.setStyle(TableStyle([
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("LINEBEFORE", (1, 0), (1, 0), 0.6, RULE),
    ("LEFTPADDING", (0, 0), (-1, -1), 0),
    ("RIGHTPADDING", (0, 0), (-1, -1), 13),
    ("RIGHTPADDING", (1, 0), (1, 0), 0),
    ("TOPPADDING", (0, 0), (-1, -1), 0),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
]))
story.append(columns)


def draw_page(canvas, document):
    canvas.saveState()
    canvas.setStrokeColor(RULE)
    canvas.setLineWidth(0.7)
    canvas.line(document.leftMargin, 0.34 * inch, letter[0] - document.rightMargin, 0.34 * inch)
    canvas.setFont("Helvetica", 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawString(document.leftMargin, 0.2 * inch, "Garren Dullas | Cloud / Platform Engineering")
    canvas.drawRightString(letter[0] - document.rightMargin, 0.2 * inch, "Portfolio: acteus.github.io")
    canvas.restoreState()


doc.build(story, onFirstPage=draw_page)
