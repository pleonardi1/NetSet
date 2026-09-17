import { Suspense } from "react";
import { SessionWorkout } from "@/components/session-workout";

type SessionPageProps = PageProps<"/session/[id]">;

export default async function SessionPage({ params }: SessionPageProps) {
  const { id } = await params;
  return (
    <Suspense fallback={null}>
      <SessionWorkout sessionId={id} />
    </Suspense>
  );
}
