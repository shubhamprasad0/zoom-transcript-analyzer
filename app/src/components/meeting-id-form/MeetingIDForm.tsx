import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const MeetingIDForm = ({
  setTranscript,
  setQuestions,
}: {
  setTranscript: (transcript: string) => void;
  setQuestions: (questions: string[]) => void;
}) => {
  const [meetingID, setMeetingID] = useState("");

  const onSubmit = async () => {
    const url = `/api/transcripts?meeting_id=${meetingID}`;
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        const resData = await res.json();
        setTranscript(resData.transcript);
        setQuestions(resData.questions);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex w-4/5 gap-2">
      <Input
        placeholder="Zoom Meeting ID"
        value={meetingID}
        onChange={(e) => setMeetingID(e.target.value)}
      />
      <Button onClick={onSubmit} disabled={meetingID === ""}>
        Submit
      </Button>
    </div>
  );
};

export default MeetingIDForm;
