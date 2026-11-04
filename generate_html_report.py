import os
import base64
import subprocess

# Load College Logo as Base64
logo_path = 'college_logo.jpg'
logo_b64 = ''
if os.path.exists(logo_path):
    with open(logo_path, 'rb') as f:
        logo_b64 = base64.b64encode(f.read()).decode('utf-8')

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>YAT AI - Project Report</title>
<style>
    @page {
        size: A4 portrait;
        margin: 20mm 18mm 20mm 20mm;
    }
    body {
        font-family: 'Times New Roman', Times, serif;
        font-size: 11pt;
        line-height: 1.5;
        color: #111;
        margin: 0;
        padding: 0;
    }
    h1, h2, h3, h4 {
        font-family: 'Times New Roman', Times, serif;
        color: #000;
        margin-top: 12px;
        margin-bottom: 8px;
    }
    h1 { font-size: 16pt; text-align: center; font-weight: bold; text-transform: uppercase; }
    h2 { font-size: 13pt; text-align: center; font-weight: bold; }
    h3 { font-size: 12pt; font-weight: bold; }
    h4 { font-size: 11pt; font-weight: bold; }
    p {
        margin-top: 6px;
        margin-bottom: 6px;
        text-align: justify;
    }
    .center { text-align: center; }
    .page {
        page-break-after: always;
        break-after: page;
        min-height: 250mm;
        position: relative;
        box-sizing: border-box;
        padding-bottom: 15mm;
    }
    .page:last-child {
        page-break-after: avoid;
        break-after: avoid;
    }
    .page-box {
        position: absolute;
        bottom: 5mm;
        right: 0mm;
        border: 1px solid #000;
        padding: 2px 8px;
        font-size: 10pt;
        font-weight: normal;
    }
    table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
        margin-bottom: 12px;
        font-size: 10pt;
    }
    table, th, td {
        border: 1px solid #444;
    }
    th {
        background-color: #f2f2f2;
        padding: 6px 8px;
        font-weight: bold;
        text-align: left;
    }
    td {
        padding: 5px 8px;
        vertical-align: top;
    }
    .signature-table td {
        height: 40px;
        vertical-align: top;
        font-size: 10.5pt;
    }
    .placeholder-box {
        border: 2px dashed #777;
        background-color: #f9fbfb;
        padding: 20px;
        text-align: center;
        margin: 14px 0;
        border-radius: 4px;
    }
    .placeholder-title {
        font-weight: bold;
        font-size: 10.5pt;
        color: #222;
    }
    .placeholder-desc {
        font-size: 9.5pt;
        color: #555;
        margin-top: 4px;
    }
    .code-box {
        background-color: #1e1e1e;
        color: #d4d4d4;
        font-family: 'Consolas', 'Courier New', monospace;
        font-size: 9pt;
        padding: 12px;
        border-radius: 4px;
        margin: 10px 0;
        white-space: pre-wrap;
    }
    .header-dept {
        color: #0b5394;
        font-weight: bold;
        font-size: 13pt;
        text-align: center;
        margin-bottom: 10px;
    }
    .logo-img {
        display: block;
        margin: 15px auto;
        max-width: 130px;
        height: auto;
    }
    .logo-img-small {
        display: block;
        margin: 8px auto;
        max-width: 90px;
        height: auto;
    }
    hr.dept-line {
        border: 0;
        border-top: 1.5px solid #000;
        margin: 10px 0 16px 0;
    }
    ul, ol {
        margin-top: 4px;
        margin-bottom: 6px;
        padding-left: 24px;
    }
    li {
        margin-bottom: 4px;
        text-align: justify;
    }
</style>
</head>
<body>

<!-- COVER PAGE -->
<div class="page" style="text-align: center; display: flex; flex-direction: column; justify-content: space-between;">
    <div>
        <h1 style="font-size: 18pt; margin-top: 25px; margin-bottom: 4px;">YAT AI – AI-Powered Mock Interview Platform</h1>
        <h2 style="font-size: 13pt; font-weight: bold; margin-bottom: 25px;">(Minor Project)</h2>

        <p class="center" style="font-size: 11pt; margin-bottom: 4px;">Project report submitted on the partial fulfilment of the requirements for the</p>
        <p class="center" style="font-size: 11pt; margin-bottom: 4px;">Degree of</p>
        <p class="center" style="font-size: 15pt; font-weight: bold; font-style: italic; margin-bottom: 4px;">Diploma</p>
        <p class="center" style="font-size: 12pt; font-style: italic; margin-bottom: 4px;">In</p>
        <p class="center" style="font-size: 15pt; font-weight: bold; font-style: italic; margin-bottom: 8px;">Computer Science and Engineering</p>
        <p class="center" style="font-size: 12pt; font-weight: bold; text-decoration: underline; margin-bottom: 25px;">Academic session: 2024-27</p>

        <p class="center" style="font-size: 11.5pt; font-style: italic; margin-bottom: 6px;">Submitted by:</p>
        <p class="center" style="font-size: 11pt; line-height: 1.4; margin-bottom: 2px;"><b>Anzar Hasnaat:</b> 2025-CSEL-605</p>
        <p class="center" style="font-size: 11pt; line-height: 1.4; margin-bottom: 2px;"><b>Dipanshu Kumar:</b> 25025-CSEL-401</p>
        <p class="center" style="font-size: 11pt; line-height: 1.4; margin-bottom: 2px;"><b>Roshan Kumar:</b> 2025-CSEL-603</p>
        <p class="center" style="font-size: 11pt; line-height: 1.4; margin-bottom: 25px;"><b>Chandan Kumar:</b> 2024-CSE-042</p>

        <p class="center" style="font-size: 12pt; font-weight: bold; font-style: italic; margin-bottom: 4px;">Under the supervision of</p>
        <p class="center" style="font-size: 12pt; font-weight: bold; margin-bottom: 2px;">Md Naiyer Hoda</p>
        <p class="center" style="font-size: 11pt; font-style: italic; margin-bottom: 25px;">Lecturer, Department of CSE</p>
    </div>

    <div>
        <img src="data:image/jpeg;base64,__LOGO_B64__" class="logo-img" alt="Government Polytechnic Muzaffarpur Logo">
        <p class="center" style="font-size: 12.5pt; font-weight: normal; margin-bottom: 2px;">Department of Computer Science and Engineering</p>
        <p class="center" style="font-size: 13.5pt; font-weight: bold; margin-bottom: 15px;">Government Polytechnic Muzaffarpur</p>
    </div>
</div>

<!-- PAGE 1: PROJECT COMPLETION CERTIFICATE -->
<div class="page">
    <p class="center" style="font-size: 13pt; margin-bottom: 2px;">Government Polytechnic Muzaffarpur</p>
    <p class="center" style="font-size: 11pt; margin-bottom: 8px;">Naya Tola, Technical Chowk, Muzaffarpur-842001</p>
    <div class="header-dept">Department of Computer Science and Engineering</div>

    <img src="data:image/jpeg;base64,__LOGO_B64__" class="logo-img-small" alt="College Logo">

    <h2 style="font-size: 13pt; text-decoration: underline; margin-top: 15px; margin-bottom: 20px;">PROJECT COMPLETION CERTIFICATE</h2>

    <p>This is to certify that the project entitled <b>"YAT AI – AI-POWERED MOCK INTERVIEW & CANDIDATE EVALUATION PLATFORM"</b> has been carried out by the following students of the Department of Computer Science & Engineering, Government Polytechnic Muzaffarpur, under my guidance and supervision.</p>

    <ol style="margin-top: 12px; margin-bottom: 16px;">
        <li><b>Anzar Hasnaat</b> – Roll No.: 2025-CSEL-605</li>
        <li><b>Dipanshu Kumar</b> – Roll No.: 25025-CSEL-401</li>
        <li><b>Roshan Kumar</b> – Roll No.: 2025-CSEL-603</li>
        <li><b>Chandan Kumar</b> – Roll No.: 2024-CSE-042</li>
    </ol>

    <p>The project work has been completed as part of the academic requirements for the <b>Diploma in Computer Science & Engineering</b>.</p>
    <p>The work presented in this report has been reviewed and is submitted for academic evaluation during the session <b>2024-27</b>.</p>

    <div style="margin-top: 40px;">
        <table class="signature-table">
            <tr>
                <th style="width: 50%;">Project Guide / Supervisor</th>
                <th style="width: 50%;">Head of Department</th>
            </tr>
            <tr>
                <td>
                    <b>Signature:</b> ___________________________<br><br>
                    <b>Name:</b> Md Naiyer Hoda<br>
                    <b>Designation:</b> Lecturer, CSE Dept.<br>
                    <b>Date:</b> ______________________________
                </td>
                <td>
                    <b>Signature:</b> ___________________________<br><br>
                    <b>Name:</b> ______________________________<br>
                    <b>Designation:</b> H.O.D., CSE Dept.<br>
                    <b>Date:</b> ______________________________
                </td>
            </tr>
        </table>
    </div>

    <div class="page-box">1</div>
</div>

<!-- PAGE 2: DECLARATION OF ORIGINALITY AND AI USAGE -->
<div class="page">
    <img src="data:image/jpeg;base64,__LOGO_B64__" class="logo-img-small" style="max-width: 65px; margin: 4px auto;" alt="College Logo">
    <p class="center" style="font-size: 12pt; font-weight: bold; margin-bottom: 2px;">GOVERNMENT POLYTECHNIC MUZAFFARPUR</p>
    <p class="center" style="font-size: 11pt; margin-bottom: 6px;">Department of Computer Science & Engineering</p>
    <hr class="dept-line">

    <h2 style="font-size: 12pt; text-decoration: underline; margin-bottom: 14px;">DECLARATION OF ORIGINALITY AND AI USAGE</h2>

    <h4>A. Declaration of Originality</h4>
    <p>We hereby declare that the project entitled <b>"YAT AI – AI-POWERED MOCK INTERVIEW & CANDIDATE EVALUATION PLATFORM"</b>, submitted to the Department of Computer Science & Engineering, Government Polytechnic Muzaffarpur, is the work carried out by our team under the guidance and supervision of our assigned project guide.</p>
    <p>We confirm that the information presented in this report is accurate to the best of our knowledge. All external resources, references and contributions have been appropriately acknowledged. We accept responsibility for the contents of this project report.</p>

    <h4>B. Declaration of AI Usage</h4>
    <p>AI-based tools were used as supporting resources during the development of this project and preparation of its documentation. These tools assisted with technical guidance, programming suggestions, debugging, architectural discussions and selected AI-assisted application functionalities.</p>
    <p>The tools used and their contributions are listed below:</p>

    <table>
        <tr>
            <th style="width: 30%;">AI tool</th>
            <th style="width: 70%;">Purpose and contribution</th>
        </tr>
        <tr>
            <td><b>Groq Cloud SDK</b></td>
            <td>High-throughput inference for dynamic interview questions, algorithmic code efficiency analysis, and real-time response evaluation.</td>
        </tr>
        <tr>
            <td><b>Google Gemini Flash</b></td>
            <td>Multi-modal PDF resume extraction, structured candidate skill profiling, and Candidate DNA report synthesis.</td>
        </tr>
        <tr>
            <td><b>Claude / Assistant</b></td>
            <td>Technical guidance, architectural consultations, Next.js App Router route debugging, and documentation formatting.</td>
        </tr>
    </table>

    <p>The project team reviewed and evaluated the suggestions and outputs generated by these tools and remains responsible for the final implementation and submitted work.</p>

    <h4>C. Team Declaration</h4>
    <p>We acknowledge that we have read and understood the above declaration and accept responsibility for our respective contributions to the project.</p>

    <table>
        <tr>
            <td style="width: 50%;"><b>1. Anzar Hasnaat:-</b> _____________________</td>
            <td style="width: 50%;"><b>2. Dipanshu Kumar:-</b> _____________________</td>
        </tr>
        <tr>
            <td><b>3. Roshan Kumar:-</b> _____________________</td>
            <td><b>4. Chandan Kumar:-</b> _____________________</td>
        </tr>
    </table>

    <p style="margin-top: 15px;"><b>Place:</b> Muzaffarpur, Bihar <span style="float: right;"><b>Date:</b> ____________________</span></p>

    <div class="page-box">2</div>
</div>

<!-- PAGE 3: ACKNOWLEDGEMENT -->
<div class="page">
    <img src="data:image/jpeg;base64,__LOGO_B64__" class="logo-img-small" style="max-width: 65px; margin: 4px auto;" alt="College Logo">
    <p class="center" style="font-size: 12pt; font-weight: bold; margin-bottom: 2px;">GOVERNMENT POLYTECHNIC MUZAFFARPUR</p>
    <p class="center" style="font-size: 11pt; margin-bottom: 6px;">Department of Computer Science & Engineering</p>
    <hr class="dept-line">

    <h2 style="font-size: 13pt; text-decoration: underline; margin-bottom: 18px;">ACKNOWLEDGEMENT</h2>

    <p>We would like to express our sincere gratitude to <b>Government Polytechnic Muzaffarpur</b>, Department of Computer Science & Engineering, for providing us with the opportunity, technical laboratory facilities and academic environment to undertake and complete our project entitled <b>"YAT AI – AI-POWERED MOCK INTERVIEW & CANDIDATE EVALUATION PLATFORM."</b></p>

    <p>We are deeply grateful to our project guide, <b>Md Naiyer Hoda</b>, for his valuable guidance, continuous support, encouragement and constructive suggestions throughout the development of this project. His insights and feedback helped us improve our understanding, overcome technical challenges and enhance the overall quality of our work.</p>

    <p>We would also like to extend our heartfelt gratitude to the <b>Head of the Department</b>, all the faculty members of the Computer Science & Engineering Department, and the <b>Principal of Government Polytechnic Muzaffarpur</b> for their encouragement, support and for providing us with the necessary academic resources and facilities.</p>

    <p>We would also like to thank our team members for their cooperation, dedication and collective efforts throughout the planning, development, implementation and documentation of this project. Finally, we express our sincere appreciation to our families and everyone who directly or indirectly supported and encouraged us during the completion of this project.</p>

    <p>Thank you to everyone who contributed to making this project a meaningful learning experience.</p>

    <p style="margin-top: 40px; line-height: 1.6;">
        <b>Submitted by:</b><br>
        Anzar Hasnaat<br>
        Dipanshu Kumar<br>
        Roshan Kumar<br>
        Chandan Kumar
    </p>

    <div class="page-box">3</div>
</div>

<!-- PAGE 4: ABSTRACT -->
<div class="page">
    <img src="data:image/jpeg;base64,__LOGO_B64__" class="logo-img-small" style="max-width: 65px; margin: 4px auto;" alt="College Logo">
    <p class="center" style="font-size: 12pt; font-weight: bold; margin-bottom: 2px;">GOVERNMENT POLYTECHNIC MUZAFFARPUR</p>
    <p class="center" style="font-size: 11pt; margin-bottom: 6px;">Department of Computer Science & Engineering</p>
    <hr class="dept-line">

    <h2 style="font-size: 13pt; text-decoration: underline; margin-bottom: 12px;">ABSTRACT</h2>
    <p class="center" style="font-weight: bold; margin-bottom: 16px;">YAT AI – AI-POWERED MOCK INTERVIEW & CANDIDATE EVALUATION PLATFORM</p>

    <p>Technical placement examinations and recruitment interviews are pivotal milestones for diploma and engineering students. However, students frequently face difficulties evaluating their practical readiness because conventional preparation methods rely on static question banks, unassisted self-study, or disjointed coding websites. Students rarely receive real-time, constructive feedback on their technical problem-solving logic, code efficiency, or resume project explanations. This creates a critical need for an intelligent, accessible, and automated platform that provides realistic mock evaluations.</p>

    <p><b>YAT AI – AI-Powered Mock Interview Platform</b> is a web-based application developed to provide students with a comprehensive, centralized environment for practicing, analyzing, and mastering technical recruitment interviews. The system allows authenticated users to upload their PDF resume, which is parsed by AI to extract skills, frameworks, and projects. Based on this profile, YAT AI conducts a dynamic 5-round technical evaluation covering: (1) Core CS Fundamentals & MCQs, (2) Deep-Dive Technical Inquiry, (3) System Design & Architecture, (4) Live Algorithmic Coding Challenge, and (5) Behavioral & HR Evaluation.</p>

    <p>Following the interview, the platform generates a comprehensive <b>Candidate DNA Report</b> that visualizes performance across multi-dimensional competency vectors (Logic, Algorithmic Efficiency, System Architecture, Core CS Depth, and Communication). The application also supports Training and Placement Officer (TPO) placement drives and job-specific practice rooms.</p>

    <p>The application is developed using modern web technologies, including <b>Next.js 15 (React 19)</b>, <b>TypeScript</b>, <b>Tailwind CSS</b>, and <b>Framer Motion</b> with a premium Glassy Emerald UI. <b>Supabase (PostgreSQL)</b> is used for database operations and authentication with Row-Level Security (RLS), while <b>Groq SDK</b> and <b>Google Gemini Flash</b> provide high-throughput AI services with automated failover.</p>

    <p>The project demonstrates the development of an integrated assessment platform that combines real-time AI evaluation, resume intelligence, and performance telemetry within a unified web application.</p>

    <div class="page-box">4</div>
</div>

<!-- PAGE 5: TABLE OF CONTENTS -->
<div class="page">
    <h2 style="font-size: 15pt; text-decoration: underline; margin-bottom: 16px;">Table of Contents</h2>

    <table>
        <tr>
            <th style="width: 12%;">S.No.</th>
            <th style="width: 73%;">Contents</th>
            <th style="width: 15%; text-align: center;">Page No.</th>
        </tr>
        <tr><td colspan="3" style="background-color: #f7f7f7; font-weight: bold;">PRELIMINARY PAGES</td></tr>
        <tr><td>1.</td><td>Certificate</td><td class="center">1</td></tr>
        <tr><td>2.</td><td>Declaration of Originality and AI Usage</td><td class="center">2</td></tr>
        <tr><td>3.</td><td>Acknowledgement</td><td class="center">3</td></tr>
        <tr><td>4.</td><td>Abstract</td><td class="center">4</td></tr>
        <tr><td>5.</td><td>Table of Contents</td><td class="center">5</td></tr>
        <tr><td colspan="3" style="background-color: #f7f7f7; font-weight: bold;">CHAPTER 1 - INTRODUCTION</td></tr>
        <tr><td>1.1</td><td>Project Overview</td><td class="center">7</td></tr>
        <tr><td>1.2</td><td>Problem Statement</td><td class="center">8</td></tr>
        <tr><td>1.3</td><td>Objectives of the Project</td><td class="center">9</td></tr>
        <tr><td>1.4</td><td>Scope of the project</td><td class="center">10</td></tr>
        <tr><td colspan="3" style="background-color: #f7f7f7; font-weight: bold;">CHAPTER 2 – BACKGROUND</td></tr>
        <tr><td>2.1</td><td>Background of the problem</td><td class="center">11</td></tr>
        <tr><td>2.2</td><td>Why the Project Was Chosen</td><td class="center">12</td></tr>
        <tr><td>2.3</td><td>Existing Solutions</td><td class="center">13</td></tr>
        <tr><td>2.4</td><td>Proposed Solution</td><td class="center">16</td></tr>
        <tr><td colspan="3" style="background-color: #f7f7f7; font-weight: bold;">CHAPTER 3 – IMPLEMENTATION OF THE PROJECT</td></tr>
        <tr><td>3.1</td><td>Technologies and tools used</td><td class="center">18</td></tr>
        <tr><td>3.2</td><td>System Design / Architecture</td><td class="center">21</td></tr>
        <tr><td>3.3</td><td>Methodology and Development Process</td><td class="center">23</td></tr>
        <tr><td>3.4</td><td>Front-End Implementation with Screenshot</td><td class="center">24</td></tr>
        <tr><td>3.5</td><td>Back-End Implementation with screenshot</td><td class="center">28</td></tr>
        <tr><td>3.6</td><td>Database Design and Screenshot</td><td class="center">33</td></tr>
        <tr><td>3.7</td><td>Testing and results</td><td class="center">37</td></tr>
        <tr><td colspan="3" style="background-color: #f7f7f7; font-weight: bold;">CHAPTER 4 – PROJECT PROGRESS AND GUIDES FEEDBACK</td></tr>
        <tr><td>4.1</td><td>Progress Report 1 (Day 1-15)</td><td class="center">40</td></tr>
        <tr><td>4.2</td><td>Progress Report 2 (Day 16-30)</td><td class="center">41</td></tr>
        <tr><td>4.3</td><td>Progress Report 3 (Day 31-45)</td><td class="center">42</td></tr>
        <tr><td>4.4</td><td>Additional Progress Reports (Day 46-60)</td><td class="center">43</td></tr>
        <tr><td>4.5</td><td>Summary of major Improvements Based on Guides Feedback</td><td class="center">44</td></tr>
        <tr><td colspan="3" style="background-color: #f7f7f7; font-weight: bold;">CHAPTER 5 – CONCLUSION AND FUTURE WORK</td></tr>
        <tr><td>5.1</td><td>Conclusion</td><td class="center">45</td></tr>
        <tr><td>5.2</td><td>Limitations of the project</td><td class="center">46</td></tr>
        <tr><td>5.3</td><td>Future Scope / Future Work</td><td class="center">47</td></tr>
        <tr><td colspan="3" style="background-color: #f7f7f7; font-weight: bold;">REFERENCES</td></tr>
        <tr><td></td><td>References</td><td class="center">48</td></tr>
        <tr><td colspan="3" style="background-color: #f7f7f7; font-weight: bold;">APPENDIX</td></tr>
        <tr><td>A.</td><td>Github Repository Link</td><td class="center">49</td></tr>
        <tr><td>B.</td><td>Additional Project Screenshots</td><td class="center">50</td></tr>
        <tr><td>C.</td><td>Supporting Documents & Core Code</td><td class="center">52</td></tr>
        <tr><td>D.</td><td>Other Relevant Technical Details & Database Schema</td><td class="center">54</td></tr>
    </table>

    <div class="page-box">5</div>
</div>

<!-- PAGE 6: SECTION SEPARATOR -->
<div class="page">
    <div style="height: 400px; display: flex; align-items: center; justify-content: center; text-align: center;">
        <div>
            <h1 style="font-size: 20pt; letter-spacing: 2px;">PROJECT REPORT</h1>
            <p style="font-size: 13pt; color: #444; margin-top: 10px;">YAT AI – AI-POWERED MOCK INTERVIEW PLATFORM</p>
            <p style="font-size: 11pt; color: #777;">Department of Computer Science & Engineering<br>Government Polytechnic Muzaffarpur</p>
        </div>
    </div>
    <div class="page-box">6</div>
</div>

<!-- PAGE 7: CHAPTER 1 - INTRODUCTION -->
<div class="page">
    <h1 style="margin-bottom: 2px;">CHAPTER 1</h1>
    <h2 style="margin-bottom: 20px;">INTRODUCTION</h2>

    <h3>1.1 Project Overview</h3>
    <p><b>YAT AI</b> is an intelligent, AI-powered mock interview and technical evaluation platform developed to provide students with a comprehensive, realistic, and accessible environment for practicing and mastering technical job interviews. The project focuses on bridging the gap between theoretical classroom learning and the rigorous standards of campus placements and industry recruitment.</p>

    <p>In modern computer science and engineering education, candidates are evaluated across a diverse range of competencies, including core theoretical concepts, real-time algorithmic problem solving, project architecture defense, and behavioral communication. However, students frequently face difficulties assessing their practical interview readiness because conventional preparation relies on static multiple-choice questions or unassisted self-study.</p>

    <p>YAT AI addresses this challenge by providing a dedicated technical recruitment platform where students can experience multi-round interview simulations. The application incorporates automated PDF resume parsing, interactive 5-round evaluations, live code analysis, and a multidimensional <b>Candidate DNA Matrix</b> that diagnoses strengths and areas for improvement.</p>

    <p>The project is developed using modern web technologies and follows a structured full-stack architecture that integrates Next.js 15, TypeScript, Tailwind CSS, Supabase PostgreSQL, and advanced AI services including Groq Cloud SDK and Google Gemini Flash. Through this approach, YAT AI provides students with a unified and accessible environment for accelerating career readiness.</p>

    <div class="page-box">7</div>
</div>

<!-- PAGE 8: 1.2 PROBLEM STATEMENT -->
<div class="page">
    <h3>1.2 Problem Statement</h3>
    <p>Students preparing for campus placements and technical evaluations encounter significant friction due to the scattered and static nature of available preparation tools:</p>

    <ul>
        <li><b>Fragmented Preparation Environments:</b> Students commonly switch between multiple disjointed websites—solving coding puzzles on one platform, reviewing theoretical computer science notes on another, and practicing communication with peers who lack objective scoring standards.</li>
        <li><b>Generic, Non-Personalized Inquiries:</b> Standard practice tests rely on fixed question banks that fail to tailor inquiries to the candidate's actual projects, declared technical skills, or target engineering roles.</li>
        <li><b>Absence of Diagnostic Feedback:</b> Traditional quiz applications output a simple total score or percentage, without providing actionable explanations of why an architectural choice was suboptimal or how code efficiency can be improved.</li>
        <li><b>Scalability Constraints in Educational Institutions:</b> Conducting mock interviews manually requires significant faculty time and resources. In polytechnic colleges with hundreds of candidates, professors cannot conduct repeated individual 45-minute interviews for every student.</li>
    </ul>

    <p>Therefore, there is an urgent need for a centralized, intelligent mock interview platform that automates multi-round evaluations, analyzes candidate code in real time, and provides personalized diagnostic feedback based on individual student resumes.</p>

    <div class="placeholder-box">
        <div class="placeholder-title">[ SCREENSHOT / DIAGRAM PLACEHOLDER: Figure 1.1 - The Placement Preparation Bottleneck ]</div>
        <div class="placeholder-desc">Space for diagram showing fragmented preparation vs. YAT AI unified evaluation workflow</div>
    </div>

    <div class="page-box">8</div>
</div>

<!-- PAGE 9: 1.3 OBJECTIVES OF THE PROJECT -->
<div class="page">
    <h3>1.3 Objectives of the Project</h3>
    <p>The primary objective of the YAT AI project is to develop an intelligent, automated, and user-friendly mock interview platform that helps diploma and engineering students prepare for technical recruitments through interactive, profile-grounded evaluations.</p>

    <p>The specific objectives of the project are as follows:</p>
    <ol>
        <li>To develop a centralized, full-stack web application for conducting multi-round technical and behavioral interviews.</li>
        <li>To implement secure user registration, session management, and role-based profiles using Supabase Authentication.</li>
        <li>To build an automated PDF resume parsing engine that extracts candidate skills, technical experience, and projects to personalize interview questions.</li>
        <li>To structure a realistic 5-round evaluation pipeline covering MCQs, Technical Deep-Dive, System Architecture, Live Algorithmic Coding, and Behavioral fit.</li>
        <li>To integrate high-throughput AI inference gateways (Groq Cloud SDK and Google Gemini Flash) with a resilient sequential fallback mechanism.</li>
        <li>To provide real-time code execution and complexity analysis, assessing submitted algorithms for time and space efficiency.</li>
        <li>To calculate and visualize a <b>Candidate DNA Matrix</b> that tracks multi-dimensional competencies across five performance vectors.</li>
        <li>To develop a Training and Placement Officer (TPO) management portal for scheduling campus drives, enrolling candidates, and viewing comparative rankings.</li>
        <li>To design a premium, responsive <b>Glassy Emerald UI</b> using Tailwind CSS and Framer Motion for desktop and mobile accessibility.</li>
        <li>To enforce enterprise-grade data security through PostgreSQL Row-Level Security (RLS) policies.</li>
    </ol>

    <div class="page-box">9</div>
</div>

<!-- PAGE 10: 1.4 SCOPE OF THE PROJECT -->
<div class="page">
    <h3>1.4 Scope of the Project</h3>
    <p>The scope of the YAT AI project covers the development of an intelligent, web-based mock evaluation platform focused on technical recruitment practice and performance analytics.</p>

    <p>The major functional areas covered by the project include:</p>
    <ul>
        <li><b>User Authentication and Profile Management:</b> Enables students to create accounts, configure their academic details (branch, roll number, college), and manage their profiles securely.</li>
        <li><b>Resume Upload and Analysis:</b> Supports uploading PDF resumes with automatic parsing into structured JSON profiles.</li>
        <li><b>Dynamic 5-Round Interview Engine:</b>
            <ul>
                <li><i>Round 1:</i> Core Computer Science Fundamentals & Technical MCQs.</li>
                <li><i>Round 2:</i> Technical Deep-Dive based on candidate resume projects.</li>
                <li><i>Round 3:</i> System Architecture and Scalability Design.</li>
                <li><i>Round 4:</i> Live Algorithmic Coding Challenge with Complexity Review.</li>
                <li><i>Round 5:</i> Behavioral, Situational, and HR Assessment.</li>
            </ul>
        </li>
        <li><b>Performance Analytics & Telemetry:</b> Generates detailed scorecards, answer transcripts, and radar visualizers for student self-assessment.</li>
        <li><b>Campus Placement Drive Integration:</b> Facilitates drive scheduling and candidate rankings for college placement cells.</li>
    </ul>

    <p><i>Out-of-Scope Boundaries:</i> Native mobile operating system binaries (iOS/Android), real-time video proctoring with eye-tracking, and full-duplex voice streaming are reserved for future development milestones.</p>

    <div class="page-box">10</div>
</div>

<!-- PAGE 11: CHAPTER 2 - BACKGROUND -->
<div class="page">
    <h1 style="margin-bottom: 2px;">CHAPTER 2</h1>
    <h2 style="margin-bottom: 20px;">BACKGROUND</h2>

    <h3>2.1 Background of the Problem</h3>
    <p>The transition from academic diploma coursework to professional software engineering employment has historically presented a steep challenge for students. While academic curricula provide vital theoretical foundations in programming languages, data structures, and database management, competitive placement drives evaluate real-time problem-solving agility, practical system design, and clear articulation under evaluation constraints.</p>

    <p>Traditionally, students prepare for technical assessments using:</p>
    <ul>
        <li><b>Static Textbooks and Question Compendiums:</b> Memorizing answers to standard questions without interactive challenge or personalized follow-ups.</li>
        <li><b>Algorithmic Practice Websites:</b> Solving standalone puzzles that grade code solely on test cases while completely neglecting verbal defense, architectural trade-offs, and communication.</li>
        <li><b>Informal Peer Mocks:</b> Conducting mock interviews with classmates who often lack standardized rubrics, industry experience, or objective benchmarks.</li>
    </ul>

    <p>These limitations highlight the necessity of an automated, objective evaluation platform that combines dynamic questioning, resume grounding, and real-time analytical feedback within a single cohesive system.</p>

    <div class="page-box">11</div>
</div>

<!-- PAGE 12: 2.2 WHY THE PROJECT WAS CHOSEN -->
<div class="page">
    <h3>2.2 Why the Project Was Chosen</h3>
    <p>The YAT AI project was chosen after identifying the substantial hurdles faced by diploma students in preparing for technical placements. The project offered a valuable opportunity to develop a practical software system that directly solves an immediate academic and career challenge.</p>

    <p>The primary factors influencing the selection of this project include:</p>
    <ol>
        <li><b>Direct Educational Impact:</b> Addressing the real-world anxiety and lack of preparation tools experienced by diploma students facing competitive hiring drives.</li>
        <li><b>Application of Technical Curriculum:</b> Implementing concepts learned during the Diploma in Computer Science & Engineering, including full-stack web development, database normalization, asynchronous API communication, and cloud deployment.</li>
        <li><b>Cutting-Edge AI Integration:</b> Gaining practical engineering experience in prompt engineering, structured JSON extraction, LLM latency optimization, and fault-tolerant API failover.</li>
        <li><b>Enterprise Architecture Design:</b> Designing a scalable 4-tier application incorporating PostgreSQL Row-Level Security, modern UI/UX design tokens, and serverless edge functions.</li>
        <li><b>Comprehensive Software Lifecycle:</b> Understanding the complete software development lifecycle from initial requirement analysis to live cloud production hosting on Vercel.</li>
    </ol>

    <div class="page-box">12</div>
</div>

<!-- PAGE 13: 2.3 EXISTING SOLUTIONS -->
<div class="page">
    <h3>2.3 Existing Solutions</h3>
    <p>Several software applications exist for coding practice, interview preparation, and AI assistance. The project team studied these solutions to evaluate their capabilities and identify the specific niche for YAT AI.</p>

    <h4>2.3.1 LeetCode & HackerRank</h4>
    <p>LeetCode and HackerRank are popular online coding platforms that host extensive libraries of algorithmic puzzles. They provide automated code execution against unit test suites and rank submissions by runtime and memory consumption.</p>
    <p><i>Limitations:</i> These platforms focus strictly on algorithmic syntax. They do not simulate conversational interview rounds, evaluate candidate project architecture, assess resume authenticity, or analyze behavioral communication.</p>
    <p><b>Official Website:</b> https://leetcode.com/</p>

    <h4>2.3.2 Pramp & Interviewing.io</h4>
    <p>Pramp and Interviewing.io provide peer-to-peer and mentor-led mock interviews. They match candidates for live technical coding sessions over video and shared code editors.</p>
    <p><i>Limitations:</i> These services suffer from scheduling bottlenecks, high subscription fees, and limited mentor availability for diploma students in regional technical colleges.</p>
    <p><b>Official Website:</b> https://www.pramp.com/</p>

    <div class="page-box">13</div>
</div>

<!-- PAGE 14: EXISTING SOLUTIONS CONTINUED -->
<div class="page">
    <h4>2.3.3 Standard AI Chatbots (ChatGPT / Claude)</h4>
    <p>General-purpose conversational AI chatbots can be manually prompted to simulate an interview conversation by acting as a hiring manager.</p>
    <p><i>Limitations:</i> General chatbots lack structured 5-round progression, automated PDF resume ingestion, embedded coding sandboxes, persistent database score tracking, and institutional TPO placement drive workflows.</p>

    <h4>2.3.4 Comparative Analysis of Existing Solutions</h4>
    <p>The following table provides a comprehensive feature comparison between existing market solutions and YAT AI:</p>

    <table>
        <tr>
            <th>Feature / Capability</th>
            <th>LeetCode</th>
            <th>Pramp</th>
            <th>ChatGPT</th>
            <th>YAT AI</th>
        </tr>
        <tr>
            <td><b>Interactive 5-Round Flow</b></td>
            <td>No</td>
            <td>Manual</td>
            <td>Manual Prompt</td>
            <td><b>Automated 5-Round</b></td>
        </tr>
        <tr>
            <td><b>PDF Resume Parsing</b></td>
            <td>No</td>
            <td>No</td>
            <td>Limited</td>
            <td><b>Automated Groq/Gemini</b></td>
        </tr>
        <tr>
            <td><b>Algorithmic Code Sandbox</b></td>
            <td>Yes</td>
            <td>Yes</td>
            <td>No</td>
            <td><b>Integrated Editor</b></td>
        </tr>
        <tr>
            <td><b>Candidate DNA Telemetry</b></td>
            <td>No</td>
            <td>Subjective</td>
            <td>Text Only</td>
            <td><b>5-Axis Radar Matrix</b></td>
        </tr>
        <tr>
            <td><b>Cloud Database Persistence</b></td>
            <td>Yes</td>
            <td>Yes</td>
            <td>Session Only</td>
            <td><b>Supabase PostgreSQL</b></td>
        </tr>
        <tr>
            <td><b>Placement Drive Module</b></td>
            <td>No</td>
            <td>No</td>
            <td>No</td>
            <td><b>TPO Drive Portal</b></td>
        </tr>
        <tr>
            <td><b>Accessibility & Cost</b></td>
            <td>Freemium</td>
            <td>Paid</td>
            <td>Subscription</td>
            <td><b>Free & Open Access</b></td>
        </tr>
    </table>

    <div class="page-box">14</div>
</div>

<!-- PAGE 15: 2.3.6 IDENTIFIED GAP & OPPORTUNITY -->
<div class="page">
    <h4>2.3.6 Identified Gap and Project Opportunity</h4>
    <p>The comparative analysis demonstrates that existing tools cater to isolated components of interview preparation: LeetCode handles code syntax, Pramp handles peer matching, and ChatGPT handles open-ended text. However, students must juggle multiple disconnected tools without an integrated, objective feedback loop.</p>

    <p>The project opportunity identified by the team is to engineer a unified, automated technical evaluation platform tailored specifically for engineering candidates. YAT AI bridges these fragmented tools by combining resume analysis, multi-round technical evaluations, live coding feedback, and telemetry reports within a single web application.</p>

    <div class="placeholder-box">
        <div class="placeholder-title">[ SCREENSHOT / DIAGRAM PLACEHOLDER: Figure 2.1 - The YAT AI Unified Evaluation Ecosystem ]</div>
        <div class="placeholder-desc">Space for diagram contrasting disconnected preparation vs. YAT AI unified architecture</div>
    </div>

    <div class="page-box">15</div>
</div>

<!-- PAGE 16: 2.4 PROPOSED SOLUTION -->
<div class="page">
    <h3>2.4 Proposed Solution</h3>
    <p>To resolve the challenges of fragmented preparation, the project proposes <b>YAT AI</b>, a full-stack, AI-driven mock interview and candidate assessment platform.</p>

    <p>The proposed platform combines several tightly integrated core capabilities:</p>
    <ul>
        <li><b>User Authentication & Profile Setup:</b> Managed via Supabase Auth, supporting Google OAuth 2.0 and email/password authentication.</li>
        <li><b>Smart PDF Resume Intelligence:</b> Extracts candidate skills, frameworks, and academic project titles to formulate dynamically tailored interview questions.</li>
        <li><b>5-Round Progressive Interview Suite:</b>
            <ol>
                <li><i>Round 1 (Core CS MCQs):</i> Tests foundational computer science principles.</li>
                <li><i>Round 2 (Technical Deep-Dive):</i> Challenges candidate claims made in their resume.</li>
                <li><i>Round 3 (System Architecture):</i> Evaluates architectural reasoning and database design.</li>
                <li><i>Round 4 (Algorithmic Coding):</i> Analyzes submitted code for correctness and asymptotic complexity.</li>
                <li><i>Round 5 (Behavioral & HR):</i> Measures cultural fit, communication, and conflict resolution.</li>
            </ol>
        </li>
        <li><b>Automated Candidate DNA Report:</b> Synthesizes evaluation transcripts into an objective radar chart across 5 core competency vectors.</li>
        <li><b>Institutional Placement Drives:</b> Enables TPOs to coordinate on-campus recruitment assessments and view student performance rankings.</li>
    </ul>

    <div class="page-box">16</div>
</div>

<!-- PAGE 17: EXPECTED BENEFITS -->
<div class="page">
    <h4>2.4.7 Expected Benefits</h4>
    <p>The proposed YAT AI system delivers major academic and practical benefits:</p>
    <ul>
        <li><b>Centralized Preparation:</b> Eliminates the need to switch between disjointed study resources.</li>
        <li><b>Personalized Evaluation:</b> Dynamically adapts questions based on the candidate's unique resume rather than generic test banks.</li>
        <li><b>Diagnostic Actionability:</b> The Candidate DNA Matrix pinpoints exact technical gaps, allowing candidates to strengthen weak knowledge areas prior to live campus recruitments.</li>
        <li><b>High-Throughput & Zero Cost:</b> Runs on high-speed open-weight models (Groq Cloud) with resilient Google Gemini failover, keeping the platform accessible to every student.</li>
        <li><b>Institutional Scalability:</b> Empowers polytechnic placement cells to conduct standardized preliminary screening tests for hundreds of candidates simultaneously.</li>
    </ul>

    <div class="placeholder-box">
        <div class="placeholder-title">[ SCREENSHOT / GRAPHIC PLACEHOLDER: Figure 2.2 - Expected Benefits & Student Journey Flow ]</div>
        <div class="placeholder-desc">Space for diagram showing student journey from resume upload to final DNA report</div>
    </div>

    <div class="page-box">17</div>
</div>

<!-- PAGE 18: CHAPTER 3 - IMPLEMENTATION -->
<div class="page">
    <h1 style="margin-bottom: 2px;">CHAPTER 3</h1>
    <h2 style="margin-bottom: 20px;">IMPLEMENTATION OF THE PROJECT</h2>

    <h3>3.1 Technologies and Tools Used</h3>
    <p>The development of YAT AI involves modern, production-grade web technologies, frameworks, libraries, and cloud services. The technology stack was chosen to guarantee type safety, high execution speed, maintainable modular code, and cloud scalability.</p>

    <h4>3.1.1 Frontend Technologies</h4>
    <ul>
        <li><b>Next.js 15 (React 19):</b> Full-stack framework utilizing React Server Components, server actions, dynamic routing, and fast edge rendering.</li>
        <li><b>TypeScript:</b> Introduces static typing across client components and backend APIs, catching type mismatches during development.</li>
        <li><b>Tailwind CSS:</b> Utility-first styling framework used to engineer the signature <b>Glassy Emerald</b> design system with frosted-glass backdrops (`backdrop-blur-md`), glowing borders, and dark-mode styling.</li>
        <li><b>Framer Motion:</b> Declarative animation library powering smooth page transitions, progress bars, interactive modal dialogs, and SVG radar charts.</li>
    </ul>

    <div class="page-box">18</div>
</div>

<!-- PAGE 19: BACKEND & DATABASE TECHNOLOGIES -->
<div class="page">
    <h4>3.1.2 Backend Technologies</h4>
    <ul>
        <li><b>Next.js Route Handlers (App Router API):</b> Server-side TypeScript endpoints handling interview step transitions, prompt assembly, and response validation.</li>
        <li><b>Groq Cloud SDK:</b> High-throughput inference gateway running ultra-fast open-weight models (<code>qwen/qwen3.8-27b</code>, <code>openai/gpt-oss-120b</code>).</li>
        <li><b>Google Gemini Flash API:</b> Multimodal LLM endpoint used for high-context resume text extraction and Candidate DNA synthesis.</li>
        <li><b>Resilient Failover Engine:</b> Custom sequential model retry mechanism that seamlessly reroutes API calls during rate limits or model unavailability.</li>
    </ul>

    <h4>3.1.3 Database and Cloud Storage</h4>
    <ul>
        <li><b>Supabase (PostgreSQL 15):</b> Cloud relational database storing user profiles, interview sessions, transcripts, job postings, and campus drives.</li>
        <li><b>Supabase Auth:</b> Authentication service providing Google OAuth 2.0 and JWT session management.</li>
        <li><b>Row-Level Security (RLS):</b> Database-level policies ensuring authenticated candidates can only read and write their own interview records.</li>
        <li><b>Supabase Cloud Storage:</b> Secure bucket for storing uploaded candidate PDF resumes.</li>
    </ul>

    <div class="page-box">19</div>
</div>

<!-- PAGE 20: SUMMARY OF TECHNOLOGIES TABLE -->
<div class="page">
    <h4>3.1.7 Summary of Technologies</h4>
    <p>The complete technology stack utilized in the YAT AI platform is summarized in the table below:</p>

    <table>
        <tr>
            <th style="width: 30%;">Technology / Tool</th>
            <th style="width: 70%;">Purpose in YAT AI</th>
        </tr>
        <tr><td>Next.js 15</td><td>Full-stack web application framework with App Router</td></tr>
        <tr><td>React 19</td><td>Component-based user interface rendering</td></tr>
        <tr><td>TypeScript</td><td>Static type safety across API routes and client state</td></tr>
        <tr><td>Tailwind CSS</td><td>Glassy Emerald interface styling and responsive layouts</td></tr>
        <tr><td>Framer Motion</td><td>Smooth animations, radar graphs, and progress indicators</td></tr>
        <tr><td>Groq Cloud SDK</td><td>Ultra-fast LLM inference gateway (Qwen 3.8 / GPT-OSS)</td></tr>
        <tr><td>Google Gemini Flash</td><td>PDF resume text extraction and DNA report generation</td></tr>
        <tr><td>Supabase PostgreSQL</td><td>Relational cloud database for profiles, rounds, and drives</td></tr>
        <tr><td>Supabase Auth</td><td>Google OAuth and email/password session handling</td></tr>
        <tr><td>Vercel</td><td>Global edge cloud hosting and CI/CD deployment</td></tr>
        <tr><td>Visual Studio Code</td><td>Source code development environment</td></tr>
        <tr><td>Git & GitHub</td><td>Distributed version control and team repository</td></tr>
    </table>

    <div class="page-box">20</div>
</div>

<!-- PAGE 21: 3.2 SYSTEM DESIGN / ARCHITECTURE -->
<div class="page">
    <h3>3.2 System Design / Architecture</h3>
    <p>System architecture describes the organization of the major software components and explains how they communicate to perform required operations. YAT AI follows a decoupled 4-tier full-stack architecture:</p>

    <h4>3.2.1 Presentation Layer</h4>
    <p>The presentation layer delivers the user interface through which candidates interact with the platform. Built using Next.js 15, React 19, and Tailwind CSS, this layer renders the authentication views, student dashboard, resume upload zone, 5-round interactive interview rooms, and Candidate DNA radar visualizers.</p>

    <h4>3.2.2 Application & Business Logic Layer</h4>
    <p>The server route handlers process application requests, validate incoming payloads, verify authentication tokens, construct system prompts, and coordinate operations between the AI gateway and the database.</p>

    <h4>3.2.3 AI Inference & Failover Layer</h4>
    <p>This layer interfaces with Groq Cloud and Google Gemini Flash APIs. It handles strict JSON schema enforcement, token truncation guards, latency optimization, and automated model failover.</p>

    <h4>3.2.4 Data Management & Persistence Layer</h4>
    <p>Supabase PostgreSQL maintains relational tables for candidate profiles, interview transcripts, and placement drives, protected by Row-Level Security policies.</p>

    <div class="page-box">21</div>
</div>

<!-- PAGE 22: ARCHITECTURE DIAGRAM -->
<div class="page">
    <h4>3.2.7 Overall System Architecture</h4>
    <p>The diagram below illustrates the logical interaction between the candidate, presentation layer, server route handlers, AI inference gateways, and Supabase cloud storage:</p>

    <div class="placeholder-box" style="padding: 40px 20px;">
        <div class="placeholder-title">[ SCREENSHOT / DIAGRAM PLACEHOLDER: Figure 3.1 - YAT AI System Architecture ]</div>
        <div class="placeholder-desc">Space for high-level 4-tier architectural block diagram showing Next.js -> Groq/Gemini -> Supabase DB</div>
    </div>

    <div class="placeholder-box" style="padding: 40px 20px;">
        <div class="placeholder-title">[ SCREENSHOT / DIAGRAM PLACEHOLDER: Figure 3.2 - 5-Round Interview Pipeline Flowchart ]</div>
        <div class="placeholder-desc">Space for flowchart illustrating candidate progression from Round 1 through Round 5</div>
    </div>

    <div class="page-box">22</div>
</div>

<!-- PAGE 23: 3.3 METHODOLOGY & DEVELOPMENT PROCESS -->
<div class="page">
    <h3>3.3 Methodology and Development Process</h3>
    <p>The development of YAT AI followed an <b>Agile Iterative Development Process</b>. The software was engineered in progressive stages, allowing individual modules to be implemented, tested, and refined based on feedback from our guide, <b>Md Naiyer Hoda</b>.</p>

    <ol>
        <li><b>Requirement Analysis & Architecture Planning:</b> Identified placement preparation challenges, formulated project scope, and designed database schemas.</li>
        <li><b>Technology Selection:</b> Selected Next.js 15, TypeScript, Tailwind CSS, Supabase, Groq SDK, and Gemini Flash for rapid performance and scalability.</li>
        <li><b>UI/UX Design:</b> Created the signature <b>Glassy Emerald</b> aesthetic with responsive dark-mode layouts, glowing accent borders, and accessible typography.</li>
        <li><b>Frontend & State Engineering:</b> Implemented modular React components for authentication, dashboards, interview countdown timers, and radar charts.</li>
        <li><b>Backend API & AI Integration:</b> Engineered route handlers for Rounds 1 through 5, PDF resume extraction, and the fault-tolerant AI fallback engine.</li>
        <li><b>Database Implementation & Security:</b> Configured PostgreSQL tables and enacted strict Row-Level Security (RLS) rules in Supabase.</li>
        <li><b>Testing, Optimization & Deployment:</b> Conducted unit, integration, and security tests, deploying the final build to Vercel at <code>yat-ai.vercel.app</code>.</li>
    </ol>

    <div class="page-box">23</div>
</div>

<!-- PAGE 24: 3.4 FRONT-END IMPLEMENTATION WITH SCREENSHOTS -->
<div class="page">
    <h3>3.4 Front-End Implementation with Screenshots</h3>
    <p>The frontend provides the visual interface through which candidates and placement coordinators interact with YAT AI. The following subsections illustrate the core user interface components.</p>

    <h4>3.4.1 Landing Page & Navigation</h4>
    <p>The landing page introduces candidates to YAT AI with a glassmorphic emerald hero banner, animated feature badges, and direct links to register and start an interview.</p>

    <div class="placeholder-box" style="padding: 50px 20px;">
        <div class="placeholder-title">[ SCREENSHOT PLACEHOLDER: Figure 3.3 - Landing Page with Glassy Emerald Aesthetic ]</div>
        <div class="placeholder-desc">Paste screenshot of the live landing page at yat-ai.vercel.app here</div>
    </div>

    <h4>3.4.2 Authentication Interface</h4>
    <p>Provides secure registration and sign-in via Google OAuth or email/password, with client-side form validation and clear feedback.</p>

    <div class="placeholder-box" style="padding: 40px 20px;">
        <div class="placeholder-title">[ SCREENSHOT PLACEHOLDER: Figure 3.4 - User Authentication & Login View ]</div>
        <div class="placeholder-desc">Paste screenshot of the Login / Signup modal view here</div>
    </div>

    <div class="page-box">24</div>
</div>

<!-- PAGE 25: FRONT-END SCREENSHOTS CONTINUED -->
<div class="page">
    <h4>3.4.3 Student Dashboard</h4>
    <p>Serves as the central command center, displaying interview readiness scores, total evaluations completed, active placement drives, and past evaluation cards.</p>

    <div class="placeholder-box" style="padding: 50px 20px;">
        <div class="placeholder-title">[ SCREENSHOT PLACEHOLDER: Figure 3.5 - Student Dashboard Overview ]</div>
        <div class="placeholder-desc">Paste screenshot of the main student dashboard here</div>
    </div>

    <h4>3.4.4 Resume Upload & Automated Parsing Screen</h4>
    <p>Allows students to upload their PDF resume. Real-time status badges confirm when skills, frameworks, and projects have been extracted by AI.</p>

    <div class="placeholder-box" style="padding: 50px 20px;">
        <div class="placeholder-title">[ SCREENSHOT PLACEHOLDER: Figure 3.6 - Resume Upload & Extraction Interface ]</div>
        <div class="placeholder-desc">Paste screenshot of the resume upload drag-and-drop zone here</div>
    </div>

    <div class="page-box">25</div>
</div>

<!-- PAGE 26: INTERVIEW ROOM & DNA REPORT SCREENSHOTS -->
<div class="page">
    <h4>3.4.5 Live Interactive Interview Room</h4>
    <p>The interactive interview screen presents dynamic inquiries generated by Groq AI, live timers, text answer submission areas, and the algorithmic code editor.</p>

    <div class="placeholder-box" style="padding: 50px 20px;">
        <div class="placeholder-title">[ SCREENSHOT PLACEHOLDER: Figure 3.7 - Live 5-Round Interview Room ]</div>
        <div class="placeholder-desc">Paste screenshot of an active interview round in progress here</div>
    </div>

    <h4>3.4.6 Candidate DNA Performance Report</h4>
    <p>Presents post-interview diagnostic analytics featuring the 5-axis radar chart, key strengths, improvement areas, and personalized study recommendations.</p>

    <div class="placeholder-box" style="padding: 50px 20px;">
        <div class="placeholder-title">[ SCREENSHOT PLACEHOLDER: Figure 3.8 - Candidate DNA Matrix & Performance Report ]</div>
        <div class="placeholder-desc">Paste screenshot of the Candidate DNA scorecard and radar chart here</div>
    </div>

    <div class="page-box">26</div>
</div>

<!-- PAGE 27: TPO DRIVE & PROFILE SCREENSHOTS -->
<div class="page">
    <h4>3.4.7 TPO Placement Drive Management Screen</h4>
    <p>Enables Training and Placement Officers to publish campus drives, track enrolled students, and inspect candidate rankings.</p>

    <div class="placeholder-box" style="padding: 50px 20px;">
        <div class="placeholder-title">[ SCREENSHOT PLACEHOLDER: Figure 3.9 - TPO Placement Drive Portal ]</div>
        <div class="placeholder-desc">Paste screenshot of the Placement Drives list and enrollment view here</div>
    </div>

    <h4>3.4.8 Student Profile & Academic Details Screen</h4>
    <p>Allows students to configure their roll number, department, college, and review extracted resume skills.</p>

    <div class="placeholder-box" style="padding: 50px 20px;">
        <div class="placeholder-title">[ SCREENSHOT PLACEHOLDER: Figure 3.10 - Student Profile Management ]</div>
        <div class="placeholder-desc">Paste screenshot of the student profile editing screen here</div>
    </div>

    <div class="page-box">27</div>
</div>

<!-- PAGE 28: 3.5 BACK-END IMPLEMENTATION WITH SCREENSHOTS -->
<div class="page">
    <h3>3.5 Back-End Implementation with Screenshots</h3>
    <p>The backend of YAT AI executes server-side business logic, processes incoming candidate responses, interacts with Supabase PostgreSQL, and manages LLM inference.</p>

    <h4>3.5.1 Authentication Handler & Token Verification</h4>
    <p>Validates incoming JWT tokens from client sessions, protecting routes against unauthenticated requests.</p>

    <div class="placeholder-box" style="padding: 40px 20px;">
        <div class="placeholder-title">[ CODE / TERMINAL PLACEHOLDER: Figure 3.11 - Supabase Authentication Handler ]</div>
        <div class="placeholder-desc">Paste screenshot of auth route code or terminal verification logs here</div>
    </div>

    <h4>3.5.2 Next.js Server Route Handlers</h4>
    <p>Server route handlers handle question delivery and evaluation across all 5 rounds.</p>

    <div class="placeholder-box" style="padding: 40px 20px;">
        <div class="placeholder-title">[ CODE / TERMINAL PLACEHOLDER: Figure 3.12 - Server Route Handlers for Rounds 1-5 ]</div>
        <div class="placeholder-desc">Paste screenshot of /api/round-1 or /api/round-4 route code here</div>
    </div>

    <div class="page-box">28</div>
</div>

<!-- PAGE 29: AI INFERENCE & FAILOVER CODE -->
<div class="page">
    <h4>3.5.3 Resilient AI Model Execution & Failover Engine</h4>
    <p>The central AI engine in <code>lib/ai.ts</code> ensures that if Google Gemini Flash encounters high load or rate limits, the system automatically falls back to Groq Cloud models without breaking user sessions.</p>

    <div class="placeholder-box" style="padding: 40px 20px;">
        <div class="placeholder-title">[ CODE / TERMINAL PLACEHOLDER: Figure 3.13 - Resilient AI Failover Engine in lib/ai.ts ]</div>
        <div class="placeholder-desc">Paste screenshot of terminal output or lib/ai.ts fallback implementation here</div>
    </div>

    <div class="page-box">29</div>
</div>

<!-- PAGE 30: RESUME PARSING BACKEND IMPLEMENTATION -->
<div class="page">
    <h4>3.5.4 Resume Text Extraction & Profile Synthesis</h4>
    <p>The <code>/api/parse-resume</code> route handler processes uploaded PDF files, sanitizes raw text, and generates a structured JSON object containing candidate skills and past academic projects.</p>

    <div class="placeholder-box" style="padding: 45px 20px;">
        <div class="placeholder-title">[ CODE / JSON PLACEHOLDER: Figure 3.14 - Resume Parsing Route & Output Schema ]</div>
        <div class="placeholder-desc">Paste screenshot of the resume parsing API code and sample JSON output here</div>
    </div>

    <h4>3.5.5 Algorithmic Code Evaluation (Round 4)</h4>
    <p>Evaluates candidate code implementations, verifying logical correctness, edge case handling, and asymptotic time and space complexity.</p>

    <div class="placeholder-box" style="padding: 45px 20px;">
        <div class="placeholder-title">[ SCREENSHOT PLACEHOLDER: Figure 3.15 - Algorithmic Code Evaluation Output ]</div>
        <div class="placeholder-desc">Paste screenshot of code execution results and AI complexity critique here</div>
    </div>

    <div class="page-box">30</div>
</div>

<!-- PAGE 31: CANDIDATE DNA GENERATION BACKEND -->
<div class="page">
    <h4>3.5.6 Candidate DNA Computation Engine</h4>
    <p>The <code>/api/dna/generate</code> route evaluates the accumulated round transcripts and generates scores across five core competency dimensions:</p>

    <ul>
        <li><b>Logic & Problem Solving (0–100):</b> Measures reasoning clarity and structured breakdown of complex tasks.</li>
        <li><b>Algorithmic Efficiency (0–100):</b> Evaluates code time/space complexity and optimization.</li>
        <li><b>System Architecture (0–100):</b> Assesses database design and scalability trade-offs.</li>
        <li><b>Core CS Depth (0–100):</b> Grades mastery of OS, DBMS, Networks, and Data Structures.</li>
        <li><b>Communication & Cultural Fit (0–100):</b> Measures professional articulation and behavioral poise.</li>
    </ul>

    <div class="placeholder-box" style="padding: 40px 20px;">
        <div class="placeholder-title">[ CODE / SCREENSHOT PLACEHOLDER: Figure 3.16 - Candidate DNA Computation Route ]</div>
        <div class="placeholder-desc">Paste screenshot of the DNA computation logic and scoring algorithm here</div>
    </div>

    <div class="page-box">31</div>
</div>

<!-- PAGE 32: ERROR HANDLING & SECURITY -->
<div class="page">
    <h4>3.5.7 Error Handling and Platform Security</h4>
    <p>To ensure high stability and user data privacy, the backend incorporates multi-layered defensive programming:</p>

    <ul>
        <li><b>JWT Token Verification:</b> All interview and profile modification endpoints verify session tokens against Supabase Auth.</li>
        <li><b>Strict JSON Formatting:</b> System prompts enforce structured JSON generation, paired with regex-based markdown extraction guards.</li>
        <li><b>Rate Limit Retry (HTTP 429):</b> Implements exponential backoff delays (1500ms, 3000ms, 6000ms) to smoothly navigate API quotas.</li>
        <li><b>Input Validation & Sanitization:</b> Truncates large resume payloads to prevent token overflow attacks and request timeout errors.</li>
    </ul>

    <div class="placeholder-box" style="padding: 40px 20px;">
        <div class="placeholder-title">[ TERMINAL / CODE PLACEHOLDER: Figure 3.17 - Error Handling & Retry Logic ]</div>
        <div class="placeholder-desc">Paste screenshot of error handling middleware or try-catch blocks here</div>
    </div>

    <div class="page-box">32</div>
</div>

<!-- PAGE 33: 3.6 DATABASE DESIGN AND SCREENSHOTS -->
<div class="page">
    <h3>3.6 Database Design and Screenshots</h3>
    <p>The database maintains structured application state, user accounts, interview transcripts, scores, and placement drives. PostgreSQL hosted on Supabase serves as the relational database engine.</p>

    <h4>3.6.1 Database Entity Overview</h4>
    <table>
        <tr>
            <th style="width: 25%;">Entity / Table</th>
            <th style="width: 75%;">Description & Responsibilities</th>
        </tr>
        <tr><td><b>profiles</b></td><td>Stores student details: full name, roll number, college, branch, extracted skills, and resume cloud URL.</td></tr>
        <tr><td><b>interviews</b></td><td>Maintains interview session records, target role, average score, round transcripts (JSONB), and completion status.</td></tr>
        <tr><td><b>placement_drives</b></td><td>Maintained by TPOs: company name, drive date, drive code, enrolled count, and results published status.</td></tr>
        <tr><td><b>jobs</b></td><td>Stores specific job openings associated with placement drives: department, location, required skills, and minimum score.</td></tr>
        <tr><td><b>drive_enrollments</b></td><td>Associates registered students with specific placement drives.</td></tr>
        <tr><td><b>saved_resumes</b></td><td>Tracks versioned resume files stored in Supabase Cloud Storage.</td></tr>
    </table>

    <div class="page-box">33</div>
</div>

<!-- PAGE 34: DATABASE SCHEMA & RELATIONSHIPS -->
<div class="page">
    <h4>3.6.3 Database Relationships</h4>
    <p>The database uses foreign key constraints and relational associations to guarantee referential integrity:</p>
    <ul>
        <li>A registered candidate profile has a <b>1-to-Many</b> relationship with <code>interviews</code>.</li>
        <li>A placement drive has a <b>1-to-Many</b> relationship with <code>jobs</code>.</li>
        <li>A candidate has a <b>Many-to-Many</b> relationship with <code>placement_drives</code> via <code>drive_enrollments</code>.</li>
    </ul>

    <div class="placeholder-box" style="padding: 45px 20px;">
        <div class="placeholder-title">[ SCREENSHOT / DIAGRAM PLACEHOLDER: Figure 3.18 - Entity-Relationship (ER) Diagram ]</div>
        <div class="placeholder-desc">Paste the complete ER diagram showing profiles, interviews, jobs, and drives here</div>
    </div>

    <div class="page-box">34</div>
</div>

<!-- PAGE 35: SUPABASE TABLES SCREENSHOTS -->
<div class="page">
    <h4>3.6.4 Database Table Proofs in Supabase Studio</h4>
    <p>The figures below demonstrate the live database tables operating inside the Supabase Studio dashboard:</p>

    <div class="placeholder-box" style="padding: 45px 20px;">
        <div class="placeholder-title">[ SCREENSHOT PLACEHOLDER: Figure 3.19 - Profiles Table in Supabase Studio ]</div>
        <div class="placeholder-desc">Paste screenshot of public.profiles table in Supabase dashboard here</div>
    </div>

    <div class="placeholder-box" style="padding: 45px 20px;">
        <div class="placeholder-title">[ SCREENSHOT PLACEHOLDER: Figure 3.20 - Interviews Table with JSONB Transcripts ]</div>
        <div class="placeholder-desc">Paste screenshot of public.interviews table showing scores and transcripts here</div>
    </div>

    <div class="page-box">35</div>
</div>

<!-- PAGE 36: ROW-LEVEL SECURITY SCREENSHOTS -->
<div class="page">
    <h4>3.6.5 Row-Level Security (RLS) Policies</h4>
    <p>To enforce candidate data privacy, PostgreSQL Row-Level Security policies ensure students can only view and update their own records:</p>

    <div class="placeholder-box" style="padding: 45px 20px;">
        <div class="placeholder-title">[ SCREENSHOT PLACEHOLDER: Figure 3.21 - Row-Level Security (RLS) Policy Editor ]</div>
        <div class="placeholder-desc">Paste screenshot of Supabase RLS Policies view here</div>
    </div>

    <div class="page-box">36</div>
</div>

<!-- PAGE 37: 3.7 TESTING AND RESULTS -->
<div class="page">
    <h3 style="margin-top: 10px;">3.7 Testing and Results</h3>
    <p>Testing is a crucial phase of software development to verify that the application satisfies its design specifications, performs reliably under high load, and maintains strict security boundaries.</p>

    <h4>3.7.1 Testing Approach</h4>
    <ul>
        <li><b>Functional Testing:</b> Validates that individual features (authentication, resume parsing, question delivery, scoring) operate correctly according to requirements.</li>
        <li><b>Integration Testing:</b> Verifies that frontend components, API route handlers, LLM inference engines, and Supabase database tables communicate seamlessly.</li>
        <li><b>Security & RLS Testing:</b> Confirms that unauthenticated visitors cannot access protected dashboards and that candidates cannot inspect other students' interview transcripts.</li>
        <li><b>Responsive UI Testing:</b> Verifies layout usability across desktop monitors, laptops, and mobile viewports.</li>
    </ul>

    <div class="page-box">37</div>
</div>

<!-- PAGE 38: TEST CASES TABLE -->
<div class="page">
    <h4>3.7.2 Test Cases</h4>
    <p>The following test cases were formulated and executed to validate the core features of YAT AI:</p>

    <table>
        <tr>
            <th style="width: 12%;">Test ID</th>
            <th style="width: 48%;">Test Scenario</th>
            <th style="width: 40%;">Expected Result</th>
        </tr>
        <tr><td>TC-01</td><td>Register account using valid email and password</td><td>User account created; profile row initialized in database.</td></tr>
        <tr><td>TC-02</td><td>Sign in using Google OAuth SSO</td><td>User authenticated and redirected to student dashboard.</td></tr>
        <tr><td>TC-03</td><td>Sign in using invalid password</td><td>Descriptive error alert displayed; access denied.</td></tr>
        <tr><td>TC-04</td><td>Access <code>/dashboard</code> without authentication</td><td>Redirected to login view; protected data shielded.</td></tr>
        <tr><td>TC-05</td><td>Upload valid PDF resume</td><td>Text extracted; skills and projects auto-populated.</td></tr>
        <tr><td>TC-06</td><td>Upload non-PDF or corrupt file</td><td>Upload rejected with clear validation warning.</td></tr>
        <tr><td>TC-07</td><td>Generate Round 1 Technical MCQs</td><td>5 technical questions generated with 4 distinct options.</td></tr>
        <tr><td>TC-08</td><td>Submit answers for evaluation</td><td>AI grades responses and records scores in database.</td></tr>
        <tr><td>TC-09</td><td>Submit code in Round 4 coding challenge</td><td>Algorithm analyzed for time and space complexity.</td></tr>
        <tr><td>TC-10</td><td>Simulate Gemini API rate limit (429)</td><td>System falls back to Groq SDK without crashing.</td></tr>
        <tr><td>TC-11</td><td>Generate Candidate DNA Report</td><td>5-axis radar chart rendered with strengths and tips.</td></tr>
        <tr><td>TC-12</td><td>Access another candidate's private interview</td><td>Supabase RLS blocks query, returning unauthorized.</td></tr>
        <tr><td>TC-13</td><td>Enroll in campus placement drive</td><td>Student added to drive; enrolled count increments.</td></tr>
        <tr><td>TC-14</td><td>Render dashboard on mobile viewport (375px)</td><td>Glassy UI scales smoothly without horizontal overflow.</td></tr>
    </table>

    <div class="page-box">38</div>
</div>

<!-- PAGE 39: TEST RESULTS TABLE -->
<div class="page">
    <h4>3.7.3 Test Results</h4>
    <p>The actual results of each test case were recorded after executing comprehensive evaluation suites against the staging and production environments:</p>

    <table>
        <tr>
            <th style="width: 15%;">Test ID</th>
            <th style="width: 65%;">Actual Result Recorded</th>
            <th style="width: 20%; text-align: center;">Status</th>
        </tr>
        <tr><td>TC-01</td><td>User account created; profile initialized in Supabase</td><td class="center">Pass &#9989;</td></tr>
        <tr><td>TC-02</td><td>Google OAuth completed; session stored in cookies</td><td class="center">Pass &#9989;</td></tr>
        <tr><td>TC-03</td><td>Alert "Invalid login credentials" shown correctly</td><td class="center">Pass &#9989;</td></tr>
        <tr><td>TC-04</td><td>Unauthenticated request redirected to <code>/login</code></td><td class="center">Pass &#9989;</td></tr>
        <tr><td>TC-05</td><td>Resume skills and projects successfully extracted</td><td class="center">Pass &#9989;</td></tr>
        <tr><td>TC-06</td><td>File rejection alert displayed; no crash occurred</td><td class="center">Pass &#9989;</td></tr>
        <tr><td>TC-07</td><td>5 technical questions generated with valid JSON</td><td class="center">Pass &#9989;</td></tr>
        <tr><td>TC-08</td><td>Scores calculated and saved to <code>interviews</code> table</td><td class="center">Pass &#9989;</td></tr>
        <tr><td>TC-09</td><td>Code complexity evaluated with asymptotic Big-O notes</td><td class="center">Pass &#9989;</td></tr>
        <tr><td>TC-10</td><td>Fallback to Groq succeeded; response delivered seamlessly</td><td class="center">Pass &#9989;</td></tr>
        <tr><td>TC-11</td><td>Radar visualizer rendered with complete feedback</td><td class="center">Pass &#9989;</td></tr>
        <tr><td>TC-12</td><td>RLS policy blocked access; returned empty set</td><td class="center">Pass &#9989;</td></tr>
        <tr><td>TC-13</td><td>Drive enrollment recorded successfully</td><td class="center">Pass &#9989;</td></tr>
        <tr><td>TC-14</td><td>Mobile layout remained fully usable and responsive</td><td class="center">Pass &#9989;</td></tr>
    </table>

    <h4>3.7.4 Results and Observations</h4>
    <p>The testing phase confirmed that YAT AI functions reliably across all core requirements. The resilient AI failover loop prevented downtime during upstream model changes, while Supabase Row-Level Security guaranteed strict data segregation between candidates.</p>

    <div class="page-box">39</div>
</div>

<!-- PAGE 40: CHAPTER 4 - PROGRESS REPORT 1 & 2 -->
<div class="page">
    <h1 style="margin-bottom: 2px;">CHAPTER 4</h1>
    <h2 style="margin-bottom: 20px;">PROJECT PROGRESS AND GUIDE'S FEEDBACK</h2>

    <h3>4.1 Progress Report 1 (Day 1 – 15)</h3>
    <p><b>Reporting Period:</b> Day 1 to Day 15</p>
    <p><b>Work Completed:</b></p>
    <ul>
        <li>Conducted literature review and studied student preparation challenges.</li>
        <li>Defined system scope, functional requirements, and preliminary 4-tier architecture.</li>
        <li>Set up Next.js 15 repository and established Tailwind CSS design system tokens.</li>
    </ul>
    <p><b>Guide's Observations and Suggestions (Md Naiyer Hoda):</b></p>
    <p><i>"Ensure that the interview questions are not generic multiple-choice trivia; they must adapt dynamically to each student's specific resume and project claims."</i></p>
    <p><b>Action Taken:</b> Integrated PDF text extraction and formulated prompts grounded in candidate resume projects.</p>
    <p><b>Plan for Next 15 Days:</b> Implement authentication, profile setup, and PDF resume parser.</p>
    <p><b>Guide's Signature:</b> ___________________________</p>

    <hr style="margin: 15px 0;">

    <h3>4.2 Progress Report 2 (Day 16 – 30)</h3>
    <p><b>Reporting Period:</b> Day 16 to Day 30</p>
    <p><b>Work Completed:</b></p>
    <ul>
        <li>Implemented Supabase Auth supporting Google OAuth and email/password sign-in.</li>
        <li>Engineered <code>/api/parse-resume</code> route handler for extracting skills and projects.</li>
        <li>Built profile management and resume upload drag-and-drop user interfaces.</li>
    </ul>
    <p><b>Guide's Observations and Suggestions (Md Naiyer Hoda):</b></p>
    <p><i>"Verify security boundaries: Ensure students cannot inspect or modify other candidates' resumes or interview scorecards."</i></p>
    <p><b>Action Taken:</b> Enacted strict PostgreSQL Row-Level Security (RLS) rules in Supabase.</p>
    <p><b>Plan for Next 15 Days:</b> Develop the core 5-round interview engine and connect Groq SDK.</p>
    <p><b>Guide's Signature:</b> ___________________________</p>

    <div class="page-box">40</div>
</div>

<!-- PAGE 41: PROGRESS REPORT 3 & 4 -->
<div class="page">
    <h3>4.3 Progress Report 3 (Day 31 – 45)</h3>
    <p><b>Reporting Period:</b> Day 31 to Day 45</p>
    <p><b>Work Completed:</b></p>
    <ul>
        <li>Engineered route handlers for Round 1 (MCQs), Round 2 (Technical), and Round 3 (Design).</li>
        <li>Integrated Groq Cloud SDK (<code>qwen/qwen3.8-27b</code>) for ultra-fast question generation.</li>
        <li>Built live interview room UI with countdown timers and answer submission panels.</li>
    </ul>
    <p><b>Guide's Observations and Suggestions (Md Naiyer Hoda):</b></p>
    <p><i>"Incorporate live algorithmic code analysis so students can practice coding and receive immediate feedback on time and space complexity."</i></p>
    <p><b>Action Taken:</b> Developed Round 4 (Live Coding) with an embedded editor and AI asymptotic complexity reviewer.</p>
    <p><b>Plan for Next 15 Days:</b> Implement Candidate DNA telemetry and TPO placement drive portal.</p>
    <p><b>Guide's Signature:</b> ___________________________</p>

    <hr style="margin: 15px 0;">

    <h3>4.4 Progress Report 4 (Day 46 – 60)</h3>
    <p><b>Reporting Period:</b> Day 46 to Day 60</p>
    <p><b>Work Completed:</b></p>
    <ul>
        <li>Implemented Candidate DNA telemetry engine and SVG radar visualizer.</li>
        <li>Developed TPO placement drive scheduling and candidate ranking views.</li>
        <li>Executed end-to-end testing and deployed production application to Vercel.</li>
    </ul>
    <p><b>Guide's Observations and Suggestions (Md Naiyer Hoda):</b></p>
    <p><i>"Protect dashboard analytics against null values for newly registered candidates with zero completed interviews."</i></p>
    <p><b>Action Taken:</b> Added defensive null-safety defaults across all dashboard calculations and prepared departmental documentation.</p>
    <p><b>Guide's Signature:</b> ___________________________</p>

    <div class="page-box">41</div>
</div>

<!-- PAGE 42: SUMMARY OF MAJOR IMPROVEMENTS -->
<div class="page">
    <h3>4.5 Summary of Major Improvements Based on Guide's Feedback</h3>
    <p>Through regular reviews and consultations with our mentor, <b>Md Naiyer Hoda</b>, several critical technical enhancements were incorporated into YAT AI:</p>

    <ol>
        <li><b>Dynamic Resume Grounding:</b> Transitioned from static questions to contextual inquiries generated from the candidate's actual projects and declared skills.</li>
        <li><b>Multi-Model Sequential Failover:</b> Engineered an AI failover mechanism that eliminates 404/429 errors by switching between Google Gemini and Groq models.</li>
        <li><b>Live Algorithmic Code Review:</b> Introduced an interactive coding editor in Round 4 with automated time/space complexity analysis.</li>
        <li><b>Candidate DNA Telemetry Matrix:</b> Expanded standard numeric scores into a 5-axis competency breakdown with actionable study suggestions.</li>
        <li><b>Database Security & Null-Safety:</b> Enacted PostgreSQL Row-Level Security rules and defensive null checks across all dashboard analytics.</li>
    </ol>

    <div class="placeholder-box" style="padding: 40px 20px;">
        <div class="placeholder-title">[ SCREENSHOT / GRAPHIC PLACEHOLDER: Figure 4.1 - Evolution of Project Architecture ]</div>
        <div class="placeholder-desc">Space for diagram showing architecture improvements across the 4 sprint milestones</div>
    </div>

    <div class="page-box">42</div>
</div>

<!-- PAGE 43: CHAPTER 5 - CONCLUSION AND FUTURE WORK -->
<div class="page">
    <h1 style="margin-bottom: 2px;">CHAPTER 5</h1>
    <h2 style="margin-bottom: 20px;">CONCLUSION AND FUTURE WORK</h2>

    <h3>5.1 Conclusion</h3>
    <p>The <b>YAT AI</b> project demonstrates the successful design, implementation, and cloud deployment of a full-stack, AI-driven mock interview and candidate evaluation platform for diploma and engineering students. By uniting modern full-stack web technologies—<b>Next.js 15 (React 19)</b>, <b>TypeScript</b>, <b>Tailwind CSS</b>, and <b>Supabase PostgreSQL</b>—with high-throughput generative AI gateways (<b>Groq Cloud SDK</b> and <b>Google Gemini Flash</b>), the platform delivers a realistic and accessible interview practice environment.</p>

    <p>The platform achieves all primary project objectives:</p>
    <ul>
        <li>Parses PDF resumes to ground inquiries in candidate projects.</li>
        <li>Guides candidates through a realistic 5-round evaluation pipeline.</li>
        <li>Delivers actionable diagnostic feedback via the Candidate DNA Matrix.</li>
        <li>Provides placement cells with streamlined campus drive coordination.</li>
    </ul>

    <p>YAT AI addresses the acute shortage of personalized technical preparation tools in diploma colleges, empowering students to build self-confidence and excel in competitive recruitment drives.</p>

    <div class="page-box">43</div>
</div>

<!-- PAGE 44: LIMITATIONS & FUTURE SCOPE -->
<div class="page">
    <h3>5.2 Limitations of the Project</h3>
    <p>While YAT AI meets all core requirements, certain technical constraints remain:</p>
    <ul>
        <li><b>Text-Centric Evaluation:</b> Candidate answers are submitted through text and code; real-time facial expression and speech tone analysis are not included.</li>
        <li><b>Third-Party Cloud API Dependency:</b> Requires an active Internet connection to communicate with Groq and Gemini API endpoints.</li>
        <li><b>Language Scope:</b> Question generation and evaluation rubrics operate exclusively in English.</li>
        <li><b>Scanned PDF Handling:</b> Non-selectable image-based PDF resumes require OCR preprocessing for optimal text extraction.</li>
    </ul>

    <h3>5.3 Future Scope / Future Work</h3>
    <p>Future development phases for YAT AI will explore:</p>
    <ul>
        <li><b>Bidirectional Voice AI:</b> Integrating WebRTC audio streaming for realistic voice-to-voice phone screening simulations.</li>
        <li><b>Webcam Proctoring:</b> Utilizing computer vision models to evaluate candidate eye contact, posture, and poise.</li>
        <li><b>Institutional LMS Integration:</b> Supporting single-sign-on (SSO) and grade synchronization with platforms like Moodle and Canvas.</li>
        <li><b>Offline Mobile Application:</b> Building cross-platform mobile apps (React Native) with offline question caching for practice in low-bandwidth areas.</li>
    </ul>

    <div class="page-box">44</div>
</div>

<!-- PAGE 45: REFERENCES -->
<div class="page">
    <h2 style="font-size: 15pt; text-decoration: underline; margin-bottom: 20px;">REFERENCES</h2>

    <ol style="line-height: 1.8;">
        <li><b>Next.js Documentation:</b> Vercel Inc., <i>"Next.js 15 App Router Architecture & Server Components,"</i> https://nextjs.org/docs, 2026.</li>
        <li><b>Supabase Documentation:</b> Supabase Inc., <i>"PostgreSQL Row-Level Security, Database Triggers and Storage Policies,"</i> https://supabase.com/docs, 2026.</li>
        <li><b>Groq Cloud API Documentation:</b> Groq Inc., <i>"Ultra-Low Latency LLM Inference Gateway with Llama & Qwen Models,"</i> https://console.groq.com/docs, 2026.</li>
        <li><b>Google AI Documentation:</b> Google DeepMind, <i>"Gemini Flash API: Multimodal and Structured JSON Generation,"</i> https://ai.google.dev/docs, 2026.</li>
        <li><b>Tailwind CSS Documentation:</b> Tailwind Labs, <i>"Utility-First CSS Framework & Modern Component Styling,"</i> https://tailwindcss.com/docs, 2026.</li>
        <li><b>Pressman, R. S., & Maxim, B. R.:</b> <i>Software Engineering: A Practitioner's Approach</i>, 9th Edition, McGraw-Hill Education, 2020.</li>
        <li><b>Elmasri, R., & Navathe, S. B.:</b> <i>Fundamentals of Database Systems</i>, 7th Edition, Pearson Education, 2016.</li>
        <li><b>Gamma, E., Helm, R., Johnson, R., & Vlissides, J.:</b> <i>Design Patterns: Elements of Reusable Object-Oriented Software</i>, Addison-Wesley, 1994.</li>
    </ol>

    <div class="page-box">45</div>
</div>

<!-- PAGE 46: APPENDIX A & B -->
<div class="page">
    <h2 style="font-size: 15pt; text-decoration: underline; margin-bottom: 20px;">APPENDIX</h2>

    <h3>Appendix A: GitHub Repository Link & Live Deployment</h3>
    <ul>
        <li><b>Official GitHub Repository:</b> <code>https://github.com/anzarhasnat/YAT-AI-.git</code></li>
        <li><b>Live Production Application:</b> <code>https://yat-ai.vercel.app</code></li>
        <li><b>Supabase Cloud Project:</b> <code>ygjxjohbevikvgybexns.supabase.co</code></li>
    </ul>

    <hr style="margin: 20px 0;">

    <h3>Appendix B: Additional Project Screenshots</h3>

    <div class="placeholder-box" style="padding: 40px 20px;">
        <div class="placeholder-title">[ SCREENSHOT PLACEHOLDER: Appendix Figure B.1 - Cloud Storage Resume Management ]</div>
        <div class="placeholder-desc">Paste screenshot of Supabase Storage bucket managing candidate PDF resumes here</div>
    </div>

    <div class="placeholder-box" style="padding: 40px 20px;">
        <div class="placeholder-title">[ SCREENSHOT PLACEHOLDER: Appendix Figure B.2 - Complete Interview Transcript Inspector ]</div>
        <div class="placeholder-desc">Paste screenshot of full multi-round question-answer transcript view here</div>
    </div>

    <div class="page-box">46</div>
</div>

<!-- PAGE 47: APPENDIX C & D -->
<div class="page">
    <h3>Appendix C: Core Source Code Listings</h3>
    <p>Key source code excerpt from <code>lib/ai.ts</code> demonstrating the sequential failover engine:</p>

    <div class="placeholder-box" style="padding: 40px 20px;">
        <div class="placeholder-title">[ CODE PLACEHOLDER: Appendix Figure C.1 - Centralized AI Engine in lib/ai.ts ]</div>
        <div class="placeholder-desc">Space for full syntax-highlighted code listing of the dual-model failover engine</div>
    </div>

    <hr style="margin: 15px 0;">

    <h3>Appendix D: Database Schema Migration Script</h3>
    <div class="placeholder-box" style="padding: 40px 20px;">
        <div class="placeholder-title">[ SQL PLACEHOLDER: Appendix Figure D.1 - PostgreSQL Schema Synchronization Script ]</div>
        <div class="placeholder-desc">Space for SQL migration script defining tables, foreign keys, and RLS policies</div>
    </div>

    <div class="page-box">47</div>
</div>

</body>
</html>
"""

html_final = html_content.replace('__LOGO_B64__', logo_b64)
html_path = 'YAT_AI_Project_Report.html'
with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html_final)
print("Saved HTML to", html_path)

# Generate PDF with headless Edge
pdf_out_path = os.path.abspath('YAT_AI_Project_Report.pdf')
edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
browser_bin = edge_path if os.path.exists(edge_path) else chrome_path

if os.path.exists(browser_bin):
    print("Generating PDF using:", browser_bin)
    cmd = [
        browser_bin,
        '--headless',
        '--disable-gpu',
        '--run-all-compositor-stages-before-draw',
        f'--print-to-pdf={pdf_out_path}',
        '--no-pdf-header-footer',
        os.path.abspath(html_path)
    ]
    subprocess.run(cmd, check=True)
    if os.path.exists(pdf_out_path):
        size_kb = os.path.getsize(pdf_out_path) / 1024
        print(f"SUCCESS: Generated PDF at {pdf_out_path} ({size_kb:.2f} KB)")

