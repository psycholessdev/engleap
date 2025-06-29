'use client'
import { getMyDecks } from '@/api'
import { useInfiniteQuery } from '@tanstack/react-query'
import { PAGE_SIZE } from '@/consts'
import { DeckWithCardInfo } from '@/types'

export const useInfiniteDecks = () => {
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, refetch, status } =
    useInfiniteQuery({
      queryKey: ['my-decks'],
      queryFn: async ({ pageParam = 0 }) => {
        return await getMyDecks(pageParam, PAGE_SIZE)
      },
      getNextPageParam: (lastPage, allPages) => {
        // If last page has fewer than PAGE_SIZE, no more data
        return lastPage.length < PAGE_SIZE ? undefined : allPages.flat().length
      },
    })

  const decks: DeckWithCardInfo[] = data?.pages.flat() ?? []

  return { decks, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, refetch, status }
}
