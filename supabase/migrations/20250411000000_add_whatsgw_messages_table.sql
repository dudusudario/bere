
-- Create the table for storing WhatsGW messages
CREATE TABLE IF NOT EXISTS public.whatsgw_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_number TEXT NOT NULL,
    message TEXT NOT NULL,
    message_id TEXT,
    direction TEXT CHECK (direction IN ('incoming', 'outgoing')),
    status TEXT,
    media JSONB,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_whatsgw_messages_phone_number ON public.whatsgw_messages (phone_number);
CREATE INDEX IF NOT EXISTS idx_whatsgw_messages_timestamp ON public.whatsgw_messages (timestamp);

-- Enable row level security
ALTER TABLE public.whatsgw_messages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read all messages
CREATE POLICY "Allow authenticated users to read whatsgw_messages" 
    ON public.whatsgw_messages 
    FOR SELECT 
    TO authenticated 
    USING (true);

-- Create policy to allow authenticated users to insert messages
CREATE POLICY "Allow authenticated users to insert whatsgw_messages" 
    ON public.whatsgw_messages 
    FOR INSERT 
    TO authenticated 
    WITH CHECK (true);

-- Set up realtime subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE public.whatsgw_messages;
