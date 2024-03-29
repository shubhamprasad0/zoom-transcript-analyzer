"use client";
import MeetingIDForm from "@/components/meeting-id-form/MeetingIDForm";
import QuestionsList from "@/components/questions-list/QuestionsList";
import TranscriptViewer from "@/components/transcript-viewer/TranscriptViewer";
import { Button } from "@/components/ui/button";
import useCookie from "@/hooks/use-cookie";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const token = useCookie("token");
  const [questions, setQuestions] = useState<string[]>([]);
  const [transcript, setTranscript] = useState("");

  const onZoomLoginClick = () => {
    const ZOOM_AUTH_URL = process.env.NEXT_PUBLIC_ZOOM_AUTH_URL;
    if (!ZOOM_AUTH_URL) {
      throw new Error("Could not find zoom auth url in environment!");
    }
    router.push(ZOOM_AUTH_URL);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        {!token ? (
          <Button className="font-bold" onClick={onZoomLoginClick}>
            Login with Zoom
          </Button>
        ) : (
          <>
            <MeetingIDForm
              setQuestions={setQuestions}
              setTranscript={setTranscript}
            />
            <TranscriptViewer transcript={transcript} />
            <QuestionsList questions={questions} />
          </>
        )}
      </div>
    </main>
  );
}
