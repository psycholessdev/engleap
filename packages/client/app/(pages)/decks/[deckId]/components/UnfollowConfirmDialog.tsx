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

interface IUnfollowConfirmDialog {
  opened: boolean
  onClose: () => void
  onConfirm: () => void
}

const UnfollowConfirmDialog: React.FC<IUnfollowConfirmDialog> = ({
  opened,
  onConfirm,
  onClose,
}) => {
  return (
    <AlertDialog open={opened}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete all your learning progress
            for this deck. If you decide to study this Deck again, you will be doing so from
            scratch.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Unfollow</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
export default UnfollowConfirmDialog
