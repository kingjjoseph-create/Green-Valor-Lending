import { readFileSync } from "node:fs";

/** Read width/height from a PNG header (IHDR chunk). */
export function imageSize(file: string): { width: number; height: number } {
  const buf = readFileSync(file);
  if (buf.toString("ascii", 1, 4) !== "PNG") throw new Error(`${file} is not a PNG`);
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}
