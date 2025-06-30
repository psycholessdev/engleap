import React from 'react'
import { IconPlus } from '@tabler/icons-react'

interface IAddCardButton {
  text: string
  disabled?: boolean
  onClick?: () => void
  ref?: React.Ref<HTMLButtonElement>
  hidden?: boolean
}

const AddButtonGhost: React.FC<IAddCardButton> = ({ onClick, text, disabled, hidden, ref }) => {
  return (
    <button
      type="button"
      disabled={disabled}
      hidden={hidden}
      ref={ref}
      onClick={onClick}
      style={{ opacity: disabled ? 0.3 : 1 }}
      className="w-full rounded-xl flex items-center gap-2 p-2 hover:bg-el-secondary-container/20 cursor-pointer">
      <IconPlus />
      {text}
    </button>
  )
}
export default AddButtonGhost
