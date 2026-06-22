"use client";

import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import type { Project, ProjectSort, ProjectSortKey, ProjectSortOrder } from "@/types/project";
import {
  createWorkspace,
  deleteWorkspace,
  duplicateWorkspace,
  getAuthToken,
  getWorkspaces,
  updateWorkspace,
  type WorkspaceDto,
} from "@/lib/api";

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

function projectFromWorkspace(workspace: WorkspaceDto): Project {
  return {
    id: workspace._id,
    name: workspace.projectName,
    category: workspace.category || "",
    style: workspace.style || "",
    sections: workspace.sections || [],
    thumbnail: workspace.thumbnail,
    components: workspace.components as Project["components"],
    designTokens: workspace.designTokens as Project["designTokens"],
    createdAt: workspace.createdAt,
    updatedAt: workspace.updatedAt,
  };
}

function workspacePayloadFromProject(project: Partial<Project>) {
  return {
    projectName: project.name,
    category: project.category,
    style: project.style,
    sections: project.sections,
    thumbnail: project.thumbnail,
    components: project.components,
    designTokens: project.designTokens,
  };
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
  loadProjects: () => Promise<void>;
  createProject: (data: Pick<Project, "name" | "category" | "style" | "sections">) => Promise<Project>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  duplicateProject: (id: string) => Promise<Project | null>;
  renameProject: (id: string, name: string) => Promise<void>;
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

  loadProjects: async () => {
    if (getAuthToken()) {
      try {
        const data = await getWorkspaces();
        const projects = data.projects.map(projectFromWorkspace);
        persistProjects(projects);
        set({ projects });
        return;
      } catch {
        /* fall back to cached projects */
      }
    }

    set({ projects: loadProjects() });
  },

  createProject: async (data) => {
    const now = new Date().toISOString();
    let project: Project = {
      id: uuidv4(),
      name: data.name,
      category: data.category,
      style: data.style,
      sections: data.sections,
      components: [],
      createdAt: now,
      updatedAt: now,
    };
    if (getAuthToken()) {
      try {
        const response = await createWorkspace({
          projectName: data.name,
          category: data.category,
          style: data.style,
          sections: data.sections,
        });
        project = projectFromWorkspace(response.workspace);
      } catch {
        /* keep local project when API is unreachable */
      }
    }

    const projects = [project, ...get().projects.filter((p) => p.id !== project.id)];
    persistProjects(projects);
    set({ projects });
    return project;
  },

  updateProject: async (id, updates) => {
    const projects = get().projects.map((p) =>
      p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    );
    persistProjects(projects);
    set({ projects });

    if (getAuthToken()) {
      try {
        const response = await updateWorkspace(id, workspacePayloadFromProject(updates));
        const project = projectFromWorkspace(response.workspace);
        const synced = get().projects.map((p) => (p.id === id ? project : p));
        persistProjects(synced);
        set({ projects: synced });
      } catch {
        /* local optimistic update stays in place */
      }
    }
  },

  deleteProject: async (id) => {
    const projects = get().projects.filter((p) => p.id !== id);
    persistProjects(projects);
    set({ projects });

    if (getAuthToken()) {
      try {
        await deleteWorkspace(id);
      } catch {
        /* local removal stays in place */
      }
    }
  },

  duplicateProject: async (id) => {
    const source = get().projects.find((p) => p.id === id);
    if (!source) return null;

    if (getAuthToken()) {
      try {
        const response = await duplicateWorkspace(id);
        const copy = projectFromWorkspace(response.workspace);
        const projects = [copy, ...get().projects];
        persistProjects(projects);
        set({ projects });
        return copy;
      } catch {
        /* fall through to local duplicate */
      }
    }

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

  renameProject: async (id, name) => {
    await get().updateProject(id, { name });
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
