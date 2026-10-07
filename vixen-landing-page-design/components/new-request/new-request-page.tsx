'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { FadeUp } from '@/components/fade-up'
import { NewRequestForm } from '@/components/new-request/new-request-form'
import { PreChecks } from '@/components/new-request/pre-checks'
import { GeminiAdvisor } from '@/components/new-request/gemini-advisor'
import { SuccessView } from '@/components/new-request/success-view'
import { useToast } from '@/components/toast'
import { INITIAL_FORM, NEXT_REQUEST_ID, computeChecks, type FormState } from '@/lib/new-request'
import { parts, type Skill } from '@/lib/mock-data'
import { createJobOfferFromRequest } from '@/lib/technician-job-storage'

export function NewRequestPage() {
  const router = useRouter()
  const toast = useToast()
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [submitted, setSubmitted] = useState(false)
  const checks = useMemo(() => computeChecks(form), [form])

  const handleApplySkills = (newSkills: Skill[]) => {
    setForm((current) => ({
      ...current,
      skillsTouched: true,
      skills: Array.from(new Set([...current.skills, ...newSkills])),
    }))
  }

  const handleApplyPart = (partName: string) => {
    const matched = parts.find(
      (p) => p.name.toLowerCase().includes(partName.toLowerCase()) || partName.toLowerCase().includes(p.name.toLowerCase()),
    )
    if (matched) {
      setForm((current) => {
        const exists = current.parts.some((p) => p.partId === matched.id)
        if (exists) return current
        return {
          ...current,
          parts: [...current.parts, { key: `part-${Date.now()}`, partId: matched.id, qty: 1 }],
        }
      })
      toast(`Added ${matched.name} to requested parts`)
    } else {
      toast(`Part "${partName}" suggested by AI`)
    }
  }

  if (submitted) {
    return (
      <SuccessView
        requestId={NEXT_REQUEST_ID}
        onView={() => router.push('/user/dashboard')}
        onCreateAnother={() => {
          setForm(INITIAL_FORM)
          setSubmitted(false)
        }}
      />
    )
  }

  return (
    <div className="flex flex-col gap-10">
      <FadeUp>
        <header>
          <h2 className="font-serif text-[30px] leading-tight">New service request</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Tell us what&apos;s wrong and we&apos;ll find the right technician.
          </p>
          <Link
            href="/user/dashboard"
            className="group mt-4 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            <ArrowLeft
              aria-hidden
              strokeWidth={1.5}
              className="size-3.5 transition-transform duration-200 ease-out group-hover:-translate-x-[3px]"
            />
            Back to overview
          </Link>
        </header>
      </FadeUp>

      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,60fr)_minmax(0,40fr)] lg:gap-10">
        <NewRequestForm
          form={form}
          onChange={(updater) => setForm(updater)}
          onSubmit={() => {
            const { offer } = createJobOfferFromRequest(form, NEXT_REQUEST_ID)
            setSubmitted(true)
            toast(`Request created! Dispatched with ${offer.respondWithinMinutes}-minute acceptance timer.`)
            window.scrollTo({ top: 0 })
          }}
          onSaveDraft={() => toast('Draft saved')}
        />

        <div className="flex flex-col gap-6 lg:sticky lg:top-8">
          <FadeUp delay={0.08}>
            <GeminiAdvisor
              form={form}
              onApplySkills={handleApplySkills}
              onApplyPart={handleApplyPart}
            />
          </FadeUp>

          <FadeUp delay={0.14}>
            <PreChecks checks={checks} />
          </FadeUp>
        </div>
      </div>
    </div>
  )
}
