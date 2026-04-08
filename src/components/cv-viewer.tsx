"use client";

import { Button } from "@/components/ui/button";
import { globalErrorToast, globalSuccessToast } from "@/lib/toast";
import { UploadButton } from "@/lib/uploadthing";
import { api } from "@/trpc/react";
import { ViewAsViewType } from "@/types/view-as.types";
import { Download, FileUp, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

export default function CVViewer() {
  const utils = api.useUtils();
  const { data: cvSetting, isLoading } = api.cv.getCV.useQuery();
  const { data: auth } = api.auth.me.useQuery();
  const { data: viewAsSetting, isLoading: isLoadingViewAs } =
    api.viewAs.getViewAs.useQuery();

  const isAdminView = viewAsSetting?.data?.value === ViewAsViewType.ADMIN;
  const showAdminFeatures =
    auth && (isAdminView || (!isLoadingViewAs && !viewAsSetting));

  const cvURL = cvSetting?.data.url;
  const uploadedAt = cvSetting?.data.uploadedAt
    ? new Date(cvSetting.data.uploadedAt).toLocaleString()
    : null;

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center rounded-lg border">
        <LoaderCircle className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-muted/20 p-3">
        <div className="space-y-1">
          <h2 className="font-semibold text-lg">Resume</h2>
          <p className="text-muted-foreground text-sm">
            {cvURL
              ? uploadedAt
                ? `Last updated: ${uploadedAt}`
                : "Resume is available"
              : "No resume uploaded yet"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {showAdminFeatures && (
            <UploadButton
              config={{ cn: twMerge }}
              appearance={{
                button:
                  "ut-ready:bg-primary ut-uploading:cursor-not-allowed rounded-md px-4 py-2 text-sm font-medium",
                container: "w-auto",
                allowedContent: "sr-only",
              }}
              content={{
                button: (
                  <span className="inline-flex items-center gap-2">
                    <FileUp className="h-4 w-4" />
                    Upload Resume
                  </span>
                ),
              }}
              endpoint="cvUploader"
              onClientUploadComplete={() => {
                globalSuccessToast("Resume uploaded successfully");
                utils.cv.getCV.invalidate();
              }}
              onUploadError={(error: Error) => {
                globalErrorToast(error.message || "Resume upload failed");
              }}
            />
          )}

          <Button asChild disabled={!cvURL}>
            <Link href="/resume/download" target="_blank">
              <Download className="mr-2 h-4 w-4" />
              Download Resume
            </Link>
          </Button>
        </div>
      </div>

      {cvURL ? (
        <iframe
          title="Resume PDF Viewer"
          src={cvURL}
          className="h-[75vh] w-full rounded-lg border"
        />
      ) : (
        <div className="flex h-[50vh] items-center justify-center rounded-lg border border-dashed">
          <p className="text-muted-foreground text-sm">
            Resume preview will appear here after upload.
          </p>
        </div>
      )}
    </div>
  );
}
