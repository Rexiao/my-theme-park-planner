'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface Itinerary {
  id: string;
  name: string;
  date: string;
}

export default function Itineraries() {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);

  useEffect(() => {
    // Fetch itineraries from Supabase (mock data for now)
    const mockItineraries: Itinerary[] = [
      { id: '1', name: 'Magic Kingdom Adventure', date: '2023-12-15' },
      { id: '2', name: 'Epcot Exploration', date: '2023-12-20' },
      { id: '3', name: 'Hollywood Studios Tour', date: '2023-12-25' },
    ];
    setItineraries(mockItineraries);
  }, []);

  return (
    <div className="py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Your Itineraries</h1>
      <div className="space-y-4">
        {itineraries.map((itinerary) => (
          <Card key={itinerary.id}>
            <CardHeader>
              <CardTitle>{itinerary.name}</CardTitle>
              <CardDescription>Date: {itinerary.date}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/itinerary/${itinerary.id}`} className="text-blue-500 hover:underline">
                View Itinerary
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}