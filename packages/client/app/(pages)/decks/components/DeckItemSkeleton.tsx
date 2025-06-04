import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

const DeckItemSkeleton: React.FC<{ key?: string | number }> = () => {
  return <Skeleton className="w-full h-18 py-5 px-3 rounded-2xl" />
}
export default DeckItemSkeleton
