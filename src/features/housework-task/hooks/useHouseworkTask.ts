import { useCallback, useState } from 'react'
import {
  fetchTodayHouseworkTasks,
  updateHouseworkTaskStatus,
} from '@/features/housework-task/api/houseworkTaskApi'
import type { HouseworkTask } from '@/features/housework-task/types/houseworkTask'

export const useHouseworkTask = () => {
  const [tasks, setTasks] = useState<HouseworkTask[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // API状態（読み込み/失敗）を明示することで、ユーザーに適切なフィードバックを出しやすくします。
  const loadTodayTasks = useCallback(async () => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const fetchedTasks = await fetchTodayHouseworkTasks()
      setTasks(fetchedTasks)
    } catch {
      setErrorMessage('家事タスクの取得に失敗しました。再試行してください。')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 変更対象だけを置換する更新方法は、余計な再生成を減らせるため大規模化しても扱いやすいです。
  const toggleTaskStatus = useCallback(async (taskId: string, nextDoneState: boolean) => {
    const updatedTask = await updateHouseworkTaskStatus(taskId, nextDoneState)

    setTasks((currentTasks) =>
      currentTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    )
  }, [])

  return {
    tasks,
    isLoading,
    errorMessage,
    loadTodayTasks,
    toggleTaskStatus,
  }
}
