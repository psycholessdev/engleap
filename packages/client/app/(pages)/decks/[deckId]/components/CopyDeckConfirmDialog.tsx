'use client'
import React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface ICopyDeckConfirmDialog {
  opened: boolean
  onClose: () => void
  onConfirm: () => void
}

const CopyDeckConfirmDialog: React.FC<ICopyDeckConfirmDialog> = ({
  opened,
  onConfirm,
  onClose,
}) => {
  return (
    <AlertDialog open={opened}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Make your copy</AlertDialogTitle>
          <AlertDialogDescription>
            When you copy a Deck, you gain full control of it — just as if you created it yourself.
            You can edit custom definitions, modify cards, and add your own! It&apos;s a great way
            to tailor your learning experience. Your review progress will also be copied.
            <br />
            🔔 Tip: It&apos;s recommended to unfollow the original Deck so you don’t end up
            reviewing the same cards twice.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Copy Deck</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
export default CopyDeckConfirmDialog
