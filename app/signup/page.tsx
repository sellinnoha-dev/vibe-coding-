import { AuthForm } from '@/components/AuthForm'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

export const metadata = {
  title: 'Sign Up - Vibe Pro',
  description: 'Create a new Vibe Pro account',
}

export default function SignupPage() {
  return (
    <>
      <Navigation />
      <section className="min-h-screen bg-gradient-to-br from-primary to-slate-800 pt-32 px-6 flex items-center">
        <div className="max-w-md mx-auto w-full">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            Create Account
          </h1>
          <AuthForm type="signup" />
        </div>
      </section>
      <Footer />
    </>
  )
}
