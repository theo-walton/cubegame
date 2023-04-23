<template>
  <Viewport />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Viewport from "@/components/Viewport.vue"; // @ is an alias to /src

@Options({
  components: {
    Viewport,
  },
})
export default class HomeView extends Vue {}
</script>
