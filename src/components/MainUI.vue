<template>
  <v-card flat class="rounded-0" height="500px" width="200px" color="#aaaaaa" id="main">
    <v-card-title> Resources </v-card-title>
    <v-row v-for="(amount, resource) in resources">
      <v-col>
        {{ resource }}:
      </v-col>
      <v-col>
        {{ amount }}
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import stateManager from "@/store/state";

@Options({})
export default class MainUI extends Vue {
  get resources() {
    console.log("resources getter called");
    return stateManager.state.primitives;
  }
}
</script>
