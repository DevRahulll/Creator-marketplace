"use client";

import { apiClient } from "@/lib/api/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleOnSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await apiClient.post("/api/user/register", {
        name,
        email,
        password,
      });

      if (res?.data?.ok) {
        toast.success(
          res?.data?.message || "Account created Successfully. Please Login..",
        );
        router.push("/login");
        router.refresh();
      }
    } catch (error) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-0 bg-transparent shadow-none">
      <form onSubmit={handleOnSubmit} className="space-y-4">
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-zinc-900">Name</legend>
          <Input
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-11 border-zinc-300 text-[15px] placeholder:text-zinc-400"
          />
        </fieldset>
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-zinc-900">Email</legend>
          <Input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 border-zinc-300 text-[15px] placeholder:text-zinc-400"
          />
        </fieldset>
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-zinc-900">
            Password
          </legend>
          <Input
            type="password"
            required
            autoComplete="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 border-zinc-300 text-[15px] placeholder:text-zinc-400"
          />
        </fieldset>
        <Button disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </Button>
      </form>
    </Card>
  );
}
