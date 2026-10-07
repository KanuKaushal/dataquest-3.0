'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Choice } from '@/components/new-request/choice'
import { Combobox } from '@/components/new-request/combobox'
import { TextField } from '@/components/new-request/field'
import { TIME_SLOTS, TODAY_ISO, type FormState } from '@/lib/new-request'

interface TimingFieldsProps {
  timing: FormState['timing']
  date: string
  time: string | null
  onTiming: (timing: FormState['timing']) => void
  onDate: (date: string) => void
  onTime: (time: string) => void
}

const TIME_OPTIONS = TIME_SLOTS.map((slot) => ({ value: slot, label: slot }))

export function TimingFields({ timing, date, time, onTiming, onDate, onTime }: TimingFieldsProps) {
  return (
    <div>
      <div role="radiogroup" aria-label="When" className="flex flex-col gap-3 sm:flex-row sm:gap-8">
        <Choice type="radio" name="timing" checked={timing === 'asap'} onChange={() => onTiming('asap')}>
          As soon as possible
        </Choice>
        <Choice
          type="radio"
          name="timing"
          checked={timing === 'scheduled'}
          onChange={() => onTiming('scheduled')}
        >
          Pick a date and time
        </Choice>
      </div>

      <AnimatePresence initial={false}>
        {timing === 'scheduled' && (
          <motion.div
            key="schedule"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="grid gap-6 pt-6 sm:grid-cols-2">
              <TextField
                label="Date"
                type="date"
                min={TODAY_ISO}
                value={date}
                onChange={(event) => onDate(event.target.value)}
              />
              <Combobox
                label="Time"
                options={TIME_OPTIONS}
                value={time}
                onChange={onTime}
                placeholder="Select a time"
                searchable={false}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
