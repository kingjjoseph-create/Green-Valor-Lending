/** True when `href` is the current page or an ancestor of it. "/" only matches itself. */
export function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
