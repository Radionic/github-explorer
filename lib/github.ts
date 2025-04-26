import { Repository } from "@/components/repo-card";

export async function fetchAllStarredRepos({
  username,
  perPage = 100,
  maxPages,
  withReadme = false,
}: {
  username: string;
  perPage?: number;
  maxPages?: number;
  withReadme?: boolean;
}): Promise<Repository[]> {
  const allRepos: Repository[] = [];
  const apiKey = process.env.GITHUB_API_KEY;
  try {
    let currentPage = 1;
    while (true) {
      console.log(`Fetching page ${currentPage} of ${username}`);
      const response = await fetch(
        `https://api.github.com/users/${username}/starred?page=${currentPage++}&per_page=${perPage}`,
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
            Authorization: apiKey ? `Bearer ${apiKey}` : "",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API responded with status ${response.status}`);
      }

      const repos = (await response.json()) as Repository[];
      allRepos.push(...repos);

      if (
        (maxPages && currentPage > maxPages) ||
        repos.length < perPage ||
        repos.length === 0
      ) {
        break;
      }
    }

    if (withReadme) {
      const readmePromises = allRepos.map((repo) =>
        getReadme({ repoFullName: repo.full_name })
      );
      const readmes = await Promise.all(readmePromises);
      return allRepos.map((repo, index) => ({
        ...repo,
        readme: readmes[index],
      }));
    }

    console.log("Fetched all starred repos:", allRepos);
    return allRepos;
  } catch (error) {
    console.error("Error fetching all starred repos:", error);
    throw error;
  }
}

// export interface Readme {
//   type: string;
//   encoding: string;
//   size: number;
//   name: string;
//   path: string;
//   content: string;
//   sha: string;
//   url: string;
//   git_url: string | null;
//   html_url: string | null;
//   download_url: string | null;
//   _links: {
//     git: string | null;
//     html: string | null;
//     self: string;
//   };
//   target?: string;
//   submodule_git_url?: string;
// }

export async function getReadme({
  repoFullName,
}: {
  repoFullName: string;
}): Promise<string> {
  try {
    const apiKey = process.env.GITHUB_API_KEY;
    const response = await fetch(
      `https://api.github.com/repos/${repoFullName}/readme`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: apiKey ? `Bearer ${apiKey}` : "",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API responded with status ${response.status}`);
    }

    const readmeData = (await response.json()) as { content: string };
    const decodedContent = Buffer.from(readmeData.content, "base64").toString(
      "utf-8"
    );
    return decodedContent;
  } catch (error) {
    console.error("Error fetching repository README:", error);
    return "";
  }
}
