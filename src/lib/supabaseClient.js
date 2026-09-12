// عميل Supabase المركزي — مصدر واحد للحقيقة لإعدادات الاتصال، بلا تكرار بأي ملف آخر.
// Central Supabase client — single source of truth for connection config.
//
// يستخدم مفتاح anon/public فقط (لا service_role إطلاقًا بالواجهة الأمامية) — الحماية الفعلية
// تأتي من سياسات Row Level Security على كل جدول، وليس من إخفاء المفتاح نفسه.
// Uses the anon/public key only (never the service_role key on the frontend) — real protection
// comes from Row Level Security policies on each table, not from hiding this key.
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // تنبيه مبكر واضح بدل فشل صامت لاحقًا عند أول استدعاء فعلي
  // Fail loudly and early instead of a silent failure on first real call
  console.error('VITE_SUPABASE_URL أو VITE_SUPABASE_ANON_KEY غير مُعرَّفين — تحقق من ملف .env')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
})
