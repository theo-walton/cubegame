import { sampleSize } from "lodash";
import stateManager from "@/store/state";
import { Upgrade } from "./upgrade_types";

const upgrades = [
  {
    name: "Unlock Combo",
    action: () => {
      if (!stateManager.state.upgrades.combo) {
        stateManager.state.upgrades.combo = {
          totalCombo: 0,
        };
      }
      makeUpgradeUnobtainable("Unlock Combo");
    },
  },
  {
    name: "Unlock Speed Bonus",
    action: () => {
      if (!stateManager.state.upgrades.speedBonus) {
        stateManager.state.upgrades.speedBonus = {
          multiplier: 1,
        };
      }
      makeUpgradeUnobtainable("Unlock Speed Bonus");
    },
  },
  {
    name: "Speed Bonus +",
    action: () => {
      if (stateManager.state.upgrades.speedBonus) {
        stateManager.state.upgrades.speedBonus.multiplier += 0.5;
      }
    },
  },
  {
    name: "Click Power +",
    action: () => {
      stateManager.state.upgrades.clickPower += 0.05;
    },
  },
  {
    name: "Reduce Dynamic Drag",
    action: () => {
      stateManager.state.cubeProperties.dynamicDrag *= 0.9;
    },
  },
];

function makeUpgradeUnobtainable(name: string) {
  let indexToRemove: number | undefined;
  upgrades.forEach((upgrade, i) => {
    if (upgrade.name == name) {
      indexToRemove = i;
    }
  });
  if (indexToRemove !== undefined) {
    upgrades.splice(indexToRemove, 1);
  }
}

export function refreshUpgradeChoices() {
  stateManager.state.upgrades.choices = sampleSize(
    upgrades.map((_, index) => index),
    3
  );
  console.log(stateManager.state);
}

export function getUpgradeChoices(): Upgrade[] {
  return stateManager.state.upgrades.choices.map((index) => upgrades[index]);
}
