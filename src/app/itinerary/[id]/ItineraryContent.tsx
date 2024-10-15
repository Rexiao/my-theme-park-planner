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
import { Clock, MapPin } from 'lucide-react';

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
    <div className="py-4 px-4 sm:py-8 max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8">{itineraryName}</h1>
      <Card className="mb-6 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl sm:text-2xl">Before Your Visit</CardTitle>
        </CardHeader>
        <CardContent>
          <ReactMarkdown className="prose prose-sm sm:prose max-w-none">
            {sections[0]}
          </ReactMarkdown>
        </CardContent>
      </Card>
      <Accordion type="single" collapsible className="w-full space-y-3">
        {sections.slice(1).map((section, index) => (
          <AccordionItem
            key={index}
            value={`section-${index}`}
            className="border rounded-md shadow-sm"
          >
            <AccordionTrigger className="px-3 py-2 sm:px-4 sm:py-3 hover:bg-gray-50">
              <div className="flex items-center space-x-2 w-full">
                <div className="flex-shrink-0">
                  {index === 0 ? (
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                  ) : (
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                  )}
                </div>
                <span className="text-base sm:text-lg font-medium text-left flex-grow">
                  {section
                    .split('\n')[0]
                    .replace(/^#+\s*/, '')
                    .replace(/\*\*/g, '')}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-3 py-2 sm:px-4 sm:py-3">
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h3 className="text-lg font-semibold mt-3 mb-2">{children}</h3>
                    ),
                    h2: ({ children }) => (
                      <h4 className="text-base font-semibold mt-2 mb-1">{children}</h4>
                    ),
                    p: ({ children }) => <p className="mb-2 text-sm">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
                    li: ({ children }) => <li className="mb-1 text-sm">{children}</li>,
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
