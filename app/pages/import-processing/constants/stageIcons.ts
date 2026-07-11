import {
  FileSearch,
  Wand2,
  Sparkles,
  Filter,
  CheckCircle2,
  Check,
  Phone,
  Mail,
  Users,
  Save,
  type LucideIcon,
} from "lucide-react";

export const STAGE_ICON_MAP: Record<string, LucideIcon> = {
  FileSearch,
  Wand2,
  Sparkles,
  Filter,
  CheckCircle2,
  Check,
  Phone,
  Mail,
  Users,
  Save,
};

export function resolveStageIcon(iconName: string, isCompleted: boolean): LucideIcon {
  if (isCompleted) return Check;
  return STAGE_ICON_MAP[iconName] ?? Sparkles;
}

export const STAGE_SEQUENCE = [
  { stage: "Analyzing CSV structure...", icon: "FileSearch" },
  { stage: "Understanding uploaded spreadsheet...", icon: "FileSearch" },
  { stage: "Detecting customer fields...", icon: "Wand2" },
  { stage: "Matching CRM schema...", icon: "Wand2" },
  { stage: "Cleaning phone numbers...", icon: "Phone" },
  { stage: "Validating email addresses...", icon: "Mail" },
  { stage: "Extracting batch {n} of {total} with AI...", icon: "Sparkles" },
  { stage: "Detecting duplicate leads...", icon: "Users" },
  { stage: "Saving CRM records...", icon: "Save" },
  { stage: "Normalizing and validating records...", icon: "Filter" },
  { stage: "Finalizing import...", icon: "CheckCircle2" },
] as const;
