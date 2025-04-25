import { Repository } from "@/components/repo-card";

interface FetchStarredReposParams {
  username: string;
  page?: number;
  perPage?: number;
}

export async function fetchStarredRepos({
  username,
  page = 1,
  perPage = 30,
}: FetchStarredReposParams): Promise<Repository[]> {
  if (!username) return [];

  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/starred?page=${page}&per_page=${perPage}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return [];
      }
      throw new Error(`GitHub API responded with status ${response.status}`);
    }

    const data = await response.json();
    return data as Repository[];
  } catch (error) {
    console.error("Error fetching starred repos:", error);
    throw error;
  }
}
