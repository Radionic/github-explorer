import { searchRepos } from "@/app/action/github/searching";
import { useQuery } from "@tanstack/react-query";

export const useSearchRepos = ({ query }: { query: string }) => {
  return useQuery({
    queryKey: ["search", query],
    queryFn: () => searchRepos({ query }),
    enabled: !!query,
    refetchOnWindowFocus: false,
  });
};
