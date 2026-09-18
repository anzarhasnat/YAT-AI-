import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

/**
 * GET /api/resume/saved
 * Fetches the logged-in candidate's saved resume from Supabase database.
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('resumes')
      .select('id, parsed_json, raw_text, updated_at')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Fetch saved resume error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    if (!data || !data.parsed_json) {
      return NextResponse.json({ success: true, hasSavedResume: false, data: null });
    }

    return NextResponse.json({
      success: true,
      hasSavedResume: true,
      data: data.parsed_json,
      updatedAt: data.updated_at
    });
  } catch (err: any) {
    console.error('GET /api/resume/saved failed:', err);
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}

/**
 * POST /api/resume/saved
 * Saves or updates candidate's permanent resume in Supabase database.
 */
export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { parsedData, rawText } = body;

    if (!parsedData) {
      return NextResponse.json({ success: false, error: 'Missing parsed resume data' }, { status: 400 });
    }

    const { error: upsertError } = await supabase
      .from('resumes')
      .upsert({
        user_id: user.id,
        parsed_json: parsedData,
        raw_text: rawText || '',
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

    if (upsertError) {
      console.error('Save resume upsert error:', upsertError);
      return NextResponse.json({ success: false, error: upsertError.message }, { status: 500 });
    }

    // Auto-update academic profile fields if present
    const extracted = parsedData.extracted || {};
    const profileUpdates: Record<string, any> = {};
    if (extracted.tenth_percent && !isNaN(extracted.tenth_percent)) profileUpdates.tenth_percent = extracted.tenth_percent;
    if (extracted.twelfth_percent && !isNaN(extracted.twelfth_percent)) profileUpdates.twelfth_percent = extracted.twelfth_percent;
    if (extracted.grad_cgpa && !isNaN(extracted.grad_cgpa)) profileUpdates.grad_cgpa = extracted.grad_cgpa;
    if (extracted.branch && extracted.branch.trim()) profileUpdates.branch = extracted.branch;

    if (Object.keys(profileUpdates).length > 0) {
      await supabase.from('profiles').update(profileUpdates).eq('id', user.id);
    }

    return NextResponse.json({ success: true, message: 'Resume saved to profile successfully!' });
  } catch (err: any) {
    console.error('POST /api/resume/saved failed:', err);
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}
