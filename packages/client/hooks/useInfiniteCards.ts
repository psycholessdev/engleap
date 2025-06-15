'use client'
import { getCardsByDeckId } from '@/api'
import { useInfiniteQuery } from '@tanstack/react-query'

const PAGE_SIZE = 15

export const useInfiniteCards = (deckId: string) => {
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, refetch, status } =
    useInfiniteQuery({
      queryKey: ['cards', deckId],
      queryFn: async ({ pageParam = 0 }) => {
        return await getCardsByDeckId(deckId, pageParam, PAGE_SIZE)
      },
      getNextPageParam: (lastPage, allPages) => {
        // If last page has fewer than PAGE_SIZE, no more data
        return lastPage.length < PAGE_SIZE ? undefined : allPages.flat().length
      },
    })

  const cards = data?.pages.flat() ?? []

  return { cards, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, refetch, status }
}
