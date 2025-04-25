import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search as SearchIcon } from "lucide-react";

interface SearchProps {
  onSearch: (username: string) => void;
  isLoading?: boolean;
}

export function Search({ onSearch, isLoading = false }: SearchProps) {
  const [username, setUsername] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSearch(username.trim());
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="w-full max-w-lg mx-auto flex flex-col sm:flex-row gap-3"
    >
      <div className="relative flex-1">
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Type a GitHub username"
          className="h-12"
          disabled={isLoading}
        />
      </div>
      <Button
        type="submit"
        className="h-12"
        disabled={!username.trim() || isLoading}
      >
        <SearchIcon className="h-4 w-4 mr-2" />
        Search
      </Button>
    </form>
  );
}
