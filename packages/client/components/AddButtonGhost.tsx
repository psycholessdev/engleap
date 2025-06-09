import React from 'react'
import { IconPlus } from '@tabler/icons-react'

interface IAddCardButton {
  text: string
  onClick?: () => void
}

const AddButtonGhost: React.FC<IAddCardButton> = ({ onClick, text }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-xl flex items-center gap-2 p-2 hover:bg-el-secondary-container/20 cursor-pointer">
      <IconPlus />
      {text}
    </button>
  )
}
export default AddButtonGhost
