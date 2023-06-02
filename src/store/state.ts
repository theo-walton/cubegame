import { Ref, ref } from "vue";
import { Quaternion } from "three";

interface Primitives {
  red: number;
  blue: number;
  green: number;
  yellow: number;
  white: number;
  black: number;
}

interface Currency {
  red: number;
  blue: number;
  green: number;
  yellow: number;
  white: number;
  black: number;
}

interface CubeProperties {
  spinSpeed: number;
  staticDrag: number;
  dynamicDrag: number;
}

interface Combo {
  totalCombo: number;
}

interface SpeedBonus {
  multiplier: number;
}

interface Upgrades {
  choices: number[];
  clickPower: number;
  combo?: Combo;
  speedBonus?: SpeedBonus;
}

export interface State {
  currency: Currency;
  cubeProperties: CubeProperties;
  upgrades: Upgrades;
}

function defaultState(): State {
  return {
    currency: {
      red: 0,
      blue: 0,
      green: 0,
      yellow: 0,
      white: 0,
      black: 0,
    },
    cubeProperties: {
      spinSpeed: 0,
      staticDrag: 0.0004,
      dynamicDrag: 0.01,
    },
    upgrades: {
      choices: [0],
      clickPower: 0.05,
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
