import React from 'react'
import { Button } from '@/components/ui/button'
import { Loader2Icon } from 'lucide-react'

const LoadingButton: React.FC<{
  text?: string
  fullWidth?: boolean
}> = ({ text = 'Please wait', fullWidth }) => {
  return (
    <Button className={fullWidth ? 'w-full' : ''} disabled>
      <Loader2Icon className="animate-spin" />
      {text}
    </Button>
  )
}
export default LoadingButton
