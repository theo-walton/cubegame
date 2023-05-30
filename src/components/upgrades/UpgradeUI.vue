<template>
  <v-card flat class="rounded-0" height="500px" width="200px" color="primary">
    <v-list lines="one">
      <v-list-item
        v-for="(item, name) in upgradeDisplay"
        :key="name"
        :title="name"
        @click="performUpgrade(item)"
        :disabled="!canAfford(item)"
        class="my-1"
        style="background-color: orange"
      >
        {{ `${item.cost} ${item.currency}` }}
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Upgrade, UpgradeDisplay } from "@/components/upgrades/upgrade_types";
import stateManager from "@/store/state";

@Options({})
export default class MainUI extends Vue {
  get upgradeDisplay(): UpgradeDisplay {
    return {
      "Unlock Combo": {
        action: () => {
          console.log("combo unlocked");
        },
        cost: 10,
        currency: "green",
      },
      "Unlock Wombo": {
        action: () => {
          console.log("combo unlocked");
        },
        cost: 10,
        currency: "red",
      },
      "Wunlock ombo": {
        action: () => {
          console.log("combo unlocked");
        },
        cost: 10,
        currency: "red",
      },
    };
  }

  performUpgrade(upgrade: Upgrade) {
    const amount = stateManager.state.currency[upgrade.currency];
    if (amount >= upgrade.cost) {
      upgrade.action();
      stateManager.state.currency[upgrade.currency] -= upgrade.cost;
    }
  }

  canAfford(upgrade: Upgrade) {
    return stateManager.state.currency[upgrade.currency] >= upgrade.cost;
  }
}
</script>
