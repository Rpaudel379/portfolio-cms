import { ThemeToggle } from "@/components/themes/theme-toggle";
import type { NavbarItems } from "@/components/navbar/navbar.types";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const DesktopNav = ({ items, pathname }: NavbarItems) => {
  return (
    <div className="hidden md:flex items-center gap-2">
      <div className="flex items-center space-x-1 bg-muted/50 rounded-full p-1">
        {items.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 hover:text-foreground",
              pathname === item.href
                ? "text-foreground bg-background shadow-sm"
                : "text-foreground/70 hover:text-foreground hover:bg-background/50"
            )}
          >
            {item.name}
            {pathname === item.href && (
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 animate-pulse" />
            )}
          </Link>
        ))}
      </div>
      <ThemeToggle />
    </div>
  );
};
