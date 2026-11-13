# YouTube Subscriptions Only

A Chrome extension that cleans up the YouTube subscriptions feed
(`youtube.com/feed/subscriptions`) so it shows only new uploads from the channels you
follow, newest first.

- Hides the Shorts shelf and any Shorts mixed into the grid
- Hides the "Most relevant" shelf at the top
- Shows 5 videos per row

The rest of YouTube is left alone, and the extension collects no data.

## Install

Get it from the [Chrome Web Store](https://chromewebstore.google.com/detail/hcokmffldjeocmpjoplbnichgidihknl).

## Install from source

1. Clone this repo.
2. Open `chrome://extensions` and turn on **Developer mode**.
3. Click **Load unpacked** and pick the repo folder.
4. Reload the subscriptions page.

## How it works

- `hide.css` does most of the work. Every rule is scoped to
  `ytd-browse[page-subtype="subscriptions"]`, because YouTube keeps other pages alive
  in the DOM. It hides every section/shelf in the feed (the chronological uploads are
  the plain grid items), hides grid items that link to `/shorts/`, and forces
  `--ytd-rich-grid-items-per-row` to 5.
- `hide.js` is a fallback for when YouTube renames its elements: it hides any block in
  the feed whose heading is "Shorts" or "Most relevant".

The content script matches all of `youtube.com` because YouTube navigates between pages
without reloading, so the script has to be present before you reach the subscriptions
feed.

To change the number of videos per row, edit the `5` in `hide.css`.
