'use client';

import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface PubSubMessage {
  type: string;
  status: 'success' | 'error';
  itineraryId?: string;
  error?: string;
  timestamp: string;
}

export default function PubSubNotifications() {
  const { toast } = useToast();

  useEffect(() => {
    let lastChecked = new Date().toISOString();

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/pubsub/notifications?since=${lastChecked}`);
        const messages = await response.json();

        lastChecked = new Date().toISOString();

        messages.forEach((message: PubSubMessage) => {
          if (message.type === 'create_itinerary') {
            if (message.status === 'success') {
              toast({
                title: 'Itinerary Created',
                description: 'Your itinerary has been generated successfully!',
              });
            } else {
              toast({
                title: 'Error',
                description: message.error || 'Failed to generate itinerary',
                variant: 'destructive',
              });
            }
          }
        });
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(pollInterval);
  }, [toast]);

  return null;
}
