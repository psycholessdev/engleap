'use client'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  IconExclamationCircleFilled,
  IconRosetteDiscountCheckFilled,
  IconAlertCircleFilled,
} from '@tabler/icons-react'

import React, { createContext, useContext, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

type NotificationType = 'success' | 'failure' | 'warning'

const NotificationAlert: React.FC<{
  type: NotificationType
  title: string
  message: string
}> = ({ type, title, message }) => {
  return (
    <motion.div
      key="box"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      aria-live="assertive"
      className="absolute top-20 lg:left-10 left-2 z-[9000]">
      <Alert variant={type === 'failure' ? 'destructive' : 'default'}>
        {type === 'success' && <IconRosetteDiscountCheckFilled />}
        {type === 'warning' && <IconAlertCircleFilled />}
        {type === 'failure' && <IconExclamationCircleFilled />}

        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    </motion.div>
  )
}

type NotificationsContextType = (title: string, message: string, type: NotificationType) => void
const NotificationsContext = createContext<NotificationsContextType>(() => null)

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [timerId, setTimerId] = useState<number | null>(null)
  const [type, setType] = useState<NotificationType>('success')
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')

  const alert = (title: string, message: string, type: NotificationType = 'success') => {
    setTitle(title)
    setMessage(message)
    setType(type)

    if (timerId) {
      clearTimeout(timerId)
    }

    const timer = setTimeout(() => {
      setTimerId(null)
    }, 3000)
    setTimerId(timer as unknown as number)
  }

  return (
    <NotificationsContext.Provider value={alert}>
      {children}
      <AnimatePresence>
        {timerId && <NotificationAlert type={type} title={title} message={message} />}
      </AnimatePresence>
    </NotificationsContext.Provider>
  )
}

export const useNotifications = () => {
  return useContext(NotificationsContext)
}
