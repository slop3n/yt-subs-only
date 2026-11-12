# YouTube Subscriptions Only

A Chrome extension that cleans up the YouTube subscriptions feed
(`youtube.com/feed/subscriptions`) so it shows only new uploads from the channels you
follow, newest first.

- Hides the Shorts shelf and any Shorts mixed into the grid
- Hides the "Most relevant" shelf at the top
- Shows 5 videos per row

The rest of YouTube is left alone, and the extension collects no data.

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

## Releasing

Publishing a GitHub release runs `.github/workflows/publish.yml`, which zips the
extension, uploads it to the Chrome Web Store and submits it for review.

1. Bump `"version"` in `manifest.json` and push.
2. Publish a GitHub release tagged `v<that version>` (e.g. `v1.1.0`). The workflow fails
   if the tag and the manifest version differ.

There is no stored key. The job runs in the `chrome-web-store` environment, which only
`v*` tags may use, and trades GitHub's OIDC token for a 10-minute Google access token
through Workload Identity Federation. Google only accepts tokens from that environment
of this repo.

Variables on the `chrome-web-store` environment:

| Name | Value |
|---|---|
| `CWS_PUBLISHER_ID` | Publisher ID from the Developer Dashboard settings |
| `CWS_EXTENSION_ID` | The extension's ID from the Developer Dashboard |
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | `projects/<number>/locations/global/workloadIdentityPools/github/providers/github` |
| `GCP_SERVICE_ACCOUNT` | Email of the service account linked to the Web Store publisher |

Actions are pinned to commit SHAs; Dependabot keeps them current.
