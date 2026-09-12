// نسخة تحقق تقني مؤقتة فقط (Smoke Test) — تتأكد أن الاتصال بـSupabase وسياسات RLS تعملان.
// **ليست تصميم واجهة فعلي** — الشاشة الحقيقية تُبنى لاحقًا بعد جلسة تصميم منفصلة (4 نماذج
// Mockup) حسب معايير محمد الثابتة. تُستبدَل هذه الدالة بالكامل عند بدء تلك المرحلة.
//
// Temporary technical smoke test only — confirms the Supabase connection and RLS policies work.
// **Not a real UI design** — the actual screen is built later after a separate design session.
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabaseClient'

function App() {
  const [count, setCount] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    supabase
      .from('currencies')
      .select('*', { count: 'exact', head: true })
      .then(({ count, error }) => {
        if (error) setError(error.message)
        else setCount(count)
      })
  }, [])

  return (
    <div dir="rtl" style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>زاد — فحص الاتصال بـ Supabase</h1>
      {error && <p style={{ color: 'red' }}>خطأ: {error}</p>}
      {count !== null && <p>عدد العملات المسجَّلة: {count}</p>}
      {count === null && !error && <p>جارٍ التحقق...</p>}
    </div>
  )
}

export default App
