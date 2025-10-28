import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import getCurrentSession from "@/server/auth/sessions";
import type { MenuItem } from "@/types/mobile-menu.types";
import { Menu } from "lucide-react";
import LogoutButton from "./logout-button";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { ModeViewAs } from "./mode-view-as";

interface MobileMenuProps {
  menu: MenuItem[];
}

export default async function MobileMenu({ menu }: MobileMenuProps) {
  const { user } = await getCurrentSession();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>Navigate to different sections</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col space-y-4">
          {menu.map((item) => (
            <SheetClose asChild key={item.href}>
              <a
                href={item.href}
                className="block rounded-lg px-3 py-2 font-medium text-foreground text-lg transition-colors hover:bg-muted hover:text-accent-foreground"
              >
                {item.label}
              </a>
            </SheetClose>
          ))}
        </div>
        <SheetFooter>
          <ModeToggle className="flex w-full" label="Change Theme" />

          {user && <ModeViewAs className="flex w-full" />}

          {user ? (
            <LogoutButton variant="outline" />
          ) : (
            <Link href="/login">
              <Button variant="outline" className="w-full">
                Login
              </Button>
            </Link>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
