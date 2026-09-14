import type { PreviewPreset } from "@/features/live-session/types";
import type {
  LiveClassDiscovery,
  LiveClassDraft,
  LiveClassFile,
  LiveClassPublishedSession,
  LiveClassSpotlight,
  LiveClassStatus,
} from "./types";

const statuses: LiveClassStatus[] = ["live", "frozen", "ended"];
const files: LiveClassFile[] = ["html", "css", "js"];
const spotlights: LiveClassSpotlight[] = ["split", "code", "browser"];
const presets: PreviewPreset[] = ["fit", "desktop", "tablet", "mobile"];

function asMillis(value: unknown): number | null {
  if (value && typeof value === "object" && "toMillis" in value && typeof (value as { toMillis?: unknown }).toMillis === "function") {
    return (value as { toMillis: () => number }).toMillis();
  }
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function asStatus(value: unknown): LiveClassStatus {
  return typeof value === "string" && statuses.includes(value as LiveClassStatus)
    ? value as LiveClassStatus
    : "ended";
}

function asFile(value: unknown): LiveClassFile {
  return typeof value === "string" && files.includes(value as LiveClassFile)
    ? value as LiveClassFile
    : "html";
}

function asSpotlight(value: unknown): LiveClassSpotlight {
  return typeof value === "string" && spotlights.includes(value as LiveClassSpotlight)
    ? value as LiveClassSpotlight
    : "split";
}

function asPreset(value: unknown): PreviewPreset {
  return typeof value === "string" && presets.includes(value as PreviewPreset)
    ? value as PreviewPreset
    : "fit";
}

export function composeLiveClassDocument(html: string, css: string, js: string) {
  const safeCss = css.replace(/<\/style/gi, "<\\/style");
  const safeJs = js.replace(/<\/script/gi, "<\\/script");
  const style = `<style>${safeCss}</style>`;
  const script = `<script>${safeJs}</script>`;
  const csp = `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src https: data:; style-src 'unsafe-inline'; script-src 'unsafe-inline'; font-src data:;">`;
  const viewport = `<meta name="viewport" content="width=device-width, initial-scale=1">`;

  if (/<html[\s>]/i.test(html)) {
    let document = html;
    if (/<head[\s>]/i.test(document)) document = document.replace(/<head([^>]*)>/i, `<head$1>${viewport}${csp}${style}`);
    else document = document.replace(/<html([^>]*)>/i, `<html$1><head>${viewport}${csp}${style}</head>`);
    if (/<\/body>/i.test(document)) return document.replace(/<\/body>/i, `${script}</body>`);
    return `${document}${script}`;
  }

  return `<!doctype html><html><head><meta charset="utf-8">${viewport}${csp}${style}</head><body>${html}${script}</body></html>`;
}

export function shouldPublishLiveClass(status: LiveClassStatus) {
  return status === "live";
}

export function isLiveClassViewerOnline(lastSeenMs: number | null, nowMs: number) {
  return Boolean(lastSeenMs && nowMs - lastSeenMs < 45_000);
}

export function parseLiveClassDiscovery(data: Record<string, unknown>): LiveClassDiscovery | null {
  if (typeof data.sessionId !== "string" || !data.sessionId) return null;
  return {
    sessionId: data.sessionId,
    active: data.active === true,
    status: asStatus(data.status),
    title: typeof data.title === "string" && data.title.trim() ? data.title : "Canlı Kod Atölyesi",
    teacherUid: typeof data.teacherUid === "string" ? data.teacherUid : "",
    activeFile: asFile(data.activeFile),
    spotlight: asSpotlight(data.spotlight),
    previewPreset: asPreset(data.previewPreset),
    startedAtMs: asMillis(data.startedAt),
    updatedAtMs: asMillis(data.updatedAt),
    endedAtMs: asMillis(data.endedAt),
  };
}

export function parseLiveClassPublishedSession(sessionId: string, data: Record<string, unknown>): LiveClassPublishedSession {
  return {
    sessionId,
    teacherUid: typeof data.teacherUid === "string" ? data.teacherUid : "",
    title: typeof data.title === "string" && data.title.trim() ? data.title : "Canlı Kod Atölyesi",
    status: asStatus(data.status),
    activeFile: asFile(data.activeFile),
    spotlight: asSpotlight(data.spotlight),
    previewPreset: asPreset(data.previewPreset),
    html: typeof data.publishedHtml === "string" ? data.publishedHtml : "",
    css: typeof data.publishedCss === "string" ? data.publishedCss : "",
    js: typeof data.publishedJs === "string" ? data.publishedJs : "",
    cursorLine: typeof data.cursorLine === "number" && data.cursorLine > 0 ? Math.round(data.cursorLine) : 1,
    startedAtMs: asMillis(data.startedAt),
    updatedAtMs: asMillis(data.updatedAt),
    endedAtMs: asMillis(data.endedAt),
  };
}

export function parseLiveClassDraft(data: Record<string, unknown>): LiveClassDraft {
  return {
    html: typeof data.draftHtml === "string" ? data.draftHtml : "",
    css: typeof data.draftCss === "string" ? data.draftCss : "",
    js: typeof data.draftJs === "string" ? data.draftJs : "",
    activeFile: asFile(data.activeFile),
    cursorLine: typeof data.cursorLine === "number" && data.cursorLine > 0 ? Math.round(data.cursorLine) : 1,
    updatedAtMs: asMillis(data.updatedAt),
  };
}
