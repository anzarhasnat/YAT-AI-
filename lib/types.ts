export type UserRole = 'candidate' | 'student';

export interface ExperienceEntry {
    company: string;
    role: string;
    duration: string;
    startDate: string;
    endDate: string;
    responsibilities: string[];
}

export interface ProjectEntry {
    name: string;
    description: string;
    technologies: string[];
    role: string;
    outcome: string | null;
    link: string | null;
}

export interface Profile {
    id: string;
    full_name: string;
    email: string;
    role: UserRole;
    phone?: string;
    linkedin?: string;
    github?: string;
    summary?: string;
    profession?: string;
    skills?: string[];
    college_name?: string;
    company_name?: string;
    resume_role?: string;
    resume_projects?: string;
    tenth_percent?: number;
    twelfth_percent?: number;
    grad_cgpa?: number;
    branch?: string;
    active_backlogs?: number;
    passing_year?: number;
    experience?: ExperienceEntry[];
    projects?: ProjectEntry[];
    certifications?: string[];
    achievements?: string[];
    created_at: string;
}

export interface InterviewConfig {
 
}

export interface ParsedResume {
    personalInfo: {
        name: string;
        email: string;
        phone: string;
        location: string;
        linkedin: string | null;
        github: string | null;
        portfolio: string | null;
    };
    summary: string | null;
    skills: {
        technical: string[];
        soft: string[];
        tools: string[];
        languages: string[];
    };
    experience: Array<{
        company: string;
        role: string;
        duration: string;
        startDate: string;
        endDate: string | 'Present';
        responsibilities: string[];
        achievements: string[];
    }>;
    education: Array<{
        degree: string;
        institution: string;
        year: string;
        percentage_or_cgpa: string | null;
        relevant_coursework: string[];
    }>;
    projects: Array<{
        name: string;
        description: string;
        technologies: string[];
        role: string;
        outcome: string | null;
        link: string | null;
    }>;
    certifications: string[];
    achievements: string[];
    totalYearsExperience: number;
    hasEmploymentGaps: boolean;
    longestProject: string;
    primaryTechStack: string[];
}

export interface Question {
    id: number;
    round: number;
    type: string;
    question: string;
    options?: Record<string, string>;
    correct_answer?: string;
    ideal_answer?: string;
    explanation?: string;
    time_suggested_seconds: number;
    marks: number;
    difficulty: 'easy' | 'medium' | 'hard';
    [key: string]: any;
}

export interface RoundStatus {
    status: 'locked' | 'active' | 'completed' | 'passed' | 'failed';
    score: number | null;
    maxScore: number | null;
    timeTaken: number | null;
    answers: Record<number, any>;
    weaknesses: string[];
}

export interface InterviewState {
    config: InterviewConfig | null;
    parsedResume: ParsedResume | null;
    preCheckResult: any | null;
    currentRound: number;
    rounds: Record<number, RoundStatus>;
    questions: Record<number, Question[]>;
    isCodeRoundApplicable: boolean;
    startedAt: Date;
    interviewId: string;
}
