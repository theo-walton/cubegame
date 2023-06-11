import stateManager, { State } from "@/store/state";

type CurrencyNames = keyof State["currency"];

export function addCubePointsWithMultipliers() {
  let base = 1;
  if (stateManager.state.upgrades.speedBonus) {
    base +=
      stateManager.state.upgrades.speedBonus.multiplier *
      stateManager.state.cubeProperties.spinSpeed;
  }

  const combo = stateManager.state.upgrades?.combo?.totalCombo || 1;
  const multiplier = Math.sqrt(combo);
  stateManager.state.currency.cubePoints += Math.round(multiplier * base);
}
