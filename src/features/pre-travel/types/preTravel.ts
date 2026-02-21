// 持ち物チェック。isPacked を持つことで、チェックリストUIとの対応が直感的になります。
export type PreTravelChecklistItem = {
  id: string
  isPacked: boolean
  name: string
}

// 行きたい/行った場所。ステータスを分けて1つの配列で扱えるようにします。
export type PreTravelDestination = {
  id: string
  name: string
  status: 'visited' | 'wishlist'
}
