import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { IconPencil } from '@tabler/icons-react'

interface IDeckItem {
  title: string
  cardsTotalCount: number
  cardsNewCount: number
  cardsDueCount: number
  key?: string
  editable?: boolean
}

const DeckItem: React.FC<IDeckItem> = ({
  title,
  cardsTotalCount,
  cardsNewCount,
  cardsDueCount,
  editable,
}) => {
  return (
    <div className="w-full py-5 px-3 flex justify-between rounded-2xl cursor-pointer last:border-b-transparent hover:bg-el-secondary-container/20">
      <div className="flex items-center gap-1">
        <span className="font-ubuntu text-2xl text-white select-none mr-3">{title}</span>
        <Badge>{cardsTotalCount} total</Badge>
        <Badge variant="secondary">{cardsNewCount} new</Badge>
        <Badge variant="secondary">{cardsDueCount} to review</Badge>
      </div>
      {editable && (
        <Button variant="secondary" size="sm">
          <IconPencil /> Edit
        </Button>
      )}
    </div>
  )
}
export default DeckItem
