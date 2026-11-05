/** Strip outer `$…$`, `$$…$$`, `\\(…\\)`, `\\[…\\]` wrappers. */
export function stripOuterMathDelimiters(value: string): string {
  const trimmed = value.trim();
  if (trimmed.startsWith("$$") && trimmed.endsWith("$$")) {
    return trimmed.slice(2, -2).trim();
  }
  if (
    trimmed.startsWith("$") &&
    trimmed.endsWith("$") &&
    !trimmed.startsWith("$$")
  ) {
    return trimmed.slice(1, -1).trim();
  }
  if (trimmed.startsWith("\\(") && trimmed.endsWith("\\)")) {
    return trimmed.slice(2, -2).trim();
  }
  if (trimmed.startsWith("\\[") && trimmed.endsWith("\\]")) {
    return trimmed.slice(2, -2).trim();
  }
  return trimmed;
}

/** Remove inline `$` markers for corrupted delimiter recovery. */
export function stripInlineDollarDelimiters(raw: string): string {
  let out = "";
  for (let i = 0; i < raw.length; i += 1) {
    if (raw[i] === "$" && raw[i - 1] !== "\\") continue;
    out += raw[i];
  }
  return out;
}
