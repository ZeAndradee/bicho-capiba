import { cache } from "react";

const GOOGLE_NEWS_RSS_URL = "https://news.google.com/rss/search";
const NEWS_REVALIDATE_SECONDS = 21600;
const NEWS_MAX_AGE_DAYS = 60;
const NEWS_SIMILARITY_THRESHOLD = 0.5;
const DAY_MS = 24 * 60 * 60 * 1000;
const NEWS_SAME_STORY_WINDOW_MS = 3 * DAY_MS;
const NEWS_TOPICS = [
  "castração",
  "castramóvel",
  "antirrábica",
  "cães e gatos",
  "para adoção",
  "feira de adoção",
  "adoção de animais",
  "adoção de cães",
  "adoção de gatos",
];
const NEWS_EXCLUDED_TERMS = ["castração química", "castra+"];

export interface PetNews {
  id: string;
  title: string;
  source: string;
  sourceUrl: string | null;
  url: string;
  publishedAt: string;
}

const htmlEntities: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&apos;": "'",
  "&nbsp;": " ",
};

const decodeEntities = (value: string) =>
  value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&[a-z]+;/gi, (entity) => htmlEntities[entity] ?? entity)
    .trim();

const getTagContent = (xml: string, tag: string) => {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  return match ? decodeEntities(match[1]) : "";
};

const getTagAttribute = (xml: string, tag: string, attribute: string) =>
  xml.match(new RegExp(`<${tag}[^>]*\\s${attribute}="([^"]*)"`))?.[1] ?? null;

const normalizeText = (value: string) =>
  ` ${value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()} `;

const quoteTerm = (term: string) => (term.includes(" ") ? `"${term}"` : term);

const normalizedTopics = NEWS_TOPICS.map(normalizeText);

interface NewsStory {
  words: Set<string>;
  publishedAt: number;
}

const toStory = (news: PetNews): NewsStory => ({
  words: new Set(
    normalizeText(news.title)
      .split(" ")
      .filter((word) => word.length > 3)
  ),
  publishedAt: new Date(news.publishedAt).getTime(),
});

const isSameStory = (a: NewsStory, b: NewsStory) => {
  if (Math.abs(a.publishedAt - b.publishedAt) > NEWS_SAME_STORY_WINDOW_MS) {
    return false;
  }
  const shared = [...a.words].filter((word) => b.words.has(word)).length;
  return (
    shared / Math.min(a.words.size, b.words.size) >= NEWS_SIMILARITY_THRESHOLD
  );
};

const parseNewsItem = (item: string): PetNews | null => {
  const url = getTagContent(item, "link");
  const rawTitle = getTagContent(item, "title");
  const source = getTagContent(item, "source");
  const publishedAt = new Date(getTagContent(item, "pubDate"));

  if (!url || !rawTitle || Number.isNaN(publishedAt.getTime())) return null;

  const sourceSuffix = ` - ${source}`;
  const title =
    source && rawTitle.endsWith(sourceSuffix)
      ? rawTitle.slice(0, -sourceSuffix.length)
      : rawTitle;

  return {
    id: getTagContent(item, "guid") || url,
    title,
    source: source.replace(/^[-\s]+/, ""),
    sourceUrl: getTagAttribute(item, "source", "url"),
    url,
    publishedAt: publishedAt.toISOString(),
  };
};

export const fetchCityNews = async (
  keywords: string[],
  limit = 6
): Promise<PetNews[]> => {
  const normalizedKeywords = keywords.map(normalizeText);
  const minPublishedAt = new Date(
    Date.now() - NEWS_MAX_AGE_DAYS * DAY_MS
  ).toISOString();
  const params = new URLSearchParams({
    q: `(${NEWS_TOPICS.map(quoteTerm).join(" OR ")}) ${quoteTerm(keywords[0])} when:${NEWS_MAX_AGE_DAYS}d`,
    hl: "pt-BR",
    gl: "BR",
    ceid: "BR:pt-419",
  });

  try {
    const response = await fetch(`${GOOGLE_NEWS_RSS_URL}?${params}`, {
      next: { revalidate: NEWS_REVALIDATE_SECONDS },
    });
    if (!response.ok) {
      throw new Error(`Google News responded with ${response.status}`);
    }

    const xml = await response.text();
    const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];
    const seenStories: NewsStory[] = [];

    return items
      .map(parseNewsItem)
      .filter((news): news is PetNews => {
        if (!news || news.publishedAt < minPublishedAt) return false;
        const lowerTitle = news.title.toLowerCase();
        if (NEWS_EXCLUDED_TERMS.some((term) => lowerTitle.includes(term))) {
          return false;
        }
        const key = normalizeText(news.title);
        return (
          normalizedKeywords.some((keyword) => key.includes(keyword)) &&
          normalizedTopics.some((topic) => key.includes(topic))
        );
      })
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
      .filter((news) => {
        const story = toStory(news);
        if (seenStories.some((seen) => isSameStory(seen, story))) {
          return false;
        }
        seenStories.push(story);
        return true;
      })
      .slice(0, limit);
  } catch (error) {
    console.error("Error fetching city news:", error);
    throw error;
  }
};

export const getCityNews = cache(fetchCityNews);
