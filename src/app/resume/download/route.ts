import cvQueries from "@/server/queries/cv.queries";
import { NextResponse } from "next/server";

export async function GET() {
	const cvSetting = await cvQueries.getCVSetting();

	if (!cvSetting?.data.url) {
		return new NextResponse("Resume not found", { status: 404 });
	}

	const cvFileResponse = await fetch(cvSetting.data.url);

	if (!cvFileResponse.ok) {
		return new NextResponse("Failed to fetch resume file", { status: 502 });
	}

	return new NextResponse(cvFileResponse.body, {
		headers: {
			"Content-Type": "application/pdf",
			"Content-Disposition": "attachment; filename=rizrmdhn-resume.pdf",
		},
	});
}
