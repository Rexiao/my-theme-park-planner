'use client';
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { createClient } from '@/utils/supabase/client';

interface ItineraryContentProps {
  id: string;
}

export default function ItineraryContent({ id }: ItineraryContentProps) {
  const [selectedAttraction, setSelectedAttraction] = useState<string | null>(null);
  const [currentItinerary, setCurrentItinerary] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [itineraryName, setItineraryName] = useState<string>('');
  const supabase = createClient();

  useEffect(() => {
    const fetchItinerary = async () => {
      const { data, error } = await supabase
        .from('itineraries')
        .select('name, content')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching itinerary:', error);
      } else if (data) {
        setItineraryName(data.name);
        setCurrentItinerary(data.content);
      }
    };

    fetchItinerary();
  }, [id]);

  const handleAttractionClick = (attraction: string) => {
    setSelectedAttraction(attraction);
  };

  const updateItinerary = async (userRequest: string) => {
    setIsUpdating(true);
    try {
      const response = await fetch('/api/update-itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentItinerary, userRequest }),
      });

      if (!response.ok) {
        throw new Error('Failed to update itinerary');
      }

      const data = await response.json();
      setCurrentItinerary(data.updatedItinerary);

      // Update the itinerary in Supabase
      const { error } = await supabase
        .from('itineraries')
        .update({ content: data.updatedItinerary })
        .eq('id', id);

      if (error) {
        console.error('Error updating itinerary in Supabase:', error);
      }
    } catch (error) {
      console.error('Error updating itinerary:', error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsUpdating(false);
    }
  };

  const sections = currentItinerary.split('---').map((section) => section.trim());

  return (
    <div className="py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">{itineraryName}</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Before Your Visit</CardTitle>
        </CardHeader>
        <CardContent>
          <ReactMarkdown>{sections[0]}</ReactMarkdown>
        </CardContent>
      </Card>
      <Accordion type="single" collapsible className="w-full">
        {sections.slice(1).map((section, index) => (
          <AccordionItem key={index} value={`section-${index}`}>
            <AccordionTrigger>{section.split('\n')[0]}</AccordionTrigger>
            <AccordionContent>
              <div className="prose prose-sm sm:prose max-w-none">
                <ReactMarkdown
                  components={{
                    a: ({ ...props }) => (
                      <a
                        {...props}
                        onClick={(e) => {
                          e.preventDefault();
                          if (typeof props.children === 'string') {
                            handleAttractionClick(props.children);
                          } else if (
                            Array.isArray(props.children) &&
                            typeof props.children[0] === 'string'
                          ) {
                            handleAttractionClick(props.children[0]);
                          }
                        }}
                        className="text-blue-500 underline"
                      />
                    ),
                  }}
                >
                  {section}
                </ReactMarkdown>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Dialog open={!!selectedAttraction} onOpenChange={() => setSelectedAttraction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedAttraction}</DialogTitle>
            <DialogDescription>
              Would you like to mark this attraction as completed?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                updateItinerary(`Mark ${selectedAttraction} as completed`);
                setSelectedAttraction(null);
              }}
            >
              Mark as Completed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isUpdating}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Updating itinerary...</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}