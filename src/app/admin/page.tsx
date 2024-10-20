'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const passwordFormSchema = z
  .object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' })
      .optional(),
  })
  .refine(
    (data) => {
      if (data.password === undefined || data.password === '') {
        return true;
      }
      return data.password.length >= 6;
    },
    {
      message: 'Password must be at least 6 characters long',
      path: ['password'],
    },
  );

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: { email: '', password: '' },
  });

  const handleSetPassword = async (values: z.infer<typeof passwordFormSchema>) => {
    setIsLoading(true);
    try {
      const password = values.password || '123456';
      const response = await fetch('/api/admin/invite-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Signup link generated for ${values.email}`,
        });
        passwordForm.reset();
      } else {
        throw new Error(data.error || 'Failed to generate signup link');
      }
    } catch (error) {
      console.error('Error generating signup link:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate signup link. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div>
        <h2 className="text-xl font-semibold mb-4">Generate Signup Link</h2>
        <Form {...passwordForm}>
          <form onSubmit={passwordForm.handleSubmit(handleSetPassword)} className="space-y-4">
            <FormField
              control={passwordForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} placeholder="user@example.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={passwordForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                      placeholder="Leave blank for default password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Generating Link...' : 'Generate Signup Link'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
