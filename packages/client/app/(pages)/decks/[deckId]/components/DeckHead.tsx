'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { IconOctagonPlus } from '@tabler/icons-react'

interface IDeckHead {
  title: string
  isPublic: boolean
  cardsTotal: string
  usersFollowing: string
}

const DeckHead: React.FC<IDeckHead> = ({ title, isPublic, usersFollowing, cardsTotal }) => {
  return (
    <div className="w-full h-60 p-5 mt-5 bg-el-secondary-container rounded-2xl flex flex-col justify-between">
      <div className="self-end">
        <Button size="lg">
          <IconOctagonPlus /> Follow
        </Button>
      </div>
      <div className="flex flex-col self-start gap-3">
        <div className="flex items-center gap-3">
          <h1 className="font-ubuntu text-3xl text-white">📗 {title}</h1>
          <Badge variant={isPublic ? 'default' : 'destructive'}>
            {isPublic ? 'public' : 'private'}
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary">{cardsTotal} cards</Badge>
          <Badge variant="secondary">{usersFollowing} people use it</Badge>
        </div>
      </div>
    </div>
  )
}
export default DeckHead
