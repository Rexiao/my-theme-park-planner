import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <main className="text-center">
        <h1 className="text-4xl font-bold mb-8">Welcome to Park Planner</h1>
        <Image
          className="mb-8"
          src="https://nextjs.org/icons/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <Link 
          href="/itinerary" 
          className="rounded-full bg-blue-500 text-white px-6 py-3 text-lg font-semibold hover:bg-blue-600 transition-colors"
        >
          View Itinerary
        </Link>
      </main>
    </div>
  );
}
