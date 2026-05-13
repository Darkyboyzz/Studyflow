import { Header } from '@/components/landing/header'
import { Pricing } from '@/components/landing/pricing'
import { Footer } from '@/components/landing/footer'

export const metadata = {
  title: 'Pricing - StudyFlow',
  description: 'Simple, transparent pricing for StudyFlow. Start free, upgrade when you need more.',
}

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Pricing />
      </main>
      <Footer />
    </div>
  )
}
