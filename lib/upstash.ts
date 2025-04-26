import { Index } from "@upstash/vector";

export const upstash = new Index({
  url: process.env.UPSTASH_VECTOR_URL,
  token: process.env.UPSTASH_VECTOR_API_KEY,
});
