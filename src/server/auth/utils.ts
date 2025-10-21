import { cookies } from "next/headers";

export async function createTokenCookie(
	token: string,
	// 1 month expiration
	expiresAt: Date = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
): Promise<void> {
	(await cookies()).set("session", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		expires: expiresAt,
	});
}

export async function deleteTokenCookie(): Promise<void> {
	(await cookies()).delete("session");
}
