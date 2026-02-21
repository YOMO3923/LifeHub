export type CounterState = {
  value: number
}

export type CounterConfig = {
  step: number
}

export const COUNTER_DEFAULT_CONFIG: CounterConfig = {
  step: 1,
}
