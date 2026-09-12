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

## المرحلة 2 — إكمال قاعدة البيانات (19 جدولًا + 6 Views) — 12 سبتمبر 2026

### النطاق
كل الجداول المتبقية من الـ24: `credit_card_details`, `monthly_periods`, `monthly_budgets`,
`trips`, `trip_budgets`, `trip_funds`, `trip_fund_entries`, `transactions`, `transaction_entries`,
`cash_lots`, `cash_lot_consumptions`, `reconciliations`, `reconciliation_items`,
`installment_plans`, `installment_payments`, `card_payment_plans`,
`card_payment_plan_installments`, `exchange_rates`, `audit_log`, `backups`, `app_settings` — ملفات
`schema/07` إلى `schema/16` (محلية فقط، بنفس سياسة `schema/00-06`). RLS كاملة + 6 Views محسوبة
(`v_account_balances`, `v_cash_balances`, `v_monthly_summary`, `v_trip_summary`,
`v_reconciliation_status`, `v_trip_fund_balances`).

**تصحيح معماري مهم أثناء هذه المرحلة (صندوق تمويل الرحلة)**: التصميم الأول افترض أن الصندوق
View مُشتق من `transactions.trip_id` — محمد صحّح هذا صراحة: الصندوق **جدول حقيقي مستقل**
(`trip_funds`, صف واحد لكل مستخدم يُعاد استخدامه عبر كل الرحلات) + دفتر حسابي مستقل
(`trip_fund_entries`, لا يمر عبر `transaction_entries`/`financial_accounts`). كل حركة تُربَط
بـ`trip_id` (معرّف فريد لصف `trips`، وليس اسمًا نصيًا — يمنع أي تداخل بين رحلتين لنفس الوجهة
بتواريخ مختلفة). **قاعدة عمل مهمة (تطبيق لاحقًا، ليست قيد DB)**: الفائض الأجنبي يبقى بالصندوق
ويُعاد استخدامه، **لكن فقط بقرار المستخدم الصريح عند كل تمويل جديد** (لا نقل تلقائي)؛ فائض
الريال السعودي يُعتبر صفرًا دائمًا (لا يبقى بالصندوق).

### فجوات توثيقية حقيقية بمواصفات زاد.md — قرارات/اجتهادات موثَّقة صراحة داخل كل ملف SQL
لا Enum موثَّق حرفيًا لعدة حقول `status` (credit_card_details, cash_lots, installment_payments,
card_payment_plan_installments, transactions)؛ `transaction_entries.entry_type` وقيمه
(outflow/inflow/fee) تصميم كامل غير موثَّق؛ الـ6 Views بالكامل تصميم مستقل (المواصفات لم تحدد
SQL)؛ منع DELETE على كل تاريخ مالي فعلي قرار يتجاوز النص الحرفي (الذي يمنع الحذف صراحة فقط لـ
`monthly_periods`/`trips`). **القائمة الكاملة بكل نقطة اجتهاد وتبريرها موجودة في تعليقات كل ملف
SQL نفسه** (`schema/07` إلى `schema/16`) — لم تُلخَّص هنا لتجنّب التكرار.

### قاعدة ملزمة لمرحلة الواجهة/التصدير القادمة (مؤكَّدة من محمد، تُذكَّر بها هنا حتى لا تُنسى)
لا تُعرض أي IDs/معرّفات تقنية للمستخدم إطلاقًا — لا بالموقع ولا بملفات تصدير Excel المستقبلية.
كل ما يظهر للمستخدم أسماء عربية فقط، بلا شرطات، مسافة واحدة بين الكلمات. هذا لا يغيّر أسماء
أعمدة/جداول قاعدة البيانات الداخلية (تبقى إنجليزية `snake_case` حسب نص مواصفات زاد.md الصريح)
— يخص فقط طبقة العرض (واجهة المستخدم وملفات التصدير).

### خطوة يدوية مطلوبة من محمد (لم تُنفَّذ بعد وقت كتابة هذا القسم)
تشغيل ملفات `schema/07` إلى `schema/16` بالترتيب عبر SQL Editor بلوحة Supabase (نفس أسلوب
الملفات 00-06 — Claude لا يتصل مباشرة بقاعدة البيانات عمدًا، أمنيًا).

## للمرحلة القادمة
1. تشغيل محمد لملفات `schema/07-16` والتأكد من نجاحها بلا أخطاء.
2. جلسة تصميم واجهة (4 نماذج Mockup) قبل أي شاشة فعلية.
3. تسجيل مستخدم تجريبي واحد عبر Supabase Auth للتحقق الكامل من RLS (الفحص الحالي يعتمد
   `to authenticated`، فبلا تسجيل دخول يظهر 0/خطأ صلاحيات — سلوك صحيح متوقَّع، وليس عطلًا).
4. لاحقًا (ليس عاجلًا): `.github/workflows/keep-supabase-alive.yml` مشابه لـ alsallami-family
   لمنع توقف مشروع Supabase المجاني بعد 7 أيام خمول — فقط إن مر وقت طويل بلا استخدام حقيقي.
