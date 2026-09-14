"use client";

import { Braces, Code2, FileCode2 } from "lucide-react";
import { CodeEditor } from "@/features/lesson-runner/components/code-editor";
import { cn } from "@/lib/utils";
import type { LiveClassDraft, LiveClassFile } from "../types";

const files = [
  { id: "html" as const, label: "index.html", icon: FileCode2 },
  { id: "css" as const, label: "style.css", icon: Code2 },
  { id: "js" as const, label: "script.js", icon: Braces },
];

type LiveClassEditorProps = {
  draft: LiveClassDraft;
  readOnly?: boolean;
  onActiveFileChange?: (file: LiveClassFile) => void;
  onChangeFile?: (file: LiveClassFile, value: string) => void;
  onCursorLineChange?: (line: number) => void;
};

export function LiveClassEditor({
  draft,
  readOnly = false,
  onActiveFileChange,
  onChangeFile,
  onCursorLineChange,
}: LiveClassEditorProps) {
  const activeValue = draft[draft.activeFile];

  return (
    <section className={cn("live-class-editor", readOnly && "is-read-only")} aria-label={readOnly ? "Öğretmen canlı kodu" : "Canlı ders IDE"}>
      <header className="live-class-editor-tabs">
        <div>
          {files.map(({ id, label, icon: Icon }) => (
            <button
              type="button"
              key={id}
              disabled={readOnly}
              className={draft.activeFile === id ? "is-active" : ""}
              onClick={() => onActiveFileChange?.(id)}
              aria-pressed={draft.activeFile === id}
            >
              <Icon /> {label}
            </button>
          ))}
        </div>
        <span>{readOnly ? "read-only" : "canlı düzenleme"} · satır {draft.cursorLine}</span>
      </header>
      <div className="live-class-editor-body">
        <CodeEditor
          value={activeValue}
          readOnly={readOnly}
          minHeight="640px"
          ariaLabel={`${files.find((item) => item.id === draft.activeFile)?.label ?? "Kod"} editörü`}
          onChange={readOnly ? undefined : (value) => onChangeFile?.(draft.activeFile, value)}
          onCursorLineChange={readOnly ? undefined : onCursorLineChange}
        />
      </div>
    </section>
  );
}
