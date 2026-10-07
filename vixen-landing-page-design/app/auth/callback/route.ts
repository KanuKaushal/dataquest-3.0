import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (!error) {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        const roleParam = searchParams.get('role')
        const role = roleParam || user?.user_metadata?.role || 'user'

        if (roleParam && user && user.user_metadata?.role !== roleParam) {
          await supabase.auth.updateUser({ data: { role: roleParam } })
        }

        const destination = next !== '/' ? next : role === 'technician' ? '/technician/dashboard' : '/user/dashboard'

        return NextResponse.redirect(`${origin}${destination}`)
      }
    }
  }

  // Return the user to an error page or back to sign in
  return NextResponse.redirect(`${origin}/sign-in?error=auth_failed`)
}
