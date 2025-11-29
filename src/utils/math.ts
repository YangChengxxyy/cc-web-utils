/**
 * 弧度转角度
 */
export function radiansToDegrees(radians: number) {
  return (radians * 180) / Math.PI;
}

/**
 * 角度转弧度
 */
export function degreesToRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}
