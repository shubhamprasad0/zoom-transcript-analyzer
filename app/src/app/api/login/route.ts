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

  // TODO: call zoom API with code to get access token
  return new Response(JSON.stringify({ token: code }));
}
