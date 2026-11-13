import { useState } from "react";
import colors from "@styles/colors";
import type { QuickLink, QuickLinkStore } from "./types";

/** Adds `https://` when the user typed a bare domain such as `github.com` */
function normalizeUrl(url: string) {
  const trimmed = url.trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

/**
 * `useQuickLinks` controls the quick links shown in the nav bar:
 * - `links`: the current shortcuts
 * - `addLink()`: add a shortcut; returns false when the label or url is empty
 * - `removeLink()`: remove a shortcut by id
 */
export function useQuickLinks(initial: QuickLink[]): QuickLinkStore {
  const [links, setLinks] = useState<QuickLink[]>(initial);

  function addLink(label: string, url: string): boolean {
    if (!label.trim() || !url.trim()) return false;

    setLinks((current) => [
      ...current,
      { id: Date.now(), label: label.trim(), url: normalizeUrl(url), icon: "", color: colors.MAGENTA },
    ]);
    return true;
  }

  function removeLink(id: number) {
    setLinks((current) => current.filter((link) => link.id !== id));
  }

  return { links, addLink, removeLink };
}

/** `useNewQuickLinkForm` controls the inline "Add quick link" form */
export function useNewQuickLinkForm() {
  const [adding, setAdding] = useState(false);
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");

  function reset() {
    setAdding(false);
    setLabel("");
    setUrl("");
  }

  return {
    adding, setAdding,
    label, setLabel,
    url, setUrl,
    reset,
  };
}
