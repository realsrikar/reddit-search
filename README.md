# Reddit Search

## Visit

You can visit [realsrikar/reddit-search](https://realsrikar.github.io/reddit-search/) to check out the search.

## Development

- Uses the fetch API for JSON requests
- Does _not_ use jQuery (jQuery in package.json is to avoid errors. Bootstrap requires you install jQuery as a peer dependency.)
- Bootstrap
- Uses Gulp

## Features

- Saves you last query using the localStorage API ([98% U.S. support](https://caniuse.com/#search=localstorage))
- Uses the fetch API for search requests ([85% U.S. support](https://caniuse.com/#search=fetch))

## TODO

- Make this a PWA

  - Cache Resources -- DONE - DISABLED DUE TO ERRORS
  - Custom 404 page
  - manifest.json

- Show user flair
