import { NextRequest, NextResponse } from 'next/server';
import { PubSub, Message } from '@google-cloud/pubsub';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    // Get current user ID
    const supabase = createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const pubsub = new PubSub();
    const subscription = pubsub.subscription(`theme-park-${user.id}`);

    // Pull messages for this user
    const [messages] = await subscription.

    // Process messages and acknowledge them
    const notifications = messages.map((message: Message) => {
      const data = JSON.parse(message.data.toString());
      message.ack();
      return data;
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
} 