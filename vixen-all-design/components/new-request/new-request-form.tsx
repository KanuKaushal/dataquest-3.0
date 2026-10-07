'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { FadeUp } from '@/components/fade-up'
import { CategoryTags, SkillChips } from '@/components/new-request/chips'
import { Combobox } from '@/components/new-request/combobox'
import { DropZone } from '@/components/new-request/drop-zone'
import { TextAreaField, TextField } from '@/components/new-request/field'
import { FormSection } from '@/components/new-request/form-section'
import { MachineDetails } from '@/components/new-request/machine-details'
import { PartList } from '@/components/new-request/part-list'
import { SegmentedControl } from '@/components/new-request/segmented-control'
import { TimingFields } from '@/components/new-request/timing-fields'
import { Button } from '@/components/ui/button'
import { machines, type Skill } from '@/lib/mock-data'
import {
  PRIORITIES,
  SUGGESTED_SKILLS,
  findMachine,
  isValidPhone,
  missingFields,
  type FaultCategory,
  type FormState,
  type PartLine,
} from '@/lib/new-request'

const MACHINE_OPTIONS = machines.map((machine) => ({
  value: machine.id,
  label: machine.id,
  meta: machine.type,
}))

const PRIORITY_OPTIONS = PRIORITIES.map(({ value, label, accent }) => ({ value, label, accent }))

interface NewRequestFormProps {
  form: FormState
  onChange: (updater: (current: FormState) => FormState) => void
  onSubmit: () => void
  onSaveDraft: () => void
}

export function NewRequestForm({ form, onChange, onSubmit, onSaveDraft }: NewRequestFormProps) {
  const [touched, setTouched] = useState({ title: false, phone: false })
  const machine = findMachine(form.machineId)
  const priority = PRIORITIES.find((p) => p.value === form.priority)
  const missing = missingFields(form)

  const titleError = touched.title && !form.title.trim() ? 'Add a short title.' : undefined
  const phoneError =
    touched.phone && form.contactPhone && !isValidPhone(form.contactPhone)
      ? 'Check the phone number.'
      : undefined

  const patch = (changes: Partial<FormState>) => onChange((current) => ({ ...current, ...changes }))

  function selectCategory(category: FaultCategory | null) {
    onChange((current) => {
      const suggested: Skill[] = category ? SUGGESTED_SKILLS[category] : []
      const skills = current.skillsTouched
        ? [...current.skills, ...suggested.filter((skill) => !current.skills.includes(skill))]
        : suggested
      return { ...current, category, skills }
    })
  }

  function toggleSkill(skill: Skill) {
    onChange((current) => ({
      ...current,
      skillsTouched: true,
      skills: current.skills.includes(skill)
        ? current.skills.filter((s) => s !== skill)
        : [...current.skills, skill],
    }))
  }

  function updatePart(key: string, changes: Partial<PartLine>) {
    onChange((current) => ({
      ...current,
      parts: current.parts.map((line) => (line.key === key ? { ...line, ...changes } : line)),
    }))
  }

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        if (missing.length === 0) onSubmit()
      }}
    >
      <FormSection step="01" title="Machine" index={0}>
        <Combobox
          label="Machine"
          hideLabel
          options={MACHINE_OPTIONS}
          value={form.machineId}
          onChange={(machineId) => patch({ machineId })}
          placeholder="Search by ID or type"
          searchPlaceholder="Search machines"
          monoLabel
        />
        <MachineDetails machine={machine} />
      </FormSection>

      <FormSection step="02" title="Priority" index={1}>
        <SegmentedControl
          label="Priority"
          layoutId="priority-indicator"
          options={PRIORITY_OPTIONS}
          value={form.priority}
          onChange={(value) => patch({ priority: value })}
        />
        <p aria-live="polite" className="mt-3 h-4 font-mono text-xs text-muted-foreground">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={priority?.value ?? 'none'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="inline-block"
            >
              {priority ? `Response target: ${priority.target}` : 'Pick how fast this needs a response'}
            </motion.span>
          </AnimatePresence>
        </p>
      </FormSection>

      <FormSection step="03" title="What's happening" index={2}>
        <div className="flex flex-col gap-7">
          <TextField
            label="Title"
            value={form.title}
            placeholder="Short summary, e.g. Pump bearing noise"
            autoComplete="off"
            error={titleError}
            onChange={(event) => patch({ title: event.target.value })}
            onBlur={() => setTouched((current) => ({ ...current, title: true }))}
          />
          <TextAreaField
            label="Description"
            value={form.description}
            maxLength={500}
            placeholder="When did it start? Any noise, leaks or error codes?"
            onChange={(event) => patch({ description: event.target.value })}
          />
          <div>
            <p className="mb-2 text-xs text-muted-foreground">Fault category</p>
            <CategoryTags value={form.category} onChange={selectCategory} />
          </div>
        </div>
      </FormSection>

      <FormSection step="04" title="Skills needed" index={3}>
        <SkillChips
          value={form.skills}
          onToggle={toggleSkill}
          suggestedFrom={
            !form.skillsTouched && form.category && SUGGESTED_SKILLS[form.category].length > 0
              ? form.category
              : null
          }
        />
      </FormSection>

      <FormSection step="05" title="Parts" index={4}>
        <PartList
          lines={form.parts}
          notSure={form.notSure}
          onAdd={() =>
            onChange((current) => ({
              ...current,
              parts: [...current.parts, { key: crypto.randomUUID(), partId: null, qty: 1 }],
            }))
          }
          onChange={updatePart}
          onRemove={(key) =>
            onChange((current) => ({ ...current, parts: current.parts.filter((line) => line.key !== key) }))
          }
          onNotSure={() => onChange((current) => ({ ...current, notSure: !current.notSure }))}
        />
      </FormSection>

      <FormSection step="06" title="When" index={5}>
        <TimingFields
          timing={form.timing}
          date={form.date}
          time={form.time}
          onTiming={(timing) => patch({ timing })}
          onDate={(date) => patch({ date })}
          onTime={(time) => patch({ time })}
        />
      </FormSection>

      <FormSection step="07" title="Contact on site" index={6}>
        <div className="grid gap-7 sm:grid-cols-2 sm:gap-6">
          <TextField
            label="Name"
            value={form.contactName}
            placeholder="Who should the technician ask for?"
            autoComplete="off"
            onChange={(event) => patch({ contactName: event.target.value })}
          />
          <TextField
            label="Phone"
            type="tel"
            inputMode="tel"
            value={form.contactPhone}
            placeholder="+1 555 010 0142"
            autoComplete="off"
            error={phoneError}
            onChange={(event) => patch({ contactPhone: event.target.value })}
            onBlur={() => setTouched((current) => ({ ...current, phone: true }))}
          />
        </div>
      </FormSection>

      <FormSection step="08" title="Attachments" index={7}>
        <DropZone
          files={form.files}
          onAdd={(added) => onChange((current) => ({ ...current, files: [...current.files, ...added] }))}
          onRemove={(id) =>
            onChange((current) => ({ ...current, files: current.files.filter((file) => file.id !== id) }))
          }
        />
      </FormSection>

      <FadeUp delay={0.5}>
        <div className="flex flex-col-reverse gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p aria-live="polite" className="font-mono text-xs text-muted-foreground">
            {missing.length > 0 ? `Still needed: ${missing.join(', ')}` : 'Ready to submit'}
          </p>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={onSaveDraft}>
              Save draft
            </Button>
            <Button type="submit" variant="primary" disabled={missing.length > 0}>
              Submit for approval
            </Button>
          </div>
        </div>
      </FadeUp>
    </form>
  )
}
