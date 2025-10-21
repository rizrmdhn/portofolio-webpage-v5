import fs from "node:fs";
import path from "node:path";

export const findFile = async (
	folderName: string,
	fileName: string,
): Promise<boolean> => {
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

	return true;
};
