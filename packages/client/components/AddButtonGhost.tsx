import React from 'react'
import { IconPlus } from '@tabler/icons-react'

interface IAddCardButton {
  text: string
  onClick?: () => void
  ref?: React.Ref<HTMLButtonElement>
  hidden?: boolean
}

const AddButtonGhost: React.FC<IAddCardButton> = ({ onClick, text, hidden, ref }) => {
  return (
    <button
      type="button"
      hidden={hidden}
      ref={ref}
      onClick={onClick}
      className="w-full rounded-xl flex items-center gap-2 p-2 hover:bg-el-secondary-container/20 cursor-pointer">
      <IconPlus />
      {text}
    </button>
  )
}
export default AddButtonGhost
