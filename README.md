# Social Pronoun Analysis

this is a hijacked version of the ATProto Feed Generator starter kit. It's been modified to provide a feed of posts that contain pronouns. It will export posts to a database and then provide a feed of posts that contain pronouns.


## About the Feed Generator:
Learn more here: https://github.com/bluesky-social/feed-generator

## Setup

1. Clone the repo
2. Run `npm install`
3. Copy and paste the `.env.example` file and rename it to `.env`
4. Fill in the `.env` file with your own values (add your own database value, DID, and port)
5. Run `npm start`

Optionally, if you open this in VSCode, you can run the app by pressing `F5` and it will automatically start the app.

## Changing stuff:

### Getting new insights about the posts

First: Start at subscriptions.
You care first about what happens in src/subscriptions.ts. This is where the feed generator listens for new posts and then processes them.

Second: Look in lang-parsing
All the functionality for analyzing text is there

Third: Update the database
update migrations.ts and schema.ts to reflect the new data you want to store

### Getting new insights about the feed (optional)

Go to The algos folder.
All _pronoun_ related stuff is managed by algos/handlerFactory.ts, so stuff isn't duplicated a super bunch



