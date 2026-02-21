import { useCallback, useState } from 'react'
import {
  fetchChecklistItems,
  fetchDestinations,
} from '@/features/pre-travel/api/preTravelApi'
import type {
  PreTravelChecklistItem,
  PreTravelDestination,
} from '@/features/pre-travel/types/preTravel'

export const usePreTravel = () => {
  const [checklistItems, setChecklistItems] = useState<PreTravelChecklistItem[]>([])
  const [destinations, setDestinations] = useState<PreTravelDestination[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // 複数データを同時取得しても、hook内に閉じ込めることで利用側は呼び出し1回で済みます。
  const loadPreTravelData = useCallback(async () => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const [fetchedChecklistItems, fetchedDestinations] = await Promise.all([
        fetchChecklistItems(),
        fetchDestinations(),
      ])

      setChecklistItems(fetchedChecklistItems)
      setDestinations(fetchedDestinations)
    } catch {
      setErrorMessage('旅行データの取得に失敗しました。再試行してください。')
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    checklistItems,
    destinations,
    isLoading,
    errorMessage,
    loadPreTravelData,
  }
}
