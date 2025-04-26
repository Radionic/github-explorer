import { indexRepos } from "@/app/action/github/indexing";
import { useMutation } from "@tanstack/react-query";

export const useIndexingRepos = () => {
  return useMutation({
    mutationFn: indexRepos,
    onSuccess: (data) => {
      console.log("Wow!", data);
    },
  });
};
