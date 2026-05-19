"use client";

import { type FocusEvent, type KeyboardEvent, useLayoutEffect, useRef, useState } from "react";
import { useBuilderStore } from "@/store/builderStore";

export default function InlineText({
  as = "span",
  value,
  onSave,
  className = "",
}: {
  as?: string;
  value: string;
  onSave: (v: string) => void;
  className?: string;
}) {
  const [editing, setEditing] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const original = useRef(value);
  const committed = useRef(false);
  const setInlineEditing = useBuilderStore((s) => s.setInlineEditing);

  useLayoutEffect(() => {
    if (!editing || !ref.current) return;
    ref.current.textContent = value;
    ref.current.focus();
    const sel = window.getSelection();
    if (sel) {
      const range = document.createRange();
      range.selectNodeContents(ref.current);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }, [editing, value]);

  function startEdit() {
    if (editing) return;
    original.current = value;
    committed.current = false;
    setEditing(true);
    setInlineEditing(true);
  }

  function save(text: string) {
    if (committed.current) return;
    committed.current = true;
    setEditing(false);
    setInlineEditing(false);
    onSave(text || original.current);
  }

  function discard() {
    committed.current = true;
    if (ref.current) ref.current.textContent = original.current;
    setEditing(false);
    setInlineEditing(false);
  }

  const Tag = as as "span";

  return (
    <Tag
      ref={ref as unknown as React.LegacyRef<HTMLSpanElement>}
      contentEditable={editing ? "true" : undefined}
      suppressContentEditableWarning
      className={`rounded-sm transition-[outline] duration-100 ${className} ${
        editing
          ? "cursor-text outline outline-2 outline-blue-400/70 outline-offset-1"
          : "cursor-text hover:outline hover:outline-1 hover:outline-blue-200/80 hover:outline-offset-1"
      }`}
      onClick={startEdit}
      onBlur={
        editing
          ? (e: FocusEvent<HTMLSpanElement>) => {
              if (committed.current) { committed.current = false; return; }
              save(e.currentTarget.textContent ?? "");
            }
          : undefined
      }
      onKeyDown={
        editing
          ? (e: KeyboardEvent<HTMLSpanElement>) => {
              if (e.key === "Enter") { e.preventDefault(); save(e.currentTarget.textContent ?? ""); }
              else if (e.key === "Escape") { e.preventDefault(); discard(); }
            }
          : undefined
      }
    >
      {editing ? null : value}
    </Tag>
  );
}
