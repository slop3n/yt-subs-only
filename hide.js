// Fallback for when YouTube renames its shelf elements: hide any block in the
// subscriptions feed whose heading is "Shorts" or "Most relevant". The CSS file
// does the real work; this only catches what its selectors miss.
(() => {
  const TITLES = new Set(["shorts", "most relevant"]);
  const CONTAINERS =
    "ytd-rich-section-renderer, ytd-item-section-renderer, ytd-shelf-renderer, ytd-rich-shelf-renderer, ytd-reel-shelf-renderer";

  function onSubscriptions() {
    return location.pathname === "/feed/subscriptions";
  }

  function sweep() {
    document.documentElement.classList.toggle("yt-subs-only", onSubscriptions());
    if (!onSubscriptions()) return;

    const feed = document.querySelector('ytd-browse[page-subtype="subscriptions"]');
    if (!feed) return;

    for (const heading of feed.querySelectorAll("#title, #title-text, h2, [role='heading']")) {
      const text = heading.textContent.trim().toLowerCase();
      if (!TITLES.has(text)) continue;
      const block = heading.closest(CONTAINERS);
      if (block) block.classList.add("yt-subs-only-hidden");
    }
  }

  let queued = false;
  const observer = new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      sweep();
    });
  });

  function start() {
    observer.observe(document.documentElement, { childList: true, subtree: true });
    sweep();
  }

  window.addEventListener("yt-navigate-finish", sweep);
  if (document.documentElement) start();
  else document.addEventListener("DOMContentLoaded", start, { once: true });
})();
