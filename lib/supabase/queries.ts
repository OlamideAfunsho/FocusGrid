// lib/supabase/queries.ts
import { createClient } from "@supabase/supabase-js";

export interface DailyStudyTime {
  day: string; // e.g., 'Mon', 'Tue'
  hours: number;
}

export async function getWeeklyStudyFocus(userId: string): Promise<DailyStudyTime[]> {
  const supabase = await createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  // Get date range for the past 7 days starting from midnight
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const { data: sessions, error } = await supabase
    .from("study_sessions")
    .select("duration_minutes, completed_at")
    .eq("user_id", userId)
    .eq("session_type", "focus") // Only sum actual focus sessions
    .gte("completed_at", sevenDaysAgo.toISOString());

  if (error) {
    console.error("Error fetching weekly study focus:", error);
    return [];
  }

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const aggregatedData: Record<string, number> = {};

  // Pre-fill the last 7 days (including today) with 0 hours
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayName = daysOfWeek[d.getDay()];
    aggregatedData[dayName] = 0;
  }

  // Aggregate duration minutes into hours per day
  sessions?.forEach((session: { completed_at: string | number | Date; duration_minutes: any; }) => {
    const sessionDate = new Date(session.completed_at);
    const dayName = daysOfWeek[sessionDate.getDay()];
    if (aggregatedData[dayName] !== undefined) {
      aggregatedData[dayName] += (session.duration_minutes || 0) / 60;
    }
  });

  return Object.entries(aggregatedData).map(([day, hours]) => ({
    day,
    hours: Number(hours.toFixed(1)), // Round to 1 decimal place
  }));
}