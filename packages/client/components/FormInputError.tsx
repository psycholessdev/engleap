import React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import FailureAlert from '@/components/FailureAlert'

interface IFormInputError {
  error?: { message?: string }
}

const FormInputError: React.FC<IFormInputError> = ({ error }) => {
  return (
    <AnimatePresence>
      {error && error.message ? (
        <motion.div
          key="box"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}>
          <FailureAlert title="Recheck this field" message={error.message} />
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
export default FormInputError
