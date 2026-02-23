/**
 * Lumina calc for TextColor checks
 * needs DeltaE Lib from <moussa.ahmed95@gmail.com>
 * @author Benny Stark
 */
import Colour from "./deltae";

export function luminaFromHex(hex: string): number {
  const [r,g,b] = Colour.hex2rgba(hex);
  return ((0.299 * r)+(0.587*g)+(0.114*b)/255)
}