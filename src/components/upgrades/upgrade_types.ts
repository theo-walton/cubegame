export interface Upgrade {
  name: string;
  action: () => void;
}

export interface UpgradeWithCost {
  name: string;
  action: () => void;
  cost: number;
}
