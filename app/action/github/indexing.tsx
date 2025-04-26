"use server";

import { fetchAllStarredRepos } from "@/lib/github";
import { upsertRepos } from "@/lib/indexing";

export const indexRepos = async ({ username }: { username?: string }) => {
  if (!username) {
    return { error: "Missing username" };
  }

  const repos = await fetchAllStarredRepos({
    username,
    // perPage: 3,
    withReadme: true,
  });
  await upsertRepos({ repos });
  return { repos };
};
