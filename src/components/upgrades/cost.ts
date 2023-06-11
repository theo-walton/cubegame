import stateManager from "@/store/state";
import { Upgrade } from "./upgrade_types";

export function getUpgradeCost(upgrade: Upgrade): number {
  const total_upgrades = stateManager.state.upgrades.current.length;
  const modifier = Math.pow(5, total_upgrades) + total_upgrades * 4 + 9;
  return Math.round(modifier);
}