'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { createClient } from '@/utils/supabase/client';

interface Itinerary {
  id: string;
  name: string;
  date: string;
}

interface ItinerariesListProps {
  userEmail: string;
}

export default function ItinerariesList({ userEmail }: ItinerariesListProps) {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchItineraries = async () => {
      const { data, error } = await supabase
        .from('itineraries')
        .select('id, name, date')
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching itineraries:', error);
      } else {
        setItineraries(data || []);
      }
    };

    fetchItineraries();
  }, []);

  return (
    <div className="py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Your Itineraries</h1>
      <p className="mb-4">Welcome, {userEmail}!</p>
      <div className="space-y-4">
        {itineraries.map((itinerary) => (
          <Card key={itinerary.id}>
            <CardHeader>
              <CardTitle>{itinerary.name}</CardTitle>
              <CardDescription>
                Date: {new Date(itinerary.date).toLocaleDateString()}
              </CardDescription>
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
