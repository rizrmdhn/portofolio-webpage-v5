import { NextResponse } from "next/server";

export function GET(request: Request) {
	const url = new URL("/resume/download", request.url);
	return NextResponse.redirect(url);
}
