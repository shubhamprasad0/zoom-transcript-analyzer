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

  return new Response(JSON.stringify({ msg: "success", url: transcriptUrl }));
}
