<template>
  <div>
    <UpgradeUI />
    <MainUI />
    <Viewport />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Viewport from "@/components/Viewport.vue";
import MainUI from "@/components/MainUI.vue";
import UpgradeUI from "@/components/upgrades/UpgradeUI.vue";

@Options({
  components: {
    Viewport,
    MainUI,
    UpgradeUI,
  },
})
export default class HomeView extends Vue {}
</script>
