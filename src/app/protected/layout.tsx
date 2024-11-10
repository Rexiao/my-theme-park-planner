import PubSubNotifications from '@/components/PubSubNotifications';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PubSubNotifications />
      {children}
    </>
  );
} 