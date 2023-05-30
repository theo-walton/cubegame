export type Currency = "red" | "blue" | "green" | "yellow" | "black" | "white";

export interface Upgrade {
  action: () => void;
  cost: number;
  currency: Currency;
}

export interface UpgradeDisplay {
  [text: string]: Upgrade;
}

const mock: UpgradeDisplay = {
  "Unlock Combo": {
    action: () => {
      console.log("combo unlocked");
    },
    cost: 10,
    currency: "red",
  },
};
