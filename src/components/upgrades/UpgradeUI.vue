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
        {{ `cost: ${item.cost} ${item.currency}` }}
      </v-list-item>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Upgrade } from "@/components/upgrades/upgrade_types";
import stateManager from "@/store/state";
import {
  getUpgradeChoices,
  refreshUpgradeChoices,
} from "@/components/upgrades/possible_upgrades";

@Options({})
export default class MainUI extends Vue {
  get upgradeDisplay(): Upgrade[] {
    return getUpgradeChoices().map((choice) => {
      return {
        ...choice,
        cost: 1,
        currency: "red",
      };
    });
  }

  performUpgrade(upgrade: Upgrade) {
    const amount = stateManager.state.currency[upgrade.currency];
    if (amount >= upgrade.cost) {
      upgrade.action();
      stateManager.state.currency[upgrade.currency] -= upgrade.cost;
      refreshUpgradeChoices();
    }
  }

  canAfford(upgrade: Upgrade) {
    return stateManager.state.currency[upgrade.currency] >= upgrade.cost;
  }
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
}
</style>
