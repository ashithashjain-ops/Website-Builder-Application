"use client";

import { memo, useCallback, useEffect, useRef, useState, useMemo } from "react";
import { Check, ChevronDown, Eye, FolderOpen, Images, Layers, MoreHorizontal, Palette, Pencil, Redo2, Save, Sparkles, Trash2, Undo2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { AssetManager } from "@/components/assets/AssetManager";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";
import QuickInsertBar from "./QuickInsertBar";
import ExportButton from "./ExportButton";
import ButtonComponent from "@/components/draggable/ButtonComponent";
import IconComponent from "@/components/draggable/IconComponent";
import { useBuilderStore } from "@/store/builderStore";
import { useDesignStore } from "@/store/designStore";
import { useProjectStore } from "@/store/projectStore";
import type { BuilderComponent, ComponentType } from "@/types/builder";

function Canvas({
  components,
  onSelect,
  onDelete,
  onDuplicate,
  onLoadStarter,
  onClear,
  onPreview,
}: {
  components: BuilderComponent[];
  onSelect: (id: string | null) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onLoadStarter: () => void;
  onClear: () => void;
  onPreview: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: "builder-canvas" });
  const flowComponents = useMemo(
    () => components.filter((component) => !isFloatingComponent(component)),
    [components],
  );
  const floatingComponents = useMemo(
    () => components.filter(isFloatingComponent),
    [components],
  );
  const sortableIds = useMemo(() => flowComponents.map((c) => c.id), [flowComponents]);

  /* ── Store actions for new features ── */
  const undo = useBuilderStore((s) => s.undo);
  const redo = useBuilderStore((s) => s.redo);
  const canUndo = useBuilderStore((s) => s.history.length > 0);
  const canRedo = useBuilderStore((s) => s.future.length > 0);
  const saveToLocalStorage = useBuilderStore((s) => s.saveToLocalStorage);
  const loadFromLocalStorage = useBuilderStore((s) => s.loadFromLocalStorage);
  const loadComponents = useBuilderStore((s) => s.loadComponents);
  const loadWebsiteFromRequirements = useBuilderStore((s) => s.loadWebsiteFromRequirements);
  const autoSaveEnabled = useDesignStore((s) => s.autoSaveEnabled);
  const tokens = useDesignStore((s) => s.tokens);
  const setTokens = useDesignStore((s) => s.setTokens);
  const setLastSavedAt = useDesignStore((s) => s.setLastSavedAt);
  const toggleGlobalStyles = useDesignStore((s) => s.toggleGlobalStyles);
  const loadProjects = useProjectStore((s) => s.loadProjects);
  const updateProject = useProjectStore((s) => s.updateProject);
  const getProjectById = useProjectStore((s) => s.getProjectById);
  const storeAddComponent = useBuilderStore((s) => s.addComponent);
  const insertComponentBefore = useBuilderStore((s) => s.insertComponentBefore);
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");

  /* ── Quick-insert helpers ── */
  const handleQuickInsertBefore = useCallback(
    (type: ComponentType, beforeId: string) => {
      insertComponentBefore(type, beforeId);
    },
    [insertComponentBefore],
  );

  const handleQuickInsertAfter = useCallback(
    (type: ComponentType, afterId: string) => {
      storeAddComponent(type, null, afterId);
    },
    [storeAddComponent],
  );

  /* ── Project name (local state, persisted via save) ── */
  const [projectName, setProjectName] = useState("My Website");
  const [editingName, setEditingName] = useState(false);
  const [isAssetsOpen, setIsAssetsOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const toolsMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editingName) nameInputRef.current?.select();
  }, [editingName]);

  useEffect(() => {
    if (!toolsOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (toolsMenuRef.current && !toolsMenuRef.current.contains(event.target as Node)) {
        setToolsOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [toolsOpen]);

  /* ── Save feedback ── */
  const [saved, setSaved] = useState(false);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadedProjectRef = useRef<string | null>(null);

  useEffect(() => {
    if (!projectId || loadedProjectRef.current === projectId) return;
    loadProjects();
    const project = getProjectById(projectId);
    if (!project) return;

    loadedProjectRef.current = projectId;
    window.setTimeout(() => setProjectName(project.name || "My Website"), 0);
    if (project.designTokens) {
      setTokens(project.designTokens);
    }
    if (project.components && project.components.length > 0) {
      loadComponents(project.components);
    } else if (components.length === 0) {
      loadWebsiteFromRequirements({
        projectName: project.name || "My Website",
        category: project.category || "Business",
        style: project.style || "Modern",
        sections: project.sections || [],
      });
    }
  }, [components.length, getProjectById, loadComponents, loadProjects, loadWebsiteFromRequirements, projectId, setTokens]);

  const handleSave = () => {
    if (projectId) {
      loadProjects();
      const project = getProjectById(projectId);
      if (project) {
        updateProject(projectId, {
          name: projectName.trim() || project.name,
          components,
          designTokens: tokens,
        });
      } else {
        saveToLocalStorage();
      }
    } else {
      saveToLocalStorage();
    }
    setSaved(true);
    if (savedTimer.current) clearTimeout(savedTimer.current);
    savedTimer.current = setTimeout(() => setSaved(false), 2200);
    setLastSavedAt(Date.now());
  };

  /* ── Auto-save every 30s ── */
  useEffect(() => {
    if (!autoSaveEnabled || components.length === 0) return;
    const id = setInterval(() => {
      if (projectId) {
        const project = getProjectById(projectId);
        if (project) {
          updateProject(projectId, {
            name: projectName.trim() || project.name,
            components,
            designTokens: tokens,
          });
        }
      } else {
        saveToLocalStorage();
      }
      setLastSavedAt(Date.now());
    }, 30000);
    return () => clearInterval(id);
  }, [autoSaveEnabled, components, getProjectById, projectId, projectName, saveToLocalStorage, setLastSavedAt, tokens, updateProject]);

  const handleLoad = () => {
    let ok = false;
    if (projectId) {
      loadProjects();
      const project = getProjectById(projectId);
      if (project?.components && project.components.length > 0) {
        loadComponents(project.components);
        if (project.designTokens) {
          setTokens(project.designTokens);
        }
        setProjectName(project.name || "My Website");
        ok = true;
      }
    } else {
      ok = loadFromLocalStorage();
    }
    if (!ok) {
      // Brief shake feedback would be ideal; keeping simple for now
      alert("No saved draft found.");
    }
  };

  const runTool = (action: () => void) => {
    action();
    setToolsOpen(false);
  };

  return (
    <main
      className="relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-[#dbe3ef] bg-[#f7f9fc] shadow-sm"
      onClick={() => onSelect(null)}
    >
      {/* ── Toolbar ── */}
      <div
        className="relative z-30 flex h-[60px] flex-shrink-0 items-center justify-between gap-3 overflow-visible border-b border-[#dbe3ef] bg-white px-3 shadow-[0_1px_0_rgba(15,23,42,0.03)] md:px-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: undo/redo + project name */}
        <div className="flex min-w-0 items-center gap-1.5">
          <button
            type="button"
            title="Undo (Ctrl+Z)"
            disabled={!canUndo}
            onClick={undo}
            className="flex h-8 w-8 items-center justify-center rounded text-[#566583] transition hover:bg-gray-100 hover:text-[#0B1D40] disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Undo2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Redo (Ctrl+Shift+Z)"
            disabled={!canRedo}
            onClick={redo}
            className="flex h-8 w-8 items-center justify-center rounded text-[#566583] transition hover:bg-gray-100 hover:text-[#0B1D40] disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Redo2 className="h-4 w-4" />
          </button>

          <div className="mx-1 h-5 w-px bg-[#dbe3ef]" />

          {/* Editable project name */}
          {editingName ? (
            <input
              ref={nameInputRef}
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onBlur={() => setEditingName(false)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === "Escape") setEditingName(false); }}
              className="w-32 rounded border border-blue-300 bg-blue-50 px-2 py-1 text-[13px] font-bold text-[#0B1D40] outline-none focus:ring-2 focus:ring-blue-200 sm:w-44"
            />
          ) : (
            <button
              type="button"
              title="Rename project"
              onClick={() => setEditingName(true)}
              className="flex min-w-0 items-center gap-1.5 rounded-lg px-2 py-1 text-[13px] font-bold text-[#0B1D40] transition hover:bg-gray-100"
            >
              <Layers className="h-3.5 w-3.5 flex-shrink-0 text-[#566583]" />
              <span className="max-w-[92px] truncate sm:max-w-[180px]">{projectName}</span>
              <Pencil className="h-3 w-3 text-gray-400" />
            </button>
          )}
        </div>

        {/* Right: actions */}
        <div className="flex flex-shrink-0 items-center gap-1.5 md:gap-2">
          <div className="relative" ref={toolsMenuRef}>
            <button
              type="button"
              title="Builder tools"
              onClick={() => setToolsOpen((open) => !open)}
              className="flex h-9 items-center gap-1.5 whitespace-nowrap rounded-lg border border-gray-200 bg-white px-2.5 text-[12px] font-bold text-[#0B1D40] shadow-sm transition hover:bg-gray-50 active:scale-95 sm:px-3"
            >
              <MoreHorizontal className="h-4 w-4 text-gray-500" />
              <span className="hidden sm:inline">Tools</span>
            </button>
            <AnimatePresence>
              {toolsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.16, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="absolute right-0 top-11 z-50 w-[220px] overflow-hidden rounded-xl border border-[#dbe3ef] bg-white p-1.5 shadow-[0_18px_50px_rgba(15,35,75,0.18)]"
                >
                  <ToolMenuButton label="Design" Icon={Palette} tone="text-violet-700 bg-violet-50 border-violet-100" onClick={() => runTool(toggleGlobalStyles)} />
                  <ToolMenuButton label="Assets" Icon={Images} tone="text-slate-700 bg-slate-50 border-slate-100" onClick={() => runTool(() => setIsAssetsOpen(true))} />
                  <ToolMenuButton label="Starter" Icon={Sparkles} tone="text-blue-700 bg-blue-50 border-blue-100" onClick={() => runTool(onLoadStarter)} />
                  <ToolMenuButton label="Load" Icon={FolderOpen} tone="text-slate-700 bg-slate-50 border-slate-100" onClick={() => runTool(handleLoad)} />
                  <ToolMenuButton label={saved ? "Saved" : "Save"} Icon={saved ? Check : Save} tone={saved ? "text-green-700 bg-green-50 border-green-100" : "text-slate-700 bg-slate-50 border-slate-100"} onClick={() => runTool(handleSave)} />
                  <ToolMenuButton label="Clear" Icon={Trash2} tone="text-red-700 bg-red-50 border-red-100" onClick={() => runTool(onClear)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            type="button"
            title="Preview page"
            onClick={onPreview}
            className="flex h-9 items-center gap-1.5 whitespace-nowrap rounded-lg border border-blue-100 bg-blue-50 px-2.5 text-[12px] font-bold text-blue-700 shadow-sm transition hover:bg-blue-100 active:scale-95 sm:px-3"
          >
            <Eye className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Preview</span>
          </button>

          <ExportButton components={components} />
        </div>
      </div>

      {/* ── Viewport / device switcher + Zoom ── */}
      {/* ── Canvas drop zone ── */}
      <div
        ref={setNodeRef}
        className={`flex flex-1 flex-col items-center overflow-y-auto px-3 py-4 transition sm:px-4 ${isOver ? "bg-blue-50/50" : "bg-[#f0f3f8]"}`}
        style={{
          backgroundColor: tokens.colors.background,
          color: tokens.colors.text,
          fontFamily: tokens.typography.fontFamily,
          fontSize: tokens.typography.baseFontSize,
        }}
      >
        <div
          className="relative flex min-h-[680px] w-full flex-col gap-3 transition-all duration-300"
        >
          {flowComponents.length === 0 && floatingComponents.length === 0 ? (
            <div className="flex min-h-[280px] w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#dbe3ef] bg-white px-6 text-center shadow-[0_18px_45px_rgba(15,35,75,0.08)] transition">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#eef4fb] text-[#0B1D40]">
                <ChevronDown className="h-7 w-7" />
              </div>
              <h2 className="text-[18px] font-bold text-[#0B1D40]">Drop blocks here</h2>
              <p className="mt-2 max-w-[360px] text-sm font-medium leading-6 text-[#566583]">
                Drag a block from the sidebar or click a palette item to start building.
              </p>
              <button
                type="button"
                className="mt-6 flex items-center gap-2 rounded-md bg-[#0B1D40] px-5 py-3 text-sm font-bold text-white shadow-[0_2px_4px_rgba(11,29,64,0.3)] transition hover:bg-[#152B52] active:scale-95"
                onClick={(e) => { e.stopPropagation(); onLoadStarter(); }}
              >
                <Sparkles className="h-4 w-4" />
                Create Starter Website
              </button>
            </div>
          ) : (
            <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
              {flowComponents.map((component, index) => (
                <div key={component.id} className="w-full">
                  {/* Quick-insert bar BEFORE this block */}
                  {index === 0 && (
                    <QuickInsertBar
                      onInsert={(type) => handleQuickInsertBefore(type, component.id)}
                    />
                  )}
                  <SortableItem
                    component={component}
                    onDelete={onDelete}
                    onDuplicate={onDuplicate}
                    onSelect={onSelect}
                  />
                  {/* Quick-insert bar AFTER this block */}
                  <QuickInsertBar
                    onInsert={(type) => handleQuickInsertAfter(type, component.id)}
                  />
                </div>
              ))}
            </SortableContext>
          )}

          {floatingComponents.length > 0 && (
            <div className="pointer-events-none absolute inset-0 z-40">
              {floatingComponents.map((component) => (
                <FloatingCanvasItem
                  key={component.id}
                  component={component}
                  onDelete={onDelete}
                  onSelect={onSelect}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <AssetManager open={isAssetsOpen} onClose={() => setIsAssetsOpen(false)} />
    </main>
  );
}

function ToolMenuButton({
  label,
  Icon,
  tone,
  onClick,
}: {
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  tone: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[12px] font-bold text-[#0B1D40] transition hover:bg-[#f7f9fc]"
    >
      <span className={`flex h-7 w-7 items-center justify-center rounded-md border ${tone}`}>
        <Icon className="h-3.5 w-3.5" />
      </span>
      <span className="flex-1">{label}</span>
    </button>
  );
}

const isFloatingComponent = (component: BuilderComponent) =>
  (component.type === "icon" || component.type === "button") && component.props?.floating === true;

function FloatingCanvasItem({
  component,
  onDelete,
  onSelect,
}: {
  component: BuilderComponent;
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
}) {
  const selectedComponentId = useBuilderStore((s) => s.selectedComponentId);
  const moveComponent = useBuilderStore((s) => s.moveComponent);
  const isSelected = selectedComponentId === component.id;
  const position = component.position ?? { x: 32, y: 32 };
  const zIndex = Number(component.styles.zIndex || component.zIndex || 60);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || component.locked) return;

    event.preventDefault();
    event.stopPropagation();
    onSelect(component.id);

    const startPointer = { x: event.clientX, y: event.clientY };
    const startPosition = component.position ?? { x: 32, y: 32 };

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const dx = moveEvent.clientX - startPointer.x;
      const dy = moveEvent.clientY - startPointer.y;
      moveComponent(component.id, startPosition.x + dx, startPosition.y + dy);
    };

    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp, { once: true });
  };

  return (
    <motion.div
      className="pointer-events-auto absolute"
      style={{
        left: position.x,
        top: position.y,
        zIndex: isSelected ? zIndex + 20 : zIndex,
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.16, ease: [0.25, 0.46, 0.45, 0.94] }}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(component.id);
      }}
    >
      <div
        role="button"
        tabIndex={0}
        title={component.locked ? "Element locked" : `Drag ${component.type}`}
        onPointerDown={handlePointerDown}
        className={`group/icon flex cursor-grab items-center justify-center rounded-md p-1 transition active:cursor-grabbing ${
          isSelected ? "bg-white/80 ring-2 ring-blue-500 shadow-[0_8px_24px_rgba(37,99,235,0.18)]" : "hover:bg-white/70 hover:ring-1 hover:ring-blue-200"
        }`}
      >
        {component.type === "button" ? <ButtonComponent component={component} /> : <IconComponent component={component} />}
      </div>
      {isSelected && (
        <button
          type="button"
          title={`Delete ${component.type}`}
          onClick={(event) => {
            event.stopPropagation();
            onDelete(component.id);
          }}
          className="absolute -right-3 -top-3 flex h-6 w-6 items-center justify-center rounded-full border border-red-100 bg-white text-red-500 shadow-sm transition hover:bg-red-50"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
    </motion.div>
  );
}

export default memo(Canvas);
