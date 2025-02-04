import { QueryParams } from '../lexicon/types/app/bsky/feed/getFeedSkeleton'
import { AppContext } from '../config'
import {getWords} from '../lang-parsing/tokenizers';
import { getSurroundingWords, getPronounPlacement, getDiscourseData } from '../lang-parsing/discourse'


// max 15 chars
export const shortname = 'bro'

export const handler = async (ctx: AppContext, params: QueryParams) => {
  let builder = ctx.db
    .selectFrom('post')
    .selectAll()
    .where('pronoun', '=', 'bro')
    .orderBy('indexedAt', 'desc')
    .orderBy('cid', 'desc')
    .limit(params.limit)

  if (params.cursor) {
    const timeStr = new Date(parseInt(params.cursor, 10)).toISOString()
    builder = builder.where('post.indexedAt', '<', timeStr)
  }
  const res = await builder.execute()

  const feed = res.map((row) => ({
      post: row.uri,
      pronoun: row.pronoun,
      placement: getPronounPlacement(row.text, row.pronoun),
      adjacentWords: getSurroundingWords(getWords(row.text), row.pronoun),
      data: getDiscourseData(row.text),
      length: getWords(row.text).length,
      text: row.text,
    }))

  let cursor: string | undefined
  const last = res.at(-1)
  if (last) {
    cursor = new Date(last.indexedAt).getTime().toString(10)
  }

  return {
    cursor,
    feed,
  }
}
