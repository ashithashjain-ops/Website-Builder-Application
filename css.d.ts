declare module "*.css";

declare module "@dnd-kit/core" {
  export const DndContext: any;
  export const DragOverlay: any;
  export const PointerSensor: any;
  export const closestCenter: any;
  export const pointerWithin: any;
  export const useDraggable: any;
  export const useDroppable: any;
  export const useSensor: any;
  export const useSensors: any;
  export type CollisionDetection = any;
  export type DragEndEvent = any;
  export type DragStartEvent = any;
}

declare module "@dnd-kit/sortable" {
  export const SortableContext: any;
  export const verticalListSortingStrategy: any;
  export const arrayMove: any;
  export const useSortable: any;
}

declare module "@dnd-kit/utilities" {
  export const CSS: any;
}
