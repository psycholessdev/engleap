'use client'
import React from 'react'
import NavItem from '@/components/NavItem'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { AnimatePresence, motion } from 'motion/react'

const Navbar = () => {
  const { isLogged } = useAuth()
  const pathname = usePathname()

  return (
    <AnimatePresence initial={true}>
      {isLogged ? (
        <motion.nav
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.35 }}
          className="fixed left-0 bottom-0 lg:h-full lg:w-[90px] w-full h-20 bg-el-root-bg z-[4000] flex lg:flex-col gap-5 justify-center items-center px-4 lg:border-r-1 lg:border-r-el-outline border-t-1 border-t-el-outline">
          <NavItem
            link="/study"
            icon="/icons/academic-cap.png"
            title="Study"
            currentPath={pathname}
          />
          <NavItem link="/decks" icon="/icons/cards.png" title="My Decks" currentPath={pathname} />
          <NavItem
            link="/decks/search"
            icon="/icons/search.png"
            title="Search"
            currentPath={pathname}
          />
        </motion.nav>
      ) : null}
    </AnimatePresence>
  )
}

export default Navbar
