import {
  OutputSchema as RepoEvent,
  isCommit,
} from './lexicon/types/com/atproto/sync/subscribeRepos'
import { FirehoseSubscriptionBase, getOpsByType } from './util/subscription'
import { hasPronounInText, getPronounFromText } from './lang-parsing/pronouns';
import { getPronounData, getDiscourseData} from './lang-parsing/discourse';

export class FirehoseSubscription extends FirehoseSubscriptionBase {
  async handleEvent(evt: RepoEvent) {
    if (!isCommit(evt)) return

    const ops = await getOpsByType(evt)

    const supportedLanguages = ['en'];

    const postsForSupportedLanguages = ops.posts.creates.filter((post) => supportedLanguages.every((lang) => post?.record?.langs?.includes(lang)));

    // This logs the text of every post off the firehose.
    // Just for fun :)
    // Delete before actually using
    // for (const post of postsForSupportedLanguages) {
    //   console.log(post.record);
    // }

    const postsToDelete = ops.posts.deletes.map((del) => del.uri)
    const postsToCreate = postsForSupportedLanguages
      .filter((create) => hasPronounInText(create?.record?.text))
      .map((create) => {
        // map alf-related posts to a db row
        const pronoun = getPronounFromText(create.record.text);
        const {
          pronounPlacement,
          surroundingWords
        } = getPronounData(create.record.text, pronoun);
        const {
          profanity,
          negation,
          affirmation
        } = getDiscourseData(create.record.text);
        return {
          uri: create.uri,
          cid: create.cid,
          text: create.record.text,
          pronoun,
          pronounPlacement,
          surroundingWords: surroundingWords.toString(),
          profanity,
          negation,
          affirmation,
          indexedAt: new Date().toISOString(),
        }
      });

    for (const post of postsToCreate) {
      console.log(post);
    }
    if (postsToDelete.length > 0) {
      await this.db
        .deleteFrom('post')
        .where('uri', 'in', postsToDelete)
        .execute()
    }
    if (postsToCreate.length > 0) {
      await this.db
        .insertInto('post')
        .values(postsToCreate)
        .onConflict((oc) => oc.doNothing())
        .execute()
    }
  }
}
