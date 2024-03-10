import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const MeetingIDForm = () => {
  const [meetingID, setMeetingID] = useState("");

  const onSubmit = () => {
    console.log(meetingID);
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
