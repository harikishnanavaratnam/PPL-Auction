'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, LogIn } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { authAPI } from '@/lib/api';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await authAPI.login(password);
      if (response.success && response.token) {
        localStorage.setItem('authToken', response.token);
        router.push('/admin');
      } else {
        setError('Invalid password');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Enhanced Animated Background - Multiple Layers */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        {/* Pulsing radial pattern background */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(circle at 30% 40%, rgba(92, 46, 42, 0.25) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(139, 70, 64, 0.2) 0%, transparent 50%)',
          animation: 'pulse-glow 4s ease-in-out infinite',
        }} />
        
        {/* Shimmer sweep - visible horizontal sweep */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full animate-shimmer-sweep" style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(245, 222, 179, 0.4) 45%, rgba(92, 46, 42, 0.3) 50%, rgba(245, 222, 179, 0.4) 55%, transparent 100%)',
            width: '40%',
            height: '100%',
          }} />
        </div>
        
        {/* Floating orbs - larger and more visible */}
        <div className="absolute inset-0">
          <div className="absolute top-32 left-32 w-[500px] h-[500px] bg-primary/25 rounded-full blur-3xl animate-wave" style={{ animationDelay: '0s' }} />
          <div className="absolute bottom-32 right-32 w-[600px] h-[600px] bg-accent/20 rounded-full blur-3xl animate-wave" style={{ animationDelay: '2.5s' }} />
          <div className="absolute top-1/2 left-1/4 w-[450px] h-[450px] bg-[#f5deb3]/20 rounded-full blur-3xl animate-wave" style={{ animationDelay: '5s' }} />
        </div>
      </div>
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md animate-slideUp">
          <div className="rounded-lg bg-card border border-border shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Admin Login</h1>
              <p className="text-sm text-muted-foreground">Enter password to access auction controls</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-primary/30 bg-input text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none transition-colors"
                  placeholder="Enter admin password"
                  required
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
                  <p className="text-sm text-destructive text-center">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !password}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    Login
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-border">
              <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors text-center block">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
