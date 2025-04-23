import { promises as fs } from "fs";
import { mkdir } from 'fs/promises';
import { Utilities } from "saml.servercore";

export class Image {
    /**
     * Checks if the provided Buffer data corresponds to a JPEG file.
     * @param data The file data as a Buffer.
     * @returns Returns true if the data belongs to a JPEG file, false otherwise.
     */
    public static isJpeg(data: Buffer): boolean {
        const jpgStart = data[0] === 0xFF && data[1] === 0xD8;
        // const jpgEnd = data[data.length - 2] === 0xFF && data[data.length - 1] === 0xD9;
        const jpgMarker = data.indexOf(Buffer.from([0xFF, 0xE0])) !== -1 || data.indexOf(Buffer.from([0xFF, 0xE1])) !== -1;
        return (jpgStart /* && jpgEnd */ && jpgMarker);
    }
    /**
     * Checks if the provided Buffer data corresponds to a PNG file.
     * @param data The file data as a Buffer.
     * @returns Returns true if the data belongs to a PNG file, false otherwise.
     */
    public static isPng(data: Buffer): boolean {
        const pngStart = data[0] === 0x89 && data[1] === 0x50 && data[2] === 0x4E && data[3] === 0x47;
        // const pngEnd = data[data.length - 8] === 0x49 && data[data.length - 7] === 0x45 && data[data.length - 6] === 0x4E && data[data.length - 5] === 0x44 && data[data.length - 4] === 0xAE && data[data.length - 3] === 0x42 && data[data.length - 2] === 0x60 && data[data.length - 1] === 0x82;
        return (pngStart /* && pngEnd */);
    }
    /**
     * Checks if the provided Buffer data corresponds to a GIF file.
     * @param data The file data as a Buffer.
     * @returns Returns true if the data belongs to a GIF file, false otherwise.
     */
    public static isGif(data: Buffer): boolean {
        const gifStart = data[0] === 0x47 && data[1] === 0x49 && data[2] === 0x46;
        // const gifEnd = data[data.length - 1] === 0x3B;
        return (gifStart /* && gifEnd */);
    }
    /**
     * Detects the image format of the provided Buffer data.
     * @param data The file data as a Buffer.
     * @returns Returns the detected image format as 'jpeg', 'png', 'gif', or null if the format is not recognized.
     */
    public static detectImageFormat(data: Buffer): 'jpeg' | 'png' | 'gif' | null {
        if (this.isJpeg(data)) return 'jpeg';
        if (this.isPng(data)) return 'png';
        if (this.isGif(data)) return 'gif';
        return null;
    }
    /**
     * Check if the Buffer data belongs to a jpg file
     * @param data The file data Buffer
     * @returns True if is a jpg file or false if not is a jpg file
     */
    public static isImageFile(data: Buffer, validFormats: ('jpg'|'jpeg'|'png'|'gif')[] = ['jpg', 'jpeg']): boolean {
        let result: boolean = false;
        for (const format of validFormats) switch (format) {
            case 'jpg':
            case 'jpeg': result = result || this.isJpeg(data); break;
            case 'png':  result = result || this.isPng(data);  break;
            case 'gif':  result = result || this.isGif(data);  break;
        }
        return result;
    }
    /**
     * Saves an image to the specified folder with the given name.
     * @param folder The folder path where the image should be saved.
     * @param name The name of the image file.
     * @param data The image data as a Buffer.
     * @returns A Promise that resolves with the full path to the saved image file.
     * @throws Throws an error if the image cannot be saved.
     */
    public static async saveImage(folder: string, name: string, data: Buffer): Promise<string> {
        folder = Utilities.Path.normalize(folder);
        folder = folder.endsWith('/') ? folder : folder + '/';
        name = name.replaceAll(/^[\\/\[\]]/g, '-');
        const path = Utilities.Path.normalize(folder + name);
        try {
            await mkdir(folder, { recursive: true });
            await fs.writeFile(path, data);
            return path;
        } catch(error) { throw Error(`fail saving image on: ${path}`, { cause: error }); }
    }
}