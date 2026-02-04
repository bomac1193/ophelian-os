/**
 * Imprint Alignment Stress Test
 *
 * Generates N characters via generateLCOSCharacter, runs generateCharenomePreview
 * on each, and validates that:
 *
 * 1. Orisha aligns with heritage + order (mapping tables honored)
 * 2. Sephira aligns with archetype (TAROT_TO_SEPHIRA mapping)
 * 3. Camino belongs to the selected Orisha's camino list
 * 4. Hot/cool axis matches Orisha energy map
 * 5. Trajectory matches Orisha trajectory map
 * 6. Voice type is consistent with gender + Orisha energy
 * 7. Sample tweet comes from the correct Orisha template pool
 * 8. Secondary influences exclude the primary Orisha
 * 9. Name is non-empty
 * 10. Alignment metadata (heritage, order, archetype) matches input
 */

// We import from the source files directly since this is a script
// Run with: npx tsx apps/studio/src/tests/imprint-alignment-stress.ts

import { generateLCOSCharacter, type LCOSGeneratedCharacter } from '../../../../packages/oripheon/src/index';

// We need to import charenome functions — they live in the studio app
// We'll inline the relevant mapping tables and functions here for validation
// but call generateCharenomePreview from the actual source

// ============================================================================
// MAPPING TABLES (copied from charenome.ts for validation)
// ============================================================================

const HERITAGE_ORISHA_AFFINITY: Record<string, { primary: string[]; secondary: string[] }> = {
  yoruba: {
    primary: ['Èṣù', 'Ògún', 'Ọ̀ṣun', 'Yemọja', 'Ṣàngó', 'Ọya', 'Obàtálá', 'Ọ̀rúnmìlà', 'Ọ̀ṣọ́ọ̀sì', 'Ọ̀sanyìn'],
    secondary: [],
  },
  igbo: {
    primary: ['Obàtálá', 'Ọ̀rúnmìlà', 'Ọ̀sanyìn', 'Èṣù'],
    secondary: ['Ògún', 'Ọya'],
  },
  norse: {
    primary: ['Ògún', 'Ṣàngó', 'Ọya', 'Obàtálá'],
    secondary: ['Èṣù', 'Ọ̀ṣọ́ọ̀sì'],
  },
  celtic: {
    primary: ['Ọ̀ṣun', 'Ọ̀sanyìn', 'Ọya', 'Obàtálá'],
    secondary: ['Ògún', 'Èṣù'],
  },
  arabic: {
    primary: ['Èṣù', 'Ọ̀rúnmìlà', 'Ọya'],
    secondary: ['Ṣàngó', 'Obàtálá'],
  },
  european: {
    primary: ['Ọ̀ṣun', 'Ṣàngó', 'Ògún', 'Ọ̀rúnmìlà'],
    secondary: ['Yemọja', 'Èṣù'],
  },
};

const ORDER_TO_ORISHA: Record<string, { primary: string; alternates: string[] }> = {
  trickster: { primary: 'Èṣù', alternates: ['Ọya'] },
  angel: { primary: 'Obàtálá', alternates: ['Ọ̀rúnmìlà', 'Yemọja'] },
  demon: { primary: 'Ṣàngó', alternates: ['Ọya', 'Ògún'] },
  jinn: { primary: 'Èṣù', alternates: ['Ọya', 'Ṣàngó'] },
  human: { primary: 'Ọ̀ṣọ́ọ̀sì', alternates: ['Ògún', 'Ọ̀ṣun'] },
  titan: { primary: 'Ògún', alternates: ['Ṣàngó', 'Obàtálá'] },
  fae: { primary: 'Ọ̀ṣun', alternates: ['Ọ̀sanyìn', 'Yemọja'] },
  yokai: { primary: 'Ọya', alternates: ['Èṣù', 'Ọ̀sanyìn'] },
  elemental: { primary: 'Ṣàngó', alternates: ['Ọya', 'Yemọja'] },
  nephilim: { primary: 'Ògún', alternates: ['Ṣàngó', 'Obàtálá'] },
  archon: { primary: 'Ọ̀rúnmìlà', alternates: ['Obàtálá'] },
  dragonkin: { primary: 'Ṣàngó', alternates: ['Ògún', 'Ọya'] },
  construct: { primary: 'Ògún', alternates: ['Ọ̀rúnmìlà'] },
  eldritch: { primary: 'Ọya', alternates: ['Èṣù', 'Ọ̀rúnmìlà'] },
};

const TAROT_TO_SEPHIRA: Record<string, string> = {
  fool: 'Kether',
  magician: 'Binah',
  high_priestess: 'Binah',
  empress: 'Binah',
  emperor: 'Chokmah',
  hierophant: 'Chokmah',
  lovers: 'Tiphareth',
  chariot: 'Geburah',
  strength: 'Geburah',
  hermit: 'Chesed',
  wheel_of_fortune: 'Chesed',
  justice: 'Geburah',
  hanged_man: 'Daath',
  death: 'Daath',
  temperance: 'Tiphareth',
  devil: 'Hod',
  tower: 'Netzach',
  star: 'Netzach',
  moon: 'Yesod',
  sun: 'Tiphareth',
  judgement: 'Malkuth',
  world: 'Malkuth',
};

const ORISHA_TO_SEPHIRA: Record<string, string> = {
  'Obàtálá': 'Kether',
  'Ọ̀rúnmìlà': 'Chokmah',
  'Yemọja': 'Binah',
  'Ọ̀sanyìn': 'Chesed',
  'Ṣàngó': 'Geburah',
  'Ọ̀ṣọ́ọ̀sì': 'Tiphareth',
  'Ọ̀ṣun': 'Netzach',
  'Ògún': 'Hod',
  'Èṣù': 'Yesod',
  'Ọya': 'Daath',
};

const ORISHA_CAMINOS: Record<string, string[]> = {
  'Èṣù': ['Èṣù Laroye', 'Èṣù Elegguá', 'Èṣù Alagwanna', 'Èṣù Bi'],
  'Ògún': ['Ògún Arere', 'Ògún Onile', 'Ògún Chibiriki'],
  'Ọ̀ṣun': ['Ọ̀ṣun Ibu Kolé', 'Ọ̀ṣun Yeye Morí', 'Ọ̀ṣun Ibu Añá'],
  'Yemọja': ['Yemọja Asesu', 'Yemọja Okute', 'Yemọja Mayalewo'],
  'Ṣàngó': ['Ṣàngó Obakoso', 'Ṣàngó Alafin', 'Ṣàngó Obalube'],
  'Ọya': ['Ọya Yansa', 'Ọya Oriri', 'Ọya Funke'],
  'Obàtálá': ['Obàtálá Ayáguna', 'Obàtálá Oshanlá', 'Obàtálá Orishanla'],
  'Ọ̀rúnmìlà': ['Ọ̀rúnmìlà Eleri Ipin', 'Ọ̀rúnmìlà Ibikeje'],
  'Ọ̀ṣọ́ọ̀sì': ['Ọ̀ṣọ́ọ̀sì Odde', 'Ọ̀ṣọ́ọ̀sì Ibualama'],
  'Ọ̀sanyìn': ['Ọ̀sanyìn Aguanile', 'Ọ̀sanyìn Ode'],
};

const HOT_COOL_MAP: Record<string, number> = {
  'Ṣàngó': 0.9,
  'Ògún': 0.7,
  'Ọ̀ṣọ́ọ̀sì': 0.5,
  'Èṣù': 0.0,
  'Ọya': 0.1,
  'Obàtálá': -0.8,
  'Yemọja': -0.7,
  'Ọ̀ṣun': -0.5,
  'Ọ̀rúnmìlà': -0.6,
  'Ọ̀sanyìn': -0.4,
};

const TRAJECTORY_MAP: Record<string, string> = {
  'Obàtálá': 'transcendence',
  'Ọ̀rúnmìlà': 'integration',
  'Yemọja': 'integration',
  'Ọ̀sanyìn': 'emergence',
  'Ṣàngó': 'ascent',
  'Ọ̀ṣọ́ọ̀sì': 'ascent',
  'Ọ̀ṣun': 'emergence',
  'Ògún': 'crisis',
  'Èṣù': 'crisis',
  'Ọya': 'descent',
};

const ORISHA_VOICE_ENERGY: Record<string, 'hot' | 'cool' | 'crossroads'> = {
  'Èṣù': 'crossroads',
  'Ògún': 'hot',
  'Ọ̀ṣun': 'cool',
  'Yemọja': 'cool',
  'Ṣàngó': 'hot',
  'Ọya': 'crossroads',
  'Obàtálá': 'cool',
  'Ọ̀rúnmìlà': 'cool',
  'Ọ̀ṣọ́ọ̀sì': 'hot',
  'Ọ̀sanyìn': 'cool',
};

const TWEET_TEMPLATES: Record<string, string[]> = {
  'Èṣù': [
    "the door you fear to open is the one you've already walked through. which version of you remembers?",
    "they call it luck. i call it knowing which crossroads to stand at.",
    "every message you send arrives at two destinations. the question is: which one did you intend?",
    "chaos isn't the absence of order—it's order refusing to explain itself.",
  ],
  'Ògún': [
    "built it with my hands. burned the blueprint. the work is the only truth.",
    "they asked for permission. i was already finished.",
    "iron doesn't negotiate. neither do i.",
    "the path exists because i cut it. stand aside or be cleared.",
  ],
  'Ọ̀ṣun': [
    "honey catches what force cannot. remember who taught you that.",
    "my reflection knows secrets yours is too afraid to show.",
    "abundance isn't given—it's attracted. what are you radiating?",
    "the river doesn't rush. it arrives when the landscape surrenders.",
  ],
  'Yemọja': [
    "the tide remembers every shore it has ever touched. so do i.",
    "i carried you before you knew how to carry yourself. that debt has no expiration.",
    "depth isn't measured in distance—it's measured in what you protect.",
    "come to the water when you've forgotten your own reflection.",
  ],
  'Ṣàngó': [
    "JUSTICE DOESN'T WHISPER. it arrives with thunder and you will know its name.",
    "my fire doesn't ask permission to illuminate. stand in the light or explain your shadows.",
    "they wanted a king. they got a storm with a crown.",
    "the throne isn't taken—it's manifested through righteous fire.",
  ],
  'Ọya': [
    "transformation isn't gentle. neither am i.",
    "the wind carries every secret you thought you buried. i'm listening.",
    "death is just change that refuses to apologize. i relate.",
    "clear the space or i will. your attachment isn't my problem.",
  ],
  'Obàtálá': [
    "in silence, creation speaks loudest. have you learned to listen yet?",
    "purity isn't absence—it's presence of what truly matters.",
    "i shaped worlds from stillness. what have you shaped from noise?",
    "white holds all colors. remember that before you judge what seems empty.",
  ],
  'Ọ̀rúnmìlà': [
    "your future called. it left a message you won't understand until it's already happened.",
    "the pattern was set before your ancestors dreamed. you're just now noticing.",
    "wisdom isn't knowing the answer. it's remembering you already knew the question.",
    "fate doesn't negotiate, but it does send messengers. i am one.",
  ],
  'Ọ̀ṣọ́ọ̀sì': [
    "i don't chase. i position. then i release.",
    "the target reveals itself to those who know how to wait.",
    "precision is patience that learned when to strike.",
    "they see the arrow. i see the entire trajectory before i draw.",
  ],
  'Ọ̀sanyìn': [
    "the forest knows your name. it told me when you stopped listening.",
    "every leaf holds a secret. every root holds a cure. every wound holds a teacher.",
    "they call it medicine. i call it conversation with what grows.",
    "healing isn't fixing what's broken—it's remembering what was never broken.",
  ],
};

// ============================================================================
// HERITAGE LABEL → KEY NORMALIZATION
// ============================================================================

const HERITAGE_LABEL_TO_KEY: Record<string, string> = {
  yoruba: 'yoruba',
  igbo: 'igbo',
  arabic: 'arabic',
  european: 'european',
  celtic: 'celtic',
  norse: 'norse',
};

// ============================================================================
// IMPORT CHARENOME PREVIEW GENERATOR
// ============================================================================

// Dynamic import since charenome.ts uses @/ path aliases — we'll call it directly
import { generateCharenomePreview, generateSampleTweet } from '../lib/charenome.js';

// ============================================================================
// STRESS TEST
// ============================================================================

interface TestResult {
  seed: number;
  name: string;
  heritage: string;
  order: string;
  archetype: string;
  system: string;
  orisha: string;
  sephira: string;
  camino: string;
  failures: string[];
}

function validateAlignment(char: LCOSGeneratedCharacter): TestResult {
  const preview = generateCharenomePreview(char);
  const failures: string[] = [];

  const heritage = char.heritage?.toLowerCase() || 'yoruba';
  const heritageKey = HERITAGE_LABEL_TO_KEY[heritage] || heritage;
  const order = char.order?.name?.toLowerCase() || 'human';
  const archetype = char.arcana?.archetype?.toLowerCase().replace(/ /g, '_') || 'fool';
  const system = char.arcana?.system?.toLowerCase() || 'tarot';

  // 1. ORISHA ALIGNMENT — must be reachable from heritage + order
  const heritageAffinity = HERITAGE_ORISHA_AFFINITY[heritageKey];
  const orderMapping = ORDER_TO_ORISHA[order];

  if (heritageAffinity && orderMapping) {
    const allReachable = new Set([
      ...heritageAffinity.primary,
      ...heritageAffinity.secondary,
      orderMapping.primary,
      ...orderMapping.alternates,
    ]);
    if (!allReachable.has(preview.orisha)) {
      failures.push(
        `ORISHA_UNREACHABLE: "${preview.orisha}" not reachable from heritage="${heritageKey}" + order="${order}". ` +
        `Reachable: [${[...allReachable].join(', ')}]`
      );
    }
  }

  // 2. SEPHIRA ALIGNMENT — must match archetype mapping (or Orisha fallback)
  if (system === 'tarot') {
    const expectedSephira = TAROT_TO_SEPHIRA[archetype];
    if (expectedSephira && preview.sephira !== expectedSephira) {
      // Check Orisha fallback
      const orishaFallback = ORISHA_TO_SEPHIRA[preview.orisha];
      if (preview.sephira !== orishaFallback) {
        failures.push(
          `SEPHIRA_MISMATCH: archetype="${archetype}" → expected "${expectedSephira}", ` +
          `orisha fallback="${orishaFallback}", got "${preview.sephira}"`
        );
      }
    }
  } else {
    // Non-tarot systems use Orisha fallback
    const orishaFallback = ORISHA_TO_SEPHIRA[preview.orisha];
    if (orishaFallback && preview.sephira !== orishaFallback) {
      // Not a hard failure — selectAlignedSephira tries TAROT_TO_SEPHIRA first
      // and only falls back to Orisha. Non-tarot archetypes might still hit
      // TAROT_TO_SEPHIRA if they share names (e.g., "magician" in jung)
    }
  }

  // 3. CAMINO — must belong to the Orisha's camino list (or be empty)
  if (preview.camino) {
    const validCaminos = ORISHA_CAMINOS[preview.orisha] || [];
    if (validCaminos.length > 0 && !validCaminos.includes(preview.camino)) {
      failures.push(
        `CAMINO_INVALID: "${preview.camino}" not in ${preview.orisha}'s caminos: [${validCaminos.join(', ')}]`
      );
    }
  }

  // 4. HOT/COOL AXIS — must match Orisha energy map
  const expectedHotCool = HOT_COOL_MAP[preview.orisha];
  if (expectedHotCool !== undefined && preview.hotCoolAxis !== expectedHotCool) {
    failures.push(
      `HOTCOOL_MISMATCH: orisha="${preview.orisha}" → expected ${expectedHotCool}, got ${preview.hotCoolAxis}`
    );
  }

  // 5. TRAJECTORY — must match Orisha trajectory map
  const expectedTrajectory = TRAJECTORY_MAP[preview.orisha];
  if (expectedTrajectory && preview.trajectory !== expectedTrajectory) {
    failures.push(
      `TRAJECTORY_MISMATCH: orisha="${preview.orisha}" → expected "${expectedTrajectory}", got "${preview.trajectory}"`
    );
  }

  // 6. VOICE TYPE — must be consistent with gender + Orisha energy
  const orishaEnergy = ORISHA_VOICE_ENERGY[preview.orisha];
  const gender = char.gender || 'neutral';
  if (orishaEnergy && preview.voice) {
    const voiceType = preview.voice.type;
    if (gender === 'masculine') {
      if (orishaEnergy === 'hot' && voiceType !== 'baritone') {
        failures.push(`VOICE_MISMATCH: masculine + hot orisha → expected "baritone", got "${voiceType}"`);
      }
      if (orishaEnergy === 'cool' && voiceType !== 'tenor') {
        failures.push(`VOICE_MISMATCH: masculine + cool orisha → expected "tenor", got "${voiceType}"`);
      }
    } else if (gender === 'feminine') {
      if (orishaEnergy === 'hot' && voiceType !== 'mezzo-soprano') {
        failures.push(`VOICE_MISMATCH: feminine + hot orisha → expected "mezzo-soprano", got "${voiceType}"`);
      }
      if (orishaEnergy === 'cool' && voiceType !== 'soprano') {
        failures.push(`VOICE_MISMATCH: feminine + cool orisha → expected "soprano", got "${voiceType}"`);
      }
    } else {
      // Neutral
      if (orishaEnergy === 'hot' && voiceType !== 'tenor') {
        failures.push(`VOICE_MISMATCH: neutral + hot orisha → expected "tenor", got "${voiceType}"`);
      }
      if (orishaEnergy === 'cool' && voiceType !== 'countertenor') {
        failures.push(`VOICE_MISMATCH: neutral + cool orisha → expected "countertenor", got "${voiceType}"`);
      }
    }
    // crossroads = random, no strict check
  }

  // 7. SAMPLE TWEET — must come from the correct Orisha template pool
  const orishaTemplates = TWEET_TEMPLATES[preview.orisha];
  if (orishaTemplates && preview.sampleTweet) {
    if (!orishaTemplates.includes(preview.sampleTweet)) {
      failures.push(
        `TWEET_MISMATCH: sampleTweet not in ${preview.orisha}'s template pool. ` +
        `Got: "${preview.sampleTweet.slice(0, 60)}..."`
      );
    }
  }

  // 8. SECONDARY INFLUENCES — must not include primary Orisha
  if (preview.secondaryInfluences) {
    for (const inf of preview.secondaryInfluences) {
      if (inf.orisha === preview.orisha) {
        failures.push(
          `SECONDARY_CONTAINS_PRIMARY: secondary influence "${inf.orisha}" equals primary orisha`
        );
      }
      if (inf.strength < 0 || inf.strength > 1) {
        failures.push(
          `SECONDARY_STRENGTH_OOB: "${inf.orisha}" strength ${inf.strength} out of [0,1] range`
        );
      }
    }
  }

  // 9. NAME — must be non-empty
  if (!char.name || char.name.trim() === '') {
    failures.push('NAME_EMPTY: character name is empty');
  }

  // 10. ALIGNMENT METADATA — heritage/order/archetype must match
  if (preview.alignment) {
    if (preview.alignment.heritage !== heritage) {
      failures.push(
        `ALIGNMENT_HERITAGE: expected "${heritage}", got "${preview.alignment.heritage}"`
      );
    }
    if (preview.alignment.order !== order) {
      failures.push(
        `ALIGNMENT_ORDER: expected "${order}", got "${preview.alignment.order}"`
      );
    }
    if (preview.alignment.archetype !== archetype) {
      failures.push(
        `ALIGNMENT_ARCHETYPE: expected "${archetype}", got "${preview.alignment.archetype}"`
      );
    }
  }

  return {
    seed: char.seed,
    name: char.name,
    heritage: heritageKey,
    order,
    archetype,
    system,
    orisha: preview.orisha,
    sephira: preview.sephira,
    camino: preview.camino,
    failures,
  };
}

// ============================================================================
// RUN
// ============================================================================

const NUM_ITERATIONS = 500;
const results: TestResult[] = [];
const failedResults: TestResult[] = [];
const failureCounts: Record<string, number> = {};

console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`  IMPRINT ALIGNMENT STRESS TEST — ${NUM_ITERATIONS} iterations`);
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

for (let i = 0; i < NUM_ITERATIONS; i++) {
  const char = generateLCOSCharacter({});
  const result = validateAlignment(char);
  results.push(result);

  if (result.failures.length > 0) {
    failedResults.push(result);
    for (const f of result.failures) {
      const key = f.split(':')[0]!;
      failureCounts[key] = (failureCounts[key] || 0) + 1;
    }
  }
}

// ============================================================================
// REPORT
// ============================================================================

const passCount = results.length - failedResults.length;
const passRate = ((passCount / results.length) * 100).toFixed(1);

console.log(`RESULTS: ${passCount}/${results.length} passed (${passRate}%)\n`);

if (Object.keys(failureCounts).length > 0) {
  console.log(`FAILURE BREAKDOWN:`);
  const sorted = Object.entries(failureCounts).sort((a, b) => b[1] - a[1]);
  for (const [key, count] of sorted) {
    console.log(`  ${key}: ${count} failures (${((count / results.length) * 100).toFixed(1)}%)`);
  }
  console.log('');
}

// Show first 10 failures in detail
if (failedResults.length > 0) {
  console.log(`FIRST ${Math.min(10, failedResults.length)} FAILURES:\n`);
  for (const r of failedResults.slice(0, 10)) {
    console.log(`  seed=${r.seed} | "${r.name}"`);
    console.log(`    heritage=${r.heritage} order=${r.order} archetype=${r.archetype} (${r.system})`);
    console.log(`    → orisha=${r.orisha} sephira=${r.sephira} camino=${r.camino}`);
    for (const f of r.failures) {
      console.log(`    ✗ ${f}`);
    }
    console.log('');
  }
}

// Distribution analysis
console.log(`\nDISTRIBUTION ANALYSIS:`);

const orishaDist: Record<string, number> = {};
const sephiraDist: Record<string, number> = {};
const trajectoryDist: Record<string, number> = {};
const energyDist: Record<string, number> = {};

for (const r of results) {
  orishaDist[r.orisha] = (orishaDist[r.orisha] || 0) + 1;
  sephiraDist[r.sephira] = (sephiraDist[r.sephira] || 0) + 1;
}

console.log(`\n  Orisha distribution:`);
for (const [k, v] of Object.entries(orishaDist).sort((a, b) => b[1] - a[1])) {
  const bar = '█'.repeat(Math.round(v / results.length * 40));
  console.log(`    ${k.padEnd(12)} ${String(v).padStart(4)} ${bar}`);
}

console.log(`\n  Sephira distribution:`);
for (const [k, v] of Object.entries(sephiraDist).sort((a, b) => b[1] - a[1])) {
  const bar = '█'.repeat(Math.round(v / results.length * 40));
  console.log(`    ${k.padEnd(12)} ${String(v).padStart(4)} ${bar}`);
}

// Sample voice check — show 5 random examples
console.log(`\nSAMPLE VOICE SPOT CHECK (5 random):`);
const spotChecks = results
  .filter((_, i) => i % Math.floor(results.length / 5) === 0)
  .slice(0, 5);

for (const r of spotChecks) {
  const char = generateLCOSCharacter({ seed: r.seed });
  const preview = generateCharenomePreview(char);
  console.log(`\n  "${char.name}" (seed=${r.seed})`);
  console.log(`    ${char.heritage} ${char.order.name} · ${char.arcana.archetype} (${char.arcana.system})`);
  console.log(`    → ${preview.orisha} · ${preview.sephira} · ${preview.trajectory}`);
  console.log(`    voice: ${preview.voice.type} (${ORISHA_VOICE_ENERGY[preview.orisha] || '?'} energy)`);
  console.log(`    tweet: "${preview.sampleTweet.slice(0, 80)}${preview.sampleTweet.length > 80 ? '...' : ''}"`);
}

console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
if (failedResults.length === 0) {
  console.log(`  ALL ${results.length} CHARACTERS PASSED ALIGNMENT CHECKS`);
} else {
  console.log(`  ${failedResults.length} CHARACTERS FAILED — SEE DETAILS ABOVE`);
}
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

process.exit(failedResults.length > 0 ? 1 : 0);
