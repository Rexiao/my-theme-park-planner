import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const { currentItinerary, userRequest } = await request.json();

  const prompt = `
You are an AI assistant specializing in Disney World itinerary planning. Your task is to update an existing itinerary based on the user's current action and time. Please follow these guidelines:

1. Review the current itinerary and the user's action.
2. Update the itinerary to reflect the completed attraction and adjust subsequent timings if necessary.
3. Suggest the next best action based on the current time and location.
4. Maintain the overall structure and format of the itinerary.
5. Only output the updated itinerary content, not including the "Current Itinerary" header.

Current time: ${new Date().toLocaleTimeString()}
User action: ${userRequest}

Please update the following itinerary accordingly:

${currentItinerary}

Provide only the updated itinerary content in your response, maintaining the original markdown format.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that updates Disney World itineraries.',
        },
        { role: 'user', content: prompt },
      ],
    });

    const updatedItinerary = completion.choices[0].message.content;

    return NextResponse.json({ updatedItinerary });
  } catch (error) {
    console.error('Error updating itinerary:', error);
    return NextResponse.json({ error: 'Failed to update itinerary' }, { status: 500 });
  }
}
