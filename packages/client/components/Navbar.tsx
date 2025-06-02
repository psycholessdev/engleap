'use client'
import React from 'react'
import NavItem from '@/components/NavItem'
import { usePathname } from 'next/navigation'

const Navbar = () => {
  const pathname = usePathname()

  return (
    <nav className="absolute top-0 left-0 h-full w-[90px] bg-el-root-bg z-[4000] flex flex-col gap-5 justify-center items-center px-4 border-r-1 border-r-el-outline">
      <NavItem link="/decks" icon="/icons/cards.png" title="My Decks" currentPath={pathname} />
      <NavItem link="/search" icon="/icons/search.png" title="Search" currentPath={pathname} />
    </nav>
  )
}

export default Navbar
