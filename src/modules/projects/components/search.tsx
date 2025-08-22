import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import React from "react";

type Props = {
  searchQuery: string;
  setSearchQuery: (value: React.SetStateAction<string>) => void;
};

const SearchBar = ({ searchQuery, setSearchQuery }: Props) => {
  return (
    <div className="relative max-w-2xl mx-auto w-full">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
      <Input
        placeholder="Search projects by name, technology, status, or description..."
        className="pl-12 pr-12 h-14 bg-card/70 border-border/50 focus:border-primary/50 rounded-2xl text-base shadow-sm"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {searchQuery && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          onClick={() => setSearchQuery("")}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default SearchBar;
