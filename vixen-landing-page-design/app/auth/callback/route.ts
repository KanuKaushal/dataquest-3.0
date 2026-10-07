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
        const role = (roleParam || user?.user_metadata?.role || 'user') as 'user' | 'technician'

        if (user) {
          if (roleParam && user.user_metadata?.role !== roleParam) {
            await supabase.auth.updateUser({ data: { role: roleParam } })
          }

          // Directly ensure the user profile exists in public.profiles
          const fullName = user.user_metadata?.full_name || user.user_metadata?.name || 'User'
          const firstName = user.user_metadata?.given_name || fullName.split(' ')[0]
          const lastName = user.user_metadata?.family_name || fullName.split(' ').slice(1).join(' ') || ''
          const avatarUrl = user.user_metadata?.picture || user.user_metadata?.avatar_url || null

          try {
            await supabase.from('profiles').upsert({
              id: user.id,
              email: user.email!,
              full_name: fullName,
              first_name: firstName,
              last_name: lastName,
              avatar_url: avatarUrl,
              role: role,
              company: user.user_metadata?.company || null,
              updated_at: new Date().toISOString(),
            }, { onConflict: 'id' })
          } catch (dbErr) {
            console.error('Error upserting profile in callback:', dbErr)
          }
        }

        const destination = next !== '/' ? next : role === 'technician' ? '/technician/dashboard' : '/user/dashboard'

        return NextResponse.redirect(`${origin}${destination}`)
      }
    }
  }

  // Return the user to an error page or back to sign in
  return NextResponse.redirect(`${origin}/sign-in?error=auth_failed`)
}
