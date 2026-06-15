import {
  User,
  Search,
  Download,
  Copy,
  Cloud,
  Clock,
  X,
  Camera,
  Heart,
  type LucideIcon,
} from "lucide-react";
import type { IconBlockProps, IconType } from "./types";
 
const ICON_MAP: Record<IconType, LucideIcon> = {
  user: User,
  search: Search,
  download: Download,
  copy: Copy,
  cloud: Cloud,
  clock: Clock,
  cancel: X,
  camera: Camera,
  heart: Heart,
};
 
export function getIconComponent(type: IconType): LucideIcon {
  return ICON_MAP[type] ?? User;
}
 
export default function IconPreview({
  props,
  className = "",
}: {
  props: IconBlockProps;
  className?: string;
}) {
  const size = parseInt(props.size, 10) || 48;
 
  if (props.customIconUrl) {
    return (
      <img
        src={props.customIconUrl}
        alt="Custom Icon"
        width={size}
        height={size}
        className={className}
        style={{ objectFit: "contain" }}
      />
    );
  }
 
  const Icon = getIconComponent(props.iconType);
 
  return (
    <Icon
      className={className}
      size={size}
      color={props.color}
      strokeWidth={props.thickness}
    />
  );
}