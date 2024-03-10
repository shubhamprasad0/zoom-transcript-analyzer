import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { ZOOM_BASE_URL } from "@/constants";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const meetingId = searchParams.get("meeting_id");

  if (meetingId === "") {
    return new Response(JSON.stringify({ msg: "Invalid meeting id" }), {
      status: 400,
    });
  }

  const token = cookies().get("token");
  if (!token?.value) {
    return new Response(
      JSON.stringify({ msg: "Invalid token or token not present" }),
      {
        status: 401,
      }
    );
  }

  const url = `${ZOOM_BASE_URL}/meetings/${meetingId}/recordings`;
  const res = await fetch(url, {
    method: "GET",
    headers: new Headers({
      Authorization: `Bearer ${token.value}`,
    }),
  });
  const resData = await res.json();
  if (!res.ok) {
    return new Response(
      JSON.stringify({
        msg: resData.message,
      }),
      {
        status: res.status,
      }
    );
  }

  const transcriptData = resData.recording_files.filter(
    (r: { file_type: string }) => r.file_type === "TRANSCRIPT"
  );
  if (transcriptData.length === 0) {
    return new Response(
      JSON.stringify({ msg: "Could not find transcript for the meeting" }),
      { status: 404 }
    );
  }

  const transcriptUrl = transcriptData[0].download_url;
  const transcriptResponse = await fetch(transcriptUrl, {
    headers: new Headers({
      Authorization: `Bearer ${token.value}`,
    }),
  });
  const transcriptText = await transcriptResponse.text();
  const sentences = extractSentencesFromVTT(transcriptText);

  return new Response(
    JSON.stringify({
      msg: "success",
      transcript: transcriptText,
      questions: sentences,
    })
  );
}

function extractSentencesFromVTT(vtt: string): string[] {
  // Remove the WEBVTT header, timestamps, and any empty lines
  const dialogueLines = vtt.replace(
    /WEBVTT\n\n|\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}\n/g,
    ""
  );

  // Split by line breaks to get individual lines
  let lines = dialogueLines.split("\n");

  // Combine lines to form the complete dialogue for each speaker
  let combinedLines = [];
  let currentLine = "";
  lines.forEach((line) => {
    if (/^\d+$/.test(line)) {
      // Skip line numbers
      return;
    } else if (/[A-Za-z]+ [A-Za-z]+:/.test(line)) {
      // Speaker line
      if (currentLine) {
        combinedLines.push(currentLine);
        currentLine = line;
      } else {
        currentLine = line;
      }
    } else {
      currentLine += " " + line; // Continuation of a speaker's dialogue
    }
  });
  if (currentLine) {
    // Add the last accumulated line
    combinedLines.push(currentLine);
  }

  return combinedLines;
}
