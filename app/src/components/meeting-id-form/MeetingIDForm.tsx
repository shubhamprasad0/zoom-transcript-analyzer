import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import useLocalStorage from "@/hooks/use-local-storage";

const MeetingIDForm = () => {
  const [meetingID, setMeetingID] = useState("");
  const [_, setTranscript] = useLocalStorage("transcript", "");

  const onSubmit = async () => {
    const url = `/api/transcripts?meeting_id=${meetingID}`;
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        const resData = await res.json();
        setTranscript(resData.transcript);
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
