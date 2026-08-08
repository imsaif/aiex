import Parser from 'rss-parser';
const p = new Parser({ timeout: 8000 });
const C = [
 ['Apple Newsroom','https://www.apple.com/newsroom/rss-feed.rss'],
 ['Simon Willison','https://simonwillison.net/atom/everything/'],
 ['Adobe Blog','https://blog.adobe.com/en/publish/rss.xml'],
 ['Google Design','https://design.google/feed.xml'],
 ['Stripe Blog','https://stripe.com/blog/feed.rss'],
 ['Intercom','https://www.intercom.com/blog/feed/'],
 ['Airbnb Design','https://airbnb.design/feed/'],
 ['Spotify Design','https://spotify.design/feed'],
 ['Miro','https://miro.com/blog/feed/'],
 ['Canva Newsroom','https://www.canva.com/newsroom/news/feed/'],
 ['Pragmatic Engineer','https://blog.pragmaticengineer.com/rss/'],
 ['Every','https://every.to/feed.xml'],
 ['Interconnects','https://www.interconnects.ai/feed'],
 ['Anthropic','https://www.anthropic.com/rss.xml'],
];
const now=Date.now();
for (const [name,url] of C) {
  try {
    const f = await p.parseURL(url);
    const recent = f.items.filter(i=>{const d=new Date(i.pubDate||i.isoDate||0);return (now-d)/(864e5)<=14;}).length;
    const host = new URL(f.items[0]?.link||url).hostname;
    console.log(`OK    ${name.padEnd(20)} items=${String(f.items.length).padEnd(3)} last14d=${String(recent).padEnd(3)} articleHost=${host}`);
  } catch(e){ console.log(`DEAD  ${name.padEnd(20)} ${String(e.message).slice(0,60)}`); }
}
