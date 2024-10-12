import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ItineraryFormData {
  parkId: string;
  parkName: string;
  date: Date;
  adults: number;
  children: number;
  preferredPace: string;
  earlyEntry: boolean;
  lightningLaneMulti: boolean;
  memoryMaker: boolean;
  email: string;
  additionalComments: string;
}

function generateDetailedPrompt(formData: ItineraryFormData): string {
  const visitDate = new Date(formData.date);
  const formattedDate = visitDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const paceDescriptions = {
    relaxed: 'a relaxed and leisurely',
    moderate: 'a moderate and balanced',
    packed: 'an action-packed and busy',
  };

  const pace =
    paceDescriptions[formData.preferredPace as keyof typeof paceDescriptions] ||
    'a moderate and balanced';
  const totalGuests = formData.adults + formData.children;

  // This is the original detailed prompt
  return `
Generate a detailed itinerary for ${totalGuests} guest${totalGuests !== 1 ? 's' : ''} visiting ${formData.parkName} at Walt Disney World Resort on ${formattedDate}.

Guest Details and Preferences:
- Adults: ${formData.adults}
- Children: ${formData.children}
- Preferred Pace: ${pace}
- Early Entry: ${formData.earlyEntry ? 'Yes' : 'No'}
- Lightning Lane Multi Pass: ${formData.lightningLaneMulti ? 'Yes' : 'No'}
- Memory Maker: ${formData.memoryMaker ? 'Yes' : 'No'}
${formData.additionalComments ? `- Additional Comments: ${formData.additionalComments}` : ''}

Instructions:
1. Create ${pace} itinerary for the specified date, considering the park's operating hours and any special events.
2. Include popular attractions, prioritizing:
   - Signature attractions unique to ${formData.parkName}
   - Tier 1 high-demand attractions
   - Tier 2 popular attractions
3. Suggest optimal times for meals, snacks, and breaks.
4. If Early Entry is available, incorporate early morning strategies.
5. If Lightning Lane Multi Pass is purchased, suggest efficient use throughout the day.
6. Include Memory Maker photo opportunities if selected.
7. Balance ride times with shows, character meet-and-greets, and other experiences.
8. Provide tips for managing crowds and maximizing enjoyment.
9. Suggest alternative activities or attractions in case of long wait times.
10. Include a brief conclusion with tips for ending the day (e.g., best spots for fireworks, last-minute must-dos).

Format the itinerary as follows:
1. A brief introduction summarizing the day ahead.
2. A chronological list of activities, each with:
   - Approximate time
   - Activity name
   - Brief description or tip
   - Estimated duration or wait time (if applicable)
3. Meal suggestions with recommended times and locations.
4. A conclusion with final tips and reminders.

Use markdown formatting for readability, including headers, bullet points, and emphasis where appropriate.

Generate the itinerary now.`;
}

function generateShortPrompt(): string {
  return `are you ready?`;
}

export async function POST(request: NextRequest) {
  try {
    const formData: ItineraryFormData = await request.json();
    const detailedPrompt = generateDetailedPrompt(formData);
    const shortPrompt = generateShortPrompt();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a helpful Disney World itinerary planner.' },
        { role: 'user', content: shortPrompt },
      ],
      max_tokens: 150, // Limit the response to save tokens
    });

    const generatedItinerary = completion.choices[0].message.content;

    return NextResponse.json({
      itinerary: generatedItinerary,
      detailedPrompt: detailedPrompt, // Include the detailed prompt in the response for future use
    });
  } catch (error) {
    console.error('Error generating itinerary:', error);
    return NextResponse.json({ error: 'Failed to generate itinerary' }, { status: 500 });
  }
}
