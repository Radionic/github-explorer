import { Repository } from "@/components/repo-card";
import { Index } from "@upstash/vector";

const index = new Index({
  url: process.env.UPSTASH_VECTOR_URL,
  token: process.env.UPSTASH_VECTOR_API_KEY,
});

const formatRepo = (repo: Repository) => {
  return `Repo: ${repo.full_name}
Description: ${repo.description}
${repo.readme}`;
};

export const upsertRepos = async ({ repos }: { repos?: Repository[] }) => {
  await index.upsert(
    repos?.map((repo) => {
      const { readme, ...rest } = repo;
      return {
        id: repo.id.toString(),
        data: formatRepo(repo),
        metadata: { ...rest },
      };
    }) ?? []
  );
};
