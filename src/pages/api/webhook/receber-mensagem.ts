
import type { NextApiRequest, NextApiResponse } from 'next';
import { saveMessageToSupabase } from '@/utils/sendToN8n';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

// Define allowed origins for CORS
const allowedOrigins = [
  'https://en8n.berenice.ai',
  process.env.NEXT_PUBLIC_URL,
  'http://localhost:3000',
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check if the request method is POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Handle CORS
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Extract data from the request body
    const { user, numero, mensagem } = req.body;

    // Validate required fields
    if (!numero || !mensagem) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Save the message to Supabase
    await saveMessageToSupabase({
      username: user || 'agent',
      numero,
      mensagem,
      origem: 'agent',
    });

    return res.status(200).json({ success: true, message: 'Mensagem recebida e salva com sucesso' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
}
