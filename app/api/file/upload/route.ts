import { del, list, put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const file = request.body;
  const filename = searchParams.get("filename");
  let blob;
  if (file && filename) {
    blob = await put(filename, file, {
      access: "public",
    });
    return NextResponse.json(blob);
  }
  return NextResponse.json({});
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const urlToDelete = searchParams.get("url") as string;
  await del(urlToDelete);

  return new Response();
}

export async function GET(request: Request) {
  const { blobs } = await list();
  for (let blob of blobs) {
    await del(blob.url);
  }
  return Response.json(blobs);
}
