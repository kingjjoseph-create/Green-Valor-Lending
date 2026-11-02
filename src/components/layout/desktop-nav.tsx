"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { NavItem } from "@/config/navigation";
import { isActive } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function DesktopNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Primary" className="hidden xl:block">
      <ul className="flex items-center gap-0.5 2xl:gap-1.5">
        {items.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative block rounded-md px-3 py-2 text-[0.9375rem] font-medium whitespace-nowrap text-gv-charcoal transition-colors duration-200 hover:text-gv-green",
                  "after:absolute after:inset-x-3 after:bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-gv-gold after:transition-transform after:duration-300 hover:after:scale-x-100",
                  active && "text-gv-green after:scale-x-100",
                  item.emphasis &&
                    "ml-1 border border-gv-gold/70 px-3.5 text-gv-green after:hidden hover:border-gv-green hover:bg-gv-ivory",
                  item.emphasis && active && "border-gv-green bg-gv-ivory",
                )}
              >
                {item.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
