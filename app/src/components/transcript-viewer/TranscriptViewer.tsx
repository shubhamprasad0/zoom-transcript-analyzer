import useLocalStorage from "@/hooks/use-local-storage";

const TranscriptViewer = () => {
  const [transcript, setTranscript] = useLocalStorage("transcript", "");

  return (
    <>
      <h1 className="text-2xl font-bold">Transcript</h1>
      <p>{transcript}</p>
    </>
  );
};

export default TranscriptViewer;
