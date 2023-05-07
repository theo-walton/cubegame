import { Ref, ref } from "vue";

interface Primitives {
  red: number;
  blue: number;
  green: number;
  yellow: number;
  white: number;
  black: number;
}

interface State {
  primitives: Primitives;
}

function defaultState(): State {
  return {
    primitives: {
      red: 0,
      blue: 0,
      green: 0,
      yellow: 0,
      white: 0,
      black: 0,
    },
  };
}

export class StateManager {
  private _state: Ref<State> = ref(defaultState());

  get state(): State {
    return this._state.value;
  }
}

const state = new StateManager();
export default state;
