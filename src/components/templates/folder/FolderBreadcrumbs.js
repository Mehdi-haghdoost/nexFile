"use client";

import Link from "next/link";
import { ChevronRightIcon, HomeIcon } from "@/components/ui/icons";

// Deep paths collapse in the middle, keeping the root and the last two levels
const MAX_VISIBLE = 3;

const FolderBreadcrumbs = ({ path = [] }) => {
  const isCollapsed = path.length > MAX_VISIBLE;
  const visible = isCollapsed ? path.slice(-2) : path;

  const linkClasses =
    "text-xs sm:text-sm text-neutral-400 dark:text-neutral-300 hover:text-neutral-500 dark:hover:text-white transition-colors truncate max-w-[140px]";

  return (
    <nav aria-label="Folder path" className="flex items-center gap-1 min-w-0 flex-wrap">
      <Link href="/folder" className="flex items-center gap-1.5 shrink-0 hover:opacity-70 transition-opacity">
        <HomeIcon />
        <span className="text-xs sm:text-sm text-neutral-400 dark:text-neutral-300">All folders</span>
      </Link>

      {isCollapsed && (
        <>
          <span className="shrink-0 opacity-50">
            <ChevronRightIcon />
          </span>
          <span
            title={path.slice(0, -2).map((entry) => entry.name).join(" / ")}
            className="text-xs sm:text-sm text-neutral-300 dark:text-neutral-400 px-1"
          >
            …
          </span>
        </>
      )}

      {visible.map((entry, index) => {
        const isLast = index === visible.length - 1;

        return (
          <span key={entry.id} className="flex items-center gap-1 min-w-0">
            <span className="shrink-0 opacity-50">
              <ChevronRightIcon />
            </span>

            {/* The folder you are already in is a label, not a link */}
            {isLast ? (
              <span
                dir="auto"
                className="text-xs sm:text-sm font-medium text-neutral-500 dark:text-white truncate max-w-[180px]"
              >
                {entry.name}
              </span>
            ) : (
              <Link href={`/folder/${entry.id}`} dir="auto" className={linkClasses}>
                {entry.name}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
};

export default FolderBreadcrumbs;