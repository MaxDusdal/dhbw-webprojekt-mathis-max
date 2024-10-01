export function clx(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
