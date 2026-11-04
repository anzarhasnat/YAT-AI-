import os
from PIL import Image, ImageDraw, ImageFont
import qrcode

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
    else:
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

def draw_sparkline(draw, bbox, points, line_color="#059669", fill_color="#ECFDF5"):
    x0, y0, x1, y1 = bbox
    w = x1 - x0
    h = y1 - y0
    min_val, max_val = min(points), max(points)
    span = max_val - min_val if max_val != min_val else 1.0

    scaled = []
    n = len(points)
    for i, v in enumerate(points):
        px = x0 + (i / float(n - 1)) * w
        py = y1 - ((v - min_val) / span) * (h - 6) - 3
        scaled.append((px, py))

    # polygon for fill
    poly = [(x0, y1)] + scaled + [(x1, y1)]
    draw.polygon(poly, fill=fill_color)
    # line
    draw.line(scaled, fill=line_color, width=2)

def create_banner(output_path="YAT_AI_Project_Banner.png"):
    w, h = 2400, 1350
    # Create background with warm elegant off-white (matching the reference image)
    im = Image.new("RGB", (w, h), "#F3F4F6")
    draw = ImageDraw.Draw(im)

    # Outer border
    draw_rounded_rect(draw, (24, 24, w - 24, h - 24), 22, "#FFFFFF", outline="#E2E8F0", width=3)

    # Fonts
    title_font = get_font(size=40, bold=True)
    sub_font = get_font(size=23, bold=False)
    author_bold = get_font(size=19, bold=True)
    h2_font = get_font(size=25, bold=True)
    h3_font = get_font(size=21, bold=True)
    body_font = get_font(size=18, bold=False)
    body_bold = get_font(size=18, bold=True)
    badge_font = get_font(size=15, bold=True)

    # -------------------------------------------------------------
    # 1. HEADER SECTION
    # -------------------------------------------------------------
    logo_file = "college_logo.jpg"
    logo_offset = 60
    if os.path.exists(logo_file):
        try:
            logo_img = Image.open(logo_file)
            logo_img = logo_img.resize((100, 110), Image.Resampling.LANCZOS)
            im.paste(logo_img, (60, 42))
            logo_offset = 180
        except Exception:
            logo_offset = 60

    # Project Title
    draw.text((logo_offset, 48), "YAT AI – AI-POWERED MOCK INTERVIEW PLATFORM", fill="#0F172A", font=title_font)
    draw.text((logo_offset, 104), "Department of Computer Science & Engineering | Government Polytechnic, Muzaffarpur", fill="#475569", font=sub_font)

    # Author & Guide Box on Top-Right
    draw.line([(1780, 40), (1780, 150)], fill="#CBD5E1", width=2)
    draw.text((1805, 44), "Anzar Hasnaat (Roll 605)  •  Dipanshu Kumar (Roll 401)", fill="#1E293B", font=author_bold)
    draw.text((1805, 78), "Roshan Kumar (Roll 603)  •  Chandan Kumar (Roll 042)", fill="#1E293B", font=author_bold)
    draw.text((1805, 112), "Guided by: Md Naiyer Hoda (Lecturer, CSE Dept.)", fill="#047857", font=author_bold)

    # Header Bottom Divider
    draw.line([(50, 162), (w - 50, 162)], fill="#E2E8F0", width=2)

    # -------------------------------------------------------------
    # 2. THREE-COLUMN LAYOUT
    # -------------------------------------------------------------
    col_top = 185
    col_bottom = h - 45

    # Column 1: Left (Width: 670px)
    c1_x0, c1_x1 = 50, 720
    draw_rounded_rect(draw, (c1_x0, col_top, c1_x1, col_bottom), 16, "#F8FAFC", outline="#CBD5E1", width=2)
    
    # Title 1
    draw.text((c1_x0 + 30, col_top + 24), "1. INTRODUCTION & PROBLEM", fill="#0F172A", font=h2_font)
    draw.text((c1_x0 + 30, col_top + 58), "    STATEMENT", fill="#0F172A", font=h2_font)

    # Overview Block
    draw_rounded_rect(draw, (c1_x0 + 25, col_top + 105, c1_x1 - 25, col_top + 380), 12, "#FFFFFF", outline="#E2E8F0", width=1)
    draw.text((c1_x0 + 40, col_top + 122), "Overview:", fill="#047857", font=h3_font)
    
    overview_text = (
        "An intelligent, full-stack recruitment evaluation platform that dynamically "
        "adjusts technical and behavioral inquiries based on the candidate's verified resume profile. "
        "It features live algorithmic code analysis, dynamic multi-model AI inference, and deep "
        "Candidate DNA matrix telemetry to prepare students for campus placement drives."
    )
    wrapped_ov = wrap_text(overview_text, body_font, max_width=(c1_x1 - c1_x0 - 80))
    ov_y = col_top + 168
    for l in wrapped_ov:
        draw.text((c1_x0 + 40, ov_y), l, fill="#334155", font=body_font)
        ov_y += 31

    # Problem Statement Block
    draw_rounded_rect(draw, (c1_x0 + 25, col_top + 405, c1_x1 - 25, col_bottom - 25), 12, "#FFFFFF", outline="#E2E8F0", width=1)
    draw.text((c1_x0 + 40, col_top + 425), "Problem Statement:", fill="#B91C1C", font=h3_font)

    problems = [
        ("1. Disjointed Preparation Environments:", "Students switch between coding sites and static question banks without viva or architecture defense."),
        ("2. Generic, Non-Personalized Inquiries:", "Tests rely on fixed question banks that fail to tailor to the candidate's actual projects or target stack."),
        ("3. Absence of Real-Time Big-O Feedback:", "Traditional platforms only verify test cases without evaluating time and space algorithmic complexity."),
        ("4. Institutional Scalability Constraints:", "Faculty cannot manually conduct repeated 45-minute mock interviews for 500+ diploma candidates.")
    ]
    prob_y = col_top + 468
    for p_title, p_desc in problems:
        draw.text((c1_x0 + 40, prob_y), p_title, fill="#0F172A", font=body_bold)
        prob_y += 28
        wrapped_p = wrap_text(p_desc, body_font, max_width=(c1_x1 - c1_x0 - 85))
        for l in wrapped_p:
            draw.text((c1_x0 + 60, prob_y), l, fill="#475569", font=body_font)
            prob_y += 26
        prob_y += 18

    # -------------------------------------------------------------
    # Column 2: Center (Width: 920px)
    # -------------------------------------------------------------
    c2_x0, c2_x1 = 745, 1665
    draw_rounded_rect(draw, (c2_x0, col_top, c2_x1, col_bottom), 16, "#F8FAFC", outline="#CBD5E1", width=2)
    
    # Title 2
    draw.text((c2_x0 + 35, col_top + 24), "3. PROJECT SNAPSHOT & SYSTEM ARCHITECTURE", fill="#0F172A", font=h2_font)

    # Workflow Diagram Canvas Inside Center Column
    diag_y = col_top + 76
    draw_rounded_rect(draw, (c2_x0 + 25, diag_y, c2_x1 - 25, diag_y + 400), 12, "#FFFFFF", outline="#E2E8F0", width=1)

    # Flow Diagram Nodes
    # Node 1: Candidate Resume
    draw_rounded_rect(draw, (c2_x0 + 45, diag_y + 35, c2_x0 + 225, diag_y + 175), 10, "#E0F2FE", outline="#0284C7", width=2)
    draw.text((c2_x0 + 60, diag_y + 50), "Candidate PDF\nResume", fill="#0369A1", font=h3_font)
    draw.text((c2_x0 + 60, diag_y + 110), "Skills, Frameworks,\nTarget Role Input", fill="#334155", font=get_font(size=15))

    draw_arrow(draw, (c2_x0 + 225, diag_y + 105), (c2_x0 + 275, diag_y + 105), color="#0284C7", width=3)

    # Node 2: Groq / Gemini Extraction
    draw_rounded_rect(draw, (c2_x0 + 275, diag_y + 35, c2_x0 + 460, diag_y + 175), 10, "#FAF5FF", outline="#A855F7", width=2)
    draw.text((c2_x0 + 290, diag_y + 50), "AI Extraction\nEngine", fill="#7E22CE", font=h3_font)
    draw.text((c2_x0 + 290, diag_y + 110), "Gemini 3.5 Flash\nStructured JSON", fill="#334155", font=get_font(size=15))

    draw_arrow(draw, (c2_x0 + 460, diag_y + 105), (c2_x0 + 510, diag_y + 105), color="#A855F7", width=3)

    # Node 3: 5-Round Pipeline
    draw_rounded_rect(draw, (c2_x0 + 510, diag_y + 30, c2_x0 + 850, diag_y + 205), 10, "#ECFDF5", outline="#059669", width=2)
    draw.text((c2_x0 + 530, diag_y + 44), "Dynamic 5-Round Interview Engine", fill="#047857", font=h3_font)
    rounds_pills = [
        "R1: Aptitude & CS MCQs",
        "R2: Tech Deep-Dive",
        "R3: Architecture Defense",
        "R4: Live Coding Sandbox",
        "R5: HR & Behavioral Fit"
    ]
    r_px = c2_x0 + 530
    r_py = diag_y + 88
    for r_idx, rp in enumerate(rounds_pills):
        if r_idx == 3:
            r_px = c2_x0 + 530
            r_py += 44
        draw_rounded_rect(draw, (r_px, r_py, r_px + 148, r_py + 36), 6, "#FFFFFF", outline="#34D399")
        draw.text((r_px + 8, r_py + 8), rp, fill="#065F46", font=get_font(size=12, bold=True))
        r_px += 156

    # Arrow Down from Pipeline to Dual AI & DNA Matrix
    draw_arrow(draw, (c2_x0 + 680, diag_y + 205), (c2_x0 + 680, diag_y + 245), color="#059669", width=3)

    # Node 4: Groq Ultra-Fast LPU
    draw_rounded_rect(draw, (c2_x0 + 45, diag_y + 250, c2_x0 + 345, diag_y + 372), 10, "#FEF3C7", outline="#D97706", width=2)
    draw.text((c2_x0 + 62, diag_y + 264), "Groq LPU (~680ms)", fill="#B45309", font=h3_font)
    draw.text((c2_x0 + 62, diag_y + 300), "• Sub-second question synthesis\n• Real-time Big-O code review\n• Gemini Flash auto-failover", fill="#334155", font=get_font(size=14.5))

    draw_arrow(draw, (c2_x0 + 345, diag_y + 311), (c2_x0 + 405, diag_y + 311), color="#D97706", width=3)

    # Node 5: Supabase Cloud Database
    draw_rounded_rect(draw, (c2_x0 + 405, diag_y + 250, c2_x0 + 610, diag_y + 372), 10, "#EFF6FF", outline="#3B82F6", width=2)
    draw.text((c2_x0 + 422, diag_y + 264), "Supabase DB", fill="#1D4ED8", font=h3_font)
    draw.text((c2_x0 + 422, diag_y + 300), "• Auth & Session Cookies\n• JSONB Transcripts\n• PostgreSQL RLS Security", fill="#334155", font=get_font(size=14.5))

    draw_arrow(draw, (c2_x0 + 610, diag_y + 311), (c2_x0 + 670, diag_y + 311), color="#3B82F6", width=3)

    # Node 6: Candidate DNA Card
    draw_rounded_rect(draw, (c2_x0 + 670, diag_y + 245, c2_x0 + 850, diag_y + 377), 10, "#D1FAE5", outline="#059669", width=2)
    draw.text((c2_x0 + 688, diag_y + 258), "Candidate DNA", fill="#047857", font=h3_font)
    draw.text((c2_x0 + 688, diag_y + 295), "• 5-Axis Radar Matrix\n• Hiring Verdict\n• TPO Placement Board", fill="#065F46", font=get_font(size=14.5))

    # Center Feature Blocks (4 Key Highlights)
    feat_y = col_top + 495
    draw.text((c2_x0 + 35, feat_y), "Key Workflow Highlights", fill="#0F172A", font=h3_font)

    highlights = [
        ("Smart PDF Parsing", "Instant AI skill extraction & project grounding from uploaded student resumes.", "#0284C7", "#E0F2FE"),
        ("5-Round Mock Suite", "Simulates realistic campus drives: MCQs, Architecture, Coding, and HR.", "#059669", "#ECFDF5"),
        ("Live Code Sandbox", "In-browser algorithmic evaluation measuring asymptotic Big-O complexity.", "#7E22CE", "#FAF5FF"),
        ("Candidate DNA Matrix", "Visualizes 5-dimensional candidate competency telemetry with hiring verdicts.", "#D97706", "#FFFBEB")
    ]
    hx = c2_x0 + 25
    for h_title, h_desc, b_col, bg_col in highlights:
        draw_rounded_rect(draw, (hx, feat_y + 38, hx + 205, feat_y + 345), 10, bg_col, outline=b_col, width=2)
        draw.text((hx + 14, feat_y + 54), h_title, fill=b_col, font=get_font(size=17, bold=True))
        
        wrapped_h = wrap_text(h_desc, get_font(size=15), max_width=175)
        hy = feat_y + 92
        for l in wrapped_h:
            draw.text((hx + 14, hy), l, fill="#334155", font=get_font(size=15))
            hy += 23
        hx += 222

    # Tech Stack Banner across bottom of Center Column
    stack_y = col_bottom - 135
    draw_rounded_rect(draw, (c2_x0 + 25, stack_y, c2_x1 - 25, col_bottom - 25), 10, "#FFFFFF", outline="#E2E8F0", width=1)
    draw.text((c2_x0 + 40, stack_y + 14), "Technology Stack:", fill="#0F172A", font=h3_font)

    badges = [
        ("Next.js 15 (React 19)", "#000000", "#F1F5F9"),
        ("TypeScript", "#2563EB", "#DBEAFE"),
        ("Tailwind CSS", "#0284C7", "#E0F2FE"),
        ("Supabase (PostgreSQL 15)", "#059669", "#ECFDF5"),
        ("Groq SDK (LPU Engine)", "#D97706", "#FEF3C7"),
        ("Google Gemini 3.5 Flash", "#7E22CE", "#FAF5FF"),
        ("Framer Motion", "#EC4899", "#FCE7F3")
    ]
    bx = c2_x0 + 40
    by = stack_y + 52
    for b_text, t_col, bg_col in badges:
        tb = badge_font.getbbox(b_text)
        bw = (tb[2] - tb[0]) + 20
        if bx + bw > c2_x1 - 40:
            bx = c2_x0 + 40
            by += 34
        draw_rounded_rect(draw, (bx, by, bx + bw, by + 28), 6, bg_col, outline=t_col, width=1)
        draw.text((bx + 10, by + 5), b_text, fill=t_col, font=badge_font)
        bx += bw + 12

    # -------------------------------------------------------------
    # Column 3: Right (Width: 645px)
    # -------------------------------------------------------------
    c3_x0, c3_x1 = 1690, w - 50

    # Section 4: Key Results & Performance (Top-Right)
    draw_rounded_rect(draw, (c3_x0, col_top, c3_x1, col_top + 460), 16, "#F8FAFC", outline="#CBD5E1", width=2)
    draw.text((c3_x0 + 30, col_top + 24), "4. KEY RESULTS & PERFORMANCE", fill="#0F172A", font=h2_font)

    # 4 Performance Metric Cards with Sparklines
    stats = [
        ("AI Inference Response Latency:", "~680 ms", "#059669", "#ECFDF5", [12.4, 9.8, 4.2, 1.8, 0.9, 0.68]),
        ("Test Suite Validation Compliance:", "14 / 14 (100%)", "#0284C7", "#E0F2FE", [4, 7, 10, 12, 14, 14]),
        ("Algorithmic Sandbox Accuracy:", "94.8%", "#7E22CE", "#FAF5FF", [78.2, 84.1, 88.5, 91.0, 94.8]),
        ("Failover Resiliency & Uptime:", "< 1.2 sec (Zero Downtime)", "#D97706", "#FEF3C7", [5.2, 3.4, 2.1, 1.5, 1.1])
    ]
    ry = col_top + 68
    for label, stat_val, color, bg_fill, spark_pts in stats:
        draw_rounded_rect(draw, (c3_x0 + 20, ry, c3_x1 - 20, ry + 86), 8, "#FFFFFF", outline="#E2E8F0", width=1)
        draw.text((c3_x0 + 35, ry + 10), label, fill="#475569", font=body_bold)
        draw.text((c3_x0 + 35, ry + 38), stat_val, fill=color, font=get_font(size=30, bold=True))
        
        # Draw sleek sparkline on the right side of the card
        draw_sparkline(draw, (c3_x1 - 160, ry + 22, c3_x1 - 35, ry + 72), spark_pts, line_color=color, fill_color=bg_fill)
        ry += 95

    # Section 5: GitHub Access & QR Code (Bottom-Right)
    qr_top = col_top + 480
    draw_rounded_rect(draw, (c3_x0, qr_top, c3_x1, col_bottom), 16, "#F8FAFC", outline="#CBD5E1", width=2)
    draw.text((c3_x0 + 30, qr_top + 20), "5. GITHUB ACCESS", fill="#0F172A", font=h2_font)
    draw.text((c3_x0 + 30, qr_top + 54), "Scan to View Code & Documentation on GitHub:", fill="#475569", font=body_font)

    # Real QR Code Generation
    qr_url = "https://github.com/anzarhasnat/YAT-AI-.git"
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=2,
    )
    qr.add_data(qr_url)
    qr.make(fit=True)
    qr_img = qr.make_image(fill_color="#0F172A", back_color="#FFFFFF").convert("RGB")

    # Resize QR code
    qr_size = 370
    qr_img = qr_img.resize((qr_size, qr_size), Image.Resampling.LANCZOS)
    qr_x = c3_x0 + (c3_x1 - c3_x0 - qr_size) // 2
    qr_y = qr_top + 90

    # White card frame behind QR
    draw_rounded_rect(draw, (qr_x - 12, qr_y - 12, qr_x + qr_size + 12, qr_y + qr_size + 12), 12, "#FFFFFF", outline="#CBD5E1", width=2)
    im.paste(qr_img, (qr_x, qr_y))

    # Repository link underneath QR
    draw_centered_link = "https://github.com/anzarhasnat/YAT-AI-.git"
    lk_bbox = body_bold.getbbox(draw_centered_link)
    lk_w = lk_bbox[2] - lk_bbox[0]
    draw.text((c3_x0 + (c3_x1 - c3_x0 - lk_w) // 2, qr_y + qr_size + 24), draw_centered_link, fill="#047857", font=body_bold)
    
    live_link = "Live Deployment: https://yat-ai.vercel.app"
    ll_bbox = body_font.getbbox(live_link)
    ll_w = ll_bbox[2] - ll_bbox[0]
    draw.text((c3_x0 + (c3_x1 - c3_x0 - ll_w) // 2, qr_y + qr_size + 52), live_link, fill="#475569", font=body_font)

    # Save Banner
    im.save(output_path, "PNG", quality=95)
    print(f"SUCCESS: Generated banner at {output_path} ({os.path.getsize(output_path)/1024:.2f} KB)")

if __name__ == "__main__":
    create_banner()
