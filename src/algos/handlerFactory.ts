import { QueryParams } from '../lexicon/types/app/bsky/feed/getFeedSkeleton'
import { AppContext } from '../config'
import {  getPronounData, getDiscourseData  } from '../lang-parsing/discourse'

export function getPronounHandler(pronoun: string) {
    const handler = async (ctx: AppContext, params: QueryParams) => {
        let builder = ctx.db
            .selectFrom('post')
            .selectAll()
            .where('pronoun', '=', pronoun)
            .orderBy('indexedAt', 'desc')
            .orderBy('cid', 'desc')
            .limit(params.limit)

        if (params.cursor) {
            const timeStr = new Date(parseInt(params.cursor, 10)).toISOString()
            builder = builder.where('post.indexedAt', '<', timeStr)
        }
        const res = await builder.execute()

        const feed = res.map((row) => {
            return {
                post: row.uri,
                pronoun: row.pronoun,
                pronounData: getPronounData(row.text, row.pronoun),
                discourseData: getDiscourseData(row.text),
                text: row.text
            };
         });

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

    return handler;
}