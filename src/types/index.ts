export * from "./vulnerability";
export * from "./payload";

export interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  priority: "critical" | "high" | "medium" | "low";
  category: string;
}

export interface ChecklistSection {
  id: string;
  title: string;
  description: string;
  items: ChecklistItem[];
}

export interface AttackStage {
  id: string;
  order: number;
  title: string;
  shortLabel: string;
  description: string;
  techniques: string[];
  detail: string;
  colorFrom: string;
  colorTo: string;
}
