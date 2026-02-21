// 献立データ。mealDate を分けることで、日付軸の表示や並び替えがしやすくなります。
export type CookingMealPlan = {
  id: string
  mealDate: string
  menuName: string
}

// 買い物リスト。isChecked を持つことで、チェックボックスUIへそのまま接続できます。
export type CookingShoppingItem = {
  id: string
  isChecked: boolean
  name: string
}

// レシピURL。外部リンク先の保存を想定した最小構成です。
export type CookingRecipe = {
  id: string
  title: string
  url: string
}
