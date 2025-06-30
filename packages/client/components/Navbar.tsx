'use client'
import React from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

import Image from 'next/image'
import Link from 'next/link'

import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks'
import { AnimatePresence, motion } from 'motion/react'

interface INavItem {
  icon: string
  link: string
  currentPath: string
  title: string
}
const NavItemRaw: React.FC<INavItem> = ({ icon, link, currentPath, title }) => {
  return (
    <Tooltip disableHoverableContent>
      <TooltipTrigger asChild>
        <Link href={link} className={`nav-item ${link === currentPath ? 'active' : ''}`}>
          <Image
            src={icon}
            alt="nav item logo"
            className="select-none drag-none"
            width={60}
            height={60}
          />
        </Link>
      </TooltipTrigger>
      <TooltipContent className="z-[5000]">
        <p>{title}</p>
      </TooltipContent>
    </Tooltip>
  )
}
const NavItem = React.memo(NavItemRaw)

const NavItemList: React.FC<{ currentPath: string }> = ({ currentPath }) => {
  return (
    <>
      <NavItem
        link="/study"
        icon="/icons/academic-cap.png"
        title="Study"
        currentPath={currentPath}
      />
      <NavItem link="/decks" icon="/icons/cards.png" title="My Decks" currentPath={currentPath} />
      <NavItem
        link="/decks/search"
        icon="/icons/search.png"
        title="Search"
        currentPath={currentPath}
      />
    </>
  )
}

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
          aria-label="Main navigation"
          role="navigation"
          className="fixed left-0 bottom-0 lg:h-full lg:w-[90px] w-full h-20 bg-el-root-bg z-[4000] flex lg:flex-col gap-5 justify-center items-center px-4 lg:border-r-1 lg:border-r-el-outline border-t-1 border-t-el-outline">
          <NavItemList currentPath={pathname} />
        </motion.nav>
      ) : null}
    </AnimatePresence>
  )
}

export default Navbar
