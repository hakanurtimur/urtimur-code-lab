"use client";

import { html } from "@codemirror/lang-html";
import CodeMirror from "@uiw/react-codemirror";

type CodeEditorProps = {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  minHeight?: string;
  ariaLabel?: string;
};

export function CodeEditor({ value, onChange, readOnly = false, minHeight = "420px", ariaLabel = "HTML kod editörü" }: CodeEditorProps) {
  return (
    <div className={readOnly ? "code-editor is-read-only" : "code-editor"} aria-label={ariaLabel}>
      <CodeMirror
        value={value}
        height="100%"
        minHeight={minHeight}
        extensions={[html()]}
        onChange={onChange}
        editable={!readOnly}
        readOnly={readOnly}
        basicSetup={{
          lineNumbers: true,
          foldGutter: false,
          highlightActiveLine: !readOnly,
          highlightActiveLineGutter: !readOnly,
          autocompletion: !readOnly,
          bracketMatching: true,
          closeBrackets: !readOnly,
          indentOnInput: !readOnly,
        }}
      />
    </div>
  );
}
