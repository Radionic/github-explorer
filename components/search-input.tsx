import React, { useState } from "react";
import { Input } from "./ui/input";
import { ArrowRightIcon, Search as SearchIcon } from "lucide-react";

interface SearchProps {
  placeholder: string;
  onSearch: (username: string) => void;
  disabled?: boolean;
}

export function SearchInput({
  placeholder,
  onSearch,
  disabled = false,
}: SearchProps) {
  const [input, setInput] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-lg mx-auto">
      <Input
        className="peer ps-9 pe-9 h-10"
        placeholder={placeholder}
        type="search"
        disabled={disabled}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
        <SearchIcon size={16} />
      </div>
      <button
        className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Submit search"
        type="submit"
        disabled={disabled}
      >
        <ArrowRightIcon size={16} aria-hidden="true" />
      </button>
    </form>
  );
}
