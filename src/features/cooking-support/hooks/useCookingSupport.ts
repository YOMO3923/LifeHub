import { useCallback, useState } from 'react'
import {
  fetchMealPlans,
  fetchRecipes,
  fetchShoppingItems,
} from '@/features/cooking-support/api/cookingSupportApi'
import type {
  CookingMealPlan,
  CookingRecipe,
  CookingShoppingItem,
} from '@/features/cooking-support/types/cookingSupport'

export const useCookingSupport = () => {
  const [mealPlans, setMealPlans] = useState<CookingMealPlan[]>([])
  const [shoppingItems, setShoppingItems] = useState<CookingShoppingItem[]>([])
  const [recipes, setRecipes] = useState<CookingRecipe[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // 献立・買い物・レシピを1回でまとめて取得し、初期表示をシンプルに管理します。
  const loadCookingSupportData = useCallback(async () => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const [fetchedMealPlans, fetchedShoppingItems, fetchedRecipes] = await Promise.all([
        fetchMealPlans(),
        fetchShoppingItems(),
        fetchRecipes(),
      ])

      setMealPlans(fetchedMealPlans)
      setShoppingItems(fetchedShoppingItems)
      setRecipes(fetchedRecipes)
    } catch {
      setErrorMessage('料理サポートデータの取得に失敗しました。再試行してください。')
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    mealPlans,
    shoppingItems,
    recipes,
    isLoading,
    errorMessage,
    loadCookingSupportData,
  }
}
