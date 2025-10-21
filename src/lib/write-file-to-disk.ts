import fs from "node:fs";
import path from "node:path";
import { IMAGE_MIME_TYPES, type SUPPORTED_FILE_EXTENSIONS } from "./constants";

// Function to get file extension from MIME type
const getFileExtensionFromMimeType = (
	mimeType: string,
): SUPPORTED_FILE_EXTENSIONS => {
	const extension = IMAGE_MIME_TYPES[mimeType as keyof typeof IMAGE_MIME_TYPES];

	if (extension) {
		return extension; // Return the corresponding extension
	}

	// If the MIME type is not found, throw an error
	throw new Error(`Unsupported file type: ${mimeType}`);
};

export async function writeFileToDisk(
	folderName: string,
	file: File,
	mimeType: string,
	fileName?: string,
) {
	const rootDir = process.cwd();

	const fileDir = path.resolve(`${rootDir}/public/uploads/${folderName}`);

	if (!fs.existsSync(fileDir)) {
		try {
			fs.mkdirSync(fileDir, { recursive: true });
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(`Gagal membuat direktori: ${error.message}`);
			}
		}
	}

	// Get the file extension from MIME type
	const fileExtension = getFileExtensionFromMimeType(mimeType);

	// Use custom fileName if provided, otherwise derive it from the file's original name
	const fileNameWithoutExtension = fileName
		? fileName
		: path.basename(file.name, path.extname(file.name));
	const finalFileName = `${fileNameWithoutExtension}.${fileExtension}`;

	const filePath = path.resolve(`${fileDir}/${finalFileName}`);

	try {
		// Convert File to Buffer and write it to disk
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		fs.writeFileSync(filePath, buffer);

		// check if the file is supported and validate the file

		if (!Object.values(IMAGE_MIME_TYPES).includes(fileExtension)) {
			throw new Error("Tipe file tidak didukung");
		}

		return {
			url: `/api/uploads/${folderName}/${finalFileName}`,
			name: finalFileName,
		};
	} catch (error: unknown) {
		// check if the file was written to disk if yes delete the incomplete file
		if (fs.existsSync(filePath)) {
			fs.unlinkSync(filePath);
		}

		if (error instanceof Error) {
			throw new Error(`Gagal menulis file ke disk: ${error.message}`);
		}

		throw new Error("Gagal menulis file ke disk");
	}
}
