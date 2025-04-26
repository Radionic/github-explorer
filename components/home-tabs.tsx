import { Search, Star } from "lucide-react";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchInput } from "./search-input";

export const HomeTabs = ({
  handleSearch,
  handleIndex,
  disabled,
}: {
  handleSearch: (username: string) => void;
  handleIndex: (username: string) => void;
  disabled: boolean;
}) => {
  return (
    <Tabs defaultValue="tab-1" className="w-full">
      <ScrollArea>
        <TabsList className="mb-3 gap-1 bg-transparent">
          <TabsTrigger
            value="tab-1"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full data-[state=active]:shadow-none"
          >
            <Search
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            Search
          </TabsTrigger>
          <TabsTrigger
            value="tab-2"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full data-[state=active]:shadow-none"
          >
            <Star
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            Index
          </TabsTrigger>
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <TabsContent value="tab-1">
        <SearchInput
          placeholder="Search repositories..."
          onSearch={handleSearch}
          disabled={disabled}
        />
      </TabsContent>
      <TabsContent value="tab-2">
        <SearchInput
          placeholder="Enter GitHub username to index their starred repositories"
          onSearch={handleIndex}
          disabled={disabled}
        />
      </TabsContent>
    </Tabs>
  );
};
