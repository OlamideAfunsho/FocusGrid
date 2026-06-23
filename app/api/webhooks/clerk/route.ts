import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize a service-role Supabase Client (bypasses RLS to write new users)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
); 

export async function POST(req:Request){
    // 1. Grab the verification headers sent by the providers
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new NextResponse("Missing verification headers", { status: 400 });
    }

    // 2. Get the raw request body text
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // 3. Verify the signature using your webhook secret key
    const wh = new Webhook(process.env.WORKSPACE_WEBHOOK_SECRET!);
    let evt: any;

    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        });
    } catch (err) {
        return new NextResponse('Invalid signature match', { status: 400 });
    }

    // 4. Handle the specific event type
    const eventType = evt.type;

    if (eventType === 'user.created') {
        // Extract the profile data from the verified payload
        const { id, first_name, last_name, email_addresses, image_url } = evt.data;

        const primaryEmail = email_addresses[0]?.email_address;
        const computedName = `${first_name || ''} ${last_name || ''}`.trim();

        // Insert the row cleannly into the database
        const { error } = await supabaseAdmin
                            .from('users')
                            .insert({
                                id: id,
                                full_name: computedName,
                                email_address: primaryEmail,
                                avatar_url: image_url
                            });

        if (error) {
            console.error('Database write failed:', error);
            return new NextResponse('Database write error', { status: 500 });
        }
    }

    return NextResponse.json({ success: true }, { status: 200 });

}


