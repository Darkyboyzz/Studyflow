import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { PublicPlanView } from './public-plan-view'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  if (!supabase) {
    return { title: 'StudyFlow' }
  }

  const { data: plan } = await supabase
    .from('study_plans')
    .select('title')
    .eq('share_slug', slug)
    .eq('is_public', true)
    .single()

  if (!plan) {
    return { title: 'Plan Not Found - StudyFlow' }
  }

  return {
    title: `${plan.title} - StudyFlow`,
    description: `Check out this study plan on StudyFlow: ${plan.title}`,
  }
}

export default async function PublicPlanPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  if (!supabase) {
    notFound()
  }

  const { data: plan } = await supabase
    .from('study_plans')
    .select('*')
    .eq('share_slug', slug)
    .eq('is_public', true)
    .single()

  if (!plan) {
    notFound()
  }

  const { data: items } = await supabase
    .from('study_plan_items')
    .select('*')
    .eq('plan_id', plan.id)
    .order('scheduled_date', { ascending: true })

  return <PublicPlanView plan={plan} items={items || []} />
}
