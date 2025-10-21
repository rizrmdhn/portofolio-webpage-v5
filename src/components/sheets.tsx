"use client";

import { Sheet, SheetContent, SheetDescription } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useSheetStore } from "@/stores/sheet.stores";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

type ModalProps = {
	className?: string;
	children: React.ReactNode;
};

export default function Sheets({ className, children }: ModalProps) {
	const open = useSheetStore((state) => state.open);
	const setOpen = useSheetStore((state) => state.setOpen);

	const router = useRouter();

	const handleOpenChange = () => {
		setOpen(!open);
		setTimeout(() => {
			router.back();
			setOpen(true);
		}, 300);
	};

	const sheetRoot = document.getElementById("sheet-root");

	if (!sheetRoot) {
		console.error("Sheet root element not found");
		return <></>;
	}

	return createPortal(
		<Sheet defaultOpen={open} open={open} onOpenChange={handleOpenChange}>
			<SheetContent
				className={cn(
					className,
					"sm:w-[600px] sm:max-w-[650px] lg:w-[650px] xl:w-[760px]",
				)}
			>
				<SheetDescription>
					<VisuallyHidden>Sheet</VisuallyHidden>
				</SheetDescription>
				{children}
			</SheetContent>
		</Sheet>,
		sheetRoot,
	);
}
