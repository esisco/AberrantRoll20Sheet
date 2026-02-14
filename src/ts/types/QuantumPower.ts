namespace QuantumPowerData {
  export interface QuantumPower {
    name: string;
    level: number;
    quantum: number;
    source: string;
    dicePool?: string;
    range?: string;
    area?: string;
    duration?: string;
    effect?: string;
    multipleActions?: string | boolean | null;
    page?: string;
    summary?: string;
    techniques?: string[];
  }
}