import type { DictionaryServiceResult } from '../../types'

export interface IDictionaryService {
  /**
   * A unique name or key for this source, e.g. "merriam-webster-intermediate"
   * Used for logging or storing sourceName in DB.
   */
  readonly sourceName: string

  /**
   * Fetch definitions for the given word from this source.
   * Throws or returns found=false if not found.
   */
  fetchDefinitions(word: string): Promise<DictionaryServiceResult>
}
