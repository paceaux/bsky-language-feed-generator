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

    // feel free to add more languages if we want  to study... more
    // this will excludes posts in english if they aren't expliciltly tagged
    const supportedLanguages = ['en'];
    const postsForSupportedLanguages = ops.posts.creates.filter((post) => supportedLanguages.every((lang) => post?.record?.langs?.includes(lang)));

    const postsToDelete = ops.posts.deletes.map((del) => del.uri)

    // THIS IS THE MAGIC
    // This is takes posts that have been created and puts them in a database
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

        // this object returned here needs to match what you  see in db/schema
        // it also needs to match what you see in db/migrations
        return {
          uri: create.uri,
          cid: create.cid,
          text: create.record.text,
          pronoun,
          pronounPlacement,
          surroundingWords: surroundingWords.toString(), // the database won't support a javascripty array
          profanity,
          negation,
          affirmation,
          indexedAt: new Date().toISOString(),
        }
      });

    // for visualization purposes
    for (const post of postsToCreate) {
      console.log(post);
    }
    
    if (postsToDelete.length > 0) {
      await this.db
        .deleteFrom('post')
        .where('uri', 'in', postsToDelete)
        .execute()
    }

    // This will load the data into the database
    if (postsToCreate.length > 0) {
      await this.db
        .insertInto('post')
        .values(postsToCreate)
        .onConflict((oc) => oc.doNothing())
        .execute()
    }
  }
}
