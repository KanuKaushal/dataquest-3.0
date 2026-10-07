'use client'

import { useCallback, useState, type FormEvent } from 'react'
import { motion, MotionConfig, type Variants } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronDown, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { Field, inputClass } from './field'
import { GoogleButton } from './google-button'
import { SkillPicker } from './skill-picker'
import { Toast } from './toast'

const DEPARTMENTS = ['Mechanical', 'Electrical', 'Hydraulics', 'Pneumatics', 'Instrumentation']

type FormValues = {
  firstName: string
  lastName: string
  email: string
  password: string
  dob: string
  location: string
  department: string
  skills: string[]
  experience: string
}

type FormErrors = Partial<Record<keyof FormValues, string>>

const EMPTY_VALUES: FormValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  dob: '',
  location: '',
  department: '',
  skills: [],
  experience: '',
}

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

function latestAdultBirthDate() {
  const date = new Date()
  date.setFullYear(date.getFullYear() - 18)
  return date.toISOString().slice(0, 10)
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {}
  if (!values.firstName.trim()) errors.firstName = 'Required.'
  if (!values.lastName.trim()) errors.lastName = 'Required.'
  if (!/^\S+@\S+\.\S+$/.test(values.email)) errors.email = 'Enter a valid work email.'
  if (values.password.length < 8) errors.password = 'At least 8 characters.'
  if (!values.dob) errors.dob = 'Required.'
  else if (values.dob > latestAdultBirthDate()) errors.dob = 'You must be 18 or older.'
  if (!values.location.trim()) errors.location = 'Required.'
  if (!values.department) errors.department = 'Pick a department.'
  if (values.skills.length === 0) errors.skills = 'Select at least one specialization.'
  const years = Number(values.experience)
  if (values.experience === '' || Number.isNaN(years) || years < 0 || years > 60)
    errors.experience = 'Enter years between 0 and 60.'
  return errors
}

export function SignupForm() {
  const router = useRouter()
  const { openGoogleAuth, signUpWithCredentials } = useAuth()
  const [values, setValues] = useState<FormValues>(EMPTY_VALUES)
  const [errors, setErrors] = useState<FormErrors>({})
  const [googleConnected, setGoogleConnected] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const dismissToast = useCallback(() => setToast(null), [])

  const setField = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const toggleSkill = (skill: string) =>
    setField(
      'skills',
      values.skills.includes(skill)
        ? values.skills.filter((s) => s !== skill)
        : [...values.skills, skill],
    )

  const handleGoogleSignUp = () => {
    openGoogleAuth('technician', 'signup', (authUser) => {
      setField('firstName', authUser.firstName)
      setField('lastName', authUser.lastName)
      setField('email', authUser.email)
      setGoogleConnected(authUser.email)
      setToast(`Google connected: ${authUser.email}`)
    })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setSubmitting(true)
    const res = await signUpWithCredentials({
      email: values.email,
      password: values.password,
      role: 'technician',
      name: `${values.firstName} ${values.lastName}`.trim(),
      department: values.department,
      skills: values.skills,
      experience: values.experience,
    })
    setSubmitting(false)

    if (res.error) {
      setToast(res.error)
      return
    }

    setToast('Registration submitted successfully')
    setTimeout(() => router.push('/technician/dashboard'), 800)
  }

  const invalid = (key: keyof FormValues) => (errors[key] ? true : undefined)
  const describedBy = (key: keyof FormValues) => (errors[key] ? `${key}-error` : undefined)

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full max-w-[540px] rounded-md border border-border p-6 sm:p-10"
      >
        <motion.header variants={item} className="flex flex-col gap-6">
          <p className="font-serif text-xl text-foreground">ServiceSync</p>
          <div className="flex flex-col gap-2">
            <h1 className="font-serif text-4xl leading-tight tracking-tight text-foreground sm:text-[44px]">
              Technician registration.
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Register your profile for field equipment maintenance and task routing.
            </p>
          </div>
        </motion.header>

        <motion.div variants={item} className="mt-8">
          <GoogleButton onClick={handleGoogleSignUp} />
          {googleConnected && (
            <div className="mt-3 flex items-center gap-2 rounded-md border border-[#3F7D58]/30 bg-[#3F7D58]/10 px-3 py-2 text-xs text-[#3F7D58]">
              <CheckCircle2 className="size-4 shrink-0" />
              <span>Google profile connected: <strong>{googleConnected}</strong></span>
            </div>
          )}
        </motion.div>

        <motion.div variants={item} className="my-6 flex items-center gap-3" aria-hidden="true">
          <span className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">or register with credentials</span>
          <span className="h-px flex-1 bg-border" />
        </motion.div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          <motion.div variants={item} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field id="firstName" label="First name" error={errors.firstName}>
              <input
                id="firstName"
                autoComplete="given-name"
                className={inputClass}
                value={values.firstName}
                aria-invalid={invalid('firstName')}
                aria-describedby={describedBy('firstName')}
                onChange={(e) => setField('firstName', e.target.value)}
              />
            </Field>
            <Field id="lastName" label="Last name" error={errors.lastName}>
              <input
                id="lastName"
                autoComplete="family-name"
                className={inputClass}
                value={values.lastName}
                aria-invalid={invalid('lastName')}
                aria-describedby={describedBy('lastName')}
                onChange={(e) => setField('lastName', e.target.value)}
              />
            </Field>
          </motion.div>

          <motion.div variants={item}>
            <Field id="email" label="Work email" error={errors.email}>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="name@company.com"
                className={inputClass}
                value={values.email}
                aria-invalid={invalid('email')}
                aria-describedby={describedBy('email')}
                onChange={(e) => setField('email', e.target.value)}
              />
            </Field>
          </motion.div>

          <motion.div variants={item}>
            <Field id="password" label="Password" error={errors.password} hint="min. 8 characters">
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={`${inputClass} pr-10`}
                  value={values.password}
                  aria-invalid={invalid('password')}
                  aria-describedby={describedBy('password')}
                  onChange={(e) => setField('password', e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:text-primary focus-visible:outline-none"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </Field>
          </motion.div>

          <motion.div variants={item} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field id="dob" label="Date of birth" error={errors.dob}>
              <input
                id="dob"
                type="date"
                autoComplete="bday"
                max={latestAdultBirthDate()}
                className={`${inputClass} font-mono`}
                value={values.dob}
                aria-invalid={invalid('dob')}
                aria-describedby={describedBy('dob')}
                onChange={(e) => setField('dob', e.target.value)}
              />
            </Field>
            <Field id="location" label="City / base location" error={errors.location}>
              <input
                id="location"
                placeholder="Site A, B or C hub"
                className={inputClass}
                value={values.location}
                aria-invalid={invalid('location')}
                aria-describedby={describedBy('location')}
                onChange={(e) => setField('location', e.target.value)}
              />
            </Field>
          </motion.div>

          <motion.div variants={item} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field id="department" label="Department" error={errors.department}>
              <div className="relative">
                <select
                  id="department"
                  className={`${inputClass} appearance-none pr-10 ${values.department ? '' : 'text-muted-foreground/70'}`}
                  value={values.department}
                  aria-invalid={invalid('department')}
                  aria-describedby={describedBy('department')}
                  onChange={(e) => setField('department', e.target.value)}
                >
                  <option value="" disabled>
                    Select
                  </option>
                  {DEPARTMENTS.map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  aria-hidden="true"
                  size={16}
                  className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground"
                />
              </div>
            </Field>
            <Field
              id="experience"
              label="Experience"
              error={errors.experience}
              hint="years in industrial maintenance"
            >
              <input
                id="experience"
                type="number"
                inputMode="numeric"
                min={0}
                max={60}
                placeholder="0"
                className={`${inputClass} font-mono`}
                value={values.experience}
                aria-invalid={invalid('experience')}
                aria-describedby={describedBy('experience')}
                onChange={(e) => setField('experience', e.target.value)}
              />
            </Field>
          </motion.div>

          <motion.div variants={item}>
            <SkillPicker selected={values.skills} error={errors.skills} onToggle={toggleSkill} />
          </motion.div>

          <motion.div variants={item} className="mt-1">
            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="h-11 w-full rounded-md bg-primary text-sm font-medium text-primary-foreground transition-colors duration-200 ease-out hover:bg-[#CF4F0A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60"
            >
              {submitting ? 'Submitting...' : 'Complete registration'}
            </motion.button>
          </motion.div>
        </form>

        <motion.p variants={item} className="mt-6 text-sm text-muted-foreground">
          Already registered?{' '}
          <Link
            href="/sign-in"
            className="text-foreground underline underline-offset-4 decoration-border transition-colors duration-200 hover:decoration-primary focus-visible:text-primary focus-visible:outline-none"
          >
            Sign in.
          </Link>
        </motion.p>
      </motion.div>

      <Toast message={toast} onDismiss={dismissToast} />
    </MotionConfig>
  )
}
