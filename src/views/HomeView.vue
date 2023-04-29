<template>
  <div>
    <MainUI />
    <Viewport />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Viewport from "@/components/Viewport.vue";
import MainUI from "@/components/MainUI.vue";

@Options({
  components: {
    Viewport,
    MainUI,
  },
})
export default class HomeView extends Vue {}
</script>
