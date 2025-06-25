'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { IconOctagonPlus, IconCancel, IconEdit, IconCopy } from '@tabler/icons-react'
import DeckEditorModal from './DeckEditorModal'
import UnfollowConfirmDialog from './UnfollowConfirmDialog'
import CopyDeckConfirmDialog from './CopyDeckConfirmDialog'

import { useRouter } from 'next/navigation'
import { useDeckController } from '@/hooks'

interface IDeckHead {
  deckId: string
  title: string
  description: string
  emoji: string
  followingDefault: boolean
  isPublic: boolean
  cardsTotal: string
  usersFollowing: string
  showEditButtons: boolean
}

const DeckActions: React.FC<{
  isLoading: boolean
  isPublic: boolean
  editAvailable: boolean
  isFollowing: boolean
  onFollow: () => void
  onUnfollow: () => void
  onEditOpen: () => void
  onCopy: () => void
}> = ({
  isLoading,
  editAvailable,
  onFollow,
  onUnfollow,
  isFollowing,
  isPublic,
  onEditOpen,
  onCopy,
}) => {
  const followButton = isFollowing ? (
    <Button size="lg" onClick={onUnfollow} disabled={isLoading}>
      <IconCancel /> Unfollow
    </Button>
  ) : (
    <Button size="lg" onClick={onFollow} disabled={isLoading}>
      <IconOctagonPlus /> Follow
    </Button>
  )

  return (
    <div className="self-end flex items-center gap-2">
      {/* Edit button */}
      {editAvailable && (
        <Button size="lg" variant="secondary" onClick={onEditOpen}>
          <IconEdit /> Edit
        </Button>
      )}
      {(isPublic || editAvailable) && (
        <Button size="lg" variant="secondary" onClick={onCopy}>
          <IconCopy /> Copy deck
        </Button>
      )}

      {!editAvailable && followButton}
    </div>
  )
}

const DeckHead: React.FC<IDeckHead> = ({
  title,
  description,
  emoji,
  isPublic,
  usersFollowing,
  cardsTotal,
  deckId,
  showEditButtons,
  followingDefault,
}) => {
  const router = useRouter()
  const [modalOpened, setModalOpened] = useState(false)
  const [unfollowModalOpened, setUnfollowModalOpened] = useState(false)
  const [copyModalOpened, setCopyModalOpened] = useState(false)
  const [following, setFollowing] = useState(followingDefault)
  const { isLoading, followDeck, unfollowDeck, copyDeck } = useDeckController()

  const handleFollowClick = () => {
    followDeck({ deckId }).then(success => {
      if (success) {
        setFollowing(true)
      }
    })
  }

  const handleUnfollowClick = () => {
    setUnfollowModalOpened(false)
    unfollowDeck({ deckId }).then(success => {
      if (success) {
        setFollowing(false)
      }
    })
  }

  const handleCopyDeck = () => {
    setCopyModalOpened(false)
    copyDeck(deckId).then(copiedDeck => {
      if (copiedDeck) {
        router.push(`/decks/${copiedDeck.id}`)
      }
    })
  }

  return (
    <div className="w-full h-60 p-5 mt-5 bg-el-secondary-container rounded-2xl flex flex-col justify-between">
      <DeckActions
        isLoading={isLoading}
        editAvailable={showEditButtons}
        isFollowing={following}
        isPublic={isPublic}
        onFollow={handleFollowClick}
        onUnfollow={() => setUnfollowModalOpened(true)}
        onEditOpen={() => setModalOpened(true)}
        onCopy={() => setCopyModalOpened(true)}
      />

      <div className="flex flex-col self-start gap-2">
        <div className="flex items-center gap-1">
          <h1 className="font-ubuntu lg:text-3xl text-2xl text-white">
            {emoji} {title}
          </h1>
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
        defaultEmoji={emoji}
        defaultDescription={description}
        defaultIsPublic={isPublic}
        onCloseSignal={() => setModalOpened(false)}
        opened={modalOpened}
      />
      <UnfollowConfirmDialog
        opened={unfollowModalOpened}
        onClose={() => setUnfollowModalOpened(false)}
        onConfirm={handleUnfollowClick}
      />
      <CopyDeckConfirmDialog
        opened={copyModalOpened}
        onClose={() => setCopyModalOpened(false)}
        onConfirm={handleCopyDeck}
      />
    </div>
  )
}
export default DeckHead
