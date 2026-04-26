import { Spinner } from "@/components/ui/spinner";

type PageLoaderProps = {
  message: string;
};

export function PageLoader({ message }: PageLoaderProps) {
  return (
    <div className="bg-background flex min-h-screen w-full items-center justify-center">
      <div className="flex items-center gap-2">
        <Spinner className="fill-foreground h-5 w-5" />
        <p className="text-muted-foreground text-sm">{message}</p>
      </div>
    </div>
  );
}
