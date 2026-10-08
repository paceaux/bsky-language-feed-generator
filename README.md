# Social Pronoun Analysis

this is a hijacked version of the ATProto Feed Generator starter kit. It's been modified to provide feeds of posts that contain pronouns. It will export posts to a database and then provide a feed of posts that contain pronouns.

## About the Feed Generator:

Learn more here: https://github.com/bluesky-social/feed-generator

## Setup

1. Clone the repo
2. Run `npm install`
3. Copy and paste the `.env.example` file and rename it to `.env`
4. Fill in the `.env` file with your own values (add your own database value, DID, and port)
5. Run `npm start`

Optionally, if you open this in VSCode, you can run the app by pressing `F5` and it will automatically start the app.

## Modifications

### Getting new insights about the posts

#### First: Start at subscriptions

You care first about what happens in src/subscriptions.ts. This is where the feed generator listens for new posts and then processes them.

#### Second: Look in lang-parsing

All the functionality for analyzing text is there

#### Third: Update the database

update migrations.ts and schema.ts to reflect the new data you want to store

### Adding new "pronouns" (or vocatives, whatever you want to call them)

#### Add the Pronoun to the official list of pronouns

1. Go to `src/lang-parsing/pronouns.ts`
2. Add the pronoun to the `pronounExps` map. (you need to write a regular expression for it and then give the canonical version of it)

```JavaScript
const pronounExps = new Map([
    ['dude', 'du+de'],
    ['bro', 'bro+'],
    ['bruh', 'bru+h+'],
    ['chat', 'cha+t'],
    ['sis', 'si+s'],
    ['fam', 'fa+m'],
    ['gurl', 'gu+[rl]+'],
    ['boi', 'bo+i+' ],
    ['bitch', 'bi+tch'],
    ['queen', 'quee+n+'],
    ['unc', 'u+n+c'],
    ['auntie', 'aunt(ie|y)']
]);
```

Doing this makes sure that the app will actually find a post containing this word and log it in a database.

#### Add the pronoun to the feed pages

1. go to `src/algos` folder and create a new file whose name is `<pronoun>.ts`.
2. Copy-paste the contents from any existing pronoun file and change the name
3. Then import that file ino `src/algos/index.ts`

Doing this will make sure that the feed generator creates a url for that word so that you can browse results if you want. 