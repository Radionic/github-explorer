import { Repository } from "@/components/repo-card";
import { useQuery } from "@tanstack/react-query";

const REPOS_PER_PAGE = 100;

export const useStarredRepos = ({
  username,
  currentPage,
  reposPerPage = REPOS_PER_PAGE,
}: {
  username: string;
  currentPage: number;
  reposPerPage?: number;
}) => {
  const {
    data: allRepos,
    isLoading,
    error,
  } = useQuery<Repository[]>({
    queryKey: ["starred", username],
    queryFn: async () => {
      const response = await fetch(`/api/github/starred?username=${username}`);
      if (!response.ok) {
        throw new Error("Failed to fetch starred repos");
      }
      return (await response.json()).repos;
    },
    enabled: !!username,
    staleTime: Infinity, // Never revalidate
  });

  // Get repositories of current page
  const currentRepos = allRepos?.slice(
    (currentPage - 1) * reposPerPage,
    currentPage * reposPerPage
  );

  const totalCount = allRepos?.length ?? 0;
  const totalPages = Math.ceil(totalCount / reposPerPage);

  return { currentRepos, isLoading, error, totalPages, totalCount };
};
