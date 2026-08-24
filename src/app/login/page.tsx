"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result || result.error) {
        setError("Email atau password salah.");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);
      setError("Terjadi kesalahan saat login.");
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f3ee] px-6 py-12">
      <div className="w-full max-w-md">
        {/* BRAND */}
        <div className="mb-10 text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[#b9944f]">
            Duta Karya Membrane
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-[#171717]">
            Admin Login
          </h1>

          <p className="mt-3 text-sm text-[#666]">
            Masuk ke dashboard untuk mengelola project.
          </p>
        </div>

        {/* LOGIN CARD */}
        <div className="rounded-3xl bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* EMAIL */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-[#171717]"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@example.com"
                autoComplete="email"
                required
                className="w-full rounded-xl border border-[#dedbd4] bg-[#faf9f6] px-4 py-3 text-sm text-[#171717] outline-none transition placeholder:text-[#999] focus:border-[#b9944f] focus:ring-2 focus:ring-[#b9944f]/20"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-[#171717]"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Masukkan password"
                autoComplete="current-password"
                required
                className="w-full rounded-xl border border-[#dedbd4] bg-[#faf9f6] px-4 py-3 text-sm text-[#171717] outline-none transition placeholder:text-[#999] focus:border-[#b9944f] focus:ring-2 focus:ring-[#b9944f]/20"
              />
            </div>

            {/* ERROR */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#171717] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#b9944f] hover:text-[#171717] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Memproses..." : "Masuk ke Dashboard"}
            </button>
          </form>
        </div>

        {/* BACK */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-sm text-[#666] transition hover:text-[#b9944f]"
          >
            ← Kembali ke website
          </a>
        </div>
      </div>
    </main>
  );
}