'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { IconOctagonPlus, IconCancel, IconEdit } from '@tabler/icons-react'
import { Loader2Icon } from 'lucide-react'

import { useAuth, useDeckController } from '@/hooks'

interface IDeckHead {
  deckId: string
  title: string
  isPublic: boolean
  cardsTotal: string
  usersFollowing: string
  creatorId: string
}

const DeckHead: React.FC<IDeckHead> = ({
  title,
  isPublic,
  usersFollowing,
  cardsTotal,
  deckId,
  creatorId,
}) => {
  const { userId } = useAuth()
  const [following, setFollowing] = useState(true)
  const { loading, followDeck, unfollowDeck } = useDeckController()

  const handleFollowClick = () => {
    followDeck({ deckId }).then(success => {
      if (success) {
        setFollowing(true)
      }
    })
  }

  const handleUnfollowClick = () => {
    unfollowDeck({ deckId }).then(success => {
      if (success) {
        setFollowing(false)
      }
    })
  }

  return (
    <div className="w-full h-60 p-5 mt-5 bg-el-secondary-container rounded-2xl flex flex-col justify-between">
      <div className="self-end flex items-center gap-2">
        {/* Edit button */}
        {userId === creatorId && (
          <Button size="lg" variant="secondary">
            <IconEdit /> Edit
          </Button>
        )}

        {/* Follow button */}
        {loading && (
          <Button disabled size="lg">
            <Loader2Icon className="animate-spin" /> loading
          </Button>
        )}
        {!loading && !following && (
          <Button size="lg" onClick={handleFollowClick}>
            <IconOctagonPlus /> Follow
          </Button>
        )}
        {!loading && following && (
          <Button size="lg" onClick={handleUnfollowClick}>
            <IconCancel /> Unfollow
          </Button>
        )}
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
