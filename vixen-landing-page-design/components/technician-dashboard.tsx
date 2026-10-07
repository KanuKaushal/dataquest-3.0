'use client'

import { useEffect, useState } from 'react'
import { FadeUp } from '@/components/fade-up'
import { JobRow } from '@/components/job-row'
import { StatRow } from '@/components/stat-row'
import { useToast } from '@/components/toast'
import { initialJobs, type Job } from '@/lib/mock-data'

export function TechnicianDashboard() {
  const toast = useToast()
  const [jobs, setJobs] = useState<Job[]>(initialJobs)
  const [completing, setCompleting] = useState<string[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem('vixen_technician_jobs_v2')
      if (stored) {
        const parsed: Job[] = JSON.parse(stored)
        if (parsed.length > 0) {
          // Merge avoiding duplicates
          const ids = new Set(parsed.map((j) => j.id))
          setJobs([...parsed, ...initialJobs.filter((j) => !ids.has(j.id))])
        }
      }
    } catch {}
  }, [])

  const count = (predicate: (job: Job) => boolean) => jobs.filter(predicate).length
  const ordered = [
    ...jobs.filter((job) => job.status !== 'done'),
    ...jobs.filter((job) => job.status === 'done'),
  ]

  function startJob(id: string) {
    setJobs((current) =>
      current.map((job) => (job.id === id ? { ...job, status: 'in_progress' } : job)),
    )
    toast('Job started')
  }

  function completeJob(id: string) {
    setCompleting((current) => [...current, id])
    setTimeout(() => {
      setJobs((current) =>
        current.map((job) =>
          job.id === id ? { ...job, status: 'done', completedAt: 'just now' } : job,
        ),
      )
      setCompleting((current) => current.filter((item) => item !== id))
      toast('Job marked complete')
    }, 800)
  }

  return (
    <>
      <FadeUp>
        <StatRow
          stats={[
            { label: 'Assigned', value: jobs.length },
            { label: 'In progress', value: count((job) => job.status === 'in_progress') },
            { label: 'Done today', value: count((job) => job.status === 'done') },
            { label: 'Pending', value: count((job) => job.status === 'pending') },
          ]}
        />
      </FadeUp>

      <section aria-labelledby="todays-jobs">
        <FadeUp delay={0.06}>
          <h2 id="todays-jobs" className="mb-4 text-sm font-medium">
            Today&apos;s jobs
          </h2>
        </FadeUp>
        <ul className="border-t">
          {ordered.map((job, index) => (
            <JobRow
              key={job.id}
              job={job}
              index={index + 2}
              completing={completing.includes(job.id)}
              onStart={() => startJob(job.id)}
              onComplete={() => completeJob(job.id)}
            />
          ))}
        </ul>
      </section>
    </>
  )
}
