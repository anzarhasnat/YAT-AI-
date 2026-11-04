import os
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml

def build_docx_report(docx_filename="YAT_AI_Project_Report.docx"):
    print(f"Building Word Document: {docx_filename}...")
    doc = Document()
    logo_file = 'college_logo.jpg'

    for section in doc.sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)

    def add_p(text, bold=False, italic=False, center=False, font_size=11, space_after=4):
        p = doc.add_paragraph()
        if center: p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        else: p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        run = p.add_run(text)
        run.font.name = 'Times New Roman'
        run.font.size = Pt(font_size)
        run.bold = bold
        run.italic = italic
        p.paragraph_format.space_after = Pt(space_after)
        return p

    def add_title(text, font_size=16, space_after=6):
        return add_p(text, bold=True, center=True, font_size=font_size, space_after=space_after)

    def add_h1(text):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run = p.add_run(text)
        run.font.name = 'Times New Roman'
        run.font.size = Pt(15)
        run.bold = True
        p.paragraph_format.space_before = Pt(14)
        p.paragraph_format.space_after = Pt(4)

    def add_h2(text):
        p = doc.add_paragraph()
        run = p.add_run(text)
        run.font.name = 'Times New Roman'
        run.font.size = Pt(13)
        run.bold = True
        p.paragraph_format.space_before = Pt(10)
        p.paragraph_format.space_after = Pt(3)

    def add_h3(text):
        p = doc.add_paragraph()
        run = p.add_run(text)
        run.font.name = 'Times New Roman'
        run.font.size = Pt(11.5)
        run.bold = True
        p.paragraph_format.space_before = Pt(8)
        p.paragraph_format.space_after = Pt(2)

    def add_diagram(img_file, caption, width=Inches(6.2)):
        if os.path.exists(img_file):
            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.space_before = Pt(6)
            p.paragraph_format.space_after = Pt(4)
            p.add_run().add_picture(img_file, width=width)
            
            p_cap = doc.add_paragraph()
            p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_cap.paragraph_format.space_after = Pt(8)
            r_cap = p_cap.add_run(caption)
            r_cap.font.name = 'Times New Roman'
            r_cap.font.size = Pt(9.5)
            r_cap.bold = True
            r_cap.italic = True
        else:
            add_box(f"[ DIAGRAM: {caption} ]", f"Image file '{img_file}' not found.")

    def add_box(title, desc):
        tbl = doc.add_table(rows=1, cols=1)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        cell = tbl.cell(0, 0)
        tcPr = cell._tc.get_or_add_tcPr()
        tcBorders = parse_xml(r'''
            <w:tcBorders xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
                <w:top w:val="dashed" w:sz="12" w:space="0" w:color="777777"/>
                <w:left w:val="dashed" w:sz="12" w:space="0" w:color="777777"/>
                <w:bottom w:val="dashed" w:sz="12" w:space="0" w:color="777777"/>
                <w:right w:val="dashed" w:sz="12" w:space="0" w:color="777777"/>
            </w:tcBorders>
        ''')
        tcPr.append(tcBorders)
        shd = parse_xml(r'<w:shd xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" w:val="clear" w:color="auto" w:fill="F9FBFB"/>')
        tcPr.append(shd)

        p1 = cell.paragraphs[0]
        p1.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r1 = p1.add_run(title)
        r1.bold = True
        r1.font.size = Pt(10)
        r1.font.name = 'Times New Roman'

        p2 = cell.add_paragraph()
        p2.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r2 = p2.add_run(desc)
        r2.italic = True
        r2.font.size = Pt(9)
        r2.font.name = 'Times New Roman'
        doc.add_paragraph().paragraph_format.space_after = Pt(4)

    def style_table_header(row, col_widths, bg_color="059669"):
        for i, cell in enumerate(row.cells):
            tcPr = cell._tc.get_or_add_tcPr()
            shd = parse_xml(f'<w:shd xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" w:val="clear" w:color="auto" w:fill="{bg_color}"/>')
            tcPr.append(shd)
            cell.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
            for run in cell.paragraphs[0].runs:
                run.font.name = 'Times New Roman'
                run.font.size = Pt(10)
                run.bold = True
                run.font.color.rgb = RGBColor(255, 255, 255)
            if i < len(col_widths):
                cell.width = col_widths[i]

    # COVER PAGE
    add_title("YAT AI – AI-Powered Mock Interview Platform", font_size=18, space_after=4)
    add_title("(Minor Project)", font_size=14, space_after=18)
    add_p("Project report submitted on the partial fulfilment of the requirements for the", center=True)
    add_p("Degree of", center=True)
    add_p("Diploma", bold=True, italic=True, center=True, font_size=15)
    add_p("In", italic=True, center=True, font_size=12)
    add_p("Computer Science and Engineering", bold=True, italic=True, center=True, font_size=15)
    add_p("Academic session: 2024-27", bold=True, center=True, font_size=12, space_after=18)

    add_p("Submitted by:", italic=True, center=True, font_size=11.5)
    add_p("Anzar Hasnaat: 2025-CSEL-605", bold=True, center=True)
    add_p("Dipanshu Kumar: 25025-CSEL-401", bold=True, center=True)
    add_p("Roshan Kumar: 2025-CSEL-603", bold=True, center=True)
    add_p("Chandan Kumar: 2024-CSE-042", bold=True, center=True, space_after=18)

    add_p("Under the supervision of", bold=True, italic=True, center=True, font_size=12)
    add_p("Md Naiyer Hoda", bold=True, center=True, font_size=12)
    add_p("Lecturer, Department of CSE", italic=True, center=True, font_size=11, space_after=18)

    if os.path.exists(logo_file):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.add_run().add_picture(logo_file, width=Inches(1.5))

    add_p("Department of Computer Science and Engineering", center=True, font_size=12)
    add_p("Government Polytechnic Muzaffarpur", bold=True, center=True, font_size=13)
    doc.add_page_break()

    # CERTIFICATE
    add_p("Government Polytechnic Muzaffarpur", center=True, font_size=13)
    add_p("Naya Tola, Technical Chowk, Muzaffarpur-842001", center=True, font_size=11)
    add_p("Department of Computer Science and Engineering", bold=True, center=True, font_size=13, space_after=10)

    if os.path.exists(logo_file):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.add_run().add_picture(logo_file, width=Inches(1.1))

    add_title("PROJECT COMPLETION CERTIFICATE", font_size=14, space_after=14)
    add_p('This is to certify that the project entitled "YAT AI – AI-POWERED MOCK INTERVIEW & CANDIDATE EVALUATION PLATFORM" has been carried out by the following students of the Department of Computer Science & Engineering, Government Polytechnic Muzaffarpur, under my guidance and supervision.')

    add_p("1. Anzar Hasnaat – Roll No.: 2025-CSEL-605")
    add_p("2. Dipanshu Kumar – Roll No.: 25025-CSEL-401")
    add_p("3. Roshan Kumar – Roll No.: 2025-CSEL-603")
    add_p("4. Chandan Kumar – Roll No.: 2024-CSE-042", space_after=12)

    add_p("The project work has been completed as part of the academic requirements for the Diploma in Computer Science & Engineering.")
    add_p("The work presented in this report has been reviewed and is submitted for academic evaluation during the session 2024-27.", space_after=24)

    tbl_cert = doc.add_table(rows=2, cols=2)
    tbl_cert.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_cert.cell(0, 0).text = "Project Guide / Supervisor"
    tbl_cert.cell(0, 1).text = "Head of Department"
    tbl_cert.cell(1, 0).text = "Signature: ___________________________\n\nName: Md Naiyer Hoda\nDesignation: Lecturer, CSE Dept.\nDate: _______________________________"
    tbl_cert.cell(1, 1).text = "Signature: ___________________________\n\nName: _______________________________\nDesignation: H.O.D., CSE Dept.\nDate: _______________________________"
    doc.add_page_break()

    # DECLARATION
    add_p("GOVERNMENT POLYTECHNIC MUZAFFARPUR", bold=True, center=True, font_size=12)
    add_p("Department of Computer Science & Engineering", center=True, font_size=11, space_after=10)
    add_title("DECLARATION OF ORIGINALITY AND AI USAGE", font_size=13, space_after=12)

    add_h2("A. Declaration of Originality")
    add_p('We hereby declare that the project entitled "YAT AI – AI-POWERED MOCK INTERVIEW & CANDIDATE EVALUATION PLATFORM", submitted to the Department of Computer Science & Engineering, Government Polytechnic Muzaffarpur, is the work carried out by our team under the guidance and supervision of our assigned project guide.')
    add_p("We confirm that the information presented in this report is accurate to the best of our knowledge. All external resources, references and contributions have been appropriately acknowledged. We accept responsibility for the contents of this project report.")

    add_h2("B. Declaration of AI Usage")
    add_p("AI-based tools were used as supporting resources during the development of this project and preparation of its documentation. These tools assisted with technical guidance, programming suggestions, debugging, architectural discussions and selected AI-assisted application functionalities.")

    tbl_ai = doc.add_table(rows=4, cols=2)
    tbl_ai.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_ai.cell(0, 0).text = "AI Tool"
    tbl_ai.cell(0, 1).text = "Purpose and Contribution"
    tbl_ai.cell(1, 0).text = "Groq Cloud SDK"
    tbl_ai.cell(1, 1).text = "High-throughput inference for dynamic interview questions, algorithmic code efficiency analysis, and real-time response evaluation."
    tbl_ai.cell(2, 0).text = "Google Gemini Flash"
    tbl_ai.cell(2, 1).text = "Multi-modal PDF resume extraction, structured candidate skill profiling, and Candidate DNA report synthesis."
    tbl_ai.cell(3, 0).text = "Claude / Assistant"
    tbl_ai.cell(3, 1).text = "Technical guidance, architectural consultations, Next.js App Router route debugging, and documentation formatting."
    style_table_header(tbl_ai.rows[0], [Inches(2.0), Inches(4.5)], bg_color="0284C7")

    add_h2("C. Team Declaration")
    add_p("We acknowledge that we have read and understood the above declaration and accept responsibility for our respective contributions to the project.")

    tbl_team = doc.add_table(rows=2, cols=2)
    tbl_team.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_team.cell(0, 0).text = "1. Anzar Hasnaat:- ____________________"
    tbl_team.cell(0, 1).text = "2. Dipanshu Kumar:- ____________________"
    tbl_team.cell(1, 0).text = "3. Roshan Kumar:- ____________________"
    tbl_team.cell(1, 0).text = "4. Chandan Kumar:- ____________________"
    add_p("\nPlace: Muzaffarpur, Bihar                            Date: ____________________")
    doc.add_page_break()

    # ACKNOWLEDGEMENT
    add_p("GOVERNMENT POLYTECHNIC MUZAFFARPUR", bold=True, center=True, font_size=12)
    add_p("Department of Computer Science & Engineering", center=True, font_size=11, space_after=10)
    add_title("ACKNOWLEDGEMENT", font_size=13, space_after=14)

    add_p('We would like to express our sincere gratitude to Government Polytechnic Muzaffarpur, Department of Computer Science & Engineering, for providing us with the opportunity, technical laboratory facilities and academic environment to undertake and complete our project entitled "YAT AI – AI-POWERED MOCK INTERVIEW & CANDIDATE EVALUATION PLATFORM."')
    add_p("We are deeply grateful to our project guide, Md Naiyer Hoda, for his valuable guidance, continuous support, encouragement and constructive suggestions throughout the development of this project. His insights and feedback helped us improve our understanding, overcome technical challenges and enhance the overall quality of our work.")
    add_p("We would also like to extend our heartfelt gratitude to the Head of the Department, all the faculty members of the Computer Science & Engineering Department, and the Principal of Government Polytechnic Muzaffarpur for their encouragement, support and for providing us with the necessary academic resources and facilities.")
    add_p("We would also like to thank our team members for their cooperation, dedication and collective efforts throughout the planning, development, implementation and documentation of this project. Finally, we express our sincere appreciation to our families and everyone who directly or indirectly supported and encouraged us during the completion of this project.")
    add_p("\nSubmitted by:\nAnzar Hasnaat\nDipanshu Kumar\nRoshan Kumar\nChandan Kumar", space_after=10)
    doc.add_page_break()

    # ABSTRACT
    add_p("GOVERNMENT POLYTECHNIC MUZAFFARPUR", bold=True, center=True, font_size=12)
    add_p("Department of Computer Science & Engineering", center=True, font_size=11, space_after=10)
    add_title("ABSTRACT", font_size=13, space_after=6)
    add_p("YAT AI – AI-POWERED MOCK INTERVIEW & CANDIDATE EVALUATION PLATFORM", bold=True, center=True, space_after=14)

    add_p("Technical placement examinations and recruitment interviews are pivotal milestones for diploma and engineering students. However, students frequently face difficulties evaluating their practical readiness because conventional preparation methods rely on static question banks, unassisted self-study, or disjointed coding websites. Students rarely receive real-time, constructive feedback on their technical problem-solving logic, code efficiency, or resume project explanations. This creates a critical need for an intelligent, accessible, and automated platform that provides realistic mock evaluations.")
    add_p("YAT AI – AI-Powered Mock Interview Platform is a web-based application developed to provide students with a comprehensive, centralized environment for practicing, analyzing, and mastering technical recruitment interviews. The system allows authenticated users to upload their PDF resume, which is parsed by AI to extract skills, frameworks, and projects. Based on this profile, YAT AI conducts a dynamic 5-round technical evaluation covering: (1) Core CS Fundamentals & MCQs, (2) Deep-Dive Technical Inquiry, (3) System Design & Architecture, (4) Live Algorithmic Coding Challenge, and (5) Behavioral & HR Evaluation.")
    add_p("Following the interview, the platform generates a comprehensive Candidate DNA Report that visualizes performance across multi-dimensional competency vectors (Logic, Algorithmic Efficiency, System Architecture, Core CS Depth, and Communication). The application also supports Training and Placement Officer (TPO) placement drives and job-specific practice rooms.")
    add_p("The application is developed using modern web technologies, including Next.js 15 (React 19), TypeScript, Tailwind CSS, and Framer Motion with a premium Glassy Emerald UI. Supabase (PostgreSQL) is used for database operations and authentication with Row-Level Security (RLS), while Groq SDK and Google Gemini Flash provide high-throughput AI services with automated failover.")
    doc.add_page_break()

    # TABLE OF CONTENTS
    add_title("Table of Contents", font_size=15, space_after=14)
    tbl_toc = doc.add_table(rows=18, cols=3)
    tbl_toc.alignment = WD_TABLE_ALIGNMENT.CENTER
    toc_items = [
        ("S.No.", "Contents", "Page No."),
        ("1.", "Certificate", "1"),
        ("2.", "Declaration of Originality and AI Usage", "2"),
        ("3.", "Acknowledgement", "3"),
        ("4.", "Abstract", "4"),
        ("5.", "Table of Contents", "5"),
        ("1.1 - 1.4", "CHAPTER 1: INTRODUCTION", "7 - 10"),
        ("2.1 - 2.4", "CHAPTER 2: BACKGROUND", "11 - 17"),
        ("3.1", "Technologies and Tools Used", "18"),
        ("3.2", "System Design / Architecture", "21"),
        ("3.3", "Methodology and Development Process", "23"),
        ("3.4", "Front-End Implementation with Screenshots", "24"),
        ("3.5", "Back-End Implementation with Screenshots", "28"),
        ("3.6", "Database Design and Screenshots", "33"),
        ("3.7", "Testing and Results", "37"),
        ("4.1 - 4.5", "CHAPTER 4: PROJECT PROGRESS AND GUIDE'S FEEDBACK", "40 - 42"),
        ("5.1 - 5.3", "CHAPTER 5: CONCLUSION AND FUTURE WORK", "43 - 44"),
        ("App A-D", "REFERENCES & APPENDIX", "45 - 47")
    ]
    for idx, item in enumerate(toc_items):
        tbl_toc.cell(idx, 0).text = item[0]
        tbl_toc.cell(idx, 1).text = item[1]
        tbl_toc.cell(idx, 2).text = item[2]
    style_table_header(tbl_toc.rows[0], [Inches(1.2), Inches(4.3), Inches(1.2)], bg_color="059669")
    doc.add_page_break()

    # CHAPTER 1
    add_h1("CHAPTER 1\nINTRODUCTION")
    add_h2("1.1 Project Overview")
    add_p("YAT AI is an intelligent, AI-powered mock interview and technical evaluation platform developed to provide students with a comprehensive, realistic, and accessible environment for practicing and mastering technical job interviews. The project focuses on bridging the gap between theoretical classroom learning and the rigorous standards of campus placements and industry recruitment.")
    add_p("In modern computer science and engineering education, candidates are evaluated across a diverse range of competencies, including core theoretical concepts, real-time algorithmic problem solving, project architecture defense, and behavioral communication. However, students frequently face difficulties assessing their practical interview readiness because conventional preparation relies on static multiple-choice questions or unassisted self-study.")
    add_p("YAT AI addresses this challenge by providing a dedicated technical recruitment platform where students can experience multi-round interview simulations. The application incorporates automated PDF resume parsing, interactive 5-round evaluations, live code analysis, and a multidimensional Candidate DNA Matrix that diagnoses strengths and areas for improvement.")

    add_h2("1.2 Problem Statement")
    add_p("Students preparing for campus placements and technical evaluations encounter significant friction due to the scattered and static nature of available preparation tools:")
    add_p("• Fragmented Preparation Environments: Students commonly switch between multiple disjointed websites—solving coding puzzles on one platform, reviewing theoretical computer science notes on another, and practicing communication with peers who lack objective scoring standards.")
    add_p("• Generic, Non-Personalized Inquiries: Standard practice tests rely on fixed question banks that fail to tailor inquiries to the candidate's actual projects, declared technical skills, or target engineering roles.")
    add_p("• Absence of Diagnostic Feedback: Traditional quiz applications output a simple total score or percentage, without providing actionable explanations of why an architectural choice was suboptimal or how code efficiency can be improved.")
    add_p("• Scalability Constraints in Educational Institutions: Conducting mock interviews manually requires significant faculty time and resources. In polytechnic colleges with hundreds of candidates, professors cannot conduct repeated individual 45-minute interviews for every student.")

    add_diagram("diagram_fig1_1.png", "Figure 1.1: Fragmented Placement Preparation Bottleneck vs. YAT AI Unified Platform")

    add_h2("1.3 Objectives of the Project")
    add_p("1. To develop a centralized, full-stack web application for conducting multi-round technical and behavioral interviews.")
    add_p("2. To implement secure user registration, session management, and role-based profiles using Supabase Authentication.")
    add_p("3. To build an automated PDF resume parsing engine that extracts candidate skills, technical experience, and projects to personalize interview questions.")
    add_p("4. To structure a realistic 5-round evaluation pipeline covering MCQs, Technical Deep-Dive, System Architecture, Live Algorithmic Coding, and Behavioral fit.")
    add_p("5. To integrate high-throughput AI inference gateways (Groq Cloud SDK and Google Gemini Flash) with a resilient sequential fallback mechanism.")
    add_p("6. To provide real-time code execution and complexity analysis, assessing submitted algorithms for time and space efficiency.")
    add_p("7. To calculate and visualize a Candidate DNA Matrix that tracks multi-dimensional competencies across five performance vectors.")
    add_p("8. To develop a Training and Placement Officer (TPO) management portal for scheduling campus drives, enrolling candidates, and viewing comparative rankings.")
    add_p("9. To design a premium, responsive Glassy Emerald UI using Tailwind CSS and Framer Motion.")
    add_p("10. To enforce enterprise-grade data security through PostgreSQL Row-Level Security (RLS) policies.")

    add_h2("1.4 Scope of the Project")
    add_p("The scope covers candidate authentication, automated resume parsing, interactive 5-round evaluations, Candidate DNA telemetry, and TPO placement drive portals. Native mobile OS binaries and real-time audio/video streaming are designated for future phases.")
    doc.add_page_break()

    # CHAPTER 2
    add_h1("CHAPTER 2\nBACKGROUND")
    add_h2("2.1 Background of the Problem")
    add_p("The transition from academic diploma coursework to professional software engineering employment has historically presented a steep challenge for students. While academic curricula provide vital theoretical foundations in programming languages, data structures, and database management, competitive placement drives evaluate real-time problem-solving agility, practical system design, and clear articulation under evaluation constraints.")
    add_p("Traditionally, students prepare for technical assessments using static textbooks, standalone coding platforms (LeetCode), or informal peer mocks that lack standardized rubrics.")

    add_h2("2.2 Why the Project Was Chosen")
    add_p("The YAT AI project was chosen to solve the acute interview preparation hurdles experienced by diploma candidates. It provided a real-world opportunity to apply concepts learned in the Diploma in Computer Science & Engineering—such as full-stack web development, database normalization, asynchronous APIs, and cloud hosting—while exploring modern Generative AI gateways.")

    add_h2("2.3 Existing Solutions & Comparative Analysis")
    add_p("The team analyzed LeetCode, Pramp, and ChatGPT, observing that existing tools isolate code syntax or text chatting without providing an integrated, profile-grounded recruitment simulation.")

    tbl_comp = doc.add_table(rows=8, cols=5)
    tbl_comp.alignment = WD_TABLE_ALIGNMENT.CENTER
    comp_data = [
        ("Feature / Capability", "LeetCode", "Pramp", "ChatGPT", "YAT AI"),
        ("Interactive 5-Round Flow", "No", "Manual", "Prompt", "Automated 5-Round"),
        ("PDF Resume Parsing", "No", "No", "Limited", "Automated Groq/Gemini"),
        ("Algorithmic Code Sandbox", "Yes", "Yes", "No", "Integrated Editor"),
        ("Candidate DNA Telemetry", "No", "Subjective", "Text Only", "5-Axis Radar Matrix"),
        ("Cloud Database Persistence", "Yes", "Yes", "Session", "Supabase PostgreSQL"),
        ("Placement Drive Module", "No", "No", "No", "TPO Drive Portal"),
        ("Accessibility & Cost", "Freemium", "Paid", "Subscription", "Free & Open Access")
    ]
    for r_idx, row in enumerate(comp_data):
        for c_idx, val in enumerate(row):
            tbl_comp.cell(r_idx, c_idx).text = val
    style_table_header(tbl_comp.rows[0], [Inches(1.8), Inches(1.1), Inches(1.1), Inches(1.1), Inches(1.6)], bg_color="0284C7")

    add_diagram("diagram_fig2_1.png", "Figure 2.1: The YAT AI Unified Evaluation Ecosystem")

    add_h2("2.4 Proposed Solution & Key Advantages")
    add_p("YAT AI combines profile-grounded questioning, multi-round technical depth, real-time code complexity analysis, and Candidate DNA telemetry in a single, accessible Glassy Emerald web interface.")
    doc.add_page_break()

    # CHAPTER 3
    add_h1("CHAPTER 3\nIMPLEMENTATION OF THE PROJECT")
    add_h2("3.1 Technologies and Tools Used")
    add_p("• Frontend: Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion.")
    add_p("• Backend: Next.js Server Route Handlers, Groq Cloud SDK (LPU ultra-fast engine), Google Gemini Flash.")
    add_p("• Database & Storage: Supabase PostgreSQL 15, Supabase Auth, Row-Level Security, Cloud Storage.")
    add_p("• Hosting & Tools: Vercel Cloud, Visual Studio Code, Git and GitHub.")

    add_h2("3.2 System Design / Architecture")
    add_p("YAT AI follows a 4-tier architecture comprising Presentation Layer, Application Logic Layer, AI Inference & Failover Layer, and Data Persistence Layer.")

    add_diagram("diagram_fig3_1.png", "Figure 3.1: YAT AI 4-Tier System Architecture")
    add_diagram("diagram_fig3_2.png", "Figure 3.2: 5-Round Interview Pipeline & Evaluation Flowchart")

    add_h2("3.4 Front-End Implementation with Screenshots")
    add_p("The front-end user experience is implemented in Next.js 15 with React 19, featuring an immersive Glassy Emerald design language, real-time HUD evaluation telemetry, and fluid Framer Motion transitions.")

    add_box("[ SCREENSHOT: Figure 3.3 - Landing Page with Glassy Emerald Aesthetic ]", 
            "Live production landing page featuring hero banner, interactive navigation, and instant mock launch buttons.")
    add_box("[ SCREENSHOT: Figure 3.4 - User Authentication & Login View ]", 
            "Secure authentication view supporting email/password sign-in and Google OAuth SSO with Supabase Auth.")
    add_box("[ SCREENSHOT: Figure 3.5 - Student Dashboard Overview ]", 
            "Comprehensive candidate control center displaying active placements, recent scores, and practice rooms.")
    add_box("[ SCREENSHOT: Figure 3.6 - Resume Upload & Extraction Interface ]", 
            "Drag-and-drop PDF resume upload zone with real-time AI skill extraction and candidate profile sync.")
    add_box("[ SCREENSHOT: Figure 3.7 - Live 5-Round Interview Room ]", 
            "Interactive interview examination interface displaying live questions, timers, and code editor sandbox.")
    add_box("[ SCREENSHOT: Figure 3.8 - Candidate DNA Matrix & Performance Report ]", 
            "Post-interview analytics report presenting 5-axis competency radar telemetry, scores, and hiring verdicts.")
    add_box("[ SCREENSHOT: Figure 3.9 - TPO Placement Drives Management View ]", 
            "Placement coordinator portal displaying institutional campus drives, candidate registrations, and cutoffs.")
    add_box("[ SCREENSHOT: Figure 3.10 - Student Profile & Passport Management ]", 
            "Verified candidate digital passport showing contact info, certified badges, skills, and work experience.")

    add_h2("3.5 Back-End Implementation with Screenshots")
    add_p("The back-end layer executes inside Next.js Route Handlers with dual-model AI failover (Groq SDK -> Gemini Flash) and atomic Supabase database transactions.")

    add_box("[ CODE / TERMINAL: Figure 3.11 - Supabase Authentication Handler ]", 
            "Server-side auth middleware verifying JWT cookies and enforcing session persistence across routes.")
    add_box("[ CODE / TERMINAL: Figure 3.12 - Server Route Handlers for Rounds 1-5 ]", 
            "Modular API handlers (/api/round-1 to /api/round-5) generating grounded questions and scoring responses.")
    add_box("[ TERMINAL: Figure 3.13 - AI Failover Execution Terminal Logs ]", 
            "Terminal execution output showcasing ultra-fast sub-second responses via Groq with seamless Gemini failover.")

    add_h2("3.6 Database Design and Screenshots")
    add_p("The database architecture is built upon PostgreSQL 15 managed via Supabase, enforcing multi-tenant security through Row-Level Security (RLS) policies.")

    add_diagram("diagram_fig3_18.png", "Figure 3.18: Database Entity-Relationship (ER) Diagram")

    add_box("[ SCREENSHOT: Figure 3.19 - Profiles Table in Supabase Studio ]", 
            "Supabase Table Editor displaying public.profiles with user IDs, roles, verified skill arrays, and resume URLs.")
    add_box("[ SCREENSHOT: Figure 3.20 - Interviews Table with JSONB Transcripts ]", 
            "Supabase Table Editor displaying public.interviews containing scores, hiring verdicts, and JSONB transcripts.")
    add_box("[ SCREENSHOT: Figure 3.21 - Row-Level Security (RLS) Policy Editor ]", 
            "Supabase Auth & RLS dashboard showing strict SELECT, INSERT, and UPDATE policies securing candidate records.")

    # 3.7 TESTING AND RESULTS (FULL DETAILS)
    add_h2("3.7 Testing and Results")
    add_p("Comprehensive testing was conducted across 14 rigorous test cases (TC-01 to TC-14) covering functional validation, end-to-end integration, AI failover resiliency, security constraints, and responsive viewport performance. All 14 test cases passed with 100% compliance.")

    add_h3("3.7.1 Testing Approach")
    add_p("• Functional Testing: Validates that individual features (authentication, resume parsing, question delivery, scoring) operate correctly according to requirements.")
    add_p("• Integration Testing: Verifies that frontend components, API route handlers, LLM inference engines, and Supabase database tables communicate seamlessly.")
    add_p("• Security & RLS Testing: Confirms that unauthenticated visitors cannot access protected dashboards and that candidates cannot inspect other students' interview transcripts.")
    add_p("• Responsive UI Testing: Verifies layout usability across desktop monitors, laptops, tablets, and mobile viewports.")

    add_h3("3.7.2 Test Cases")
    add_p("The following test cases were formulated and executed to validate the core features of YAT AI:")

    tbl_tc = doc.add_table(rows=15, cols=3)
    tbl_tc.alignment = WD_TABLE_ALIGNMENT.CENTER
    tc_data = [
        ("Test ID", "Test Scenario", "Expected Result"),
        ("TC-01", "Register account using valid email and password", "User account created; profile row initialized in database."),
        ("TC-02", "Sign in using Google OAuth SSO", "User authenticated and redirected to student dashboard."),
        ("TC-03", "Sign in using invalid password", "Descriptive error alert displayed; access denied."),
        ("TC-04", "Access /dashboard without authentication", "Redirected to login view; protected data shielded."),
        ("TC-05", "Upload valid PDF resume", "Text extracted; skills and projects auto-populated."),
        ("TC-06", "Upload non-PDF or corrupt file", "Upload rejected with clear validation warning."),
        ("TC-07", "Generate Round 1 Technical MCQs", "5 technical questions generated with 4 distinct options."),
        ("TC-08", "Submit answers for evaluation", "AI grades responses and records scores in database."),
        ("TC-09", "Submit code in Round 4 coding challenge", "Algorithm analyzed for time and space complexity."),
        ("TC-10", "Simulate Gemini API rate limit (429)", "System falls back to Groq SDK without crashing."),
        ("TC-11", "Generate Candidate DNA Report", "5-axis radar chart rendered with strengths and tips."),
        ("TC-12", "Access another candidate's private interview", "Supabase RLS blocks query, returning unauthorized."),
        ("TC-13", "Enroll in campus placement drive", "Student added to drive; enrolled count increments."),
        ("TC-14", "Render dashboard on mobile viewport (375px)", "Glassy UI scales smoothly without horizontal overflow.")
    ]
    for r_idx, row in enumerate(tc_data):
        for c_idx, val in enumerate(row):
            tbl_tc.cell(r_idx, c_idx).text = val
    style_table_header(tbl_tc.rows[0], [Inches(1.0), Inches(3.2), Inches(2.5)], bg_color="059669")

    add_h3("3.7.3 Test Results")
    add_p("The actual results of each test case were recorded after executing comprehensive evaluation suites against the staging and production environments:")

    tbl_tr = doc.add_table(rows=15, cols=3)
    tbl_tr.alignment = WD_TABLE_ALIGNMENT.CENTER
    tr_data = [
        ("Test ID", "Actual Result Recorded", "Status"),
        ("TC-01", "User account created; profile initialized in Supabase", "Pass [OK]"),
        ("TC-02", "Google OAuth completed; session stored in cookies", "Pass [OK]"),
        ("TC-03", "Alert 'Invalid login credentials' shown correctly", "Pass [OK]"),
        ("TC-04", "Unauthenticated request redirected to /login", "Pass [OK]"),
        ("TC-05", "Resume skills and projects successfully extracted", "Pass [OK]"),
        ("TC-06", "File rejection alert displayed; no crash occurred", "Pass [OK]"),
        ("TC-07", "5 technical questions generated with valid JSON", "Pass [OK]"),
        ("TC-08", "Scores calculated and saved to interviews table", "Pass [OK]"),
        ("TC-09", "Code complexity evaluated with asymptotic Big-O notes", "Pass [OK]"),
        ("TC-10", "Fallback to Groq succeeded; response delivered seamlessly", "Pass [OK]"),
        ("TC-11", "Radar visualizer rendered with complete feedback", "Pass [OK]"),
        ("TC-12", "RLS policy blocked access; returned empty set", "Pass [OK]"),
        ("TC-13", "Drive enrollment recorded successfully", "Pass [OK]"),
        ("TC-14", "Mobile layout remained fully usable and responsive", "Pass [OK]")
    ]
    for r_idx, row in enumerate(tr_data):
        for c_idx, val in enumerate(row):
            cell = tbl_tr.cell(r_idx, c_idx)
            cell.text = val
            if r_idx > 0 and c_idx == 2:
                cell.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
                for run in cell.paragraphs[0].runs:
                    run.font.color.rgb = RGBColor(5, 150, 105)
                    run.bold = True
    style_table_header(tbl_tr.rows[0], [Inches(1.0), Inches(4.5), Inches(1.2)], bg_color="059669")

    add_h3("3.7.4 Results and Observations")
    add_p("The testing phase confirmed that YAT AI functions reliably across all core requirements. The resilient AI failover loop prevented downtime during upstream model changes, while Supabase Row-Level Security guaranteed strict data segregation between candidates.")
    doc.add_page_break()

    # CHAPTER 4
    add_h1("CHAPTER 4\nPROJECT PROGRESS AND GUIDE'S FEEDBACK")
    add_h2("4.1 Progress Report 1 (Day 1 – 15)")
    add_p("Work Completed: Scope formulation, Next.js 15 project setup, Tailwind CSS tokens.\nGuide's Feedback (Md Naiyer Hoda): Ensure interview questions ground dynamically in resumes.\nAction Taken: Built Gemini PDF parser to extract candidate skills.\nGuide's Signature: ___________________________")

    add_h2("4.2 Progress Report 2 (Day 16 – 30)")
    add_p("Work Completed: Supabase Auth, PDF resume upload drag-and-drop, /api/parse-resume.\nGuide's Feedback (Md Naiyer Hoda): Enforce data privacy between student accounts.\nAction Taken: Enacted PostgreSQL Row-Level Security (RLS) policies.\nGuide's Signature: ___________________________")

    add_h2("4.3 Progress Report 3 (Day 31 – 45)")
    add_p("Work Completed: Rounds 1 to 3 APIs, Groq SDK integration, interactive interview UI.\nGuide's Feedback (Md Naiyer Hoda): Add live code evaluation and handle API rate limits.\nAction Taken: Implemented Round 4 coding sandbox and dual-model failover engine in lib/ai.ts.\nGuide's Signature: ___________________________")

    add_h2("4.4 Progress Report 4 (Day 46 – 60)")
    add_p("Work Completed: Candidate DNA matrix, TPO placement drive portal, Vercel deployment.\nGuide's Feedback (Md Naiyer Hoda): Ensure null-safety for candidates with zero completed tests.\nAction Taken: Added null-safety defaults across all dashboard matrix calculations.\nGuide's Signature: ___________________________")

    add_h2("4.5 Summary of Major Improvements")
    add_p("1. Dynamic Resume Grounding derived from uploaded student PDFs.\n2. Multi-Model Failover Engine eliminating 404/429 downtime.\n3. Live Algorithmic Code Review with asymptotic Big-O notes.\n4. 5-Axis Candidate DNA Telemetry for structured exam preparation.\n5. Row-Level Security safeguarding student scores and transcripts.")
    doc.add_page_break()

    # CHAPTER 5
    add_h1("CHAPTER 5\nCONCLUSION AND FUTURE WORK")
    add_h2("5.1 Conclusion")
    add_p("YAT AI successfully implements a full-stack, AI-powered mock interview platform for diploma students. Uniting Next.js 15, TypeScript, Tailwind CSS, Supabase, Groq SDK, and Gemini Flash, the platform delivers automated resume parsing, a 5-round evaluation suite, and deep diagnostic DNA analytics.")

    add_h2("5.2 Limitations of the Project")
    add_p("• Text and code input only; real-time facial emotion and tone analysis are not yet included.\n• Requires active Internet connectivity for cloud AI inference.\n• English language only.")

    add_h2("5.3 Future Scope / Future Work")
    add_p("• Bidirectional Voice AI for low-latency conversational interviews.\n• Webcam proctoring and body language analysis.\n• Institutional LMS integration (Moodle / Canvas).\n• Offline mobile applications with cached question modules.")
    doc.add_page_break()

    # REFERENCES & APPENDIX
    add_title("REFERENCES", font_size=14, space_after=14)
    add_p("1. Next.js Documentation: Vercel Inc., https://nextjs.org/docs, 2026.")
    add_p("2. Supabase Documentation: Supabase Inc., https://supabase.com/docs, 2026.")
    add_p("3. Groq Cloud API Documentation: Groq Inc., https://console.groq.com/docs, 2026.")
    add_p("4. Google AI Documentation: Google DeepMind, https://ai.google.dev/docs, 2026.")
    add_p("5. Pressman, R. S., & Maxim, B. R.: Software Engineering: A Practitioner's Approach, McGraw-Hill, 2020.")
    add_p("6. Elmasri, R., & Navathe, S. B.: Fundamentals of Database Systems, Pearson, 2016.", space_after=20)

    add_title("APPENDIX", font_size=14, space_after=12)
    add_h2("Appendix A: GitHub Repository Link")
    add_p("• GitHub Repository: https://github.com/anzarhasnat/YAT-AI-.git")
    add_p("• Live Deployment: https://yat-ai.vercel.app")

    add_h2("Appendix B: Additional Screenshots")
    add_box("[ SCREENSHOT: Appendix Figure B.1 - Cloud Storage Resume Management ]", 
            "Supabase Storage bucket explorer managing uploaded candidate PDF resumes securely.")
    add_box("[ SCREENSHOT: Appendix Figure B.2 - Detailed Interview Transcript View ]", 
            "Full historical inquiry transcript revealing question prompts, candidate responses, and individual round scores.")

    try:
        doc.save(docx_filename)
        print(f"SUCCESS: Generated Word document at {docx_filename} (size: {os.path.getsize(docx_filename)/1024:.2f} KB)")
    except PermissionError:
        alt_name = "YAT_AI_Project_Report_Updated.docx"
        doc.save(alt_name)
        print(f"NOTE: {docx_filename} is currently open in Microsoft Word. Saved updated report as {alt_name} (size: {os.path.getsize(alt_name)/1024:.2f} KB)")

if __name__ == "__main__":
    build_docx_report()
