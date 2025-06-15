'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { IconOctagonPlus, IconCancel, IconEdit } from '@tabler/icons-react'
import { Loader2Icon } from 'lucide-react'
import DeckEditorModal from './DeckEditorModal'

import { useDeckController } from '@/hooks'

interface IDeckHead {
  deckId: string
  title: string
  description: string
  followingDefault: boolean
  isPublic: boolean
  cardsTotal: string
  usersFollowing: string
  showEditButtons: boolean
}

const DeckActions: React.FC<{
  isLoading: boolean
  editAvailable: boolean
  isFollowing: boolean
  onFollow: () => void
  onUnfollow: () => void
  onEditOpen: () => void
}> = ({ isLoading, editAvailable, onFollow, onUnfollow, isFollowing, onEditOpen }) => {
  return (
    <div className="self-end flex items-center gap-2">
      {/* Edit button */}
      {editAvailable && (
        <Button size="lg" variant="secondary" onClick={onEditOpen}>
          <IconEdit /> Edit
        </Button>
      )}

      {/* Follow button */}
      {isLoading ? (
        <Button disabled size="lg">
          <Loader2Icon className="animate-spin" /> loading
        </Button>
      ) : isFollowing ? (
        <Button size="lg" onClick={onUnfollow}>
          <IconCancel /> Unfollow
        </Button>
      ) : (
        <Button size="lg" onClick={onFollow}>
          <IconOctagonPlus /> Follow
        </Button>
      )}
    </div>
  )
}

const DeckHead: React.FC<IDeckHead> = ({
  title,
  isPublic,
  usersFollowing,
  cardsTotal,
  deckId,
  showEditButtons,
  followingDefault,
  description,
}) => {
  const [modalOpened, setModalOpened] = useState(false)
  const [following, setFollowing] = useState(followingDefault)
  const { isLoading, followDeck, unfollowDeck } = useDeckController()

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
      <DeckActions
        isLoading={isLoading}
        editAvailable={showEditButtons}
        isFollowing={following}
        onFollow={handleFollowClick}
        onUnfollow={handleUnfollowClick}
        onEditOpen={() => setModalOpened(true)}
      />

      <div className="flex flex-col self-start gap-2">
        <div className="flex items-center gap-1">
          <h1 className="font-ubuntu lg:text-3xl text-2xl text-white">📗 {title}</h1>
          <Badge variant={isPublic ? 'default' : 'destructive'}>
            {isPublic ? 'public' : 'private'}
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <Badge variant="secondary">{cardsTotal} cards</Badge>
          <Badge variant="secondary">{usersFollowing} people use it</Badge>
        </div>
      </div>

      <DeckEditorModal
        deckId={deckId}
        defaultTitle={title}
        defaultDescription={description}
        defaultIsPublic={isPublic}
        onCloseSignal={() => setModalOpened(false)}
        opened={modalOpened}
      />
    </div>
  )
}
export default DeckHead
