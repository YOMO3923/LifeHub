// 入力フォームの date 形式 (YYYY-MM-DD) に合わせて本日文字列を生成します。
// toISOString はUTCになるため、ローカル日付で生成します。
export const getTodayDateString = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}
