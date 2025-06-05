import React from 'react'
import { IconPlus } from '@tabler/icons-react'

interface IAddCardButton {
  onClick?: () => void
}

const AddCardButton: React.FC<IAddCardButton> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-xl flex items-center gap-2 p-2 hover:bg-el-secondary-container/20 cursor-pointer">
      <IconPlus />
      Add Card
    </button>
  )
}
export default AddCardButton
