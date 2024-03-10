import useLocalStorage from "@/hooks/use-local-storage";
import { useEffect, useState } from "react";

const TranscriptViewer = () => {
  const [transcript, setTranscript] = useLocalStorage("transcript", "");

  return (
    <>
      <h1>Transcript</h1>
      <p>{transcript}</p>
    </>
  );
};

export default TranscriptViewer;
