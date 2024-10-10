import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-8">
      <main className="text-center w-full max-w-md px-4">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8">Welcome to Park Planner</h1>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Plan Your Disney Adventure</CardTitle>
            <CardDescription>Create and manage your park itineraries</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Get started by viewing your existing itineraries or creating a new one.</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild className="w-full sm:w-auto">
              <Link href="/itineraries">View Itineraries</Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
