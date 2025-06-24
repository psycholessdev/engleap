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
            When you create a copy of a Deck, you gain the full control of the copy as if it was
            created by you. You will be able to edit custom definitions, alter cards and add your
            own! It a great way to customize your experience. Your learning process will also be
            copied. Also, it&apos;s recommended to unfollow of the original Deck so you don&apos;t
            study the same cards twice.
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
