"use client";

import { useState } from "react";
import { AlignCenter, AlignLeft, AlignRight, ChevronDown } from "lucide-react";
import { ColorSwatch } from "./controls/ColorSwatch";
import { UnitInput } from "./controls/UnitInput";
import { SegmentedControl } from "./controls/SegmentedControl";
import { useBuilderStore } from "@/store/builderStore";
import type { BuilderComponent, ComponentStyles } from "@/types/builder";

const FONT_WEIGHTS = [
  { value: "400", label: "Regular" },
  { value: "500", label: "Medium" },
  { value: "600", label: "Semi" },
  { value: "700", label: "Bold" },
];

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[#f0eae6] last:border-0">
      <button
        type="button"
        className="flex w-full items-center justify-between px-5 py-3.5 text-left"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="text-[11px] font-bold uppercase tracking-widest text-[#566583]">{title}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-[#566583] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="space-y-4 px-5 pb-5">{children}</div>}
    </div>
  );
}

export function StyleTab({
  component,
  onUpdate,
}: {
  component: BuilderComponent;
  onUpdate: (id: string, updates: Partial<BuilderComponent>) => void;
}) {
  const s = component.styles;
  const selectedTextStyleTarget = useBuilderStore((state) => state.selectedTextStyleTarget);
  const selectTextStyleTarget = useBuilderStore((state) => state.selectTextStyleTarget);
  const textTarget =
    selectedTextStyleTarget?.componentId === component.id
      ? selectedTextStyleTarget
      : null;
  const activeTextStyles = textTarget ? component.textStyles?.[textTarget.key] ?? {} : s;
  const defaultTextColor = textTarget?.key.endsWith(".cta") ? "#ffffff" : "#000000";

  const set = (patch: Partial<ComponentStyles>) =>
    onUpdate(component.id, { styles: { ...s, ...patch } });
  const setTypography = (patch: Partial<ComponentStyles>) => {
    if (!textTarget) {
      set(patch);
      return;
    }

    onUpdate(component.id, {
      textStyles: {
        [textTarget.key]: {
          ...(component.textStyles?.[textTarget.key] ?? {}),
          ...patch,
        },
      },
    });
  };

  return (
    <div className="pb-6">
      {/* Typography */}
      <Section title="Typography">
        {textTarget && (
          <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2">
            <div className="flex items-center justify-between gap-2">
              <span className="min-w-0 truncate text-[11px] font-bold text-blue-800">
                Editing {textTarget.label}
              </span>
              <button
                type="button"
                onClick={() => selectTextStyleTarget(null)}
                className="text-[10px] font-bold text-blue-600 hover:text-blue-800"
              >
                Clear
              </button>
            </div>
          </div>
        )}
        <ColorSwatch
          label="Text Color"
          value={activeTextStyles.color || defaultTextColor}
          onChange={(v) => setTypography({ color: v })}
        />
        <div className="grid grid-cols-2 gap-3">
          <UnitInput
            label="Font Size"
            value={activeTextStyles.fontSize || ""}
            onChange={(v) => setTypography({ fontSize: v })}
            placeholder="16"
          />
          <div>
            <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wider text-[#566583]">Weight</span>
            <select
              value={activeTextStyles.fontWeight || "400"}
              onChange={(e) => setTypography({ fontWeight: e.target.value })}
              className="w-full rounded-lg border border-[#dbe3ef] bg-transparent px-2.5 py-2 text-[12px] font-bold text-[#0B1D40] outline-none focus:border-blue-400"
            >
              {FONT_WEIGHTS.map((fw) => (
                <option key={fw.value} value={fw.value}>{fw.label}</option>
              ))}
            </select>
          </div>
        </div>
        <SegmentedControl
          label="Alignment"
          value={(activeTextStyles.textAlign as string) || "left"}
          options={[
            { value: "left",   icon: <AlignLeft className="h-3.5 w-3.5" />,   title: "Left" },
            { value: "center", icon: <AlignCenter className="h-3.5 w-3.5" />, title: "Center" },
            { value: "right",  icon: <AlignRight className="h-3.5 w-3.5" />,  title: "Right" },
          ]}
          onChange={(v) => setTypography({ textAlign: v as ComponentStyles["textAlign"] })}
        />
      </Section>

      {/* Background */}
      <Section title="Background">
        <ColorSwatch
          label="Background Color"
          value={s.backgroundColor || "#ffffff"}
          onChange={(v) => set({ backgroundColor: v })}
        />
      </Section>

      {/* Size */}
      <Section title="Size" defaultOpen={false}>
        <div className="grid grid-cols-2 gap-3">
          <UnitInput
            label="Width"
            value={s.width || ""}
            onChange={(v) => set({ width: v })}
            placeholder="100"
          />
          <UnitInput
            label="Height"
            value={s.height || ""}
            onChange={(v) => set({ height: v })}
            placeholder="auto"
          />
        </div>
        <UnitInput
          label="Border Radius"
          value={s.borderRadius || ""}
          onChange={(v) => set({ borderRadius: v })}
          placeholder="8"
        />
      </Section>

      {/* Position */}
      <Section title="Position" defaultOpen={false}>
        <div>
          <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wider text-[#566583]">Mode</span>
          <div className="flex overflow-hidden rounded-lg border border-[#dbe3ef]">
            {(["", "relative", "absolute"] as const).map((mode) => {
              const label = mode === "" ? "Static" : mode.charAt(0).toUpperCase() + mode.slice(1);
              const isActive = (s.position || "") === mode;
              return (
                <button
                  key={mode || "static"}
                  type="button"
                  onClick={() => set({ position: mode })}
                  className={`flex flex-1 items-center justify-center py-2 text-[11px] font-bold transition ${
                    isActive
                      ? "bg-[#0B1D40] text-white"
                      : "bg-transparent text-[#566583] hover:bg-[#f7f9fc] hover:text-[#0B1D40]"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
        {s.position === "absolute" && (
          <div className="grid grid-cols-2 gap-3">
            <UnitInput
              label="Left (X)"
              value={s.left || ""}
              onChange={(v) => set({ left: v })}
              placeholder="0"
            />
            <UnitInput
              label="Top (Y)"
              value={s.top || ""}
              onChange={(v) => set({ top: v })}
              placeholder="0"
            />
          </div>
        )}
      </Section>

      {/* Layer (Z-Index) */}
      <Section title="Layer" defaultOpen={false}>
        <div>
          <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wider text-[#566583]">Z-Index</span>
          <div className="flex overflow-hidden rounded-lg border border-[#dbe3ef] focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
            <input
              type="number"
              min="0"
              max="9999"
              value={s.zIndex || ""}
              placeholder="auto"
              onChange={(e) => set({ zIndex: e.target.value })}
              className="min-w-0 flex-1 bg-transparent px-2.5 py-2 text-[13px] font-bold text-[#0B1D40] outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
          <p className="mt-1.5 text-[11px] font-medium text-[#566583]">
            Higher values appear on top of lower ones.
          </p>
        </div>
      </Section>
    </div>
  );
}
