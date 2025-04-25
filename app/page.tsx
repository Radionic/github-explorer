"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Search } from "@/components/search";
import { RepoGrid } from "@/components/repo-grid";
import { PaginationControl } from "@/components/pagination-control";
import { useStarredRepos } from "@/hooks/use-starred-repos";

export default function Home() {
  const [username, setUsername] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { currentRepos, isLoading, error, totalCount, totalPages } =
    useStarredRepos({
      username,
      currentPage,
    });

  const handleSearch = async (searchUsername: string) => {
    if (!searchUsername.trim()) return;
    setUsername(searchUsername);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
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
            {error.message}
          </div>
        )}

        {((currentRepos && currentRepos.length > 0) || isLoading) && (
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

            <RepoGrid repos={currentRepos ?? []} isLoading={isLoading} />

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
