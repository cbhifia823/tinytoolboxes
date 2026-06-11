import type { Context } from "hono";

type Mode = "rhymes" | "near" | "synonyms" | "antonyms" | "related";

type DatamuseWord = {
  word: string;
  score?: number;
  tags?: string[];
  numSyllables?: number;
};

const MODE_TO_PARAM: Record<Mode, string> = {
  rhymes: "rel_rhy",
  near: "rel_nry",
  synonyms: "rel_syn",
  antonyms: "rel_ant",
  related: "rel_trg",
};

function normalizeWord(input: string | null): string {
  return (input ?? "").trim().toLowerCase();
}

function normalizeMode(input: string | null): Mode {
  if (input && input in MODE_TO_PARAM) return input as Mode;
  return "rhymes";
}

export default async (c: Context) => {
  const word = normalizeWord(c.req.query("word"));
  const mode = normalizeMode(c.req.query("mode"));

  if (!word) {
    return c.json({ error: "Missing word" }, 400);
  }

  if (word.length > 60) {
    return c.json({ error: "Word is too long" }, 400);
  }

  const url = new URL("https://api.datamuse.com/words");
  url.searchParams.set(MODE_TO_PARAM[mode], word);
  url.searchParams.set("md", "p");
  url.searchParams.set("max", "30");

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    return c.json({ error: "Failed to fetch word data" }, 502);
  }

  const items = (await response.json()) as DatamuseWord[];
  const results = items.map((item) => ({
    word: item.word,
    score: item.score ?? 0,
    tags: item.tags ?? [],
    syllables: item.numSyllables ?? null,
    partOfSpeech: item.tags?.find((tag) => ["n", "v", "adj", "adv", "pron", "prep", "conj", "det", "p", "u"].includes(tag)) ?? null,
  }));

  return c.json({
    query: word,
    mode,
    count: results.length,
    results,
  });
};
