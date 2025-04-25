import { Repository } from "@/components/repo-card";

export async function fetchAllStarredRepos({
  username,
  perPage = 100,
}: {
  username: string;
  perPage?: number;
}): Promise<Repository[]> {
  const allRepos: Repository[] = [];

  try {
    let currentPage = 1;
    while (true) {
      const response = await fetch(
        `https://api.github.com/users/${username}/starred?page=${currentPage++}&per_page=${perPage}`,
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API responded with status ${response.status}`);
      }

      const repos = (await response.json()) as Repository[];
      allRepos.push(...repos);

      if (repos.length < perPage || repos.length === 0) {
        break;
      }
    }
    return allRepos;
  } catch (error) {
    console.error("Error fetching all starred repos:", error);
    throw error;
  }
}
