'use client'
import { getDefinitionsForCard } from '@/api'
import { useInfiniteQuery } from '@tanstack/react-query'
import { PAGE_SIZE } from '@/consts'
import { Definition } from '@/types'

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

  const definitions: Definition[] = data?.pages.flat() ?? []

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
