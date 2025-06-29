import React from 'react'
import { AnimatePresence, motion } from 'motion/react'

import { IconExclamationCircle } from '@tabler/icons-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface IFormInputError {
  title?: string
  message?: { message?: string } | string
}

const FormInputErrorMessage: React.FC<IFormInputError> = ({
  title = 'Recheck this field',
  message,
}) => {
  const errorMessage =
    typeof message === 'object' && message?.message
      ? message.message
      : typeof message === 'string'
      ? message
      : null
  return (
    <AnimatePresence>
      {errorMessage ? (
        <motion.div
          key="box"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}>
          <Alert variant="destructive">
            <IconExclamationCircle />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
export default FormInputErrorMessage
