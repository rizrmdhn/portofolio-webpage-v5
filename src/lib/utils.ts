import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function calculateFutureDate(yearsToAdd: number): Date {
	const currentDate = new Date();
	const futureYear = currentDate.getFullYear() + yearsToAdd;
	return new Date(futureYear, currentDate.getMonth(), currentDate.getDate());
}
