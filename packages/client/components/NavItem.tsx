import React from 'react'
import Image from 'next/image'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import Link from 'next/link'

interface INavItem {
  icon: string
  link: string
  currentPath: string
  title: string
}

const NavItem: React.FC<INavItem> = ({ icon, link, currentPath, title }) => {
  return (
    <Tooltip disableHoverableContent>
      <TooltipTrigger>
        <Link
          href={link}
          className={`block w-16 h-16 p-1 rounded-lg cursor-pointer transition-colors border-2 hover:border-el-secondary active:bg-el-secondary active:border-el-primary ${
            link === currentPath ? 'bg-el-secondary border-el-primary' : 'border-transparent'
          }`}>
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
export default NavItem
