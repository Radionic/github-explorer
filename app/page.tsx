"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Search } from "@/components/search";
import { RepoGrid } from "@/components/repo-grid";
import { Repository } from "@/components/repo-card";
import { fetchAllStarredRepos } from "@/lib/github";
import { PaginationControl } from "@/components/pagination-control";

const REPOS_PER_PAGE = 100;

export default function Home() {
  const [username, setUsername] = useState("");
  const [allRepos, setAllRepos] = useState<Repository[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate pagination info based on all repositories
  const totalCount = allRepos.length;
  const totalPages = Math.ceil(totalCount / REPOS_PER_PAGE);

  // Get current page of repositories
  const currentRepos = allRepos.slice(
    (currentPage - 1) * REPOS_PER_PAGE,
    currentPage * REPOS_PER_PAGE
  );

  const handleSearch = async (searchUsername: string) => {
    if (!searchUsername.trim()) return;

    setUsername(searchUsername);
    setCurrentPage(1);
    setIsLoading(true);
    setError(null);

    try {
      // Fetch all starred repositories at once
      const allRepos = await fetchAllStarredRepos({
        username: searchUsername,
        perPage: REPOS_PER_PAGE,
      });

      setAllRepos(allRepos);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setAllRepos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
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

        {(allRepos.length > 0 || isLoading) && (
          <div className="mt-4">
            {username && !isLoading && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                <h3 className="text-xl font-medium mb-2 sm:mb-0">
                  Starred repositories for{" "}
                  <span className="font-bold">{username}</span>
                  <span className="text-muted-foreground ml-2 text-sm">
                    ({totalCount}{" "}
                    {totalCount === 1 ? "repository" : "repositories"})
                  </span>
                </h3>

                {totalPages > 1 && (
                  <div className="inline-flex items-center gap-2">
                    <PaginationControl
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </div>
            )}

            <RepoGrid repos={currentRepos} isLoading={isLoading} />

            {totalPages > 1 && !isLoading && (
              <div className="mt-8">
                <PaginationControl
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
