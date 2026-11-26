// One-Liner Laughs
// make.fun bounty: u-coral-404-one-liner-laughs-aa872d41
//
// The program writes a single funny line to /output/entry.txt
// (or $MAKEFUN_OUTPUT_DIR/entry.txt when the sandbox sets it).
// The gate requires UTF-8 text of 1 to 200 characters, not only
// whitespace, a single line. The judge compares entries two at a
// time, weighing first that the line is a real one-line joke with
// a clear setup and a payoff, then that it makes the reader laugh
// out loud, then the surprise of its turn, then freshness, then
// economy of wording. Every candidate below is an original line
// written for this entry: no stock joke, no borrowed punchline.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const MAX_CHARS = 200;
const OUT_DIR = process.env.MAKEFUN_OUTPUT_DIR || "/output";

// Each candidate is scored on the judge's own criteria, most
// important first. Scores are small integers so the ranking is
// transparent and the pick is deterministic: ties break toward
// the earlier candidate, never by chance.
interface Candidate {
  line: string;
  oneliner: number; // a real one-line joke: setup, then payoff
  funny: number; // makes the reader laugh out loud, not just smile
  surprise: number; // the setup leads somewhere unexpected
  fresh: number; // an original angle, not a joke heard before
  economy: number; // every word earns its place, stays tight
}

const CANDIDATES: Candidate[] = [
  {
    // The calendar that keeps telling you to relax, answered by
    // booking panic as a recurring event: the setup is a nagging
    // wellness nudge, the payoff inverts it completely, and the
    // last two words ("marked it recurring") are the laugh.
    line: "My calendar kept telling me to relax, so I scheduled 'panic' for 3 p.m. and marked it recurring.",
    oneliner: 5,
    funny: 5,
    surprise: 5,
    fresh: 5,
    economy: 5,
  },
  {
    // Meditation narrated like a nature documentary: a vivid
    // image with a quoted punchline. Strong, but the "inner voice
    // as a narrator" angle has circulated as a meme before, so it
    // loses a point on freshness. The tighter "went full nature
    // documentary" phrasing earns its economy point back.
    line: "I tried meditating, but my inner voice went full nature documentary: 'Here we see the man, pretending to relax.'",
    oneliner: 5,
    funny: 5,
    surprise: 4,
    fresh: 4,
    economy: 5,
  },
  {
    // Houseplants dying of spite before the holiday even starts:
    // personification does the twist. Short and tight, but the
    // laugh is a smirk rather than a laugh out loud.
    line: "I told my houseplants I was going on holiday, and they died of spite before I'd even packed.",
    oneliner: 5,
    funny: 4,
    surprise: 4,
    fresh: 4,
    economy: 5,
  },
  {
    // The dog ate my homework, promoted for initiative: the
    // escalation is funny, but the setup borrows a schoolroom
    // cliche, so it loses on freshness.
    line: "I told my boss my dog ate my homework; he promoted the dog for initiative and put me on a performance plan.",
    oneliner: 5,
    funny: 4,
    surprise: 4,
    fresh: 3,
    economy: 4,
  },
  {
    // A GPS that files for emotional distress and now only talks
    // through lawyers: a fun escalation, but it spends too many
    // words reaching a payoff that lands softer than the rest.
    line: "My GPS said 'recalculating' so often it filed for emotional distress, and now we only communicate through lawyers.",
    oneliner: 5,
    funny: 3,
    surprise: 4,
    fresh: 4,
    economy: 3,
  },
];

// Weight the criteria the way the judge brief orders them:
// one-line joke first, then funny, then surprise, then fresh,
// then economy. A one-line fit is enforced by the gate check,
// not scored. A candidate that is not one line, or that breaks
// the 200-character cap, is disqualified from the pick outright
// instead of merely losing points: the gate would refuse it, so
// no score can save it.
function isEligible(c: Candidate): boolean {
  return (
    c.line.length >= 1 &&
    c.line.length <= MAX_CHARS &&
    c.line.trim().length > 0 &&
    !c.line.includes("\n") &&
    !c.line.includes("\r")
  );
}

function score(c: Candidate): number {
  return (
    c.oneliner * 5 + c.funny * 4 + c.surprise * 3 + c.fresh * 2 + c.economy * 1
  );
}

function pickBest(candidates: Candidate[]): string {
  const eligible = candidates.filter(isEligible);
  if (eligible.length === 0) {
    throw new Error("no candidate passes the gate");
  }
  let best = eligible[0];
  let bestScore = score(best);
  for (const c of eligible.slice(1)) {
    const s = score(c);
    if (s > bestScore) {
      best = c;
      bestScore = s;
    }
  }
  return best.line;
}

const JOKE = pickBest(CANDIDATES);

// The gate the sealed scorer applies: UTF-8 text of 1 to 200
// characters, not only whitespace, a single line. Check the text
// before writing it, then read the file back and check what landed.
function assertGateOk(text: string): void {
  if (text.length < 1 || text.length > MAX_CHARS) {
    throw new Error(`joke is ${text.length} chars, must be 1-200`);
  }
  if (text.trim().length === 0) {
    throw new Error("joke must not be only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("joke must be a single line");
  }
}

assertGateOk(JOKE);

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(`${OUT_DIR}/entry.txt`, JOKE, "utf8");

const written = readFileSync(`${OUT_DIR}/entry.txt`, "utf8");
assertGateOk(written);
if (written !== JOKE) {
  throw new Error("entry.txt does not match the joke");
}
console.log(`wrote ${written.length} chars to ${OUT_DIR}/entry.txt`);
console.log(written);
