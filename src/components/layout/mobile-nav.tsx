"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon } from "lucide-react";

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
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { isActive } from "./main-nav";

export function MobileNav({ items, cta, tagline }: { items: NavItem[]; cta: NavItem; tagline: string }) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="xl:hidden" aria-label="Open menu">
          <MenuIcon className="size-6" aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="px-6 pt-6 pb-8">
        <SheetClose asChild>
          <Logo variant="mark" height={48} className="self-start" />
        </SheetClose>
        <SheetTitle className="sr-only">Site menu</SheetTitle>
        <SheetDescription className="sr-only">Navigate Green Valor Lending</SheetDescription>
        <nav aria-label="Mobile" className="flex-1">
          <ul className="flex flex-col divide-y divide-border">
            {[{ title: "Home", href: "/" }, ...items].map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <SheetClose asChild>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "block py-4 font-serif text-xl text-gv-charcoal transition-colors hover:text-gv-green",
                        active && "text-gv-green",
                      )}
                    >
                      {item.title}
                    </Link>
                  </SheetClose>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="space-y-4">
          <SheetClose asChild>
            <Button asChild variant="accent" size="lg" className="w-full">
              <Link href={cta.href}>{cta.title}</Link>
            </Button>
          </SheetClose>
          <p className="text-center text-xs tracking-wide text-muted-foreground">{tagline}</p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
