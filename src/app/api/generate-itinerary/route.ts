import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@/utils/supabase/server';
import fs from 'fs';
// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ItineraryFormData {
  parkId: string;
  parkName: string;
  date: string;
  adults: number;
  children: number;
  preferredPace: string;
  earlyEntry: boolean;
  lightningLaneMulti: boolean;
  memoryMaker: boolean;
  email: string;
  additionalComments: string;
}

async function fetchThemeParkInfo(parkId: string) {
  const supabase = createClient();
  const { data: resources, error: resourcesError } = await supabase
    .from('theme_park_info')
    .select('content')
    .eq('theme_park_id', parkId)
    .eq('content_type', 'itinerary_resources');

  if (resourcesError) {
    console.error('Error fetching itinerary resources:', resourcesError);
    return { resources: [], example: null };
  }

  const { data: examples, error: examplesError } = await supabase
    .from('theme_park_info')
    .select('content')
    .eq('theme_park_id', parkId)
    .eq('content_type', 'itinerary_examples')
    .limit(1);

  if (examplesError) {
    console.error('Error fetching itinerary example:', examplesError);
    return { resources: resources || [], example: null };
  }

  return {
    resources: resources || [],
    example: examples && examples.length > 0 ? examples[0].content : null,
  };
}

function generateDetailedPrompt(
  formData: ItineraryFormData,
  resources: string[],
  example: string | null,
): string {
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

  let prompt = `
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
2. Include popular attractions, prioritizing those mentioned in the [[Park-specific resources]].
3. Suggest optimal times for meals, snacks, and breaks.
4. If Early Entry is available, incorporate early morning strategies.
5. If Lightning Lane Multi Pass is purchased, suggest efficient use throughout the day.
6. Include Memory Maker photo opportunities if selected.
7. Balance ride times with shows, character meet-and-greets, and other experiences.
8. Provide tips for managing crowds and maximizing enjoyment.
9. Suggest alternative activities or attractions in case of long wait times.
10. Include a brief conclusion with tips for ending the day (e.g., best spots for fireworks, last-minute must-dos).

Format the itinerary as follows:
1. A brief introduction summarizing the day ahead. If Lightning Lane Multi Pass is purchased, tell the user which rides they should get Lightning Lane passes for and in which time slots.
2. A chronological list of activities, each with:
   - Approximate time
   - Activity name
   - Brief description or tip
   - Estimated duration or wait time (if applicable)
3. If the user has used one of their Lightning Lane Multi Passes, tell them which ride they should reserve next.
4. Meal suggestions with recommended times and locations.
5. A conclusion with final tips and reminders.

Use markdown formatting for readability, including headers, bullet points, and emphasis where appropriate.

You must follow [[Sample Output Format]] exactly. Start with the **Before Your Visit** section, then the **Day of Your Visit** section.

[[Sample Output Format]]
${example}

[[Park-specific resources]]
${resources.map((resource, index) => `Resource ${index + 1}:\n${resource}`).join('\n\n\n')}

`;

  return prompt;
}

export async function POST(request: NextRequest) {
  try {
    const formData: ItineraryFormData = await request.json();
    const { resources, example } = await fetchThemeParkInfo(formData.parkId);
    const detailedPrompt = generateDetailedPrompt(
      formData,
      resources.map((r) => r.content),
      example,
    );

    console.log(detailedPrompt);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a helpful Disney World itinerary planner.' },
        { role: 'user', content: detailedPrompt },
      ],
      max_completion_tokens: null,
    });

    const generatedItinerary = completion.choices[0].message.content;

    // Save the generated itinerary to the database
    const supabase = createClient();
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error('Error fetching user:', userError);
      return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
    }
    const userId = user?.user?.id;
    const formattedDate = new Date(formData.date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    const { data, error } = await supabase
      .from('itineraries')
      .insert({
        user_id: userId,
        theme_park_id: formData.parkId,
        name: `${formData.parkName} Itinerary - ${formattedDate}`,
        date: formData.date,
        content: generatedItinerary,
      })
      .select();

    if (error) {
      console.error('Error saving itinerary:', error);
      return NextResponse.json({ error: 'Failed to save itinerary' }, { status: 500 });
    }

    return NextResponse.json({ success: true, itineraryId: data[0].id });
  } catch (error) {
    console.error('Error generating itinerary:', error);
    return NextResponse.json({ error: 'Failed to generate itinerary' }, { status: 500 });
  }
}
