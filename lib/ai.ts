"use server";

import { generateObject } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { z } from "zod";
import { Repository } from "@/components/repo-card";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const summarizeReadme = async ({
  repoName,
  description,
  readme,
}: {
  repoName: string;
  description: string;
  readme: string;
}) => {
  const { object } = await generateObject({
    model: openrouter("anthropic/claude-3.7-sonnet"),
    prompt: `Summarize the following GitHub repository.

Please:
- Focus on the main purpose and features of the repository instead of usage
- List similar alternatives, products, projects, or libraries
- Write down the keywords that describe the repository

Repo name:
${repoName}

Repo description:
${description}

Repo README:
${readme}`,
    schema: z.object({
      summary: z
        .string()
        .describe("A summary of the repository in less than 100 words"),
      alternatives: z
        .array(z.string())
        .describe("A list of similar alternatives"),
      keywords: z
        .array(z.string())
        .describe("A list of keywords that describe the repository"),
    }),
  });
  return { readme, ...object };
};

interface RerankResult {
  model: string;
  usage: {
    total_tokens: number;
  };
  results: {
    index: number;
    relevance_score: number;
  }[];
}

export const rerankRepos = async ({
  query,
  repos,
  topN = 30,
}: {
  query: string;
  repos: Repository[];
  topN?: number;
}) => {
  const requestData = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.JINA_API_KEY}`,
    },
    body: JSON.stringify({
      model: "jina-reranker-m0",
      query: query,
      top_n: topN,
      documents: repos.map(
        (r) => `${r.full_name}

Keywords: ${r.keywords?.join(", ")}

Alternatives: ${r.alternatives?.join(", ")}

${r.summary}`
      ),
      return_documents: false,
    }),
  };

  try {
    const response = await fetch("https://api.jina.ai/v1/rerank", requestData);
    if (!response.ok) {
      throw new Error(
        `Reranking API error: ${response.status} ${response.statusText}`
      );
    }
    const data = (await response.json()) as RerankResult;
    console.log(
      "Rerank result:",
      data.results.map(
        (r) => `${repos[r.index].full_name}: ${r.relevance_score}`
      )
    );
    return data.results
      .filter((r) => r.relevance_score > 0.7)
      .map((r) => repos[r.index]);
  } catch (error) {
    console.error("Reranking error:", error);
    return repos;
  }
};
