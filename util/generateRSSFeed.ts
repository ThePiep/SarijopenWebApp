import RSS from 'rss';
import fs from 'fs';
import { getChatGPTArtikel } from './chatGPT';

const feedOptions = {
  title: 'Blog posts | RSS Feed',
  description: 'Welcome to this blog posts!',
  site_url: process.env.WEBSITE_URL ?? '',
  feed_url: `${process.env.WEBSITE_URL}/rss.xml`,
  // image_url: `${process.env.WEBSITE_URL}/logo.png`,
  pubDate: new Date(),
  copyright: `All rights reserved ${new Date().getFullYear()}, Ibas`,
};

export const generateRssFeed = async () => {
  const feed = new RSS(feedOptions);
  const content = await getChatGPTArtikel();
  if (!content) {
    return;
  }

  feed.item({
    title: content.titel,
    description: content.inhoud,
    url: `${process.env.WEBSITE_URL}/quotes`,
    date: new Date(),
  });

  fs.writeFileSync('./public/rss.xml', feed.xml({ indent: true }));
};
