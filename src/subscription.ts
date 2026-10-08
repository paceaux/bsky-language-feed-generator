import {
  OutputSchema as RepoEvent,
  isCommit,
} from './lexicon/types/com/atproto/sync/subscribeRepos'
import { FirehoseSubscriptionBase, getOpsByType } from './util/subscription'
import { hasPronounInText, getPronounFromText } from './lang-parsing/pronouns';
import { getPronounData, getDiscourseData} from './lang-parsing/discourse';

/**
 * Converts an AT URI for a Bluesky post to a https://bsky.app.
 * Found here: https://github.com/bluesky-social/atproto/discussions/2523
 *
 * @param atUri The AT URI of the post.  Must be in the format at://<DID>/<COLLECTION>/<RKEY>
 * @returns The HTTPS URL to view the post on bsky.app, or null if the AT URI is invalid or not a post.
 */
function atUriToBskyAppUrl(atUri: string): string {
  const regex = /^at:\/\/([^/]+)\/([^/]+)\/([^/]+)$/;
  const match = atUri.match(regex);

  if (!match) {
    return ''; // Invalid AT URI format
  }

  const did = match[1];
  const collection = match[2];
  const rkey = match[3];

  if (collection === 'app.bsky.feed.post') {
    return `https://bsky.app/profile/${did}/post/${rkey}`;
  } else {
    return ''; // Not a post record
  }
}

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
          url: atUriToBskyAppUrl(create.uri),
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
