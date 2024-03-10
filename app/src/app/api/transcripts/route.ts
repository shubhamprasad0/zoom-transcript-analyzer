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

  const classifySentences = async (payload: any) => {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/facebook/bart-large-mnli",
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINFACE_TOKEN}`,
        },
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
    const result = await response.json();
    return result;
  };

  const modelOutput = await classifySentences({
    inputs: sentences,
    parameters: { candidate_labels: ["question", "not_question"] },
  });
  const questions = [];
  for (let output of modelOutput) {
    if (output.scores[0] > 0.8) {
      questions.push(output.sequence);
    }
  }

  return new Response(
    JSON.stringify({
      msg: "success",
      transcript: transcriptText,
      questions: questions,
      modelOutput: modelOutput,
    })
  );
}

function extractSentencesFromVTT(vtt: string): string[] {
  // Remove the WEBVTT header, timestamps, and any empty lines
  const dialogueLines = vtt.replace(
    /WEBVTT\r\n|\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}\r\n/g,
    ""
  );

  // Split by line breaks to get individual lines
  let lines = dialogueLines.split("\r\n");

  // Combine lines to form the complete dialogue for each speaker
  let sentences = [];
  let currentLine = "";
  lines.forEach((line) => {
    if (/^\d+$/.test(line)) {
      // Skip line numbers
      return;
    } else if (/[A-Za-z]+ [A-Za-z]+:/.test(line)) {
      // Speaker line
      if (currentLine) {
        sentences.push(currentLine.trim());
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
    sentences.push(currentLine.trim());
  }

  sentences = sentences.filter((line) => line !== "");

  return sentences;
}
