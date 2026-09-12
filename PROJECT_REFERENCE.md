# مرجع تنفيذ "زاد" — منفصل عن زاد.md

`زاد.md` يبقى وثيقة المواصفات الثابتة (النسخة النهائية النظيفة للقرارات المعتمدة). هذا الملف
يوثّق قرارات **التنفيذ الفعلي** بعد بدء البناء — يُحدَّث مع كل مرحلة جديدة، ولا يُعاد كتابة
زاد.md نفسه.

## المرحلة 1 — التأسيس (Bootstrap) — 12 سبتمبر 2026

### النطاق
هيكل المشروع (React + Vite + Tailwind v4) + قاعدة بيانات أساسية (5 جداول مرجعية بلا منطق
معاملات): `profiles`, `countries`, `currencies`, `financial_accounts`, `categories` + RLS.

**لم يُنفَّذ بعد (مؤجَّل عمدًا لمراحل لاحقة منفصلة)**: `transactions`, `transaction_entries`,
`cash_lots`, `cash_lot_consumptions`, `reconciliations`, `exchange_rates`, `installment_plans`,
`card_payment_plans`, `trips`, `trip_budgets`, `audit_log`, `backups`, `app_settings`,
`credit_card_details`. **لا تصميم واجهة فعلي** — أي شاشة حقيقية تتطلب أولًا جلسة تصميم بـ4
نماذج Mockup مختلفة حسب معايير محمد الثابتة (CLAUDE.md البند 13.6)، لم تُنفَّذ بعد.

### القرارات المؤكَّدة
- **مستودع GitHub**: [`malsllami/ZAD`](https://github.com/malsllami/ZAD) — **عام (Public)**.
  مقبول أمنيًا لأن لا بيانات مالية حقيقية أو مفاتيح تدخل الكود نفسه (البيانات في Supabase،
  المفاتيح في `.env` مُستثنى من Git).
- **`schema/*.sql` محلي فقط** — مُستثنى من Git عبر `.gitignore` (`/schema/`, `/supabase/`)، نفس
  سياسة alsallami-family الحرفية. الملفات موجودة على القرص لكنها لا تُرفع لـ GitHub أبدًا.
- **النشر**: عبر `wrangler` CLI يدويًا (`npm run build` + `wrangler pages deploy dist
  --project-name=zad`) — أمر صريح منفصل عن `git push`، يشغّله Claude عند الطلب فقط، وليس نشرًا
  تلقائيًا. قاعدة ثابتة الآن لكل مشاريع محمد المستقبلية (انظر ملف الذاكرة
  `deploy-separate-explicit-step`).
- **مشروع Supabase**: جديد كليًا (`ZAD`)، منفصل تمامًا عن alsallami-family (لا مشاركة حساب/مفاتيح).
  Project URL: `https://fooxocmjdjxupogrwczi.supabase.co` (بلا أي مفتاح بهذا الملف — المفاتيح في
  `.env` المحلي فقط، غير مرفوع لـ Git). الجداول الخمسة + RLS + Seed العملات نُفِّذت فعليًا عبر
  SQL Editor بلوحة التحكم (12 سبتمبر 2026)، وتحقّق `npm run dev` محليًا يستجيب بلا أخطاء.
- **حزم الإصدارات الفعلية وقت الإنشاء**: React 19.2.8، Vite 8.3.0، `@tailwindcss/vite` 4.3.0،
  `@supabase/supabase-js` 2.58.0، `react-router-dom` 7.15.1.

### نقطة غير موثَّقة بمواصفات زاد.md (قرار تنفيذي مستقل)
جدول `countries` مذكور فقط باسمه ضمن قائمة الـ24 جدولًا بزاد.md، بلا حقول أو استخدام موصوف.
أُنشئ بحقول احتياطية بسيطة (`id, iso_code, name_ar, name_en, is_active`) قياسًا على نمط
`currencies`، **بلا أي بيانات ابتدائية (Seed)** — تُضاف وظيفته الفعلية وربطه بجداول أخرى
(مثل `financial_accounts` أو `profiles`) عند اتضاح الحاجة الفعلية لاحقًا.

### بنية الملفات
```
src/
  main.jsx          → Router.jsx
  Router.jsx         → مسار واحد فقط ("/") حاليًا
  App.jsx            → نسخة تحقق تقني مؤقتة (Smoke Test)، تُستبدَل عند بدء التصميم الفعلي
  index.css          → استيراد Tailwind + حد أدنى فقط، بلا هوية بصرية بعد
  lib/supabaseClient.js → عميل Supabase المركزي (anon key فقط، لا service_role)
schema/*.sql          → محلي فقط (غير مرفوع لـ Git)، مُرقَّم بأسماء عربية
```

### للمرحلة القادمة
1. جلسة تصميم واجهة (4 نماذج Mockup) قبل أي شاشة فعلية.
2. تسجيل مستخدم تجريبي واحد عبر Supabase Auth للتحقق الكامل من RLS (الفحص الحالي يعتمد
   `to authenticated`، فبلا تسجيل دخول يظهر 0/خطأ صلاحيات — سلوك صحيح متوقَّع، وليس عطلًا).
3. لاحقًا (ليس عاجلًا): `.github/workflows/keep-supabase-alive.yml` مشابه لـ alsallami-family
   لمنع توقف مشروع Supabase المجاني بعد 7 أيام خمول — فقط إن مر وقت طويل بلا استخدام حقيقي.
