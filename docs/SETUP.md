# Logística SaaS - Setup e Arquitetura

Este documento substitui as instruções extensas que estavam no README principal para evitar problemas de compatibilidade em plataformas que rejeitam diffs binários.

## Stack
- React + Vite + TypeScript + Tailwind
- TanStack Query
- Supabase (Auth/Postgres/Realtime/Storage)

## Estrutura principal
- `src/app` layout/router/providers
- `src/components` UI reutilizável
- `src/features` módulos de domínio
- `supabase/migrations` schema SQL
- `supabase/seed` carga inicial

## Executar localmente
1. Copie `.env.example` para `.env`
2. Preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
3. `npm install`
4. `npm run dev`

## Banco
- Migration: `supabase/migrations/20260318_initial_schema.sql`
- Seed: `supabase/seed/seed.sql`

## Observação
Se o ambiente bloquear instalação de dependências via npm (403), rode apenas validações de arquivo (`git diff --check`, encoding) e execute build em ambiente com acesso ao registry.
