import React from "react";
import { RepoCard, type Repository } from "./repo-card";

interface RepoGridProps {
  repos: Repository[];
  isLoading?: boolean;
}

export function RepoGrid({ repos, isLoading = false }: RepoGridProps) {
  if (isLoading) {
    return (
      <div className="w-full text-center py-12">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
        <p className="mt-4 text-muted-foreground">Fetching repositories...</p>
      </div>
    );
  }

  if (repos.length === 0) {
    return (
      <div className="w-full text-center py-12">
        <p className="text-lg">No repositories found</p>
        <p className="mt-2 text-muted-foreground">
          This user hasn't starred any repositories or the username doesn't
          exist.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {repos.map((repo) => (
        <RepoCard key={repo.id} repo={repo} />
      ))}
    </div>
  );
}
