"use server";

import { Repository } from "@/components/repo-card";
import { upstash } from "@/lib/upstash";
import { QueryMode } from "@upstash/vector";

export const searchRepos = async ({ query }: { query: string }) => {
  const result = await upstash.query({
    data: `Represent this sentence for searching relevant passages: ${query}`,
    topK: 30,
    includeMetadata: true,
    queryMode: QueryMode.DENSE,
  });
  console.log(
    "Scores",
    result.map((r) => `${r.id}: ${r.score}`)
  );
  return result.map((r) => r.metadata as unknown as Repository);
};
