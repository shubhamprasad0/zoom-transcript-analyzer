const TranscriptViewer = ({ transcript }: { transcript: string }) => {
  return (
    <>
      <h1 className="text-2xl font-bold">Transcript</h1>
      <p>{transcript}</p>
    </>
  );
};

export default TranscriptViewer;
