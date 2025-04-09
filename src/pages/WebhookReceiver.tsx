
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// This component will handle webhook POST requests
// In a real application, this would be a server-side endpoint
// But for our frontend-only demo, we'll simulate receiving the request
const WebhookReceiver: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Extract data from the URL query string or request body
    const handleRequest = async () => {
      try {
        // In a real application we'd get this from the request body
        // Since this is a frontend-only demo, we're simulating the behavior
        const urlParams = new URLSearchParams(window.location.search);
        const message = urlParams.get('message') || 'Mensagem recebida via webhook';
        
        console.log('Webhook message received:', message);
        
        // Process the webhook message
        if (window.receiveWebhookMessage) {
          window.receiveWebhookMessage(message);
        }
        
        // Redirect back to chat or respond with success
        if (urlParams.get('redirect') !== 'false') {
          navigate('/chat');
        }
      } catch (error) {
        console.error('Error processing webhook:', error);
      }
    };
    
    handleRequest();
  }, [navigate]);
  
  // This page should not be visible to users
  // It just processes the webhook and redirects or returns a response
  return (
    <div className="p-4">
      <h1>Processando webhook...</h1>
      <p>Esta página processa webhooks e não deve ser vista pelos usuários.</p>
    </div>
  );
};

export default WebhookReceiver;
