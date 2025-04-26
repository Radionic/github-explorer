"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { RepoGrid } from "@/components/repo-grid";
import { HomeTabs } from "@/components/home-tabs";
import { useIndexRepos } from "@/hooks/use-index-repos";
import { useSearchRepos } from "@/hooks/use-search-repos";

export default function Home() {
  const [query, setQuery] = useState("");
  const {
    data: repos,
    isLoading: isSearching,
    error: searchError,
  } = useSearchRepos({ query });
  const {
    mutate: indexRepos,
    isPending: isIndexing,
    error: indexError,
  } = useIndexRepos();

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setQuery(searchQuery);
  };

  const handleIndex = async (indexUsername: string) => {
    if (!indexUsername.trim()) return;
    console.log("Indexing repos for", indexUsername);
    indexRepos({ username: indexUsername });
  };

  const isLoading = isSearching || isIndexing;
  const error = searchError || indexError;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col gap-8">
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Explore GitHub Repositories
          </h2>
          <HomeTabs
            handleSearch={handleSearch}
            handleIndex={handleIndex}
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-md">
            {error.message}
          </div>
        )}

        <RepoGrid repos={repos ?? []} isLoading={isLoading} />
      </main>
    </div>
  );
}
