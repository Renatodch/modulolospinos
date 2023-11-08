import { put } from "@vercel/blob";
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
