import type {
  CookingMealPlan,
  CookingRecipe,
  CookingShoppingItem,
} from '@/features/cooking-support/types/cookingSupport'

// 本番ではAPIクライアントへ置き換える想定のダミー実装です。
export const fetchMealPlans = async (): Promise<CookingMealPlan[]> => {
  return []
}

export const fetchShoppingItems = async (): Promise<CookingShoppingItem[]> => {
  return []
}

export const fetchRecipes = async (): Promise<CookingRecipe[]> => {
  return []
}
