import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Star, GitFork, ExternalLink, Globe, Code } from "lucide-react";
import Link from "next/link";

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  owner: {
    login: string;
    avatar_url: string;
  };
  topics: string[];
  created_at: string;
  updated_at: string;
}

interface RepoCardProps {
  repo: Repository;
}

export function RepoCard({ repo }: RepoCardProps) {
  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Link
            href={repo.html_url}
            target="_blank"
            className="hover:underline"
          >
            <CardTitle className="line-clamp-1">{repo.name}</CardTitle>
          </Link>
        </div>
        <CardDescription className="flex items-center gap-2 text-sm">
          by {repo.owner.login}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm line-clamp-3 mb-4">
          {repo.description || "No description provided"}
        </p>

        {repo.language && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
            <Code className="h-4 w-4" />
            <span>{repo.language}</span>
          </div>
        )}

        {repo.topics && repo.topics.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {repo.topics.slice(0, 3).map((topic) => (
              <span
                key={topic}
                className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
              >
                {topic}
              </span>
            ))}
            {repo.topics.length > 3 && (
              <span className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground">
                +{repo.topics.length - 3} more
              </span>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t pt-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="text-sm">
              {repo.stargazers_count.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <GitFork className="h-4 w-4" />
            <span className="text-sm">{repo.forks_count.toLocaleString()}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={repo.html_url}
            target="_blank"
            className="p-1 rounded-full hover:bg-muted transition-colors"
            title="GitHub Repository"
          >
            <ExternalLink className="h-4 w-4" />
          </Link>
          {repo.homepage && (
            <Link
              href={repo.homepage}
              target="_blank"
              className="p-1 rounded-full hover:bg-muted transition-colors"
              title="Project Website"
            >
              <Globe className="h-4 w-4" />
            </Link>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
