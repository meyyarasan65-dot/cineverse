import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

/**
 * Ensures a user record exists in public.users table.
 * Especially important for OAuth sign-ins (like Google) where the database trigger
 * might need fallback data or if the trigger hasn't been updated yet.
 */
export async function syncUserProfile(user: User | null): Promise<void> {
  if (!user) return;

  try {
    // Check if user already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("id, username, avatar_url")
      .eq("id", user.id)
      .maybeSingle();

    if (fetchError) {
      console.warn("Could not check public.users:", fetchError.message);
    }

    const email = user.email || "";
    const meta = user.user_metadata || {};
    
    // Determine avatar
    const avatarUrl = meta.avatar_url || meta.picture || null;

    if (!existingUser) {
      // Determine a clean, friendly username
      const rawName = meta.username || meta.full_name || meta.name || email.split("@")[0] || "user";
      const cleanName = rawName
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "")
        .slice(0, 18);
      const uniqueUsername = cleanName ? `${cleanName}_${user.id.slice(0, 4)}` : `user_${user.id.slice(0, 6)}`;

      await supabase.from("users").upsert(
        {
          id: user.id,
          username: meta.username || uniqueUsername,
          email: email,
          avatar_url: avatarUrl,
        },
        { onConflict: "id" }
      );
    } else if (avatarUrl && !existingUser.avatar_url) {
      // Enrich existing user avatar if it wasn't saved before
      await supabase
        .from("users")
        .update({ avatar_url: avatarUrl })
        .eq("id", user.id);
    }
  } catch (err) {
    console.error("Failed to sync user profile:", err);
  }
}
