import { apiServerGet } from "../api/server";

export type MeResponse = {
  ok: boolean;
  user?: { id: string; name: string; email: string; isCreator: boolean };
};

export async function getMe() {
  try {
    return await apiServerGet<MeResponse>("/api/user/me");
  } catch (error) {
    return { ok: false } as MeResponse;
  }
}
