import { cookies } from "next/headers";

const SESSION_SECRET = "portfolio_admin_session_auth_key_v1";

export async function verifyAdminSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;
    if (!token) return false;
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    return decoded.startsWith(SESSION_SECRET);
  } catch {
    return false;
  }
}
