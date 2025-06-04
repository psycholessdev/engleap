'use client'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  IconExclamationCircle,
  IconRosetteDiscountCheck,
  IconAlertCircle,
} from '@tabler/icons-react'

import React, { createContext, useContext, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

type NotificationType = 'success' | 'failure' | 'warning'
type NotificationsContextType = {
  alert: (title: string, message: string, type: NotificationType) => void
}

const NotificationsContext = createContext<NotificationsContextType>({
  alert: () => null,
})

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
    <NotificationsContext.Provider value={{ alert }}>
      {children}
      <AnimatePresence>
        {timerId && (
          <motion.div
            key="box"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-20 left-10 z-[9000]">
            <Alert variant={type === 'failure' ? 'destructive' : 'default'}>
              {type === 'success' && <IconRosetteDiscountCheck />}
              {type === 'warning' && <IconAlertCircle />}
              {type === 'failure' && <IconExclamationCircle />}

              <AlertTitle>{title}</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
    </NotificationsContext.Provider>
  )
}

export const useNotifications = () => {
  return useContext(NotificationsContext)
}
