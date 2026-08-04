/**
 * Navigation route matching.
 *
 * Lives here rather than inside a client component so it can be unit-tested
 * without a DOM or a React renderer: the active-route rule is the thing that
 * decides whether `aria-current="page"` is correct on every page of the site,
 * and it is worth testing directly.
 */
export function isActiveRoute(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Focus-trap cycling. Given the focusable elements inside a modal and the one
 * currently focused, returns the index that should receive focus next — or
 * `null` when the browser's own default is already correct.
 *
 * Extracted from the mobile drawer for the same reason: the wrap-around at both
 * ends is exactly where a hand-rolled trap gets it wrong.
 */
export function nextTrapIndex({
  count,
  activeIndex,
  shiftKey,
}: {
  count: number;
  /** Index of the focused element, or -1 when focus is outside the trap. */
  activeIndex: number;
  shiftKey: boolean;
}): number | null {
  if (count === 0) return null;

  if (shiftKey) {
    // Shift+Tab from the first element, or from outside, wraps to the last.
    if (activeIndex === 0 || activeIndex === -1) return count - 1;
    return null;
  }

  // Tab from the last element wraps to the first.
  if (activeIndex === count - 1) return 0;
  return null;
}
