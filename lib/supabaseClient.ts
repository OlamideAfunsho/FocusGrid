import { createClient } from "@supabase/supabase-js";

export function createBrowserClient(clerkSession: any) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
        global: {
            // Intercept the native fetch engine to automatically inject the security header
            fetch: async (url, options = {}) => {
                // Grab the fresh session token directly from your auth manager
                const clerkToken = await clerkSession?.getToken({
                    template: "supabase"
                });

                // Clone the existing headers and append our Authorization bearer token
                const headers = new Headers(options?.headers);
                
                // ONLY inject the bearer token if it actually exists!
                if (clerkToken) {
                headers.set("Authorization", `Bearer ${clerkToken}`);
                }

                // Complete the database network request with our secure identity attached
                return fetch(url, {
                    ...options,
                    headers,
                });
            }
        }
    }
  );
}