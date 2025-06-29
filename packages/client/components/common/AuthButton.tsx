'use client'
import React from 'react'
import Link from 'next/link'

import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { IconLogout2, IconUserCircle } from '@tabler/icons-react'

const AuthButton: React.FC<{
  isLoading?: boolean
  isLogged?: boolean
  onLogout: () => void
}> = ({ isLoading, isLogged, onLogout }) => {
  if (isLoading) {
    return <Skeleton className="w-23 h-8 rounded-lg" />
  }

  return isLogged ? (
    <Button variant="outline" size="sm" onClick={onLogout}>
      <IconLogout2 /> Log out
    </Button>
  ) : (
    <Button variant="outline" size="sm" asChild>
      <Link href="/signin">
        <IconUserCircle /> Log in
      </Link>
    </Button>
  )
}
export default AuthButton
