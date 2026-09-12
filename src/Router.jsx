// التوجيه — حاليًا مسار واحد فقط (صفحة فحص الاتصال بـSupabase)، بلا صفحات فعلية بعد.
// Routing — currently a single placeholder route only, no real pages yet.
// تُضاف الصفحات الفعلية (الرئيسية، الأشهر، البطاقات، الرحلات، الرؤية) في مراحل لاحقة منفصلة،
// بعد جلسة تصميم الواجهة (4 نماذج Mockup) — وليس بهذه المرحلة التأسيسية.
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
      </Routes>
    </BrowserRouter>
  )
}
