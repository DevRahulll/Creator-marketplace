import LoginForm from "@/components/auth/LoginForm";
import { getMe } from "@/lib/auth/getMe";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

export default async function LoginPage() {
  const me = await getMe();
  if (me?.ok) redirect("/");

  return (
    <>
      <header className="flex flex-col gap-4 border-b border-zinc-200 p-8 sm:p-16 md:p-8">
        <div className="flex items-center justify-between gap-2">
          <h1 className="hidden sm:block text-3xl">
            <Link href={"/"} className="font-semibold tracking-tight">
              Creator Place
            </Link>
          </h1>
          <div className="flex items-center gap-4 text-md">
            <Link className="font-medium underline" href={"/register"}>
              Sign Up
            </Link>
          </div>
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">Sign In</h2>
      </header>
      <div className="p-8 sm:p-16">
        <div className="max-w-md">
          <LoginForm />
        </div>
      </div>
    </>
  );
}
