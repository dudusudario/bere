
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.36.0'

// This is a Supabase Edge Function that creates a storage bucket for profile images
Deno.serve(async (req) => {
  try {
    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Create a Supabase client with the service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Create a bucket if it doesn't exist
    const { data, error } = await supabaseAdmin.storage.createBucket('profiles', {
      public: true,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
    })

    if (error) {
      // If the bucket already exists, this is fine
      if (error.message.includes('already exists')) {
        return new Response(
          JSON.stringify({ message: 'Bucket already exists', status: 'success' }),
          { headers: { 'Content-Type': 'application/json' } }
        )
      }
      throw error
    }

    return new Response(
      JSON.stringify({ message: 'Bucket created successfully', data, status: 'success' }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
