import type { HouseworkTask } from '@/features/housework-task/types/houseworkTask'

// 仮実装API。関数名と戻り値型を先に決めることで、後続の本API接続時に置き換えが容易になります。
export const fetchTodayHouseworkTasks = async (): Promise<HouseworkTask[]> => {
  return []
}

export const updateHouseworkTaskStatus = async (
  taskId: string,
  isDone: boolean
): Promise<HouseworkTask> => {
  return {
    id: taskId,
    title: '未設定タスク',
    scheduledDate: new Date().toISOString().slice(0, 10),
    isDone,
  }
}
