import React from 'react'
import { IconExclamationCircle } from '@tabler/icons-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface IFailureAlert {
  title: string
  message: string
}

const FailureAlert: React.FC<IFailureAlert> = ({ title, message }) => {
  return (
    <Alert variant="destructive">
      <IconExclamationCircle />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}
export default FailureAlert
