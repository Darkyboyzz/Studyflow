'use client'

import { useAuth } from '@/components/providers/auth-provider'
import { Bell } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function DashboardHeader() {
  const { user, signOut } = useAuth()

  const initials = user?.user_metadata?.display_name
    ? user.user_metadata.display_name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() || 'U'

  return (
    <header className="flex justify-between items-center w-full mb-8 lg:mb-16">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-on-surface mb-2">
          Good morning, {user?.user_metadata?.display_name?.split(' ')[0] || 'Alex'}
        </h1>
        <p className="text-base text-on-surface-variant">You have 3 tasks due this week.</p>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="text-on-surface-variant hover:bg-surface-container-highest rounded-full p-2 transition-colors relative">
          <Bell className="h-6 w-6" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="relative h-10 w-10 rounded-full cursor-pointer focus:outline-none">
            <Avatar className="h-10 w-10 shadow-sm">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-primary-container text-on-primary-container text-sm font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <div className="flex items-center gap-2 p-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-sm font-medium">
                  {user?.user_metadata?.display_name || 'Student'}
                </p>
                <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                  {user?.email}
                </p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => window.location.href = '/dashboard/profile'}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut} className="text-destructive focus:text-destructive">
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
