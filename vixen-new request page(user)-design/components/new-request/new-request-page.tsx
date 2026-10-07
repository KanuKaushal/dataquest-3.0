'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { FadeUp } from '@/components/fade-up'
import { NewRequestForm } from '@/components/new-request/new-request-form'
import { PreChecks } from '@/components/new-request/pre-checks'
import { SuccessView } from '@/components/new-request/success-view'
import { useToast } from '@/components/toast'
import { INITIAL_FORM, NEXT_REQUEST_ID, computeChecks, type FormState } from '@/lib/new-request'

export function NewRequestPage() {
  const router = useRouter()
  const toast = useToast()
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [submitted, setSubmitted] = useState(false)
  const checks = useMemo(() => computeChecks(form), [form])

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

      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,62fr)_minmax(0,38fr)] lg:gap-12">
        <NewRequestForm
          form={form}
          onChange={(updater) => setForm(updater)}
          onSubmit={() => {
            setSubmitted(true)
            toast('Request created')
            window.scrollTo({ top: 0 })
          }}
          onSaveDraft={() => toast('Draft saved')}
        />
        <FadeUp delay={0.1} className="lg:sticky lg:top-8">
          <PreChecks checks={checks} />
        </FadeUp>
      </div>
    </div>
  )
}
