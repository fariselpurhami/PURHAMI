'use client'

import { useFormState } from 'react-dom';
import { loginAction } from '../actions/auth';

const initialState = { error: null as string | null };

export default function LoginPage() {
  const [state, formAction] = useFormState(loginAction, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4">
      <div className="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">PURHAMI</h1>
          <p className="mt-2 text-sm text-zinc-400">Welcome back to the flagship storefront</p>
        </div>

        {/* عرض رسالة الخطأ إذا كانت موجودة */}
        {state?.error && (
          <div className="mb-6 rounded-md bg-red-500/10 p-4 border border-red-500/50">
            <p className="text-sm font-medium text-red-500 text-center">{state.error}</p>
          </div>
        )}

        <form action={formAction} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-300">Email Address</label>
            <input
              type="email"
              name="email"
              required
              className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-950 px-4 py-2 text-white placeholder-zinc-500 focus:border-white focus:outline-none focus:ring-1 focus:ring-white transition-colors"
              placeholder="admin@purhami.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300">Password</label>
            <input
              type="password"
              name="password"
              required
              className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-950 px-4 py-2 text-white placeholder-zinc-500 focus:border-white focus:outline-none focus:ring-1 focus:ring-white transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-white hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 transition-colors"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
