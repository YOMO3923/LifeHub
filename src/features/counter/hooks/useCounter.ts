import { useCallback, useState } from 'react'
import { COUNTER_DEFAULT_CONFIG } from '@/features/counter/types/counter'

export const useCounter = () => {
  const [value, setValue] = useState(0)

  const increment = useCallback(() => {
    setValue((currentValue) => currentValue + COUNTER_DEFAULT_CONFIG.step)
  }, [])

  return {
    value,
    increment,
  }
}
