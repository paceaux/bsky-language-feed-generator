# What's this stuff for?

When the app launches, you can see a feed of posts. 

The code in here fetches data from the database so you could view it in a browser

go to something like

`http://localhost:<PORT>/xrpc/app.bsky.feed.getFeedSkeleton?feed=at://did:example:paceaux/app.bsky.feed.generator/<PRONOUN>`

where `<PORT>` is the port you're running the server on and `<PRONOUN>` is the name of the feed generator you want to see.

Because all of the posts are stored in the DB and with the same info, that's why there's a handlerFactory for generating all of them. 