import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Crown, Sparkles } from 'lucide-react'
import Link from 'next/link'

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for getting started',
    badge: null,
    features: [
      '3 subjects',
      '20 active tasks',
      '5 study plans',
      'Basic notes',
      'Shareable plans',
      'Dark mode',
    ],
    cta: 'Start Free',
    href: '/signup',
    variant: 'outline' as const,
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$4.99/mo',
    description: 'For serious students',
    badge: 'Coming Soon',
    features: [
      'Unlimited subjects',
      'Unlimited tasks',
      'Unlimited study plans',
      'Premium themes',
      'Priority support',
      'Export to PDF',
    ],
    cta: 'Coming Soon',
    href: '#',
    variant: 'default' as const,
    highlight: true,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="py-24 sm:py-32 relative">
      <div className="absolute inset-0 animated-gradient opacity-30" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, <span className="gradient-text">transparent</span> pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start free. Upgrade when you need more. No hidden fees.
          </p>
        </div>

        <div className="mx-auto grid max-w-lg grid-cols-1 gap-8 lg:max-w-4xl lg:grid-cols-2">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col ${
                plan.highlight
                  ? 'border-primary/50 shadow-lg shadow-primary/10'
                  : 'border-border/50'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-3 py-1 gap-1">
                    <Crown className="h-3 w-3" />
                    {plan.badge}
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                </div>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col flex-1">
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.variant}
                  className="w-full"
                  asChild={plan.href !== '#'}
                  disabled={plan.href === '#'}
                >
                  {plan.href !== '#' ? (
                    <Link href={plan.href}>
                      {plan.name === 'Free' && <Sparkles className="mr-2 h-4 w-4" />}
                      {plan.cta}
                    </Link>
                  ) : (
                    <span>
                      <Crown className="mr-2 h-4 w-4" />
                      {plan.cta}
                    </span>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
