"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Search } from "@/components/search";
import { RepoGrid } from "@/components/repo-grid";
import { Repository } from "@/components/repo-card";
import { fetchStarredRepos } from "@/lib/github";

export default function Home() {
  const [username, setUsername] = useState("");
  const [repos, setRepos] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (searchUsername: string) => {
    setUsername(searchUsername);
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchStarredRepos({ username: searchUsername });
      setRepos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setRepos([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col gap-8">
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Explore GitHub Starred Repositories
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl">
            Enter a GitHub username to discover repositories they've starred.
            Find interesting projects, libraries, and tools other developers are
            interested in.
          </p>

          <Search onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-md">
            {error}
          </div>
        )}

        {(repos.length > 0 || isLoading) && (
          <div className="mt-4">
            {username && !isLoading && (
              <h3 className="text-xl font-medium mb-6">
                Starred repositories for{" "}
                <span className="font-bold">{username}</span>
                <span className="text-muted-foreground ml-2 text-sm">
                  ({repos.length}{" "}
                  {repos.length === 1 ? "repository" : "repositories"})
                </span>
              </h3>
            )}

            <RepoGrid repos={repos} isLoading={isLoading} />
          </div>
        )}
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <p>GitHub Explorer — Built with Next.js and the GitHub API</p>
      </footer>
    </div>
  );
}
