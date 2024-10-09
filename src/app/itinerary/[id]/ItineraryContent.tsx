'use client';
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const itineraryMarkdown = `
**Before Your Visit (7 Days in Advance):**  
- **Purchase Lightning Lane Multi Pass**  for December 15th.
 
- **Purchase Individual Lightning Lane for TRON Lightcycle Run**  — Aim for a time between 2:00 PM and 3:00 PM.
**Book Your Initial Lightning Lane Selections:**  
- **Tier 1: Peter Pan's Flight**  — Aim for a time between 10:00 AM and 11:00 AM.
 
- **Tier 2: Haunted Mansion**  — Aim for 11:00 AM to 12:00 PM.
 
- **Tier 2: Jungle Cruise**  — Aim for 12:30 PM to 1:30 PM.

These timings ensure you can ride popular attractions without feeling rushed.

---

**Day of Your Visit**  
**Morning**  
**7:00 AM:**  
- Wake up and prepare for the day.
 
- Ensure your **My Disney Experience** app is ready.
 
- **Attempt to join the Virtual Queue for [Tiana's Bayou Adventure]()** (if available).  
  - If successful, modify your first Lightning Lane to **[Jungle Cruise]()** or **[Space Mountain]()** for the morning.

**7:30 AM:**  
- Enjoy a quick breakfast at your resort or grab something to go.

**7:50 AM:**  
- Board Disney transportation to Magic Kingdom.

**8:15 AM:**  
- Arrive at Magic Kingdom, pass through security, and enter the park.

**8:30 AM – 9:00 AM: Early Entry**  
- **Option 1: [Seven Dwarfs Mine Train]()**  
  - If the wait is under 30 minutes, ride it during Early Entry.  
  - If the wait exceeds 30 minutes, skip for now and head to **[Space Mountain]()** or **[Buzz Lightyear's Space Ranger Spin]()**.

**Additional Early Entry Options (if time permits):**  
- **[Space Mountain]()**  
- **[Buzz Lightyear's Space Ranger Spin]()**  
- **[The Many Adventures of Winnie the Pooh]()**

---

**9:00 AM – 10:00 AM:**  
- Explore **Fantasyland** and take early morning photos with low crowds.
 
- Ride **[The Many Adventures of Winnie the Pooh]()** if the line is short or use your early Lightning Lane for **[Peter Pan's Flight]()** around **10:00 AM**.

**10:00 AM:**  
- **[Peter Pan's Flight (Lightning Lane)]()** — After tapping in, book your next Lightning Lane: **[Big Thunder Mountain Railroad]()** for the earliest time after 2:30 PM.

---

**10:30 AM – 11:00 AM:**  
- **Rest Break**: Grab a coffee or snack at **Main Street Bakery** while exploring Fantasyland.

**11:00 AM:**  
- **[Haunted Mansion (Lightning Lane)]()** — After tapping in, book your next Lightning Lane: **[Pirates of the Caribbean]()** for 12:30 PM to 1:30 PM.

---

**Midday (12:00 PM – 2:00 PM):**  
**12:00 PM:**  
- Lunch at **Columbia Harbour House** (Liberty Square) for seafood and sandwiches.  
  - Alternative: **Pecos Bill Tall Tale Inn and Café** (Frontierland) for Tex-Mex options.

**12:30 PM:**  
- **[Pirates of the Caribbean (Lightning Lane)]()** — After tapping in, book your next Lightning Lane: **[Buzz Lightyear's Space Ranger Spin]()** for after 4:00 PM.

---

**Afternoon (2:00 PM – 4:00 PM):**  
**2:00 PM:**  
- **[TRON Lightcycle Run (Individual Lightning Lane)]()**  
  - Enjoy the thrilling ride in Tomorrowland. Afterward, take a few moments to explore Tomorrowland.

**2:30 PM:**  
- **[Big Thunder Mountain Railroad (Lightning Lane)]()** — After tapping in, book your next Lightning Lane: **[Space Mountain]()** for after 5:00 PM.

**3:00 PM:**  
- Watch the **Festival of Fantasy Parade** in Liberty Square. Find a viewing spot that allows for easy movement to **[Jungle Cruise]()** afterward.

**3:30 PM:**  
- **[Jungle Cruise (Lightning Lane)]()** — After tapping in, book your next Lightning Lane: **[The Many Adventures of Winnie the Pooh]()** for after 6:00 PM.

---

**Evening (4:00 PM – 7:00 PM):**  
**4:00 PM:**  
- **[Buzz Lightyear's Space Ranger Spin (Lightning Lane)]()** — After tapping in, book your next Lightning Lane: **[Tomorrowland Speedway]()** for after 6:30 PM.

**4:30 PM:**  
- **Rest Break**:  
  - Ride the **[PeopleMover]()** for a relaxing tour of Tomorrowland.  
  - Visit **[Carousel of Progress]()** (optional) for an air-conditioned break.

**5:30 PM:**  
- **Dinner at Cosmic Ray's Starlight Café** (Tomorrowland) — Enjoy a variety of quick-service options and entertainment by Sonny Eclipse.

**6:30 PM:**  
- **[Space Mountain (Lightning Lane)]()** — After tapping in, check for any additional Lightning Lane availability.

---

**Nighttime (7:00 PM – 9:00 PM):**  
**7:00 PM:**  
- **[The Many Adventures of Winnie the Pooh (Lightning Lane)]()**

**7:30 PM:**  
- **[Tomorrowland Speedway (Lightning Lane)]()**

**8:00 PM:**  
- **Prepare for Fireworks**: Find a spot on Main Street, U.S.A. or near the **Partners Statue** to view the **Happily Ever After Fireworks Show**.  
  - Take nighttime photos with Memory Maker photographers.

**8:30 PM:**  
- **[Happily Ever After Fireworks Show]()** — Enjoy the magical display.

---

**Post-Fireworks & Park Close:**  
**9:00 PM:**  
- As the park closes, enjoy a leisurely stroll down **Main Street, U.S.A.**  
  - This is a great time to shop for souvenirs or take final photos with the iconic backdrop of the **Cinderella Castle**.

**9:30 PM:**  
- Depart for **Coronado Springs Resort** using Disney transportation.

`;

interface ItineraryContentProps {
  id: string;
  userEmail: string;
}

export default function ItineraryContent({ id, userEmail }: ItineraryContentProps) {
  const [selectedAttraction, setSelectedAttraction] = useState<string | null>(null);
  const [currentItinerary, setCurrentItinerary] = useState<string>(itineraryMarkdown);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  useEffect(() => {
    // Fetch the itinerary from Supabase using the id
    // This is just a placeholder, replace with actual API call
    const fetchItinerary = async () => {
      // const response = await fetch(`/api/get-itinerary/${id}`);
      // const data = await response.json();
      // setCurrentItinerary(data.itinerary);
      console.log(`Fetching itinerary with id: ${id}`);
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
    } catch (error) {
      console.error('Error updating itinerary:', error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsUpdating(false);
    }
  };

  const sections = currentItinerary.split('---').map(section => section.trim());

  return (
    <div className="py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Itinerary {id}</h1>
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
                    a: ({ node, ...props }) => (
                      <a
                        {...props}
                        onClick={(e) => {
                          e.preventDefault();
                          if (typeof props.children === 'string') {
                            handleAttractionClick(props.children);
                          } else if (Array.isArray(props.children) && typeof props.children[0] === 'string') {
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
            <Button onClick={() => {
              updateItinerary(`Mark ${selectedAttraction} as completed`);
              setSelectedAttraction(null);
            }}>
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