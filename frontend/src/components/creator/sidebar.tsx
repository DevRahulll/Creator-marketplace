"use client";

import { apiClient } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import {
  BadgeDollarSign,
  Compass,
  Home,
  Library,
  LogOut,
  Menu,
  Package,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const TOP: NavItem[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Products", href: "/dashboard/products", icon: Package },
  { label: "Sales", href: "/dashboard/sales", icon: BadgeDollarSign },
];

const MID: NavItem[] = [
  { label: "Discover", href: "/discover", icon: Compass },
  { label: "Library", href: "/library", icon: Library },
];

function NavLink({
  item,
  active,
  onClick,
}: {
  item: NavItem;
  active: boolean;
  onClick?: () => void;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 truncate border-y border-white/40 px-6 py-4 text-sm no-underline transition",
        "hover:text-fuchsia-400",
        active && "text-fuchsia-400",
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

function LinksBlock({
  items,
  pathName,
  onNavigate,
}: {
  items: NavItem[];
  pathName: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="grid">
      {items.map((item) => (
        <NavLink
          key={item.href}
          item={item}
          active={item.href === pathName}
          onClick={onNavigate}
        />
      ))}
    </div>
  );
}

type LogoutResponse = {
  ok: boolean;
};

export default function CreatorSidebar() {
  const pathName = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function onLogout() {
    try {
      const res = await apiClient.post<LogoutResponse>("/api/user/logout");
      if (res?.data?.ok) {
        router.push("/login");
        router.refresh();
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <nav
      className={cn(
        "flex flex-col overflow-x-hidden overflow-y-auto bg-black text-white",
        "lg:static lg:w-52",
      )}
    >
      {/* mobile view */}
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 p-4 lg:hidden">
        <div className="text-base font-semibold leading-none">Dashboard</div>
        <div className="w-full" />

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant={"ghost"} size={"icon"}>
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <div className="bg-black text-white">
              <div className="px-4 py-4 text-base font-semibold">Dashboard</div>
              <div className="grid gap-6 p-2">
                <LinksBlock
                  items={TOP}
                  pathName={pathName}
                  onNavigate={() => setOpen(false)}
                />
                <LinksBlock
                  items={MID}
                  pathName={pathName}
                  onNavigate={() => setOpen(false)}
                />
                <div className="mt-5">
                  <label
                    onClick={onLogout}
                    className="cursor-pointer flex items-center gap-3 border-y border-white/30 px-6 py-4 transition"
                  >
                    <LogOut className="w-4 h-4 shrink-0" />
                    <span>Logout</span>
                  </label>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden lg:flex lg:flex-1 lg:flex-col">
        <header className="p-6">
          <div className="text-xl font-semibold leading-none">Dashboard</div>
        </header>
        <section className="mb-10">
          <LinksBlock items={TOP} pathName={pathName} />
        </section>
        <section className="mb-10">
          <LinksBlock items={MID} pathName={pathName} />
        </section>

        <footer className="mt-auto">
          <label
            onClick={onLogout}
            className="cursor-pointer flex items-center gap-3 border-y border-white/30 px-6 py-4 transition"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Logout</span>
          </label>
        </footer>
      </div>
    </nav>
  );
}
