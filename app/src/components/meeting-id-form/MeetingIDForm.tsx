import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import useLocalStorage from "@/hooks/use-local-storage";

const MeetingIDForm = () => {
  const [meetingID, setMeetingID] = useState("");
  const [transcriptUrl, setTranscriptUrl] = useLocalStorage(
    "transcript_url",
    ""
  );

  const onSubmit = async () => {
    const url = `/api/transcripts?meeting_id=${meetingID}`;
    try {
      const res = await fetch(url);
      if (res.ok) {
        const resData = await res.json();
        setTranscriptUrl(resData.url);
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
