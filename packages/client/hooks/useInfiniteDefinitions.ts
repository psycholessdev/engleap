'use client'
import { getDefinitionsForCard } from '@/api'
import { useInfiniteQuery } from '@tanstack/react-query'

const PAGE_SIZE = 15

export const useInfiniteDefinitions = (cardId: string) => {
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, refetch, status } =
    useInfiniteQuery({
      queryKey: ['definitions', cardId],
      queryFn: async ({ pageParam = 0 }) => {
        return await getDefinitionsForCard(cardId, pageParam, PAGE_SIZE)
      },
      getNextPageParam: (lastPage, allPages) => {
        // If last page has fewer than PAGE_SIZE, no more data
        return lastPage.length < PAGE_SIZE ? undefined : allPages.flat().length
      },
    })

  // user definitions are prioritized
  const definitions =
    data?.pages.flat().sort((a, b) => (a.source === 'user' && b.source !== 'user' ? -1 : 0)) ?? []

  return {
    definitions,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    refetch,
    status,
  }
}
