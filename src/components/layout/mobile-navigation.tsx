"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, MenuIcon } from "lucide-react";

import type { NavItem } from "@/config/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { isActive } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";

type MobileNavigationProps = {
  items: NavItem[];
  cta: NavItem;
  tagline: string;
};

/**
 * Hamburger + slide-in drawer (Radix Dialog): focus is trapped while open,
 * Escape and the close button dismiss it, focus returns to the trigger, the
 * page behind is scroll-locked, and it closes after any navigation.
 */
export function MobileNavigation({ items, cta, tagline }: MobileNavigationProps) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  // Close if the route changes by any means (e.g. browser back) while open.
  const [lastPath, setLastPath] = React.useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (open) setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-10 min-[380px]:size-11 xl:hidden"
          aria-label="Open menu"
        >
          <MenuIcon className="size-6" aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="overflow-y-auto px-6 pt-5 pb-8">
        <SheetTitle className="sr-only">Site menu</SheetTitle>
        <SheetDescription className="sr-only">Main navigation for Green Valor Lending</SheetDescription>
        <SheetClose asChild>
          <Logo variant="mark" height={52} className="self-start" />
        </SheetClose>

        <SheetClose asChild>
          <Button asChild variant="accent" size="lg" className="mt-2 w-full">
            <Link href={cta.href}>
              {cta.title}
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </SheetClose>

        <nav aria-label="Mobile" className="flex-1">
          <ul className="flex flex-col divide-y divide-border">
            {items.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <SheetClose asChild>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center justify-between py-4 font-serif text-[1.375rem] text-gv-charcoal transition-colors hover:text-gv-green",
                        active && "text-gv-green",
                      )}
                    >
                      {item.title}
                      {active && <span className="size-1.5 rounded-full bg-gv-gold" aria-hidden="true" />}
                    </Link>
                  </SheetClose>
                </li>
              );
            })}
          </ul>
        </nav>
        <p className="text-center type-support text-muted-foreground">{tagline}</p>
      </SheetContent>
    </Sheet>
  );
}
