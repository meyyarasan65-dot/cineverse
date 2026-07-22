import { fetchFromTMDB } from "@/lib/tmdb";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  
  if (!query) {
    return NextResponse.json({ results: [] });
  }

  try {
    const data = await fetchFromTMDB(`/search/movie?query=${encodeURIComponent(query)}&include_adult=false`);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ results: [], error: "Failed to fetch" }, { status: 500 });
  }
}
