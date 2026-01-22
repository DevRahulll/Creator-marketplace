import "server-only";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function apiServerGet<T>(path: string): Promise<T> {
  const cookieStore = await cookies();

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: { cookie: cookieStore.toString() },
    cache: "no-store",
  });

  return res.json();
}
