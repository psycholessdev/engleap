import React from 'react'
import { Badge } from '@/components/ui/badge'

interface IDeck {
  title: string
  cardsTotalCount: number
  cardsNewCount: number
  cardsDueCount: number
}

const Deck: React.FC<IDeck> = ({ title, cardsTotalCount, cardsNewCount, cardsDueCount }) => {
  return (
    <div className="w-full py-5 border-b-1 border-b-el-outline last:border-b-transparent">
      <div className="flex items-center gap-1">
        <span className="font-ubuntu text-2xl text-white mr-3">{title}</span>
        <Badge>{cardsTotalCount} total</Badge>
        <Badge variant="secondary">{cardsNewCount} new</Badge>
        <Badge variant="secondary">{cardsDueCount} to review</Badge>
      </div>
    </div>
  )
}
export default Deck
