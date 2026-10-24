export interface AttackTechnique {
  id: string;
  name: string;
  detail: string;
  defense: string;
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
}
