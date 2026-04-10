"use client";

import { Button } from "@/components/ui/button";
import { globalErrorToast, globalSuccessToast } from "@/lib/toast";
import { UploadButton } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { ViewAsViewType } from "@/types/view-as.types";
import { Download, FileText, FileUp, LoaderCircle } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

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
  const resumeDownloadPath = "/resume/download" as Route;
  const uploadedAt = cvSetting?.data.uploadedAt
    ? new Date(cvSetting.data.uploadedAt).toLocaleString()
    : null;

  if (isLoading) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-3 rounded-xl border bg-muted/10">
        <LoaderCircle className="h-6 w-6 animate-spin text-muted-foreground" />
        <p className="text-muted-foreground text-sm">Loading resume...</p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-0.5">
            <h2 className="font-semibold leading-tight">Resume</h2>
            <p className="text-muted-foreground text-xs">
              {cvURL
                ? uploadedAt
                  ? `Last updated: ${uploadedAt}`
                  : "Resume is available"
                : "No resume uploaded yet"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {showAdminFeatures && (
            <UploadButton
              config={{ cn: cn }}
              appearance={{
                button:
                  "ut-uploading:cursor-not-allowed rounded-md px-4 py-2 text-sm font-medium w-full",
                container: "w-auto",
                allowedContent: "sr-only",
              }}
              content={{
                button({ isUploading, uploadProgress, ready }) {
                  if (!ready) {
                    return (
                      <span className="inline-flex items-center gap-2">
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        Preparing...
                      </span>
                    );
                  }

                  if (isUploading) {
                    return (
                      <span className="inline-flex items-center gap-2">
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        Uploading {uploadProgress}%
                      </span>
                    );
                  }

                  return (
                    <span className="inline-flex items-center gap-2">
                      <FileUp className="h-4 w-4" />
                      Upload Resume
                    </span>
                  );
                },
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

          <Button asChild disabled={!cvURL} size="sm">
            <Link href={resumeDownloadPath} target="_blank">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Link>
          </Button>
        </div>
      </div>

      {cvURL ? (
        <iframe
          title="Resume PDF Viewer"
          src={cvURL}
          className="h-[75vh] w-full rounded-xl border shadow-sm"
        />
      ) : (
        <div className="flex h-[50vh] flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-muted/5">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/30">
            <FileText className="h-6 w-6 text-muted-foreground/60" />
          </div>
          <div className="space-y-1 text-center">
            <p className="font-medium text-muted-foreground text-sm">
              No resume uploaded
            </p>
            <p className="text-muted-foreground/60 text-xs">
              Resume preview will appear here after upload.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
