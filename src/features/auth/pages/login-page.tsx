import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '@/features/auth/schemas/login.schema';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { Button } from '@/components/ui/button';

export function LoginPage() {
  const { loginMutation } = useAuth();
  const form = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 p-4">
      <form
        onSubmit={form.handleSubmit((values) => loginMutation.mutate(values))}
        className="w-full max-w-md space-y-4 rounded-xl bg-white p-6 shadow"
      >
        <h1 className="text-2xl font-bold">Logística Operacional</h1>
        <p className="text-sm text-slate-600">Acesse com seu usuário corporativo.</p>
        <div>
          <label className="text-sm font-medium">E-mail</label>
          <input className="mt-1 w-full rounded border p-2" {...form.register('email')} />
          <p className="text-xs text-rose-600">{form.formState.errors.email?.message}</p>
        </div>
        <div>
          <label className="text-sm font-medium">Senha</label>
          <input type="password" className="mt-1 w-full rounded border p-2" {...form.register('password')} />
          <p className="text-xs text-rose-600">{form.formState.errors.password?.message}</p>
        </div>
        {loginMutation.isError && <p className="text-sm text-rose-600">Falha ao autenticar.</p>}
        <Button type="submit" className="w-full" disabled={loginMutation.isPending}>Entrar</Button>
      </form>
    </main>
  );
}
