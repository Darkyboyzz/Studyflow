import { Pricing } from '@/components/landing/pricing'

export default function DashboardPricingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pricing</h1>
        <p className="text-muted-foreground">Choose the plan that fits your needs</p>
      </div>
      <div className="-mx-4 sm:-mx-6 lg:-mx-8">
        <Pricing />
      </div>
    </div>
  )
}
