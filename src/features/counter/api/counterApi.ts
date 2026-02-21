import type { CounterState } from '@/features/counter/types/counter'

// 実運用では API クライアントへ置き換えます
export const fetchInitialCounter = async (): Promise<CounterState> => {
  return {
    value: 0,
  }
}
