<template>
  <div flat class="rounded-0 container" color="grey">
    <div v-for="item in upgradeDisplay" :key="item.name">
      <v-list-item
        :title="item.name"
        @click="performUpgrade(item)"
        :disabled="!canAfford(item)"
        class="mx-2"
        style="background-color: orange"
        width="300px"
      >
        {{ `cost: ${item.cost}` }}
      </v-list-item>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { UpgradeWithCost, Upgrade } from "@/components/upgrades/upgrade_types";
import stateManager from "@/store/state";
import {
  getUpgradeChoices,
  refreshUpgradeChoices,
} from "@/components/upgrades/possible_upgrades";
import { getUpgradeCost } from "@/components/upgrades/cost";

@Options({})
export default class MainUI extends Vue {
  get upgradeDisplay(): UpgradeWithCost[] {
    return getUpgradeChoices().map((choice) => {
      return {
        ...choice,
        cost: getUpgradeCost(choice),
        currency: "red",
      };
    });
  }

  performUpgrade(upgrade: UpgradeWithCost) {
    const amount = stateManager.state.currency.cubePoints;
    if (amount >= upgrade.cost) {
      upgrade.action();
      stateManager.state.currency.cubePoints -= upgrade.cost;
      stateManager.state.upgrades.current.push(upgrade.name);
      refreshUpgradeChoices();
    }
  }

  canAfford(upgrade: UpgradeWithCost) {
    return stateManager.state.currency.cubePoints >= upgrade.cost;
  }
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
}
</style>
