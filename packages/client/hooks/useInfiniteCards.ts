'use client'
import { getCardsByDeckId } from '@/api'
import { useInfiniteQuery } from '@tanstack/react-query'
import { PAGE_SIZE } from '@/consts'
import { Card } from '@/types'

export const useInfiniteCards = (deckId: string, querySentence?: string) => {
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, refetch, status } =
    useInfiniteQuery({
      queryKey: ['cards', deckId, querySentence],
      queryFn: async ({ pageParam = 0 }) => {
        return await getCardsByDeckId(deckId, querySentence, pageParam, PAGE_SIZE)
      },
      getNextPageParam: (lastPage, allPages) => {
        // If last page has fewer than PAGE_SIZE, no more data
        return lastPage.length < PAGE_SIZE ? undefined : allPages.flat().length
      },
    })

  const cards: Card[] = data?.pages.flat() ?? []

  return { cards, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, refetch, status }
}
