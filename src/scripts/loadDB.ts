import { DataAPIClient } from "@datastax/astra-db-ts";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import "dotenv/config";
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";

type SimilarityMetric = "cosine" | "euclidean" | "dot_product";

const {
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  GEMINI_API_KEY,
} = process.env;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: GEMINI_API_KEY,
  modelName: "embedding-001"
});

const musicUrls = [
  // News and Reviews
  "https://pitchfork.com",
  "https://www.rollingstone.com/music",
  "https://www.nme.com",
  "https://www.billboard.com",
  "https://consequence.net",

  // Lyrics
  "https://genius.com",
  "https://www.azlyrics.com",
  "https://www.metrolyrics.com",

  "https://developer.spotify.com",
  "https://www.last.fm",
  "https://www.allmusic.com",

  // "https://rateyourmusic.com",
  // "https://www.discogs.com",
  // "https://www.whosampled.com",

  // "https://www.musicbusinessworldwide.com",
  // "https://www.hypebot.com",
  // "https://soundcharts.com/blog",

  // "https://www.ultimate-guitar.com",
  // "https://songexploder.net",
  // "https://bandcamp.com",

  // "https://en.wikipedia.org/wiki/Music",
  // "https://en.wikipedia.org/wiki/History_of_music",
  // "https://en.wikipedia.org/wiki/Music_genre",
  // "https://en.wikipedia.org/wiki/Song",
  // "https://en.wikipedia.org/wiki/Musical_instrument",
  // "https://en.wikipedia.org/wiki/List_of_music_styles",

  // "https://www.digitalmusicnews.com",
  // "https://www.stereogum.com",
  // "https://www.albumoftheyear.org",
  // "https://open.spotify.com",
  // "https://www.musicweek.com",
];

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);

const db = client.db(ASTRA_DB_API_ENDPOINT, { namespace: ASTRA_DB_NAMESPACE });

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 512,
  chunkOverlap: 100,
});

const createCollection = async (
  similarityMetric: SimilarityMetric = "dot_product"
) => {
  const res = await db.createCollection(ASTRA_DB_COLLECTION, {
    vector: {
      dimension: 768,
      metric: similarityMetric,
    },
  });
  console.log(res);
};

const loadSampleData = async () => {
  const collection = await db.collection(ASTRA_DB_COLLECTION);
  for await (const url of musicUrls) {
    const content = await scrapePage(url);
    const chunks = await splitter.splitText(content);
    for (const chunk of chunks) {
      const embedding = await embeddings.embedQuery(chunk);

      
      const res = await collection.insertOne({
        $vector: embedding,
        text: chunk,
      });

      console.log(res);
    }
  }
};

const scrapePage = async (url: string) => {
  const loader = new PuppeteerWebBaseLoader(url, {
    launchOptions: {
      headless: true,
    },
    gotoOptions: {
      waitUntil: "domcontentloaded",
    },
    evaluate: async (page, browser) => {
      const result = await page.evaluate(() => document.body.innerHTML);
      await browser.close();
      return result;
    },
  });
  return (await loader.scrape())?.replace(/<[^>]*>?/gm, "");
};

createCollection().then(() => loadSampleData());
