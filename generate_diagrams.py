import os
from PIL import Image, ImageDraw, ImageFont

def get_font(name="segoeui.ttf", size=14, bold=False):
    windir = os.environ.get("WINDIR", "C:\\Windows")
    if bold:
        font_files = ["segoeuib.ttf", "arialbd.ttf", "calibrib.ttf"]
    else:
        font_files = [name, "arial.ttf", "calibri.ttf"]
    for f in font_files:
        p = os.path.join(windir, "Fonts", f)
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()

def draw_rounded_rect(draw, bbox, radius, fill, outline=None, width=1):
    x0, y0, x1, y1 = bbox
    draw.rounded_rectangle([x0, y0, x1, y1], radius=radius, fill=fill, outline=outline, width=width)

def draw_arrow(draw, start, end, color="#059669", width=3):
    x0, y0 = start
    x1, y1 = end
    draw.line([start, end], fill=color, width=width)
    if x0 == x1: # vertical
        if y1 > y0:
            draw.polygon([(x1-6, y1-10), (x1+6, y1-10), (x1, y1+2)], fill=color)
        else:
            draw.polygon([(x1-6, y1+10), (x1+6, y1+10), (x1, y1-2)], fill=color)
    elif y0 == y1: # horizontal
        if x1 > x0:
            draw.polygon([(x1-10, y1-6), (x1-10, y1+6), (x1+2, y1)], fill=color)
        else:
            draw.polygon([(x1+10, y1-6), (x1+10, y1+6), (x1-2, y1)], fill=color)
    else: # angled arrow
        draw.line([start, end], fill=color, width=width)
        draw.ellipse([(x1-4, y1-4), (x1+4, y1+4)], fill=color)

def wrap_text(text, font, max_width):
    words = text.split(" ")
    lines = []
    current_line = []
    for word in words:
        test_line = " ".join(current_line + [word])
        bbox = font.getbbox(test_line)
        line_w = bbox[2] - bbox[0]
        if line_w <= max_width or not current_line:
            current_line.append(word)
        else:
            lines.append(" ".join(current_line))
            current_line = [word]
    if current_line:
        lines.append(" ".join(current_line))
    return lines

def draw_centered_text(draw, y, text, font, fill, canvas_w):
    bbox = font.getbbox(text)
    text_w = bbox[2] - bbox[0]
    draw.text(((canvas_w - text_w) // 2, y), text, fill=fill, font=font)

# -------------------------------------------------------------
# 1. Figure 1.1: Placement Preparation Bottleneck vs YAT AI
# -------------------------------------------------------------
def create_fig1_1():
    w, h = 1080, 560
    im = Image.new("RGB", (w, h), "#F8FAFC")
    draw = ImageDraw.Draw(im)

    title_font = get_font(size=18, bold=True)
    h_font = get_font(size=13.5, bold=True)
    body_font = get_font(size=11, bold=False)
    bold_font = get_font(size=12, bold=True)

    draw_centered_text(draw, 20, "Figure 1.1: Fragmented Placement Preparation vs. YAT AI Unified Platform", title_font, "#0F172A", w)

    # Left: Fragmented
    left_x0, left_x1 = 40, 520
    draw_rounded_rect(draw, (left_x0, 65, left_x1, 525), 14, "#FEF2F2", outline="#F87171", width=2)
    draw_rounded_rect(draw, (left_x0 + 15, 80, left_x1 - 15, 120), 8, "#EF4444")
    
    header_left = "TRADITIONAL / DISJOINTED PREPARATION"
    hl_bbox = h_font.getbbox(header_left)
    draw.text((left_x0 + 15 + ((left_x1 - left_x0 - 30) - (hl_bbox[2]-hl_bbox[0]))//2, 92), header_left, fill="#FFFFFF", font=h_font)

    boxes_left = [
        ("Static Question Banks & LeetCode", "Candidates solve isolated coding puzzles without viva or system architecture defense."),
        ("Generic, Non-Personalized Practice", "Fixed generic question sets completely disconnected from the student's actual resume."),
        ("Zero Algorithmic Efficiency Feedback", "Binary pass/fail without diagnostic analysis of asymptotic Big-O bottlenecks."),
        ("Scalability Constraints in Colleges", "Professors lack the manual bandwidth to conduct 45-min mock interviews for 500+ candidates.")
    ]
    y = 138
    for title, desc in boxes_left:
        draw_rounded_rect(draw, (left_x0 + 15, y, left_x1 - 15, y + 84), 8, "#FFFFFF", outline="#FCA5A5", width=1)
        draw.text((left_x0 + 26, y + 8), "X  " + title, fill="#B91C1C", font=bold_font)
        
        wrapped = wrap_text(desc, body_font, max_width=(left_x1 - left_x0 - 55))
        line_y = y + 32
        for line in wrapped:
            draw.text((left_x0 + 26, line_y), line, fill="#475569", font=body_font)
            line_y += 17
        y += 94

    # Right: YAT AI
    right_x0, right_x1 = 560, 1040
    draw_rounded_rect(draw, (right_x0, 65, right_x1, 525), 14, "#ECFDF5", outline="#34D399", width=2)
    draw_rounded_rect(draw, (right_x0 + 15, 80, right_x1 - 15, 120), 8, "#059669")
    
    header_right = "YAT AI UNIFIED EVALUATION ECOSYSTEM"
    hr_bbox = h_font.getbbox(header_right)
    draw.text((right_x0 + 15 + ((right_x1 - right_x0 - 30) - (hr_bbox[2]-hr_bbox[0]))//2, 92), header_right, fill="#FFFFFF", font=h_font)

    boxes_right = [
        ("Automated Resume & Profile Grounding", "AI parses PDF resume; questions dynamically target candidate's verified skills & projects."),
        ("5-Round Comprehensive Evaluation Suite", "Structured rounds covering MCQs, Technical Inquiry, Architecture, Coding, and HR."),
        ("Live Code Sandbox & Complexity Analysis", "Real-time algorithmic grading assessing time/space Big-O and edge cases."),
        ("5-Axis Candidate DNA Telemetry & TPO", "Automated multi-vector competency matrix and institutional placement leaderboard.")
    ]
    y = 138
    for title, desc in boxes_right:
        draw_rounded_rect(draw, (right_x0 + 15, y, right_x1 - 15, y + 84), 8, "#FFFFFF", outline="#6EE7B7", width=1)
        draw.text((right_x0 + 26, y + 8), "[+] " + title, fill="#047857", font=bold_font)
        
        wrapped = wrap_text(desc, body_font, max_width=(right_x1 - right_x0 - 55))
        line_y = y + 32
        for line in wrapped:
            draw.text((right_x0 + 26, line_y), line, fill="#334155", font=body_font)
            line_y += 17
        y += 94

    im.save("diagram_fig1_1.png", "PNG", quality=95)
    print("Created diagram_fig1_1.png")

# -------------------------------------------------------------
# 2. Figure 2.1: Unified Evaluation Ecosystem
# -------------------------------------------------------------
def create_fig2_1():
    w, h = 1080, 520
    im = Image.new("RGB", (w, h), "#F8FAFC")
    draw = ImageDraw.Draw(im)

    title_font = get_font(size=18, bold=True)
    h_font = get_font(size=13, bold=True)
    body_font = get_font(size=11, bold=False)

    draw_centered_text(draw, 18, "Figure 2.1: The YAT AI Unified Evaluation Ecosystem", title_font, "#0F172A", w)

    # 1. Candidate Node (Left)
    draw_rounded_rect(draw, (35, 170, 210, 345), 12, "#E0F2FE", outline="#0284C7", width=2)
    draw.text((50, 185), "Candidate / Student", fill="#0369A1", font=h_font)
    c_lines = [
        "• PDF Resume Upload",
        "• Stated Tech Stack",
        "• Target Job Roles",
        "• Campus Drive Reg."
    ]
    cy = 215
    for cl in c_lines:
        draw.text((50, cy), cl, fill="#334155", font=body_font)
        cy += 24

    draw_arrow(draw, (210, 255), (250, 255), color="#0284C7", width=2)

    # 2. Core Engine Node (Center)
    draw_rounded_rect(draw, (250, 80, 520, 440), 14, "#ECFDF5", outline="#10B981", width=2)
    eng_title = "YAT AI Next.js Engine"
    et_bbox = h_font.getbbox(eng_title)
    draw.text((250 + (270 - (et_bbox[2]-et_bbox[0]))//2, 98), eng_title, fill="#047857", font=get_font(size=14, bold=True))

    steps = [
        "1. Dynamic PDF Parsing & Skill Extraction",
        "2. Round 1: Aptitude & CS Fundamentals",
        "3. Round 2: Deep-Dive Technical Inquiry",
        "4. Round 3: Resume Architecture Defense",
        "5. Round 4: Live Algorithmic Sandbox",
        "6. Round 5: HR Behavioral & Situational"
    ]
    sy = 135
    for s in steps:
        draw_rounded_rect(draw, (265, sy, 505, sy + 38), 6, "#FFFFFF", outline="#A7F3D0")
        wrapped_s = wrap_text(s, body_font, max_width=225)
        text_y = sy + 4 if len(wrapped_s) > 1 else sy + 10
        for l in wrapped_s:
            draw.text((275, text_y), l, fill="#065F46", font=body_font)
            text_y += 15
        sy += 48

    # Arrows to AI & DB
    draw_arrow(draw, (520, 170), (575, 170), color="#10B981", width=2)
    draw_arrow(draw, (520, 345), (575, 345), color="#10B981", width=2)

    # 3. AI Inference Gateways (Top-Right)
    draw_rounded_rect(draw, (575, 80, 820, 245), 12, "#FAF5FF", outline="#A855F7", width=2)
    draw.text((590, 95), "AI Inference Gateways", fill="#7E22CE", font=h_font)
    ai_lines = [
        "• Groq LPU (~680ms latency)",
        "• Gemini 3.5 Flash Fallback",
        "• Sub-second question synthesis",
        "• AST & Big-O code evaluation",
        "• Multi-modal PDF extraction"
    ]
    ay = 125
    for al in ai_lines:
        draw.text((590, ay), al, fill="#334155", font=body_font)
        ay += 21

    # 4. Supabase DB & Auth (Bottom-Right)
    draw_rounded_rect(draw, (575, 275, 820, 440), 12, "#EFF6FF", outline="#3B82F6", width=2)
    draw.text((590, 290), "Supabase Cloud DB", fill="#1D4ED8", font=h_font)
    db_lines = [
        "• Supabase Auth & JWT Sessions",
        "• JSONB Interview Transcripts",
        "• Verified Candidate Passports",
        "• Row-Level Security (RLS)",
        "• Cloud Resume PDF Storage"
    ]
    dy = 320
    for dl in db_lines:
        draw.text((590, dy), dl, fill="#334155", font=body_font)
        dy += 21

    # Arrows to Output
    draw_arrow(draw, (820, 170), (865, 240), color="#A855F7", width=2)
    draw_arrow(draw, (820, 345), (865, 275), color="#3B82F6", width=2)

    # 5. Diagnostic Outputs (Far Right)
    draw_rounded_rect(draw, (865, 170, 1050, 345), 12, "#FEF3C7", outline="#D97706", width=2)
    draw.text((880, 185), "Diagnostic Outputs", fill="#B45309", font=h_font)
    out_lines = [
        "• Candidate DNA Matrix",
        "• 5-Axis Radar Scorecard",
        "• Asymptotic Code Notes",
        "• Targeted Study Advice",
        "• TPO Drive Leaderboard"
    ]
    oy = 215
    for ol in out_lines:
        draw.text((880, oy), ol, fill="#78350F", font=body_font)
        oy += 23

    im.save("diagram_fig2_1.png", "PNG", quality=95)
    print("Created diagram_fig2_1.png")

# -------------------------------------------------------------
# 3. Figure 3.1: 4-Tier System Architecture
# -------------------------------------------------------------
def create_fig3_1():
    w, h = 1080, 620
    im = Image.new("RGB", (w, h), "#F8FAFC")
    draw = ImageDraw.Draw(im)

    title_font = get_font(size=18, bold=True)
    tier_font = get_font(size=13.5, bold=True)
    card_title_font = get_font(size=11.5, bold=True)
    card_desc_font = get_font(size=10.5, bold=False)

    draw_centered_text(draw, 16, "Figure 3.1: YAT AI 4-Tier System Architecture", title_font, "#0F172A", w)

    tiers = [
        ("Tier 1: Presentation Layer (Client Browser)", "#0284C7", "#E0F2FE", [
            ("Next.js 15 & React 19", "Server & Client components utilizing App Router for fast UI rendering."),
            ("Tailwind CSS & Glassy Theme", "Dark mode glass-morphism aesthetic with responsive emerald HUD accents."),
            ("Framer Motion & Lucide", "Fluid step-by-step interview transitions, animations, and telemetry icons.")
        ]),
        ("Tier 2: Application / API Layer (Next.js Server)", "#059669", "#ECFDF5", [
            ("Server Route Handlers", "Modular endpoints (/api/round-1 to 5, /api/interview/save, and resume sync)."),
            ("lib/ai.ts Failover Engine", "Sequential fallback gateway: Groq SDK LPU -> Google Gemini 3.5 Flash."),
            ("Candidate DNA Synthesis", "Aggregates multi-round evaluation transcripts into 5-axis competency scores.")
        ]),
        ("Tier 3: AI Inference & Intelligence Layer", "#7E22CE", "#FAF5FF", [
            ("Groq Cloud SDK (LPU Engine)", "Ultra-fast (~680ms) inference for dynamic interview questions and live prompts."),
            ("Google Gemini 3.5 Flash", "Multi-modal PDF parsing and resilient reasoning fallback gateway."),
            ("AST & Complexity Evaluator", "Evaluates candidate code logic for time (O(n)) and space (O(1)) efficiency.")
        ]),
        ("Tier 4: Data Persistence & Security Layer", "#D97706", "#FFFBEB", [
            ("Supabase PostgreSQL 15", "Relational database with JSONB columns for flexible interview scoring telemetry."),
            ("Supabase Auth & JWT Sessions", "Cookie-based secure user authentication and Google OAuth single sign-on."),
            ("PostgreSQL Row-Level Security", "Enforces multi-tenant student privacy directly at database schema level.")
        ])
    ]

    tier_x0, tier_x1 = 40, 1040
    y = 52
    for title, border_col, bg_col, cards in tiers:
        tier_h = 114
        draw_rounded_rect(draw, (tier_x0, y, tier_x1, y + tier_h), 10, bg_col, outline=border_col, width=2)
        draw.text((tier_x0 + 15, y + 8), title, fill=border_col, font=tier_font)
        
        card_w = 312
        card_h = 70
        cx = tier_x0 + 15
        for ctitle, cdesc in cards:
            draw_rounded_rect(draw, (cx, y + 34, cx + card_w, y + 34 + card_h), 6, "#FFFFFF", outline=border_col, width=1)
            draw.text((cx + 10, y + 40), ctitle, fill="#0F172A", font=card_title_font)
            
            wrapped_desc = wrap_text(cdesc, card_desc_font, max_width=card_w - 20)
            desc_y = y + 58
            for line in wrapped_desc:
                draw.text((cx + 10, desc_y), line, fill="#475569", font=card_desc_font)
                desc_y += 15
            cx += card_w + 17
            
        if y < 400:
            draw_arrow(draw, (w // 2, y + tier_h), (w // 2, y + tier_h + 18), color=border_col, width=2)
        y += 132

    im.save("diagram_fig3_1.png", "PNG", quality=95)
    print("Created diagram_fig3_1.png")

# -------------------------------------------------------------
# 4. Figure 3.2: 5-Round Interview Pipeline Flowchart (PR Diagram)
# -------------------------------------------------------------
def create_fig3_2():
    w, h = 1060, 580
    im = Image.new("RGB", (w, h), "#F8FAFC")
    draw = ImageDraw.Draw(im)

    title_font = get_font(size=18, bold=True)
    node_title_font = get_font(size=13, bold=True)
    body_font = get_font(size=11, bold=False)

    draw_centered_text(draw, 16, "Figure 3.2: 5-Round Interview Pipeline & Evaluation Flowchart", title_font, "#0F172A", w)

    pipeline = [
        ("Step 1: Auth & Resume Upload", "Candidate uploads PDF; Gemini parses skills & projects.", "#0284C7", "#E0F2FE", (50, 65, 480, 135)),
        ("Step 2: Round 1 - Core CS & MCQs", "5 timed MCQs on OS, DBMS, Networks, and Data Structures.", "#059669", "#ECFDF5", (580, 65, 1010, 135)),
        ("Step 3: Round 2 - Technical Deep-Dive", "Interactive inquiries tailored to candidate's stated tech stack.", "#059669", "#ECFDF5", (580, 175, 1010, 245)),
        ("Step 4: Round 3 - Resume Defense", "Detailed inquiry defending architectural decisions on past projects.", "#059669", "#ECFDF5", (50, 175, 480, 245)),
        ("Step 5: Round 4 - Algorithmic Coding", "Live code editor: algorithms tested for edge cases & Big-O.", "#7E22CE", "#FAF5FF", (50, 285, 480, 355)),
        ("Step 6: Round 5 - HR & Behavioral", "Situational problem-solving, teamwork, and ethics scenarios.", "#7E22CE", "#FAF5FF", (580, 285, 1010, 355)),
        ("Step 7: AI Synthesis & Evaluation", "Dual LLMs evaluate full transcript; assign 5-axis competency scores.", "#D97706", "#FFFBEB", (580, 395, 1010, 465)),
        ("Step 8: Candidate DNA Card Issued", "Scores saved to Supabase; interactive radar telemetry displayed.", "#047857", "#D1FAE5", (50, 395, 480, 465)),
    ]

    for title, desc, border_col, bg_col, bbox in pipeline:
        draw_rounded_rect(draw, bbox, 10, bg_col, outline=border_col, width=2)
        draw.text((bbox[0] + 16, bbox[1] + 12), title, fill=border_col, font=node_title_font)
        
        wrapped_desc = wrap_text(desc, body_font, max_width=(bbox[2] - bbox[0] - 32))
        line_y = bbox[1] + 36
        for line in wrapped_desc:
            draw.text((bbox[0] + 16, line_y), line, fill="#334155", font=body_font)
            line_y += 16

    # Connecting arrows
    draw_arrow(draw, (480, 100), (580, 100), color="#0284C7", width=2)
    draw_arrow(draw, (795, 135), (795, 175), color="#059669", width=2)
    draw_arrow(draw, (580, 210), (480, 210), color="#059669", width=2)
    draw_arrow(draw, (265, 245), (265, 285), color="#059669", width=2)
    draw_arrow(draw, (480, 320), (580, 320), color="#7E22CE", width=2)
    draw_arrow(draw, (795, 355), (795, 395), color="#7E22CE", width=2)
    draw_arrow(draw, (580, 430), (480, 430), color="#D97706", width=2)

    # Completion badge
    draw_rounded_rect(draw, (360, 495, 700, 545), 8, "#10B981")
    draw.text((385, 508), "VERIFIED CANDIDATE PASSPORT GENERATED", fill="#FFFFFF", font=get_font(size=12, bold=True))

    im.save("diagram_fig3_2.png", "PNG", quality=95)
    print("Created diagram_fig3_2.png")

# -------------------------------------------------------------
# 5. Figure 3.18: Database ER Diagram (ER Diagram)
# -------------------------------------------------------------
def create_fig3_18():
    w, h = 1060, 620
    im = Image.new("RGB", (w, h), "#F8FAFC")
    draw = ImageDraw.Draw(im)

    title_font = get_font(size=18, bold=True)
    table_head_font = get_font(size=12.5, bold=True)
    col_font = get_font(size=11, bold=False)

    draw_centered_text(draw, 16, "Figure 3.18: Database Entity-Relationship (ER) Diagram", title_font, "#0F172A", w)

    tables = [
        ("auth.users", (40, 60, 280, 220), "#0284C7", "#E0F2FE", [
            ("PK", "id : UUID"),
            ("", "email : VARCHAR"),
            ("", "created_at : TIMESTAMPTZ"),
            ("", "last_sign_in_at : TIMESTAMPTZ")
        ]),
        ("public.profiles", (370, 60, 660, 275), "#059669", "#ECFDF5", [
            ("PK, FK", "id : UUID (-> auth.users)"),
            ("", "full_name : VARCHAR"),
            ("", "role : VARCHAR ('student'|'tpo')"),
            ("", "college : VARCHAR"),
            ("", "skills : TEXT[]"),
            ("", "resume_url : TEXT"),
            ("", "updated_at : TIMESTAMPTZ")
        ]),
        ("public.interviews", (750, 60, 1020, 295), "#7E22CE", "#FAF5FF", [
            ("PK", "id : UUID"),
            ("FK", "user_id : UUID (-> profiles)"),
            ("", "role : VARCHAR"),
            ("", "avg_score : INT"),
            ("", "status : VARCHAR"),
            ("", "transcript : JSONB"),
            ("FK", "drive_id : UUID (optional)"),
            ("", "created_at : TIMESTAMPTZ")
        ]),
        ("public.placement_drives", (40, 335, 300, 535), "#D97706", "#FFFBEB", [
            ("PK", "id : UUID"),
            ("FK", "created_by : UUID (-> profiles)"),
            ("", "company_name : VARCHAR"),
            ("", "role_title : VARCHAR"),
            ("", "eligibility_criteria : TEXT"),
            ("", "deadline : TIMESTAMPTZ"),
            ("", "is_active : BOOLEAN")
        ]),
        ("public.drive_registrations", (370, 335, 660, 515), "#B45309", "#FEF3C7", [
            ("PK", "id : UUID"),
            ("FK", "drive_id : UUID (-> drives)"),
            ("FK", "user_id : UUID (-> profiles)"),
            ("", "status : VARCHAR"),
            ("", "registered_at : TIMESTAMPTZ")
        ]),
        ("public.dna_reports", (750, 345, 1020, 520), "#047857", "#D1FAE5", [
            ("PK", "id : UUID"),
            ("FK", "user_id : UUID (-> auth.users)"),
            ("", "report : JSONB (Radar & Scores)"),
            ("", "created_at : TIMESTAMPTZ"),
            ("", "updated_at : TIMESTAMPTZ")
        ])
    ]

    for name, bbox, border_col, bg_col, cols in tables:
        draw_rounded_rect(draw, bbox, 8, "#FFFFFF", outline=border_col, width=2)
        # Header bar
        draw_rounded_rect(draw, (bbox[0], bbox[1], bbox[2], bbox[1]+28), 6, border_col)
        draw.text((bbox[0]+12, bbox[1]+6), name, fill="#FFFFFF", font=table_head_font)
        
        # Columns
        cy = bbox[1] + 36
        for pk_label, col_text in cols:
            if pk_label:
                draw.text((bbox[0]+10, cy), pk_label, fill=border_col, font=get_font(size=10, bold=True))
                draw.text((bbox[0]+62, cy), col_text, fill="#334155", font=col_font)
            else:
                draw.text((bbox[0]+62, cy), col_text, fill="#475569", font=col_font)
            cy += 21

    # Relationship Arrows
    draw_arrow(draw, (280, 110), (370, 110), color="#0284C7", width=2) # auth.users -> profiles
    draw_arrow(draw, (660, 110), (750, 110), color="#059669", width=2) # profiles -> interviews
    draw_arrow(draw, (300, 410), (370, 410), color="#D97706", width=2) # drives -> registrations
    draw_arrow(draw, (515, 275), (515, 335), color="#059669", width=2) # profiles -> registrations
    draw_arrow(draw, (660, 200), (750, 410), color="#047857", width=2) # profiles -> dna_reports

    im.save("diagram_fig3_18.png", "PNG", quality=95)
    print("Created diagram_fig3_18.png")

if __name__ == "__main__":
    create_fig1_1()
    create_fig2_1()
    create_fig3_1()
    create_fig3_2()
    create_fig3_18()
    print("All diagrams generated successfully with clean alignment and text wrapping!")
