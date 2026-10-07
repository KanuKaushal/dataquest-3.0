'use client'

import { motion, useScroll } from 'framer-motion'
import { useRef } from 'react'

import { steps } from '@/lib/landing-content'
import { Reveal } from './reveal'

export function StepList() {
  const listRef = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ['start 75%', 'end 55%'],
  })

  return (
    <div className="relative pl-6 md:pl-8">
      <div aria-hidden="true" className="absolute inset-y-0 left-0 w-px bg-border">
        <motion.div
          data-progress
          className="h-full w-px origin-top bg-accent"
          style={{ scaleY: scrollYProgress }}
        />
      </div>
      <ol ref={listRef} className="border-t border-border">
        {steps.map((step, index) => (
          <li key={step.number}>
            <Reveal delay={index * 0.06}>
              <div className="row grid grid-cols-[40px_1fr] gap-x-4 gap-y-2 border-b border-border py-6 md:grid-cols-[48px_1fr_auto] md:items-baseline md:gap-x-6 md:px-3">
                <span className="font-mono text-sm text-muted-foreground">{step.number}</span>
                <div>
                  <h3 className="text-base font-semibold">{step.title}</h3>
                  <p className="mt-1 max-w-[560px] text-[15px] leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
                <span className="col-start-2 font-mono text-xs text-muted-foreground md:col-start-auto">
                  {step.tag}
                </span>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  )
}
