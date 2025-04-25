import React from "react";
import Link from "next/link";
import { Github } from "lucide-react";

export function Header() {
  return (
    <header className="flex items-center justify-between w-full px-6 py-4 border-b">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold">GitHub Explorer</h1>
      </div>
      <Link
        href="https://github.com/Radionic/github-explorer"
        target="_blank"
        className="flex items-center gap-2 hover:text-primary transition-colors"
      >
        <Github size={24} />
        <span className="hidden sm:inline">GitHub</span>
      </Link>
    </header>
  );
}
