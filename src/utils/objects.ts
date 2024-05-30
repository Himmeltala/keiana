export function hasProperties(obj: any): boolean {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return true;
    }
  }

  return false;
}

export function raw(data: any) {
  return JSON.parse(JSON.stringify(data));
}
