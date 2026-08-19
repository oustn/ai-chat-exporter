import { CircleAlert } from "lucide-react";

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="mx-4 mt-4 flex gap-3 rounded-md border border-destructive/30 bg-red-50 px-4 py-3 text-sm text-destructive">
      <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <p className="m-0 leading-5">{message}</p>
    </div>
  );
}
