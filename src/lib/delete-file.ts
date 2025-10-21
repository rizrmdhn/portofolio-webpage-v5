import fs from "node:fs";
import path from "node:path";
import { env } from "node:process";

export const deleteFile = async (
	folderName: string,
	fileName: string,
): Promise<boolean> => {
	if (env.NODE_ENV === "development")
		console.info(`Deleting file ${fileName} from ${folderName}`);

	const rootDir = process.cwd();

	const fileDir = path.resolve(`${rootDir}/public/uploads/${folderName}`);

	if (!fs.existsSync(fileDir)) {
		fs.mkdirSync(fileDir, { recursive: true });
	}

	// Find the file with the given name and extension
	const filePath = path.resolve(`${fileDir}/${fileName}`);

	// Check if the file exists
	if (!fs.existsSync(filePath)) {
		throw new Error("File not found");
	}

	// Delete the file
	fs.unlinkSync(filePath);

	return true;
};
