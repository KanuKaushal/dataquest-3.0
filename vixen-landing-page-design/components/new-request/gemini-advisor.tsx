'use client'

import { useState } from 'react'
import { Sparkles, Check, AlertCircle, Wrench, MapPin, UserCheck, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/toast'
import type { FormState } from '@/lib/new-request'
import type { Skill } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

interface GeminiAdvisorProps {
  form: FormState
  onApplySkills: (skills: Skill[]) => void
  onApplyPart?: (partName: string) => void
}

interface GeminiSuggestion {
  source?: string
  recommendedTechnician: {
    name: string
    matchScore: number
    site: string
    reason: string
    available: boolean
  }
  recommendedSite: {
    site: string
    reason: string
  }
  diagnosis: string
  recommendedSkills: Skill[]
  recommendedParts: string[]
  urgencyAdvice: string
}

export function GeminiAdvisor({ form, onApplySkills, onApplyPart }: GeminiAdvisorProps) {
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [suggestion, setSuggestion] = useState<GeminiSuggestion | null>(null)
  const [applied, setApplied] = useState(false)

  const canAnalyze = Boolean(form.machineId || form.title.trim() || form.description.trim())

  async function handleAnalyze() {
    if (!canAnalyze) {
      toast('Please select a machine or enter a fault description first.')
      return
    }

    setLoading(true)
    setApplied(false)

    try {
      const res = await fetch('/api/gemini/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          machineId: form.machineId,
          title: form.title,
          description: form.description,
          category: form.category,
          skills: form.skills,
          priority: form.priority,
        }),
      })

      if (!res.ok) throw new Error('API request failed')
      const data: GeminiSuggestion = await res.json()
      setSuggestion(data)
      toast('Gemini analysis complete!')
    } catch (err) {
      console.error(err)
      toast('Failed to fetch Gemini suggestion. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleApply() {
    if (!suggestion) return
    if (suggestion.recommendedSkills?.length > 0) {
      onApplySkills(suggestion.recommendedSkills)
    }
    setApplied(true)
    toast('Applied AI recommended skills!')
  }

  return (
    <div className="rounded-md border bg-card p-5 text-card-foreground shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-full bg-accent/15 text-accent">
            <Sparkles className="size-4" />
          </div>
          <div>
            <h3 className="font-serif text-[17px] font-medium leading-none">Gemini Dispatch AI</h3>
            <p className="mt-0.5 text-[11px] text-muted-foreground">Smart technician & site matcher</p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleAnalyze}
          disabled={loading || !canAnalyze}
          className="h-8 gap-1.5 text-xs font-mono"
        >
          {loading ? (
            <>
              <RefreshCw className="size-3 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="size-3 text-accent" />
              {suggestion ? 'Re-analyze' : 'Analyze'}
            </>
          )}
        </Button>
      </div>

      {!suggestion && !loading && (
        <div className="py-4 text-center">
          <p className="text-xs text-muted-foreground">
            {canAnalyze
              ? 'Click "Analyze" to let Gemini recommend the optimal technician, site location, and diagnosis.'
              : 'Select a machine or add a fault title to enable Gemini AI dispatch recommendations.'}
          </p>
        </div>
      )}

      {loading && (
        <div className="space-y-3 py-4">
          <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-14 w-full animate-pulse rounded bg-muted" />
          <div className="h-10 w-full animate-pulse rounded bg-muted" />
        </div>
      )}

      {suggestion && !loading && (
        <div className="mt-4 space-y-4">
          {/* Technician Match */}
          <div className="rounded-md border border-border/80 bg-background/60 p-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="size-4 text-accent" />
                <span className="font-mono text-xs font-semibold text-foreground">
                  {suggestion.recommendedTechnician.name}
                </span>
                <span className="rounded bg-accent/15 px-1.5 py-0.5 font-mono text-[10px] font-bold text-accent">
                  {suggestion.recommendedTechnician.matchScore}% Match
                </span>
              </div>
              <span className="font-mono text-[11px] text-muted-foreground">
                Base: {suggestion.recommendedTechnician.site}
              </span>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              {suggestion.recommendedTechnician.reason}
            </p>
          </div>

          {/* Site Location Recommendation */}
          <div className="rounded-md border border-border/80 bg-background/60 p-3.5">
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-primary" />
              <span className="font-mono text-xs font-semibold text-foreground">
                Optimal Site: {suggestion.recommendedSite.site}
              </span>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              {suggestion.recommendedSite.reason}
            </p>
          </div>

          {/* AI Diagnosis */}
          {suggestion.diagnosis && (
            <div className="rounded-md border border-muted bg-muted/30 p-3 text-xs leading-relaxed">
              <span className="font-mono font-medium text-foreground">Diagnostic Assessment: </span>
              <span className="text-muted-foreground">{suggestion.diagnosis}</span>
            </div>
          )}

          {/* Recommended Skills & Action */}
          {suggestion.recommendedSkills?.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Recommended Skills:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleApply}
                  disabled={applied}
                  className="h-6 gap-1 px-2 text-[11px]"
                >
                  {applied ? (
                    <>
                      <Check className="size-3 text-done" />
                      Applied
                    </>
                  ) : (
                    'Apply Skills'
                  )}
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {suggestion.recommendedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded border border-accent/40 bg-accent/10 px-2 py-0.5 font-mono text-[11px] text-accent-foreground"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Parts */}
          {suggestion.recommendedParts?.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] text-muted-foreground">Suggested Parts to Pack:</span>
              <div className="flex flex-wrap gap-1.5">
                {suggestion.recommendedParts.map((part) => (
                  <button
                    key={part}
                    type="button"
                    onClick={() => onApplyPart?.(part)}
                    className="flex items-center gap-1 rounded border border-border bg-muted/40 px-2 py-0.5 text-[11px] hover:border-foreground transition-colors"
                  >
                    <Wrench className="size-3 text-muted-foreground" />
                    <span>{part}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
