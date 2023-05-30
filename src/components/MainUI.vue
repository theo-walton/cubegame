<template>
  <v-card
    flat
    class="rounded-0"
    height="500px"
    width="200px"
    color="#aaaaaa"
    id="main"
  >
    <v-card-title> Resources </v-card-title>
    <v-row v-for="(amount, resource) in resources">
      <v-col> {{ resource }}: </v-col>
      <v-col>
        {{ amount }}
      </v-col>
    </v-row>
    <v-row>
      <v-col> Spin Speed </v-col>
      <v-col>
        {{ speed.toFixed(3) }}
      </v-col>
    </v-row>
    <v-text-field v-model="staticDrag" />
    <v-text-field v-model="dynamicDrag" />
  </v-card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import stateManager from "@/store/state";

@Options({})
export default class MainUI extends Vue {
  get resources() {
    console.log("resources getter called");
    return stateManager.state.currency;
  }

  get speed() {
    return stateManager.state.cubeProperties.spinSpeed;
  }

  get staticDrag(): number {
    return stateManager.state.cubeProperties.staticDrag;
  }

  set staticDrag(value: number) {
    stateManager.state.cubeProperties.staticDrag = value;
  }

  get dynamicDrag(): number {
    return stateManager.state.cubeProperties.dynamicDrag;
  }

  set dynamicDrag(value: number) {
    stateManager.state.cubeProperties.dynamicDrag = value;
  }
}
</script>
