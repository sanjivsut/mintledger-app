/**
 * True once real DOM is available (i.e. we're running in a browser, not
 * during server rendering). Unlike most "is this the client" checks, this is
 * safe to read directly during render rather than behind an effect: it's
 * `false` for every server render and `true` from the client's very first
 * render onward — so as long as the code it guards renders nothing (or
 * something portalled outside the hydrated tree, e.g. via `createPortal`)
 * when the guarded branch is inactive, there's nothing for React to diff a
 * mismatch against.
 */
export const canUseDOM = typeof document !== "undefined";
