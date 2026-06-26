"use client";

import { createContext, useContext, type ReactNode } from "react";

/**
 * Holds collections fetched on the server (in the root layout) so client
 * components can render their data — including images — on first paint,
 * instead of waiting for a client-side fetch. Eliminates image load delay.
 */
const CollectionsContext = createContext<Record<string, unknown[]>>({});

export function CollectionsProvider({
  value,
  children,
}: {
  value: Record<string, unknown[]>;
  children: ReactNode;
}) {
  return <CollectionsContext.Provider value={value}>{children}</CollectionsContext.Provider>;
}

/** Server-provided initial data for a collection key (undefined if not preloaded). */
export function useServerCollection(key: string): unknown[] | undefined {
  return useContext(CollectionsContext)[key];
}
