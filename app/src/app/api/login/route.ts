import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  let code: string | undefined;

  // Parse body
  try {
    const body = await request.text();
    const parsedBody = body ? JSON.parse(body) : {};
    code = parsedBody.code;
  } catch (error) {
    console.error("Error parsing request body: ", error);
    return new Response(JSON.stringify({ msg: "Invalid request body" }), {
      status: 400,
    });
  }

  if (!code) {
    return new Response(JSON.stringify({ msg: "Invalid code provided" }), {
      status: 400,
    });
  }

  // call zoom API with code to get access token
  const tokenUrl = process.env.ZOOM_OAUTH_TOKEN_URL!;
  const secret = Buffer.from(
    `${process.env.ZOOM_OAUTH_CLIENT_ID!}:${
      process.env.ZOOM_OAUTH_CLIENT_SECRET
    }`
  ).toString("base64");
  const res = await fetch(tokenUrl, {
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.ZOOM_OAUTH_REDIRECT_URI!,
    }),
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${secret}`,
    }),
  });
  if (res.status !== 200) {
    return new Response(JSON.stringify({ msg: "Failed to get access token" }), {
      status: res.status,
    });
  }

  const responseData = await res.json();
  return new Response(JSON.stringify({ token: responseData.access_token }));
}
