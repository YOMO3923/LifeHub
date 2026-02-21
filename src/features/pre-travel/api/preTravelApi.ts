import type {
  PreTravelChecklistItem,
  PreTravelDestination,
} from '@/features/pre-travel/types/preTravel'

// 将来API接続する前提の仮関数です。まずは戻り値型を固定して、UI開発を先に進めます。
export const fetchChecklistItems = async (): Promise<PreTravelChecklistItem[]> => {
  return []
}

export const fetchDestinations = async (): Promise<PreTravelDestination[]> => {
  return []
}
