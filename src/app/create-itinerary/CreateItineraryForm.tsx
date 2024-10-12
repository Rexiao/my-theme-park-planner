'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';

interface ThemePark {
  id: number;
  name: string;
}

interface CreateItineraryFormProps {
  themeParks: ThemePark[];
}

export default function CreateItineraryForm({ themeParks }: CreateItineraryFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    park: '',
    date: new Date(),
    adults: 1,
    children: 0,
    mustHaveRides: [] as string[],
    preferredPace: '',
    earlyEntry: false,
    lightningLaneMulti: false,
    memoryMaker: false,
  });

  const handleParkChange = (value: string) => {
    setFormData({ ...formData, park: value });
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData({ ...formData, date });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: parseInt(value) || 0 });
  };

  const handleCheckboxChange = (ride: string) => {
    setFormData((prev) => ({
      ...prev,
      mustHaveRides: prev.mustHaveRides.includes(ride)
        ? prev.mustHaveRides.filter((r) => r !== ride)
        : [...prev.mustHaveRides, ride],
    }));
  };

  const handlePaceChange = (value: string) => {
    setFormData({ ...formData, preferredPace: value });
  };

  const handleSwitchChange = (name: string) => {
    setFormData((prev) => ({ ...prev, [name]: !prev[name as keyof typeof prev] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your backend or ChatGPT
    // For now, we'll just log it and redirect to the itineraries page
    router.push('/itineraries');
  };

  // This should be dynamically populated based on the selected park
  const popularRides = [
    "Space Mountain",
    "Big Thunder Mountain Railroad",
    "Splash Mountain",
    "Haunted Mansion",
    "Pirates of the Caribbean",
  ];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Itinerary</h1>
      <Card>
        <CardHeader>
          <CardTitle>Itinerary Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <Label htmlFor="park">Select Park</Label>
              <Select onValueChange={handleParkChange} value={formData.park}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a park" />
                </SelectTrigger>
                <SelectContent>
                  {themeParks.map((park) => (
                    <SelectItem key={park.id} value={park.id.toString()}>
                      {park.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label>Select Date</Label>
              <Calendar
                mode="single"
                selected={formData.date}
                onSelect={handleDateChange}
                className="rounded-md border"
              />
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="adults">Number of Adults</Label>
                <Input
                  type="number"
                  id="adults"
                  name="adults"
                  value={formData.adults}
                  onChange={handleInputChange}
                  min={1}
                />
              </div>
              <div>
                <Label htmlFor="children">Number of Children</Label>
                <Input
                  type="number"
                  id="children"
                  name="children"
                  value={formData.children}
                  onChange={handleInputChange}
                  min={0}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label>Must-Have Rides and Attractions</Label>
              {popularRides.map((ride) => (
                <div key={ride} className="flex items-center space-x-2">
                  <Checkbox
                    id={ride}
                    checked={formData.mustHaveRides.includes(ride)}
                    onCheckedChange={() => handleCheckboxChange(ride)}
                  />
                  <label htmlFor={ride}>{ride}</label>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <Label>Preferred Pace</Label>
              <RadioGroup onValueChange={handlePaceChange} value={formData.preferredPace}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="relaxed" id="relaxed" />
                  <label htmlFor="relaxed">Relaxed</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="moderate" id="moderate" />
                  <label htmlFor="moderate">Moderate</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="packed" id="packed" />
                  <label htmlFor="packed">Packed</label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <Label>Experience Enhancements</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="earlyEntry"
                  checked={formData.earlyEntry}
                  onCheckedChange={() => handleSwitchChange('earlyEntry')}
                />
                <label htmlFor="earlyEntry">Early Entry Access</label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="lightningLaneMulti"
                  checked={formData.lightningLaneMulti}
                  onCheckedChange={() => handleSwitchChange('lightningLaneMulti')}
                />
                <label htmlFor="lightningLaneMulti">Lightning Lane Multi Pass</label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="memoryMaker"
                  checked={formData.memoryMaker}
                  onCheckedChange={() => handleSwitchChange('memoryMaker')}
                />
                <label htmlFor="memoryMaker">Memory Maker</label>
              </div>
            </div>

            <Button type="submit">Create Itinerary</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
