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
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

interface ThemePark {
  id: number;
  name: string;
}

interface CreateItineraryFormProps {
  themeParks: ThemePark[];
}

const formSchema = z.object({
  parkId: z.string().min(1, 'Please select a park'),
  parkName: z.string().min(1, 'Park name is required'),
  date: z.date().min(new Date(), 'Date must be in the future'),
  adults: z.number().int().min(1, 'At least one adult is required'),
  children: z.number().int().min(0, 'Number of children cannot be negative'),
  preferredPace: z.enum(['relaxed', 'moderate', 'packed'], {
    required_error: 'Please select a preferred pace',
  }),
  earlyEntry: z.boolean(),
  lightningLaneMulti: z.boolean(),
  memoryMaker: z.boolean(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  additionalComments: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function CreateItineraryForm({ themeParks }: CreateItineraryFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      parkId: '',
      parkName: '',
      date: new Date(),
      adults: 1,
      children: 0,
      preferredPace: 'moderate',
      earlyEntry: false,
      lightningLaneMulti: false,
      memoryMaker: false,
      email: '',
      additionalComments: '',
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = form;

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to generate itinerary');
      }

      const responseData = await response.json();

      if (responseData.success) {
        toast({
          title: 'Success',
          description: 'Itinerary generated successfully!',
        });
        router.push(`/protected/itinerary/${responseData.itineraryId}`);
      } else {
        throw new Error(responseData.error || 'Failed to generate itinerary');
      }
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

  // Update existing handlers to use setValue
  const handleParkChange = (value: string) => {
    const selectedPark = themeParks.find((park) => park.id.toString() === value);
    if (selectedPark) {
      setValue('parkId', value);
      setValue('parkName', selectedPark.name);
    } else {
      // themepark has data error, but it should not happen
      toast({
        title: 'Error',
        description: 'Failed to get park data. Please refresh the page.',
        variant: 'destructive',
      });
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setValue('date', date);
    }
  };

  const handlePaceChange = (value: string) => {
    setValue('preferredPace', value as 'relaxed' | 'moderate' | 'packed');
  };

  const handleSwitchChange = (name: 'earlyEntry' | 'lightningLaneMulti' | 'memoryMaker') => {
    setValue(name, !watch(name));
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && event.target instanceof HTMLElement) {
      if (event.target.id === 'submit-button') {
        event.preventDefault();
      }
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
          <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown} className="space-y-8">
            {/* Update form fields to use register and display error messages */}
            <div className="space-y-4">
              <Label htmlFor="park">Select Park</Label>
              <Select onValueChange={handleParkChange} value={watch('parkId')}>
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
              {errors.parkId && <p className="text-red-500 text-sm">{errors.parkId.message}</p>}
            </div>

            <div className="space-y-4">
              <Label>Select Date</Label>
              <Calendar
                mode="single"
                selected={watch('date')}
                onSelect={handleDateChange}
                className="rounded-md border"
              />
              {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="adults">Number of Adults</Label>
                <Input
                  type="number"
                  id="adults"
                  {...register('adults', { valueAsNumber: true })}
                  min={1}
                />
                {errors.adults && <p className="text-red-500 text-sm">{errors.adults.message}</p>}
              </div>
              <div>
                <Label htmlFor="children">Number of Children</Label>
                <Input
                  type="number"
                  id="children"
                  {...register('children', { valueAsNumber: true })}
                  min={0}
                />
                {errors.children && (
                  <p className="text-red-500 text-sm">{errors.children.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <Label>Preferred Pace</Label>
              <RadioGroup onValueChange={handlePaceChange} value={watch('preferredPace')}>
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
              {errors.preferredPace && (
                <p className="text-red-500 text-sm">{errors.preferredPace.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <Label>Experience Enhancements</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="earlyEntry"
                  checked={watch('earlyEntry')}
                  onCheckedChange={() => handleSwitchChange('earlyEntry')}
                />
                <label htmlFor="earlyEntry">Early Entry Access</label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="lightningLaneMulti"
                  checked={watch('lightningLaneMulti')}
                  onCheckedChange={() => handleSwitchChange('lightningLaneMulti')}
                />
                <label htmlFor="lightningLaneMulti">Lightning Lane Multi Pass</label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="memoryMaker"
                  checked={watch('memoryMaker')}
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
                {...register('email')}
                placeholder="Enter your email to receive the itinerary"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            <div className="space-y-4">
              <Label htmlFor="additionalComments">Additional Comments or Preferences</Label>
              <Textarea
                id="additionalComments"
                {...register('additionalComments')}
                placeholder="Enter any other requests or information that might affect your itinerary (e.g., preferred attractions, dining preferences, accessibility needs)"
              />
            </div>

            <Button type="submit" disabled={isLoading} id="submit-button">
              {isLoading ? 'Generating...' : 'Create Itinerary'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
