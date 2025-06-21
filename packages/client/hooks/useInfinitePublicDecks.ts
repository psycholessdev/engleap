'use client'
import { getPublicDecks } from '@/api'
import { useInfiniteQuery } from '@tanstack/react-query'

const PAGE_SIZE = 15

export const useInfinitePublicDecks = (query: string) => {
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, refetch, status } =
    useInfiniteQuery({
      queryKey: ['public-decks'],
      queryFn: async ({ pageParam = 0 }) => {
        return await getPublicDecks(query, pageParam, PAGE_SIZE)
      },
      getNextPageParam: (lastPage, allPages) => {
        // If last page has fewer than PAGE_SIZE, no more data
        return lastPage.length < PAGE_SIZE ? undefined : allPages.flat().length
      },
    })

  const publicDecks = data?.pages.flat() ?? []

  return {
    publicDecks,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    refetch,
    status,
  }
}
