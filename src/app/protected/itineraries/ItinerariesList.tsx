'use client';
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

interface Itinerary {
  id: string;
  name: string;
  date: string;
}

export default function ItinerariesList() {
  const router = useRouter();
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [userEmail, setUserEmail] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
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

  const deleteItinerary = async () => {
    if (!deleteId) return;

    const { error } = await supabase.from('itineraries').delete().eq('id', deleteId);

    if (error) {
      console.error('Error deleting itinerary:', error);
    } else {
      setItineraries(itineraries.filter((itinerary) => itinerary.id !== deleteId));
    }
    setIsDeleteDialogOpen(false);
    setDeleteId(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">Your Itineraries</h1>
      <p className="mb-6 text-center text-lg">Welcome, {userEmail}!</p>
      {itineraries.length === 0 ? (
        <div className="text-center">
          <p className="mb-4 text-lg">You don't have any itineraries yet.</p>
          <Button onClick={() => router.push('/protected/create-itinerary')}>
            Create Your First Itinerary
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {itineraries.map((itinerary) => (
            <Card key={itinerary.id} className="flex flex-col">
              <CardHeader>
                <Link href={`/protected/itinerary/${itinerary.id}`}>
                  <CardTitle className="text-xl text-blue-500 hover:underline cursor-pointer">
                    {itinerary.name}
                  </CardTitle>
                </Link>
                <CardDescription>
                  Date: {new Date(itinerary.date).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-end items-center mt-auto">
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      onClick={() => setDeleteId(itinerary.id)}
                      className="w-full sm:w-auto"
                    >
                      Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you sure you want to delete this itinerary?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently delete your itinerary.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={deleteItinerary}>
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
