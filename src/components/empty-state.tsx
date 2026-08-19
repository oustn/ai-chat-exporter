import { MessageSquareText } from "lucide-react";

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="mx-4 mt-4 flex min-h-28 flex-col items-center justify-center gap-3 rounded-md border bg-white px-6 text-center text-sm text-muted-foreground">
      <MessageSquareText className="size-5" aria-hidden="true" />
      <p className="m-0 leading-5">{message}</p>
    </div>
  );
}
