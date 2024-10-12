'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface ThemePark {
  id: number;
  name: string;
}

interface CreateItineraryFormProps {
  themeParks: ThemePark[];
}

export default function CreateItineraryForm({ themeParks }: CreateItineraryFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    parkId: '',
    parkName: '',
    date: new Date(),
    adults: 1,
    children: 0,
    preferredPace: '',
    earlyEntry: false,
    lightningLaneMulti: false,
    memoryMaker: false,
    email: '',
    additionalComments: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [generatedItinerary, setGeneratedItinerary] = useState<string | null>(null);

  const handleParkChange = (value: string) => {
    const selectedPark = themeParks.find((park) => park.id.toString() === value);
    setFormData({
      ...formData,
      parkId: value,
      parkName: selectedPark ? selectedPark.name : '',
    });
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData({ ...formData, date });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'adults' || name === 'children' ? parseInt(value) || 0 : value,
    });
  };

  const handlePaceChange = (value: string) => {
    setFormData({ ...formData, preferredPace: value });
  };

  const handleSwitchChange = (name: string) => {
    setFormData((prev) => ({ ...prev, [name]: !prev[name as keyof typeof prev] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneratedItinerary(null);

    try {
      const response = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate itinerary');
      }

      const data = await response.json();
      setGeneratedItinerary(data.itinerary);
      toast({
        title: 'Success',
        description: 'Itinerary generated successfully!',
      });
      router.push('/itineraries');
    } catch (error) {
      console.error('Error generating itinerary:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate itinerary. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

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
              <Select onValueChange={handleParkChange} value={formData.parkId}>
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

            <div className="space-y-4">
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email to receive the itinerary"
              />
            </div>

            <div className="space-y-4">
              <Label htmlFor="additionalComments">Additional Comments or Preferences</Label>
              <Textarea
                id="additionalComments"
                name="additionalComments"
                value={formData.additionalComments}
                onChange={handleInputChange}
                placeholder="Enter any other requests or information that might affect your itinerary (e.g., preferred attractions, dining preferences, accessibility needs)"
              />
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Generating...' : 'Create Itinerary'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {generatedItinerary && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Generated Itinerary</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap">{generatedItinerary}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
