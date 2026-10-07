import type { FormState } from '@/lib/new-request'
import { machines, type Job, type Priority } from '@/lib/mock-data'
import {
  INITIAL_NOTIFICATIONS,
  PENDING_ASSIGNMENT,
  type PendingAssignment,
  type TechnicianNotification,
} from '@/lib/technician-notifications'
import type { Site } from '@/lib/notifications'

export interface PendingOffer extends PendingAssignment {
  createdAt: number
  expiresAt: number
  status: 'pending' | 'accepted' | 'declined' | 'expired'
  declineReason?: string
  priority?: Priority
}

const STORAGE_NOTIFICATIONS_KEY = 'vixen_technician_notifications_v2'
const STORAGE_OFFERS_KEY = 'vixen_pending_offers_v2'
const STORAGE_JOBS_KEY = 'vixen_technician_jobs_v2'

export const INITIAL_OFFER: PendingOffer = {
  ...PENDING_ASSIGNMENT,
  createdAt: Date.now() - (10 * 60 - PENDING_ASSIGNMENT.offerSeconds) * 1000,
  expiresAt: Date.now() + PENDING_ASSIGNMENT.offerSeconds * 1000,
  status: 'pending',
  priority: 'urgent',
}

// Ensure initial notifications has the offer attached to t1
function getBaseNotifications(): TechnicianNotification[] {
  return INITIAL_NOTIFICATIONS.map((n) => {
    if (n.id === 't1') {
      return {
        ...n,
        offer: { ...INITIAL_OFFER },
      }
    }
    return n
  })
}

export function getStoredNotifications(): TechnicianNotification[] {
  if (typeof window === 'undefined') return getBaseNotifications()
  try {
    const raw = localStorage.getItem(STORAGE_NOTIFICATIONS_KEY)
    if (!raw) {
      const base = getBaseNotifications()
      localStorage.setItem(STORAGE_NOTIFICATIONS_KEY, JSON.stringify(base))
      return base
    }
    return JSON.parse(raw)
  } catch {
    return getBaseNotifications()
  }
}

export function saveStoredNotifications(items: TechnicianNotification[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_NOTIFICATIONS_KEY, JSON.stringify(items))
    window.dispatchEvent(new CustomEvent('vixen_notifications_changed', { detail: items }))
  } catch (err) {
    console.error('Error saving notifications:', err)
  }
}

export function getStoredOffers(): PendingOffer[] {
  if (typeof window === 'undefined') return [INITIAL_OFFER]
  try {
    const raw = localStorage.getItem(STORAGE_OFFERS_KEY)
    if (!raw) {
      const initial = [INITIAL_OFFER]
      localStorage.setItem(STORAGE_OFFERS_KEY, JSON.stringify(initial))
      return initial
    }
    return JSON.parse(raw)
  } catch {
    return [INITIAL_OFFER]
  }
}

export function saveStoredOffers(offers: PendingOffer[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_OFFERS_KEY, JSON.stringify(offers))
    window.dispatchEvent(new CustomEvent('vixen_offers_changed', { detail: offers }))
  } catch (err) {
    console.error('Error saving offers:', err)
  }
}

export function createJobOfferFromRequest(
  form: FormState,
  requestId: string = `REQ-${Math.floor(2050 + Math.random() * 800)}`,
): { offer: PendingOffer; notification: TechnicianNotification } {
  const machine = machines.find((m) => m.id === form.machineId)
  const site: Site = (machine?.site || 'Site A') as Site
  const machineName = machine ? `${machine.id} ${machine.type}` : form.machineId || 'Industrial Unit'

  const priorityMinutes: Record<Priority, number> = {
    urgent: 5,
    high: 10,
    medium: 15,
    low: 30,
  }
  const minutes = form.priority ? priorityMinutes[form.priority] : 10
  const totalSeconds = minutes * 60
  const now = Date.now()
  const notificationId = `offer-${now}-${Math.random().toString(36).slice(2, 6)}`

  const offer: PendingOffer = {
    notificationId,
    requestId,
    machine: machineName,
    site,
    respondWithinMinutes: minutes,
    offerSeconds: totalSeconds,
    createdAt: now,
    expiresAt: now + totalSeconds * 1000,
    status: 'pending',
    priority: form.priority || 'medium',
  }

  const notification: TechnicianNotification = {
    id: notificationId,
    kind: 'assignment',
    day: 'today',
    title: `New job assigned: ${form.title || machineName}`,
    summary: `${requestId}, ${machineName} at ${site}. ${form.title ? form.title + '. ' : ''}Respond within ${minutes} min.`,
    detail: `${form.title ? `${form.title}: ` : ''}${form.description || 'Urgent repair required. Equipment reported faulty.'} You have ${minutes} minutes to accept or decline this dispatch before it is reassigned.`,
    site,
    requestId,
    machine: machineName,
    age: 'just now',
    fresh: true,
    read: false,
    offer,
    action: { label: 'Open job', confirmation: `Opened ${requestId}` },
    job: {
      address: `${site}, Unit Bay 4, Plant Engineering`,
      slaDue: `Today within ${minutes} min`,
      skills: form.skills.map((s) => String(s)),
      parts: form.parts
        .filter((p) => p.partId)
        .map((p) => `${p.partId} x${p.qty}`),
    },
    events: [
      { time: 'Just now', label: 'Service request created by user' },
      { time: 'Just now', label: `Dispatch timer started (${minutes} min response window)` },
    ],
  }

  // Prepend to stored offers
  const currentOffers = getStoredOffers()
  const updatedOffers = [offer, ...currentOffers.filter((o) => o.notificationId !== notificationId)]
  saveStoredOffers(updatedOffers)

  // Prepend to stored notifications
  const currentNotifs = getStoredNotifications()
  const updatedNotifs = [notification, ...currentNotifs.filter((n) => n.id !== notificationId)]
  saveStoredNotifications(updatedNotifs)

  return { offer, notification }
}

export function updateOfferStatus(
  notificationId: string,
  status: 'accepted' | 'declined' | 'expired',
  declineReason?: string,
) {
  // Update offers
  const offers = getStoredOffers()
  let affectedOffer: PendingOffer | undefined
  const updatedOffers = offers.map((o) => {
    if (o.notificationId === notificationId) {
      affectedOffer = { ...o, status, declineReason }
      return affectedOffer
    }
    return o
  })
  saveStoredOffers(updatedOffers)

  // Update notifications
  const notifs = getStoredNotifications()
  const updatedNotifs = notifs.map((n) => {
    if (n.id === notificationId) {
      const updatedOffer = n.offer ? { ...n.offer, status, declineReason } : undefined
      const eventLabel =
        status === 'accepted'
          ? 'You accepted the job dispatch'
          : status === 'declined'
            ? `You declined: ${declineReason || 'Unavailable'}. Reassigned to next technician.`
            : 'Response time window expired. Reassigned to next available technician.'
      return {
        ...n,
        read: true,
        offer: updatedOffer,
        events: [...n.events, { time: 'Just now', label: eventLabel }],
      }
    }
    return n
  })
  saveStoredNotifications(updatedNotifs)

  // If accepted, add to technician jobs
  if (status === 'accepted' && affectedOffer) {
    addJobToTechnicianSchedule(affectedOffer)
  }
}

export function addJobToTechnicianSchedule(offer: PendingOffer) {
  if (typeof window === 'undefined') return
  try {
    const raw = localStorage.getItem(STORAGE_JOBS_KEY)
    const existing: Job[] = raw ? JSON.parse(raw) : []
    const newJob: Job = {
      id: `j-${offer.requestId}`,
      requestId: offer.requestId,
      machine: offer.machine,
      equipment: offer.machine.split(' ')[1] || 'Equipment',
      site: offer.site,
      fault: 'Customer service dispatch order.',
      priority: offer.priority || 'high',
      status: 'pending',
      minutesLeft: offer.respondWithinMinutes * 6,
    }
    const updated = [newJob, ...existing.filter((j) => j.requestId !== offer.requestId)]
    localStorage.setItem(STORAGE_JOBS_KEY, JSON.stringify(updated))
    window.dispatchEvent(new CustomEvent('vixen_jobs_changed', { detail: updated }))
  } catch (err) {
    console.error('Error saving job to schedule:', err)
  }
}
