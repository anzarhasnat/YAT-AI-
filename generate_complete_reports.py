import os
import sys
from reportlab.lib.units import inch
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, PageBreak, Spacer, Table, TableStyle, Image, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT, TA_RIGHT

from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml

# ----------------------------------------------------------------------
# CANVAS FOR BOXED PAGE NUMBERS (ZOHRA REPORT STYLE)
# ----------------------------------------------------------------------
class ZohraStyleCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.pages = []

    def showPage(self):
        self.pages.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        for page in self.pages:
            self.__dict__.update(page)
            if self._pageNumber > 1:
                page_num_str = str(self._pageNumber - 1)
                self.saveState()
                self.setFont("Times-Roman", 10)
                box_w = 26
                box_h = 17
                x = 595.27 - 54 - box_w
                y = 36
                self.setStrokeColor(colors.black)
                self.setLineWidth(1)
                self.rect(x, y, box_w, box_h, stroke=1, fill=0)
                self.drawCentredString(x + box_w / 2.0, y + 4.5, page_num_str)
                self.restoreState()
            super().showPage()
        super().save()

def build_pdf_report(pdf_filename="YAT_AI_Project_Report.pdf"):
    print(f"Building PDF: {pdf_filename}...")
    doc = SimpleDocTemplate(
        pdf_filename,
        pagesize=A4,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Custom styles matching Times New Roman standard
    title_style = ParagraphStyle('CoverTitle', fontName='Times-Bold', fontSize=18, leading=22, alignment=TA_CENTER)
    subtitle_style = ParagraphStyle('CoverSubtitle', fontName='Times-Bold', fontSize=14, leading=18, alignment=TA_CENTER)
    normal_center = ParagraphStyle('NormalCenter', fontName='Times-Roman', fontSize=11, leading=15, alignment=TA_CENTER)
    bold_center = ParagraphStyle('BoldCenter', fontName='Times-Bold', fontSize=11.5, leading=16, alignment=TA_CENTER)
    italic_center = ParagraphStyle('ItalicCenter', fontName='Times-Italic', fontSize=11, leading=15, alignment=TA_CENTER)
    h1_style = ParagraphStyle('H1', fontName='Times-Bold', fontSize=15, leading=19, alignment=TA_CENTER, spaceAfter=8)
    h2_style = ParagraphStyle('H2', fontName='Times-Bold', fontSize=13, leading=17, alignment=TA_LEFT, spaceBefore=10, spaceAfter=4)
    h3_style = ParagraphStyle('H3', fontName='Times-Bold', fontSize=11.5, leading=15, alignment=TA_LEFT, spaceBefore=8, spaceAfter=3)
    body_style = ParagraphStyle('Body', fontName='Times-Roman', fontSize=11, leading=15, alignment=TA_JUSTIFY, spaceAfter=6)
    bullet_style = ParagraphStyle('Bullet', fontName='Times-Roman', fontSize=10.5, leading=14, alignment=TA_JUSTIFY, leftIndent=15, spaceAfter=4)
    table_cell = ParagraphStyle('TableCell', fontName='Times-Roman', fontSize=9.5, leading=13)
    table_header = ParagraphStyle('TableHeader', fontName='Times-Bold', fontSize=9.5, leading=13)

    story = []
    logo_file = 'college_logo.jpg'

    def placeholder_box(title, desc):
        content = [
            Paragraph(f"<b>{title}</b>", ParagraphStyle('PB_T', fontName='Times-Bold', fontSize=10, leading=14, alignment=TA_CENTER, textColor=colors.HexColor('#222222'))),
            Spacer(1, 4),
            Paragraph(desc, ParagraphStyle('PB_D', fontName='Times-Italic', fontSize=8.5, leading=12, alignment=TA_CENTER, textColor=colors.HexColor('#555555')))
        ]
        t = Table([[content]], colWidths=[487])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F9FBFB')),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#777777')),
            ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#777777')),
            ('TOPPADDING', (0,0), (-1,-1), 16),
            ('BOTTOMPADDING', (0,0), (-1,-1), 16),
            ('LEFTPADDING', (0,0), (-1,-1), 15),
            ('RIGHTPADDING', (0,0), (-1,-1), 15),
        ]))
        return t

    def pdf_diagram(img_file, caption, width=475):
        if os.path.exists(img_file):
            from PIL import Image as PILImage
            with PILImage.open(img_file) as im:
                iw, ih = im.size
                aspect = ih / float(iw)
                h = width * aspect
            return [
                Spacer(1, 4),
                Image(img_file, width=width, height=h),
                Spacer(1, 3),
                Paragraph(f"<i><b>{caption}</b></i>", ParagraphStyle('Cap', fontName='Times-BoldItalic', fontSize=8.5, leading=11, alignment=TA_CENTER, textColor=colors.HexColor('#1E293B'))),
                Spacer(1, 6)
            ]
        return [placeholder_box(f"[ DIAGRAM: {caption} ]", f"File '{img_file}' not found.")]

    # =========================================================================
    # COVER PAGE
    # =========================================================================
    story.append(Spacer(1, 15))
    story.append(Paragraph("<b>YAT AI – AI-Powered Mock Interview Platform</b>", title_style))
    story.append(Spacer(1, 6))
    story.append(Paragraph("<b>(Minor Project)</b>", subtitle_style))
    story.append(Spacer(1, 25))

    story.append(Paragraph("Project report submitted on the partial fulfilment of the requirements for the", normal_center))
    story.append(Paragraph("Degree of", normal_center))
    story.append(Spacer(1, 4))
    story.append(Paragraph("<i><b>Diploma</b></i>", ParagraphStyle('Dip', fontName='Times-BoldItalic', fontSize=15, leading=18, alignment=TA_CENTER)))
    story.append(Paragraph("<i>In</i>", italic_center))
    story.append(Paragraph("<i><b>Computer Science and Engineering</b></i>", ParagraphStyle('CSE', fontName='Times-BoldItalic', fontSize=14, leading=18, alignment=TA_CENTER)))
    story.append(Spacer(1, 4))
    story.append(Paragraph("<u><b>Academic session: 2024-27</b></u>", ParagraphStyle('Sess', fontName='Times-Bold', fontSize=12, leading=16, alignment=TA_CENTER)))
    story.append(Spacer(1, 20))

    story.append(Paragraph("<i>Submitted by:</i>", italic_center))
    story.append(Spacer(1, 4))
    story.append(Paragraph("<b>Anzar Hasnaat:</b> 2025-CSEL-605", normal_center))
    story.append(Paragraph("<b>Dipanshu Kumar:</b> 25025-CSEL-401", normal_center))
    story.append(Paragraph("<b>Roshan Kumar:</b> 2025-CSEL-603", normal_center))
    story.append(Paragraph("<b>Chandan Kumar:</b> 2024-CSE-042", normal_center))
    story.append(Spacer(1, 18))

    story.append(Paragraph("<i><b>Under the supervision of</b></i>", bold_center))
    story.append(Spacer(1, 4))
    story.append(Paragraph("<b>Md Naiyer Hoda</b>", ParagraphStyle('Guide', fontName='Times-Bold', fontSize=12, leading=15, alignment=TA_CENTER)))
    story.append(Paragraph("<i>Lecturer, Dept. of Computer Science & Engineering</i>", italic_center))
    story.append(Spacer(1, 15))

    if os.path.exists(logo_file):
        story.append(Image(logo_file, width=1.5*inch, height=1.5*inch))
    story.append(Spacer(1, 8))
    story.append(Paragraph("Department of Computer Science and Engineering", ParagraphStyle('Dept', fontName='Times-Roman', fontSize=12.5, leading=16, alignment=TA_CENTER)))
    story.append(Paragraph("<b>Government Polytechnic Muzaffarpur</b>", ParagraphStyle('Coll', fontName='Times-Bold', fontSize=13.5, leading=18, alignment=TA_CENTER)))

    story.append(PageBreak())

    # =========================================================================
    # PAGE 1: PROJECT COMPLETION CERTIFICATE
    # =========================================================================
    story.append(Paragraph("Government Polytechnic Muzaffarpur", ParagraphStyle('C1', fontName='Times-Roman', fontSize=13, leading=16, alignment=TA_CENTER)))
    story.append(Paragraph("Naya Tola, Technical Chowk, Muzaffarpur-842001", normal_center))
    story.append(Spacer(1, 4))
    story.append(Paragraph("<b>Department of Computer Science and Engineering</b>", ParagraphStyle('CDept', fontName='Times-Bold', fontSize=13, leading=16, alignment=TA_CENTER, textColor=colors.HexColor('#0B5394'))))
    story.append(Spacer(1, 10))

    if os.path.exists(logo_file):
        story.append(Image(logo_file, width=1.1*inch, height=1.1*inch))
    story.append(Spacer(1, 12))

    story.append(Paragraph("<u><b>PROJECT COMPLETION CERTIFICATE</b></u>", ParagraphStyle('PCC', fontName='Times-Bold', fontSize=13, leading=17, alignment=TA_CENTER)))
    story.append(Spacer(1, 12))

    cert_text = ('This is to certify that the project entitled <b>"YAT AI – AI-POWERED MOCK INTERVIEW & CANDIDATE EVALUATION PLATFORM"</b> '
                 'has been carried out by the following students of the Department of Computer Science & Engineering, Government Polytechnic '
                 'Muzaffarpur, under my guidance and supervision.')
    story.append(Paragraph(cert_text, body_style))
    story.append(Spacer(1, 8))

    story.append(Paragraph("1. <b>Anzar Hasnaat</b> – Roll No.: 2025-CSEL-605", bullet_style))
    story.append(Paragraph("2. <b>Dipanshu Kumar</b> – Roll No.: 25025-CSEL-401", bullet_style))
    story.append(Paragraph("3. <b>Roshan Kumar</b> – Roll No.: 2025-CSEL-603", bullet_style))
    story.append(Paragraph("4. <b>Chandan Kumar</b> – Roll No.: 2024-CSE-042", bullet_style))
    story.append(Spacer(1, 8))

    story.append(Paragraph("The project work has been completed as part of the academic requirements for the <b>Diploma in Computer Science & Engineering</b>.", body_style))
    story.append(Paragraph("The work presented in this report has been reviewed and is submitted for academic evaluation during the session <b>2024-27</b>.", body_style))
    story.append(Spacer(1, 28))

    # Signature Table
    sig_data = [
        [Paragraph("<b>Project Guide / Supervisor</b>", table_header), Paragraph("<b>Head of Department</b>", table_header)],
        [
            Paragraph("Signature: ___________________________<br/><br/><b>Name:</b> Md Naiyer Hoda<br/><b>Designation:</b> Lecturer, CSE Dept.<br/><b>Date:</b> ______________________________", table_cell),
            Paragraph("Signature: ___________________________<br/><br/><b>Name:</b> ______________________________<br/><b>Designation:</b> H.O.D., CSE Dept.<br/><b>Date:</b> ______________________________", table_cell)
        ]
    ]
    sig_table = Table(sig_data, colWidths=[243, 244])
    sig_table.setStyle(TableStyle([
        ('GRID', (0,0), (-1,-1), 1, colors.HexColor('#444444')),
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#F2F2F2')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(sig_table)

    story.append(PageBreak())

    # =========================================================================
    # PAGE 2: DECLARATION OF ORIGINALITY AND AI USAGE
    # =========================================================================
    if os.path.exists(logo_file):
        story.append(Image(logo_file, width=0.8*inch, height=0.8*inch))
    story.append(Spacer(1, 4))
    story.append(Paragraph("<b>GOVERNMENT POLYTECHNIC MUZAFFARPUR</b>", ParagraphStyle('GPM', fontName='Times-Bold', fontSize=12, leading=15, alignment=TA_CENTER)))
    story.append(Paragraph("Department of Computer Science & Engineering", normal_center))
    story.append(Spacer(1, 6))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.black, spaceBefore=4, spaceAfter=8))

    story.append(Paragraph("<u><b>DECLARATION OF ORIGINALITY AND AI USAGE</b></u>", ParagraphStyle('DOU', fontName='Times-Bold', fontSize=12, leading=16, alignment=TA_CENTER)))
    story.append(Spacer(1, 8))

    story.append(Paragraph("<b>A. Declaration of Originality</b>", h3_style))
    story.append(Paragraph('We hereby declare that the project entitled <b>"YAT AI – AI-POWERED MOCK INTERVIEW & CANDIDATE EVALUATION PLATFORM"</b>, submitted to the Department of Computer Science & Engineering, Government Polytechnic Muzaffarpur, is the work carried out by our team under the guidance and supervision of our assigned project guide.', body_style))
    story.append(Paragraph("We confirm that the information presented in this report is accurate to the best of our knowledge. All external resources, references and contributions have been appropriately acknowledged. We accept responsibility for the contents of this project report.", body_style))

    story.append(Paragraph("<b>B. Declaration of AI Usage</b>", h3_style))
    story.append(Paragraph("AI-based tools were used as supporting resources during the development of this project and preparation of its documentation. These tools assisted with technical guidance, programming suggestions, debugging, architectural discussions and selected AI-assisted application functionalities.", body_style))

    ai_data = [
        [Paragraph("<b>AI tool</b>", table_header), Paragraph("<b>Purpose and contribution</b>", table_header)],
        [Paragraph("<b>Groq Cloud SDK</b>", table_cell), Paragraph("High-throughput inference for dynamic interview questions, algorithmic code efficiency analysis, and real-time response evaluation.", table_cell)],
        [Paragraph("<b>Google Gemini Flash</b>", table_cell), Paragraph("Multi-modal PDF resume extraction, structured candidate skill profiling, and Candidate DNA report synthesis.", table_cell)],
        [Paragraph("<b>Claude / Assistant</b>", table_cell), Paragraph("Technical guidance, architectural consultations, Next.js App Router route debugging, and documentation formatting.", table_cell)]
    ]
    ai_table = Table(ai_data, colWidths=[130, 357])
    ai_table.setStyle(TableStyle([
        ('GRID', (0,0), (-1,-1), 1, colors.HexColor('#444444')),
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#F2F2F2')),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(ai_table)
    story.append(Spacer(1, 6))

    story.append(Paragraph("The project team reviewed and evaluated the suggestions and outputs generated by these tools and remains responsible for the final implementation and submitted work.", body_style))

    story.append(Paragraph("<b>C. Team Declaration</b>", h3_style))
    story.append(Paragraph("We acknowledge that we have read and understood the above declaration and accept responsibility for our respective contributions to the project.", body_style))

    team_data = [
        [Paragraph("<b>1. Anzar Hasnaat:-</b> _____________________", table_cell), Paragraph("<b>2. Dipanshu Kumar:-</b> _____________________", table_cell)],
        [Paragraph("<b>3. Roshan Kumar:-</b> _____________________", table_cell), Paragraph("<b>4. Chandan Kumar:-</b> _____________________", table_cell)]
    ]
    team_table = Table(team_data, colWidths=[243, 244])
    team_table.setStyle(TableStyle([
        ('GRID', (0,0), (-1,-1), 1, colors.HexColor('#444444')),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(team_table)
    story.append(Spacer(1, 8))

    story.append(Paragraph("<b>Place:</b> Muzaffarpur, Bihar &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>Date:</b> ____________________", normal_center))

    story.append(PageBreak())

    # =========================================================================
    # PAGE 3: ACKNOWLEDGEMENT
    # =========================================================================
    if os.path.exists(logo_file):
        story.append(Image(logo_file, width=0.8*inch, height=0.8*inch))
    story.append(Spacer(1, 4))
    story.append(Paragraph("<b>GOVERNMENT POLYTECHNIC MUZAFFARPUR</b>", ParagraphStyle('GPM', fontName='Times-Bold', fontSize=12, leading=15, alignment=TA_CENTER)))
    story.append(Paragraph("Department of Computer Science & Engineering", normal_center))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.black, spaceBefore=4, spaceAfter=8))

    story.append(Paragraph("<u><b>ACKNOWLEDGEMENT</b></u>", ParagraphStyle('ACK', fontName='Times-Bold', fontSize=13, leading=17, alignment=TA_CENTER)))
    story.append(Spacer(1, 12))

    story.append(Paragraph('We would like to express our sincere gratitude to <b>Government Polytechnic Muzaffarpur</b>, Department of Computer Science & Engineering, for providing us with the opportunity, technical laboratory facilities and academic environment to undertake and complete our project entitled <b>"YAT AI – AI-POWERED MOCK INTERVIEW & CANDIDATE EVALUATION PLATFORM."</b>', body_style))
    story.append(Paragraph("We are deeply grateful to our project guide, <b>Md Naiyer Hoda</b>, for his valuable guidance, continuous support, encouragement and constructive suggestions throughout the development of this project. His insights and feedback helped us improve our understanding, overcome technical challenges and enhance the overall quality of our work.", body_style))
    story.append(Paragraph("We would also like to extend our heartfelt gratitude to the <b>Head of the Department</b>, all the faculty members of the Computer Science & Engineering Department, and the <b>Principal of Government Polytechnic Muzaffarpur</b> for their encouragement, support and for providing us with the necessary academic resources and facilities.", body_style))
    story.append(Paragraph("We would also like to thank our team members for their cooperation, dedication and collective efforts throughout the planning, development, implementation and documentation of this project. Finally, we express our sincere appreciation to our families and everyone who directly or indirectly supported and encouraged us during the completion of this project.", body_style))
    story.append(Paragraph("Thank you to everyone who contributed to making this project a meaningful learning experience.", body_style))
    story.append(Spacer(1, 24))

    story.append(Paragraph("<b>Submitted by:</b><br/>Anzar Hasnaat<br/>Dipanshu Kumar<br/>Roshan Kumar<br/>Chandan Kumar", ParagraphStyle('Sub', fontName='Times-Roman', fontSize=11, leading=16)))

    story.append(PageBreak())

    # =========================================================================
    # PAGE 4: ABSTRACT
    # =========================================================================
    if os.path.exists(logo_file):
        story.append(Image(logo_file, width=0.8*inch, height=0.8*inch))
    story.append(Spacer(1, 4))
    story.append(Paragraph("<b>GOVERNMENT POLYTECHNIC MUZAFFARPUR</b>", ParagraphStyle('GPM', fontName='Times-Bold', fontSize=12, leading=15, alignment=TA_CENTER)))
    story.append(Paragraph("Department of Computer Science & Engineering", normal_center))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.black, spaceBefore=4, spaceAfter=8))

    story.append(Paragraph("<u><b>ABSTRACT</b></u>", ParagraphStyle('ABS', fontName='Times-Bold', fontSize=13, leading=17, alignment=TA_CENTER)))
    story.append(Spacer(1, 4))
    story.append(Paragraph("<b>YAT AI – AI-POWERED MOCK INTERVIEW & CANDIDATE EVALUATION PLATFORM</b>", bold_center))
    story.append(Spacer(1, 10))

    story.append(Paragraph("Technical placement examinations and recruitment interviews are pivotal milestones for diploma and engineering students. However, students frequently face difficulties evaluating their practical readiness because conventional preparation methods rely on static question banks, unassisted self-study, or disjointed coding websites. Students rarely receive real-time, constructive feedback on their technical problem-solving logic, code efficiency, or resume project explanations. This creates a critical need for an intelligent, accessible, and automated platform that provides realistic mock evaluations.", body_style))
    story.append(Paragraph("<b>YAT AI – AI-Powered Mock Interview Platform</b> is a web-based application developed to provide students with a comprehensive, centralized environment for practicing, analyzing, and mastering technical recruitment interviews. The system allows authenticated users to upload their PDF resume, which is parsed by AI to extract skills, frameworks, and projects. Based on this profile, YAT AI conducts a dynamic 5-round technical evaluation covering: (1) Core CS Fundamentals & MCQs, (2) Deep-Dive Technical Inquiry, (3) System Design & Architecture, (4) Live Algorithmic Coding Challenge, and (5) Behavioral & HR Evaluation.", body_style))
    story.append(Paragraph("Following the interview, the platform generates a comprehensive <b>Candidate DNA Report</b> that visualizes performance across multi-dimensional competency vectors (Logic, Algorithmic Efficiency, System Architecture, Core CS Depth, and Communication). The application also supports Training and Placement Officer (TPO) placement drives and job-specific practice rooms.", body_style))
    story.append(Paragraph("The application is developed using modern web technologies, including <b>Next.js 15 (React 19)</b>, <b>TypeScript</b>, <b>Tailwind CSS</b>, and <b>Framer Motion</b> with a premium Glassy Emerald UI. <b>Supabase (PostgreSQL)</b> is used for database operations and authentication with Row-Level Security (RLS), while <b>Groq SDK</b> and <b>Google Gemini Flash</b> provide high-throughput AI services with automated failover.", body_style))
    story.append(Paragraph("The project demonstrates the development of an integrated assessment platform that combines real-time AI evaluation, resume intelligence, and performance telemetry within a unified web application.", body_style))

    story.append(PageBreak())

    # =========================================================================
    # PAGE 5: TABLE OF CONTENTS
    # =========================================================================
    story.append(Paragraph("<u><b>Table of Contents</b></u>", ParagraphStyle('TOC', fontName='Times-Bold', fontSize=15, leading=19, alignment=TA_CENTER)))
    story.append(Spacer(1, 10))

    toc_data = [
        [Paragraph("<b>S.No.</b>", table_header), Paragraph("<b>Contents</b>", table_header), Paragraph("<b>Page No.</b>", ParagraphStyle('THC', fontName='Times-Bold', fontSize=9.5, leading=13, alignment=TA_CENTER))],
        [Paragraph("<b>PRELIMINARY PAGES</b>", table_header), Paragraph("", table_header), Paragraph("", table_header)],
        [Paragraph("1.", table_cell), Paragraph("Certificate", table_cell), Paragraph("1", ParagraphStyle('TC', fontName='Times-Roman', fontSize=9.5, leading=13, alignment=TA_CENTER))],
        [Paragraph("2.", table_cell), Paragraph("Declaration of Originality and AI Usage", table_cell), Paragraph("2", ParagraphStyle('TC', fontName='Times-Roman', fontSize=9.5, leading=13, alignment=TA_CENTER))],
        [Paragraph("3.", table_cell), Paragraph("Acknowledgement", table_cell), Paragraph("3", ParagraphStyle('TC', fontName='Times-Roman', fontSize=9.5, leading=13, alignment=TA_CENTER))],
        [Paragraph("4.", table_cell), Paragraph("Abstract", table_cell), Paragraph("4", ParagraphStyle('TC', fontName='Times-Roman', fontSize=9.5, leading=13, alignment=TA_CENTER))],
        [Paragraph("5.", table_cell), Paragraph("Table of Contents", table_cell), Paragraph("5", ParagraphStyle('TC', fontName='Times-Roman', fontSize=9.5, leading=13, alignment=TA_CENTER))],
        [Paragraph("<b>CHAPTER 1 - INTRODUCTION</b>", table_header), Paragraph("", table_header), Paragraph("", table_header)],
        [Paragraph("1.1", table_cell), Paragraph("Project Overview", table_cell), Paragraph("7", ParagraphStyle('TC', fontName='Times-Roman', fontSize=9.5, leading=13, alignment=TA_CENTER))],
        [Paragraph("1.2", table_cell), Paragraph("Problem Statement", table_cell), Paragraph("8", ParagraphStyle('TC', fontName='Times-Roman', fontSize=9.5, leading=13, alignment=TA_CENTER))],
        [Paragraph("1.3", table_cell), Paragraph("Objectives of the Project", table_cell), Paragraph("9", ParagraphStyle('TC', fontName='Times-Roman', fontSize=9.5, leading=13, alignment=TA_CENTER))],
        [Paragraph("1.4", table_cell), Paragraph("Scope of the project", table_cell), Paragraph("10", ParagraphStyle('TC', fontName='Times-Roman', fontSize=9.5, leading=13, alignment=TA_CENTER))],
        [Paragraph("<b>CHAPTER 2 – BACKGROUND</b>", table_header), Paragraph("", table_header), Paragraph("", table_header)],
        [Paragraph("2.1", table_cell), Paragraph("Background of the problem", table_cell), Paragraph("11", ParagraphStyle('TC', fontName='Times-Roman', fontSize=9.5, leading=13, alignment=TA_CENTER))],
        [Paragraph("2.2", table_cell), Paragraph("Why the Project Was Chosen", table_cell), Paragraph("12", ParagraphStyle('TC', fontName='Times-Roman', fontSize=9.5, leading=13, alignment=TA_CENTER))],
        [Paragraph("2.3", table_cell), Paragraph("Existing Solutions", table_cell), Paragraph("13", ParagraphStyle('TC', fontName='Times-Roman', fontSize=9.5, leading=13, alignment=TA_CENTER))],
        [Paragraph("2.4", table_cell), Paragraph("Proposed Solution", table_cell), Paragraph("16", ParagraphStyle('TC', fontName='Times-Roman', fontSize=9.5, leading=13, alignment=TA_CENTER))],
        [Paragraph("<b>CHAPTER 3 – IMPLEMENTATION OF THE PROJECT</b>", table_header), Paragraph("", table_header), Paragraph("", table_header)],
        [Paragraph("3.1", table_cell), Paragraph("Technologies and tools used", table_cell), Paragraph("18", ParagraphStyle('TC', fontName='Times-Roman', fontSize=9.5, leading=13, alignment=TA_CENTER))],
        [Paragraph("3.2", table_cell), Paragraph("System Design / Architecture", table_cell), Paragraph("21", ParagraphStyle('TC', fontName='Times-Roman', fontSize=9.5, leading=13, alignment=TA_CENTER))],
        [Paragraph("3.3", table_cell), Paragraph("Methodology and Development Process", table_cell), Paragraph("23", ParagraphStyle('TC', fontName='Times-Roman', fontSize=9.5, leading=13, alignment=TA_CENTER))],
        [Paragraph("3.4", table_cell), Paragraph("Front-End Implementation with Screenshot", table_cell), Paragraph("24", ParagraphStyle('TC', fontName='Times-Roman', fontSize=9.5, leading=13, alignment=TA_CENTER))],
        [Paragraph("3.5", table_cell), Paragraph("Back-End Implementation with screenshot", table_cell), Paragraph("28", ParagraphStyle('TC', fontName='Times-Roman', fontSize=9.5, leading=13, alignment=TA_CENTER))],
        [Paragraph("3.6", table_cell), Paragraph("Database Design and Screenshot", table_cell), Paragraph("33", ParagraphStyle('TC', fontName='Times-Roman', fontSize=9.5, leading=13, alignment=TA_CENTER))],
        [Paragraph("3.7", table_cell), Paragraph("Testing and results", table_cell), Paragraph("37", ParagraphStyle('TC', fontName='Times-Roman', fontSize=9.5, leading=13, alignment=TA_CENTER))],
        [Paragraph("<b>CHAPTER 4 – PROJECT PROGRESS AND GUIDES FEEDBACK</b>", table_header), Paragraph("", table_header), Paragraph("", table_header)],
        [Paragraph("4.1", table_cell), Paragraph("Progress Report 1 (Day 1-15)", table_cell), Paragraph("40", ParagraphStyle('TC', fontName='Times-Roman', fontSize=9.5, leading=13, alignment=TA_CENTER))],
        [Paragraph("4.2", table_cell), Paragraph("Progress Report 2 (Day 16-30)", table_cell), Paragraph("41", ParagraphStyle('TC', fontName='Times-Roman', fontSize=9.5, leading=13, alignment=TA_CENTER))],
        [Paragraph("4.3", table_cell), Paragraph("Progress Report 3 (Day 31-45)", table_cell), Paragraph("42", ParagraphStyle('TC', fontName='Times-Roman', fontSize=9.5, leading=13, alignment=TA_CENTER))],
        [Paragraph("4.4", table_cell), Paragraph("Additional Progress Reports (Day 46-60)", table_cell), Paragraph("43", ParagraphStyle('TC', fontName='Times-Roman', fontSize=9.5, leading=13, alignment=TA_CENTER))],
        [Paragraph("4.5", table_cell), Paragraph("Summary of major Improvements Based on Guides Feedback", table_cell), Paragraph("44", ParagraphStyle('TC', fontName='Times-Roman', fontSize=9.5, leading=13, alignment=TA_CENTER))],
        [Paragraph("<b>CHAPTER 5 – CONCLUSION AND FUTURE WORK</b>", table_header), Paragraph("", table_header), Paragraph("", table_header)],
        [Paragraph("5.1", table_cell), Paragraph("Conclusion", table_cell), Paragraph("45", ParagraphStyle('TC', fontName='Times-Roman', fontSize=9.5, leading=13, alignment=TA_CENTER))],
        [Paragraph("5.2", table_cell), Paragraph("Limitations of the project", table_cell), Paragraph("46", ParagraphStyle('TC', fontName='Times-Roman', fontSize=9.5, leading=13, alignment=TA_CENTER))],
        [Paragraph("5.3", table_cell), Paragraph("Future Scope / Future Work", table_cell), Paragraph("47", ParagraphStyle('TC', fontName='Times-Roman', fontSize=9.5, leading=13, alignment=TA_CENTER))],
        [Paragraph("<b>REFERENCES & APPENDIX</b>", table_header), Paragraph("References & Appendix (A to D)", table_header), Paragraph("48 - 50", ParagraphStyle('TC', fontName='Times-Roman', fontSize=9.5, leading=13, alignment=TA_CENTER))]
    ]
    toc_table = Table(toc_data, colWidths=[45, 382, 60])
    toc_table.setStyle(TableStyle([
        ('GRID', (0,0), (-1,-1), 1, colors.HexColor('#444444')),
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#F2F2F2')),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(toc_table)

    story.append(PageBreak())

    # =========================================================================
    # CHAPTER 1 - INTRODUCTION
    # =========================================================================
    story.append(Paragraph("<b>CHAPTER 1</b>", h1_style))
    story.append(Paragraph("<b>INTRODUCTION</b>", ParagraphStyle('SubCh', fontName='Times-Bold', fontSize=13, leading=17, alignment=TA_CENTER)))
    story.append(Spacer(1, 14))

    story.append(Paragraph("<b>1.1 Project Overview</b>", h2_style))
    story.append(Paragraph("<b>YAT AI</b> is an intelligent, AI-powered mock interview and technical evaluation platform developed to provide students with a comprehensive, realistic, and accessible environment for practicing and mastering technical job interviews. The project focuses on bridging the gap between theoretical classroom learning and the rigorous standards of campus placements and industry recruitment.", body_style))
    story.append(Paragraph("In modern computer science and engineering education, candidates are evaluated across a diverse range of competencies, including core theoretical concepts, real-time algorithmic problem solving, project architecture defense, and behavioral communication. However, students frequently face difficulties assessing their practical interview readiness because conventional preparation relies on static multiple-choice questions or unassisted self-study.", body_style))
    story.append(Paragraph("YAT AI addresses this challenge by providing a dedicated technical recruitment platform where students can experience multi-round interview simulations. The application incorporates automated PDF resume parsing, interactive 5-round evaluations, live code analysis, and a multidimensional <b>Candidate DNA Matrix</b> that diagnoses strengths and areas for improvement.", body_style))
    story.append(Paragraph("The project is developed using modern web technologies and follows a structured full-stack architecture that integrates Next.js 15, TypeScript, Tailwind CSS, Supabase PostgreSQL, and advanced AI services including Groq Cloud SDK and Google Gemini Flash. Through this approach, YAT AI provides students with a unified and accessible environment for accelerating career readiness.", body_style))

    story.append(Paragraph("<b>1.2 Problem Statement</b>", h2_style))
    story.append(Paragraph("Students preparing for campus placements and technical evaluations encounter significant friction due to the scattered and static nature of available preparation tools:", body_style))
    story.append(Paragraph("• <b>Fragmented Preparation Environments:</b> Students commonly switch between multiple disjointed websites—solving coding puzzles on one platform, reviewing theoretical computer science notes on another, and practicing communication with peers who lack objective scoring standards.", bullet_style))
    story.append(Paragraph("• <b>Generic, Non-Personalized Inquiries:</b> Standard practice tests rely on fixed question banks that fail to tailor inquiries to the candidate's actual projects, declared technical skills, or target engineering roles.", bullet_style))
    story.append(Paragraph("• <b>Absence of Diagnostic Feedback:</b> Traditional quiz applications output a simple total score or percentage, without providing actionable explanations of why an architectural choice was suboptimal or how code efficiency can be improved.", bullet_style))
    story.append(Paragraph("• <b>Scalability Constraints in Educational Institutions:</b> Conducting mock interviews manually requires significant faculty time and resources. In polytechnic colleges with hundreds of candidates, professors cannot conduct repeated individual 45-minute interviews for every student.", bullet_style))

    story.append(Spacer(1, 8))
    story.extend(pdf_diagram("diagram_fig1_1.png", "Figure 1.1: Fragmented Placement Preparation vs. YAT AI Unified Platform"))
    story.append(Spacer(1, 8))

    story.append(Paragraph("<b>1.3 Objectives of the Project</b>", h2_style))
    story.append(Paragraph("The primary objective of the YAT AI project is to develop an intelligent, automated, and user-friendly mock interview platform that helps diploma and engineering students prepare for technical recruitments through interactive, profile-grounded evaluations.", body_style))
    story.append(Paragraph("1. To develop a centralized, full-stack web application for conducting multi-round technical and behavioral interviews.", bullet_style))
    story.append(Paragraph("2. To implement secure user registration, session management, and role-based profiles using Supabase Authentication.", bullet_style))
    story.append(Paragraph("3. To build an automated PDF resume parsing engine that extracts candidate skills, technical experience, and projects to personalize interview questions.", bullet_style))
    story.append(Paragraph("4. To structure a realistic 5-round evaluation pipeline covering MCQs, Technical Deep-Dive, System Architecture, Live Algorithmic Coding, and Behavioral fit.", bullet_style))
    story.append(Paragraph("5. To integrate high-throughput AI inference gateways (Groq Cloud SDK and Google Gemini Flash) with a resilient sequential fallback mechanism.", bullet_style))
    story.append(Paragraph("6. To provide real-time code execution and complexity analysis, assessing submitted algorithms for time and space efficiency.", bullet_style))
    story.append(Paragraph("7. To calculate and visualize a <b>Candidate DNA Matrix</b> that tracks multi-dimensional competencies across five performance vectors.", bullet_style))
    story.append(Paragraph("8. To develop a Training and Placement Officer (TPO) management portal for scheduling campus drives, enrolling candidates, and viewing comparative rankings.", bullet_style))
    story.append(Paragraph("9. To design a premium, responsive <b>Glassy Emerald UI</b> using Tailwind CSS and Framer Motion for desktop and mobile accessibility.", bullet_style))
    story.append(Paragraph("10. To enforce enterprise-grade data security through PostgreSQL Row-Level Security (RLS) policies.", bullet_style))

    story.append(Paragraph("<b>1.4 Scope of the Project</b>", h2_style))
    story.append(Paragraph("The scope of the YAT AI project covers the development of an intelligent, web-based mock evaluation platform focused on technical recruitment practice and performance analytics. The major functional areas include user authentication, resume parsing, a 5-round evaluation suite, performance telemetry, and TPO campus drive integration.", body_style))
    story.append(Paragraph("<i>Out-of-Scope Boundaries:</i> Native mobile operating system binaries (iOS/Android), real-time video proctoring with eye-tracking, and full-duplex voice streaming are reserved for future development milestones.", body_style))

    story.append(PageBreak())

    # =========================================================================
    # CHAPTER 2 - BACKGROUND
    # =========================================================================
    story.append(Paragraph("<b>CHAPTER 2</b>", h1_style))
    story.append(Paragraph("<b>BACKGROUND</b>", ParagraphStyle('SubCh', fontName='Times-Bold', fontSize=13, leading=17, alignment=TA_CENTER)))
    story.append(Spacer(1, 14))

    story.append(Paragraph("<b>2.1 Background of the Problem</b>", h2_style))
    story.append(Paragraph("The transition from academic diploma coursework to professional software engineering employment has historically presented a steep challenge for students. While academic curricula provide vital theoretical foundations in programming languages, data structures, and database management, competitive placement drives evaluate real-time problem-solving agility, practical system design, and clear articulation under evaluation constraints.", body_style))
    story.append(Paragraph("Traditionally, students prepare for technical assessments using static textbooks, standalone coding platforms (LeetCode), or informal peer mocks that lack standardized rubrics.", body_style))

    story.append(Paragraph("<b>2.2 Why the Project Was Chosen</b>", h2_style))
    story.append(Paragraph("The YAT AI project was chosen after identifying the substantial hurdles faced by diploma students in preparing for technical placements. The project offered a valuable opportunity to develop a practical software system that directly solves an immediate academic and career challenge.", body_style))
    story.append(Paragraph("1. <b>Direct Educational Impact:</b> Addressing the real-world anxiety and lack of preparation tools experienced by diploma students facing competitive hiring drives.", bullet_style))
    story.append(Paragraph("2. <b>Application of Technical Curriculum:</b> Implementing concepts learned during the Diploma in Computer Science & Engineering, including full-stack web development, database normalization, asynchronous API communication, and cloud deployment.", bullet_style))
    story.append(Paragraph("3. <b>Cutting-Edge AI Integration:</b> Gaining practical engineering experience in prompt engineering, structured JSON extraction, LLM latency optimization, and fault-tolerant API failover.", bullet_style))
    story.append(Paragraph("4. <b>Enterprise Architecture Design:</b> Designing a scalable 4-tier application incorporating PostgreSQL Row-Level Security, modern UI/UX design tokens, and serverless edge functions.", bullet_style))

    story.append(Paragraph("<b>2.3 Existing Solutions & Comparative Analysis</b>", h2_style))
    story.append(Paragraph("The team analyzed LeetCode, Pramp, and ChatGPT, observing that existing tools isolate code syntax or text chatting without providing an integrated, profile-grounded recruitment simulation.", body_style))

    comp_data = [
        [Paragraph("<b>Feature / Capability</b>", table_header), Paragraph("<b>LeetCode</b>", table_header), Paragraph("<b>Pramp</b>", table_header), Paragraph("<b>ChatGPT</b>", table_header), Paragraph("<b>YAT AI</b>", table_header)],
        [Paragraph("Interactive 5-Round Flow", table_cell), Paragraph("No", table_cell), Paragraph("Manual", table_cell), Paragraph("Prompt", table_cell), Paragraph("<b>Automated 5-Round</b>", table_cell)],
        [Paragraph("PDF Resume Parsing", table_cell), Paragraph("No", table_cell), Paragraph("No", table_cell), Paragraph("Limited", table_cell), Paragraph("<b>Automated Groq/Gemini</b>", table_cell)],
        [Paragraph("Algorithmic Code Sandbox", table_cell), Paragraph("Yes", table_cell), Paragraph("Yes", table_cell), Paragraph("No", table_cell), Paragraph("<b>Integrated Editor</b>", table_cell)],
        [Paragraph("Candidate DNA Telemetry", table_cell), Paragraph("No", table_cell), Paragraph("Subjective", table_cell), Paragraph("Text Only", table_cell), Paragraph("<b>5-Axis Radar Matrix</b>", table_cell)],
        [Paragraph("Cloud Database Persistence", table_cell), Paragraph("Yes", table_cell), Paragraph("Yes", table_cell), Paragraph("Session", table_cell), Paragraph("<b>Supabase PostgreSQL</b>", table_cell)],
        [Paragraph("Placement Drive Module", table_cell), Paragraph("No", table_cell), Paragraph("No", table_cell), Paragraph("No", table_cell), Paragraph("<b>TPO Drive Portal</b>", table_cell)],
        [Paragraph("Accessibility & Cost", table_cell), Paragraph("Freemium", table_cell), Paragraph("Paid", table_cell), Paragraph("Subscription", table_cell), Paragraph("<b>Free & Open Access</b>", table_cell)]
    ]
    comp_table = Table(comp_data, colWidths=[120, 80, 80, 85, 122])
    comp_table.setStyle(TableStyle([
        ('GRID', (0,0), (-1,-1), 1, colors.HexColor('#444444')),
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#F2F2F2')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(comp_table)
    story.append(Spacer(1, 8))

    story.extend(pdf_diagram("diagram_fig2_1.png", "Figure 2.1: The YAT AI Unified Evaluation Ecosystem"))

    story.append(Paragraph("<b>2.4 Proposed Solution & Key Advantages</b>", h2_style))
    story.append(Paragraph("YAT AI combines profile-grounded questioning, multi-round technical depth, real-time code complexity analysis, and Candidate DNA telemetry in a single, accessible Glassy Emerald web interface.", body_style))

    story.append(PageBreak())

    # =========================================================================
    # CHAPTER 3 - IMPLEMENTATION OF THE PROJECT
    # =========================================================================
    story.append(Paragraph("<b>CHAPTER 3</b>", h1_style))
    story.append(Paragraph("<b>IMPLEMENTATION OF THE PROJECT</b>", ParagraphStyle('SubCh', fontName='Times-Bold', fontSize=13, leading=17, alignment=TA_CENTER)))
    story.append(Spacer(1, 14))

    story.append(Paragraph("<b>3.1 Technologies and Tools Used</b>", h2_style))
    story.append(Paragraph("• <b>Frontend:</b> Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion.", bullet_style))
    story.append(Paragraph("• <b>Backend:</b> Next.js Server Route Handlers, Groq Cloud SDK (Qwen 3.8 / GPT-OSS), Google Gemini Flash.", bullet_style))
    story.append(Paragraph("• <b>Database & Storage:</b> Supabase PostgreSQL 15, Supabase Auth, Row-Level Security, Cloud Storage.", bullet_style))
    story.append(Paragraph("• <b>Hosting & Tools:</b> Vercel Cloud, Visual Studio Code, Git and GitHub.", bullet_style))

    story.append(Paragraph("<b>3.2 System Design / Architecture</b>", h2_style))
    story.append(Paragraph("YAT AI follows a decoupled 4-tier architecture comprising Presentation Layer, Application Logic Layer, AI Inference & Failover Layer, and Data Persistence Layer.", body_style))

    story.append(Spacer(1, 6))
    story.extend(pdf_diagram("diagram_fig3_1.png", "Figure 3.1: YAT AI 4-Tier System Architecture"))
    story.append(Spacer(1, 6))
    story.extend(pdf_diagram("diagram_fig3_2.png", "Figure 3.2: 5-Round Interview Pipeline & Evaluation Flowchart"))

    story.append(Paragraph("<b>3.4 Front-End Implementation with Screenshots</b>", h2_style))
    story.append(placeholder_box("[ SCREENSHOT PLACEHOLDER: Figure 3.3 - Landing Page with Glassy Emerald Aesthetic ]", "Paste screenshot of the live landing page at yat-ai.vercel.app here"))
    story.append(Spacer(1, 6))
    story.append(placeholder_box("[ SCREENSHOT PLACEHOLDER: Figure 3.4 - User Authentication & Login View ]", "Paste screenshot of the Login / Signup modal view here"))
    story.append(Spacer(1, 6))
    story.append(placeholder_box("[ SCREENSHOT PLACEHOLDER: Figure 3.5 - Student Dashboard Overview ]", "Paste screenshot of the main student dashboard here"))
    story.append(Spacer(1, 6))
    story.append(placeholder_box("[ SCREENSHOT PLACEHOLDER: Figure 3.6 - Resume Upload & Extraction Interface ]", "Paste screenshot of the resume upload drag-and-drop zone here"))
    story.append(Spacer(1, 6))
    story.append(placeholder_box("[ SCREENSHOT PLACEHOLDER: Figure 3.7 - Live 5-Round Interview Room ]", "Paste screenshot of an active interview round in progress here"))
    story.append(Spacer(1, 6))
    story.append(placeholder_box("[ SCREENSHOT PLACEHOLDER: Figure 3.8 - Candidate DNA Matrix & Performance Report ]", "Paste screenshot of the Candidate DNA scorecard and radar chart here"))

    story.append(Paragraph("<b>3.5 Back-End Implementation with Screenshots</b>", h2_style))
    story.append(placeholder_box("[ CODE / TERMINAL PLACEHOLDER: Figure 3.11 - Supabase Authentication Handler ]", "Paste screenshot of auth route code or terminal verification logs here"))
    story.append(Spacer(1, 6))
    story.append(placeholder_box("[ CODE / TERMINAL PLACEHOLDER: Figure 3.12 - Server Route Handlers for Rounds 1-5 ]", "Paste screenshot of /api/round-1 or /api/round-4 route code here"))
    story.append(Spacer(1, 6))
    story.append(placeholder_box("[ TERMINAL PLACEHOLDER: Figure 3.13 - AI Failover Execution Terminal Logs ]", "Paste screenshot of terminal output demonstrating model fallback here"))

    story.append(Paragraph("<b>3.6 Database Design and Screenshots</b>", h2_style))
    story.extend(pdf_diagram("diagram_fig3_18.png", "Figure 3.18: Database Entity-Relationship (ER) Diagram"))
    story.append(Spacer(1, 6))
    story.append(placeholder_box("[ SCREENSHOT PLACEHOLDER: Figure 3.19 - Profiles Table in Supabase Studio ]", "Paste screenshot of public.profiles table in Supabase dashboard here"))
    story.append(Spacer(1, 6))
    story.append(placeholder_box("[ SCREENSHOT PLACEHOLDER: Figure 3.20 - Interviews Table with JSONB Transcripts ]", "Paste screenshot of public.interviews table showing scores and transcripts here"))
    story.append(Spacer(1, 6))
    story.append(placeholder_box("[ SCREENSHOT PLACEHOLDER: Figure 3.21 - Row-Level Security (RLS) Policy Editor ]", "Paste screenshot of Supabase RLS Policies view here"))

    story.append(Paragraph("<b>3.7 Testing and Results</b>", h2_style))
    story.append(Paragraph("Comprehensive testing was conducted across 14 test cases (TC-01 to TC-14). All functional, integration, failover, and security tests passed successfully with 100% compliance.", body_style))

    test_data = [
        [Paragraph("<b>Test ID</b>", table_header), Paragraph("<b>Test Scenario</b>", table_header), Paragraph("<b>Actual Result Recorded</b>", table_header), Paragraph("<b>Status</b>", table_header)],
        [Paragraph("TC-01", table_cell), Paragraph("Register account with valid credentials", table_cell), Paragraph("Account created; profile initialized", table_cell), Paragraph("Pass &#9989;", table_cell)],
        [Paragraph("TC-02", table_cell), Paragraph("Google OAuth Single Sign-On", table_cell), Paragraph("Session tokens stored in cookies", table_cell), Paragraph("Pass &#9989;", table_cell)],
        [Paragraph("TC-03", table_cell), Paragraph("Invalid password sign-in attempt", table_cell), Paragraph("Descriptive alert shown; access denied", table_cell), Paragraph("Pass &#9989;", table_cell)],
        [Paragraph("TC-04", table_cell), Paragraph("Access /dashboard unauthorized", table_cell), Paragraph("Redirected to login view immediately", table_cell), Paragraph("Pass &#9989;", table_cell)],
        [Paragraph("TC-05", table_cell), Paragraph("Upload valid PDF resume", table_cell), Paragraph("Skills and projects auto-populated", table_cell), Paragraph("Pass &#9989;", table_cell)],
        [Paragraph("TC-06", table_cell), Paragraph("Upload non-PDF or corrupt file", table_cell), Paragraph("Validation warning shown; no crash", table_cell), Paragraph("Pass &#9989;", table_cell)],
        [Paragraph("TC-07", table_cell), Paragraph("Generate Round 1 Technical MCQs", table_cell), Paragraph("5 MCQs generated with 4 options", table_cell), Paragraph("Pass &#9989;", table_cell)],
        [Paragraph("TC-08", table_cell), Paragraph("Submit answers for evaluation", table_cell), Paragraph("AI grades answers & stores in DB", table_cell), Paragraph("Pass &#9989;", table_cell)],
        [Paragraph("TC-09", table_cell), Paragraph("Round 4 live coding challenge", table_cell), Paragraph("Code analyzed with Big-O notes", table_cell), Paragraph("Pass &#9989;", table_cell)],
        [Paragraph("TC-10", table_cell), Paragraph("Simulate Gemini API failover", table_cell), Paragraph("Groq SDK executes seamlessly", table_cell), Paragraph("Pass &#9989;", table_cell)],
        [Paragraph("TC-11", table_cell), Paragraph("Generate Candidate DNA Report", table_cell), Paragraph("5-axis radar chart rendered", table_cell), Paragraph("Pass &#9989;", table_cell)],
        [Paragraph("TC-12", table_cell), Paragraph("Access private student transcript", table_cell), Paragraph("Supabase RLS blocks query (403)", table_cell), Paragraph("Pass &#9989;", table_cell)],
        [Paragraph("TC-13", table_cell), Paragraph("Enroll in campus placement drive", table_cell), Paragraph("Registered; count increments", table_cell), Paragraph("Pass &#9989;", table_cell)],
        [Paragraph("TC-14", table_cell), Paragraph("Render on mobile viewport (375px)", table_cell), Paragraph("Glassy UI responsive with no overflow", table_cell), Paragraph("Pass &#9989;", table_cell)]
    ]
    test_table = Table(test_data, colWidths=[55, 160, 200, 72])
    test_table.setStyle(TableStyle([
        ('GRID', (0,0), (-1,-1), 1, colors.HexColor('#444444')),
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#F2F2F2')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(test_table)

    story.append(PageBreak())

    # =========================================================================
    # CHAPTER 4 - PROGRESS REPORTS AND GUIDE'S FEEDBACK
    # =========================================================================
    story.append(Paragraph("<b>CHAPTER 4</b>", h1_style))
    story.append(Paragraph("<b>PROJECT PROGRESS AND GUIDE'S FEEDBACK</b>", ParagraphStyle('SubCh', fontName='Times-Bold', fontSize=13, leading=17, alignment=TA_CENTER)))
    story.append(Spacer(1, 14))

    story.append(Paragraph("<b>4.1 Progress Report 1 (Day 1 – 15)</b>", h2_style))
    story.append(Paragraph("<b>Work Completed:</b> Scope formulation, Next.js 15 project setup, Tailwind CSS tokens.<br/>"
                           "<b>Guide's Feedback (Md Naiyer Hoda):</b> <i>'Ensure interview questions ground dynamically in candidate resumes.'</i><br/>"
                           "<b>Action Taken:</b> Built Gemini PDF parser to extract candidate skills.<br/>"
                           "<b>Guide's Signature:</b> ___________________________", body_style))

    story.append(Paragraph("<b>4.2 Progress Report 2 (Day 16 – 30)</b>", h2_style))
    story.append(Paragraph("<b>Work Completed:</b> Supabase Auth, PDF resume upload drag-and-drop, /api/parse-resume.<br/>"
                           "<b>Guide's Feedback (Md Naiyer Hoda):</b> <i>'Enforce data privacy between student accounts.'</i><br/>"
                           "<b>Action Taken:</b> Enacted PostgreSQL Row-Level Security (RLS) policies.<br/>"
                           "<b>Guide's Signature:</b> ___________________________", body_style))

    story.append(Paragraph("<b>4.3 Progress Report 3 (Day 31 – 45)</b>", h2_style))
    story.append(Paragraph("<b>Work Completed:</b> Rounds 1 to 3 APIs, Groq SDK integration, interactive interview UI.<br/>"
                           "<b>Guide's Feedback (Md Naiyer Hoda):</b> <i>'Add live code evaluation and handle API rate limits.'</i><br/>"
                           "<b>Action Taken:</b> Implemented Round 4 coding sandbox and dual-model failover engine in lib/ai.ts.<br/>"
                           "<b>Guide's Signature:</b> ___________________________", body_style))

    story.append(Paragraph("<b>4.4 Progress Report 4 (Day 46 – 60)</b>", h2_style))
    story.append(Paragraph("<b>Work Completed:</b> Candidate DNA matrix, TPO placement drive portal, Vercel deployment.<br/>"
                           "<b>Guide's Feedback (Md Naiyer Hoda):</b> <i>'Ensure null-safety for candidates with zero completed tests.'</i><br/>"
                           "<b>Action Taken:</b> Added null-safety defaults across all dashboard matrix calculations.<br/>"
                           "<b>Guide's Signature:</b> ___________________________", body_style))

    story.append(Paragraph("<b>4.5 Summary of Major Improvements</b>", h2_style))
    story.append(Paragraph("1. Dynamic Resume Grounding derived from uploaded student PDFs.<br/>"
                           "2. Multi-Model Failover Engine eliminating 404/429 downtime.<br/>"
                           "3. Live Algorithmic Code Review with asymptotic Big-O notes.<br/>"
                           "4. 5-Axis Candidate DNA Telemetry for structured exam preparation.<br/>"
                           "5. Row-Level Security safeguarding student scores and transcripts.", body_style))

    story.append(PageBreak())

    # =========================================================================
    # CHAPTER 5 - CONCLUSION AND FUTURE WORK
    # =========================================================================
    story.append(Paragraph("<b>CHAPTER 5</b>", h1_style))
    story.append(Paragraph("<b>CONCLUSION AND FUTURE WORK</b>", ParagraphStyle('SubCh', fontName='Times-Bold', fontSize=13, leading=17, alignment=TA_CENTER)))
    story.append(Spacer(1, 14))

    story.append(Paragraph("<b>5.1 Conclusion</b>", h2_style))
    story.append(Paragraph("YAT AI successfully implements a full-stack, AI-powered mock interview platform for diploma students. Uniting Next.js 15, TypeScript, Tailwind CSS, Supabase, Groq SDK, and Gemini Flash, the platform delivers automated resume parsing, a 5-round evaluation suite, and deep diagnostic DNA analytics.", body_style))

    story.append(Paragraph("<b>5.2 Limitations of the Project</b>", h2_style))
    story.append(Paragraph("• Text and code input only; real-time facial emotion and tone analysis are not yet included.<br/>"
                           "• Requires active Internet connectivity for cloud AI inference.<br/>"
                           "• English language only.", body_style))

    story.append(Paragraph("<b>5.3 Future Scope / Future Work</b>", h2_style))
    story.append(Paragraph("• Bidirectional Voice AI for low-latency conversational interviews.<br/>"
                           "• Webcam proctoring and body language analysis.<br/>"
                           "• Institutional LMS integration (Moodle / Canvas).<br/>"
                           "• Offline mobile applications with cached question modules.", body_style))

    story.append(Spacer(1, 14))
    story.append(Paragraph("<u><b>REFERENCES</b></u>", h2_style))
    story.append(Paragraph("1. Next.js Documentation: Vercel Inc., https://nextjs.org/docs, 2026.<br/>"
                           "2. Supabase Documentation: Supabase Inc., https://supabase.com/docs, 2026.<br/>"
                           "3. Groq Cloud API Documentation: Groq Inc., https://console.groq.com/docs, 2026.<br/>"
                           "4. Google AI Documentation: Google DeepMind, https://ai.google.dev/docs, 2026.<br/>"
                           "5. Pressman, R. S., & Maxim, B. R.: Software Engineering: A Practitioner's Approach, McGraw-Hill, 2020.<br/>"
                           "6. Elmasri, R., & Navathe, S. B.: Fundamentals of Database Systems, Pearson, 2016.", body_style))

    story.append(Spacer(1, 14))
    story.append(Paragraph("<u><b>APPENDIX</b></u>", h2_style))
    story.append(Paragraph("<b>Appendix A: GitHub Repository Link</b><br/>"
                           "• GitHub Repository: https://github.com/anzarhasnat/YAT-AI-.git<br/>"
                           "• Live Deployment: https://yat-ai.vercel.app", body_style))
    story.append(Spacer(1, 8))
    story.append(placeholder_box("[ SCREENSHOT PLACEHOLDER: Appendix Figure B.1 - Cloud Storage Resume Management ]", "Paste screenshot of Supabase Storage bucket managing resumes here"))
    story.append(Spacer(1, 6))
    story.append(placeholder_box("[ SCREENSHOT PLACEHOLDER: Appendix Figure B.2 - Detailed Interview Transcript View ]", "Paste screenshot of full question-answer transcript view here"))

    doc.build(story, canvasmaker=ZohraStyleCanvas)
    print(f"SUCCESS: Generated PDF at {pdf_filename} (size: {os.path.getsize(pdf_filename)/1024:.2f} KB)")

if __name__ == "__main__":
    build_pdf_report()
