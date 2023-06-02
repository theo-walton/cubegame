export type Currency = "red" | "blue" | "green" | "yellow" | "black" | "white";

export interface Upgrade {
  name: string;
  action: () => void;
  cost: number;
  currency: Currency;
}
