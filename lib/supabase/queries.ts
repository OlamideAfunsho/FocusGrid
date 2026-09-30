// lib/supabase/queries.ts
import { createClient } from "@supabase/supabase-js";

export interface StudySessionRow {
  completed_at: string;
  duration_minutes: number;
}

// Raw sessions for the weekly chart. Days are grouped in the browser instead of here,
// so the week follows the student's own timezone rather than the server's.
export async function getWeeklyStudySessions(userId: string): Promise<StudySessionRow[]> {
  const supabase = await createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  // Reach back 8 days: a timezone ahead of the server can pull an extra day into the local week
  const windowStart = new Date();
  windowStart.setDate(windowStart.getDate() - 7);
  windowStart.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("study_sessions")
    .select("duration_minutes, completed_at")
    .eq("user_id", userId) // Every timer mode (pomodoro, deep_work, marathon, custom) counts as focus time
    .gte("completed_at", windowStart.toISOString());

  if (error) {
    console.error("Error fetching weekly study sessions:", error);
    return [];
  }

  return (data ?? []) as StudySessionRow[];
}
