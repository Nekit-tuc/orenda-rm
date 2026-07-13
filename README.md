# Investal Estate

Сайт-каталог нерухомості на Next.js, TypeScript, Tailwind CSS і Supabase.

## Локальний запуск

```bash
npm run dev
```

Відкрити: [http://localhost:3000](http://localhost:3000)

## Перевірка

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Основні змінні середовища

```env
ADMIN_PASSWORD=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SUPABASE_STORAGE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

`SUPABASE_SERVICE_ROLE_KEY` має використовуватись тільки на server-side.
