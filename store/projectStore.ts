"use client";

import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import type { Project, ProjectSort, ProjectSortKey, ProjectSortOrder } from "@/types/project";

const STORAGE_KEY = "stackly_projects";

/* ─── Helpers ──────────────────────────────────────────────────────────── */

function loadProjects(): Project[] {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function persistProjects(projects: Project[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch {
    /* storage unavailable */
  }
}

function sortProjects(projects: Project[], sort: ProjectSort): Project[] {
  const sorted = [...projects];
  sorted.sort((a, b) => {
    let cmp = 0;
    if (sort.key === "name") {
      cmp = a.name.localeCompare(b.name);
    } else if (sort.key === "createdAt") {
      cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else {
      cmp = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
    }
    return sort.order === "desc" ? -cmp : cmp;
  });
  return sorted;
}

/* ─── Store Interface ──────────────────────────────────────────────────── */

interface ProjectState {
  projects: Project[];
  searchQuery: string;
  sort: ProjectSort;

  /* Actions */
  loadProjects: () => void;
  createProject: (data: Pick<Project, "name" | "category" | "style" | "sections">) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  duplicateProject: (id: string) => Project | null;
  renameProject: (id: string, name: string) => void;
  setSearchQuery: (query: string) => void;
  setSort: (key: ProjectSortKey, order?: ProjectSortOrder) => void;
  resetProjects: () => void;

  /* Derived */
  getFilteredProjects: () => Project[];
  getProjectById: (id: string) => Project | undefined;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  searchQuery: "",
  sort: { key: "updatedAt", order: "desc" },

  loadProjects: () => {
    const projects = loadProjects();
    set({ projects });
  },

  createProject: (data) => {
    const now = new Date().toISOString();
    const project: Project = {
      id: uuidv4(),
      name: data.name,
      category: data.category,
      style: data.style,
      sections: data.sections,
      components: [],
      createdAt: now,
      updatedAt: now,
    };
    const projects = [project, ...get().projects];
    persistProjects(projects);
    set({ projects });
    return project;
  },

  updateProject: (id, updates) => {
    const projects = get().projects.map((p) =>
      p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    );
    persistProjects(projects);
    set({ projects });
  },

  deleteProject: (id) => {
    const projects = get().projects.filter((p) => p.id !== id);
    persistProjects(projects);
    set({ projects });
  },

  duplicateProject: (id) => {
    const source = get().projects.find((p) => p.id === id);
    if (!source) return null;

    const now = new Date().toISOString();
    const copy: Project = {
      ...source,
      id: uuidv4(),
      name: `${source.name} (Copy)`,
      createdAt: now,
      updatedAt: now,
    };
    const projects = [copy, ...get().projects];
    persistProjects(projects);
    set({ projects });
    return copy;
  },

  renameProject: (id, name) => {
    const projects = get().projects.map((p) =>
      p.id === id ? { ...p, name, updatedAt: new Date().toISOString() } : p
    );
    persistProjects(projects);
    set({ projects });
  },

  setSearchQuery: (query) => set({ searchQuery: query }),

  setSort: (key, order) => {
    const currentSort = get().sort;
    const newOrder = order ?? (currentSort.key === key && currentSort.order === "desc" ? "asc" : "desc");
    set({ sort: { key, order: newOrder } });
  },

  resetProjects: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* storage unavailable */
    }

    set({
      projects: [],
      searchQuery: "",
      sort: { key: "updatedAt", order: "desc" },
    });
  },

  getFilteredProjects: () => {
    const { projects, searchQuery, sort } = get();
    const filtered = searchQuery.trim()
      ? projects.filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : projects;
    return sortProjects(filtered, sort);
  },

  getProjectById: (id) => get().projects.find((p) => p.id === id),
}));
