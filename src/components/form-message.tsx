import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircledIcon, CrossCircledIcon, InfoCircledIcon } from "@radix-ui/react-icons"

export type Message =
  | { success: string }
  | { error: string }
  | { message: string };

export function FormMessage({ message }: { message: Message }) {
  return (
    <div className="w-full max-w-md">
      {"success" in message && (
        <Alert variant="default">
          <CheckCircledIcon className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{message.success}</AlertDescription>
        </Alert>
      )}
      {"error" in message && (
        <Alert variant="destructive">
          <CrossCircledIcon className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{message.error}</AlertDescription>
        </Alert>
      )}
      {"message" in message && (
        <Alert>
          <InfoCircledIcon className="h-4 w-4" />
          <AlertTitle>Info</AlertTitle>
          <AlertDescription>{message.message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
