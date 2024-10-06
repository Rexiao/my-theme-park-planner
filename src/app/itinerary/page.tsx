'use client';
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

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
 
- **Attempt to join the Virtual Queue for [Tiana’s Bayou Adventure]()** (if available).  
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
  - If the wait exceeds 30 minutes, skip for now and head to **[Space Mountain]()** or **[Buzz Lightyear’s Space Ranger Spin]()**.

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

export default function Itinerary() {
  const [selectedAttraction, setSelectedAttraction] = useState<string | null>(null);
  const [currentItinerary, setCurrentItinerary] = useState<string>(itineraryMarkdown);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  useEffect(() => {
    // Fetch the initial itinerary from the database
    // This is just a placeholder, replace with actual API call
    const fetchInitialItinerary = async () => {
      // const response = await fetch('/api/get-itinerary');
      // const data = await response.json();
      // setCurrentItinerary(data.itinerary);
    };

    fetchInitialItinerary();
  }, []);

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

  return (
    <div className="p-8">
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
              href="#"
              className="text-blue-500 underline"
            />
          ),
        }}
      >
        {currentItinerary}
      </ReactMarkdown>

      {selectedAttraction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-lg font-bold">{selectedAttraction}</h2>
            <p>Would you like to start or finish this attraction?</p>
            <button
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => {
                updateItinerary(`Mark ${selectedAttraction} as completed`);
                setSelectedAttraction(null);
              }}
            >
              Mark as Completed
            </button>
            <button
              className="mt-2 ml-2 px-4 py-2 bg-gray-300 text-black rounded"
              onClick={() => setSelectedAttraction(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {isUpdating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-lg">
            <p>Updating itinerary...</p>
          </div>
        </div>
      )}
    </div>
  );
}