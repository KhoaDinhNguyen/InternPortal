import { useOutletContext } from "react-router";
import type { PortalStores } from "./usePortalStores";

/** Reads the shared feature stores from inside a page rendered by `PortalLayout` */
export function usePortal() {
  return useOutletContext<PortalStores>();
}
