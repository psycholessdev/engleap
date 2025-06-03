import React from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { IconExclamationCircle } from '@tabler/icons-react'
import { AnimatePresence, motion } from 'motion/react'
import type { FieldError } from 'react-hook-form'

interface IFormInputError {
  error: FieldError
}

const FormInputError: React.FC<IFormInputError> = ({ error }) => {
  return (
    <AnimatePresence>
      {error ? (
        <motion.div
          key="box"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}>
          <Alert variant="destructive">
            <IconExclamationCircle />
            <AlertTitle>Recheck this field</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
export default FormInputError
