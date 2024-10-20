'use client';
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { createClient } from '@/utils/supabase/client';

interface Itinerary {
  id: string;
  name: string;
  date: string;
}

export default function ItinerariesList() {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [userEmail, setUserEmail] = useState('');
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

    // get email
    const getEmail = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        return '';
      }
      setUserEmail(data.user.email ?? '');
    };

    fetchItineraries();
    getEmail();
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
              <Link
                href={`/protected/itinerary/${itinerary.id}`}
                className="text-blue-500 hover:underline"
              >
                View Itinerary
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
