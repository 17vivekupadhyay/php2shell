export interface AttackTechnique {
  id: string;
  name: string;
  detail: string;
  defense: string;
}

export interface StageReference {
  /** e.g. "CVE-2024-4577" or "MITRE ATT&CK T1053.003" */
  label: string;
  summary: string;
  /** Authoritative source (NVD / MITRE ATT&CK) for this reference. */
  url: string;
}

export interface AttackStage {
  id: string;
  order: number;
  title: string;
  shortLabel: string;
  description: string;
  techniques: AttackTechnique[];
  detail: string;
  defenderNote: string;
  colorFrom: string;
  colorTo: string;
  /** A short, real vulnerable-vs-secure code example for this stage, when one applies. */
  example?: {
    vulnerable: string;
    secure: string;
    language?: string;
  };
  /** Simulated terminal output "typed" live when this stage is active — illustrative only. */
  terminalLines: string[];
  /** A real, well-documented CVE or MITRE ATT&CK technique this stage maps to. */
  reference?: StageReference;
}
