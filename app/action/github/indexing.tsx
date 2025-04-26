"use server";

import { Repository } from "@/components/repo-card";
import { fetchAllStarredRepos } from "@/lib/github";
import { upstash } from "@/lib/upstash";

const formatRepo = (repo: Repository) => {
  return `${repo.full_name}

Keywords: ${repo.keywords?.join(", ")}

Alternatives: ${repo.alternatives?.join(", ")}

${repo.summary || repo.description}`;
};

const upsertRepos = async ({ repos }: { repos?: Repository[] }) => {
  await upstash.upsert(
    repos?.map((repo) => {
      const { readme, ...rest } = repo;
      return {
        id: repo.full_name,
        data: formatRepo(repo),
        metadata: { ...rest },
      };
    }) ?? []
  );
};

export const indexRepos = async ({ username }: { username?: string }) => {
  if (!username) {
    return { error: "Missing username" };
  }

  const repos = await fetchAllStarredRepos({
    username,
    // maxPages: 1,
    // perPage: 3,
    withReadme: true,
  });
  await upsertRepos({ repos });
  return { repos };
};
