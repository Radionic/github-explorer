import { fetchAllStarredRepos } from "@/lib/github";
import { type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const username = searchParams.get("username");
  if (!username) {
    return Response.json({ error: "Missing username" }, { status: 400 });
  }
  const repos = await fetchAllStarredRepos({ username });
  return Response.json({ repos });
}
