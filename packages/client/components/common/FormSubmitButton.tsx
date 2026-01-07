import React from 'react'
import { LoadingButton } from './LoadingButton'
import { Button } from '@/components/ui'

const FormSubmitButton: React.FC<{
  loading: boolean
  text: string
  loadingText?: string
  fullWidth?: boolean
}> = ({ loading, text, loadingText, fullWidth }) => {
  return loading ? (
    <LoadingButton text={loadingText} fullWidth={fullWidth} />
  ) : (
    <Button type="submit" className={fullWidth ? 'w-full' : ''}>
      {text}
    </Button>
  )
}
export { FormSubmitButton }
