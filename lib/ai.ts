"use server";

import { generateObject } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { z } from "zod";

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
