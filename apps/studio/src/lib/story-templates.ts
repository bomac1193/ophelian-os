// Nexus Story Templates - Universal Story Types
// Derived from pre-colonial African sources and validated through post-colonial literature

export interface Phase {
  name: string;
  description: string;
  order: number;
}

export interface StoryTemplate {
  id: string;
  name: string;
  question: string;
  description: string;
  motion: string;
  primaryEnergy: 'ascending' | 'descending' | 'cyclical' | 'lateral' | 'static';
  temperature: 'hot' | 'cool' | 'crossroads';
  phases: Phase[];
  compatibleSecondary: string[];
  shadowType: string;
  ancientSources: string[];
  modernExamples: string[];
}

export interface StoryArcConfiguration {
  primaryType: string;
  secondaryType?: string;
  shadowType?: string;
  customPhases?: Phase[];
  temperature?: 'hot' | 'cool' | 'crossroads';
  currentPhase?: number;
}

export const storyTemplates: StoryTemplate[] = [
  {
    id: "origin",
    name: "Origin",
    question: "Where did this come from?",
    description: "Stories of beginnings, creation, and the recovery of erased pasts. How worlds, communities, or selves came into being.",
    motion: "Emergence",
    primaryEnergy: "ascending",
    temperature: "cool",
    phases: [
      { name: "Void/Chaos", description: "The state before creation — formlessness, potential", order: 1 },
      { name: "Spark/Word", description: "The initiating act — separation, naming, first movement", order: 2 },
      { name: "Differentiation", description: "Forms emerge — light from dark, land from water, self from other", order: 3 },
      { name: "Ordering", description: "Laws established — how things will work, what is permitted", order: 4 },
      { name: "Inhabitation", description: "Life enters the created space — the world becomes lived", order: 5 }
    ],
    compatibleSecondary: ["inheritance", "communion", "descent"],
    shadowType: "exile",
    ancientSources: ["Kemetic cosmogony", "Yoruba Odù Ifá", "Sumerian Enuma Elish", "Genesis"],
    modernExamples: ["Ben Okri - The Famished Road (Azaro's spirit-world origin)", "Kamau Brathwaite - Masks (excavating African origins)"]
  },
  {
    id: "descent",
    name: "Descent",
    question: "What must go into the depths?",
    description: "Passage through liminal space, crisis, and dissolution. Entering the abyss — the fourth stage between worlds — and risking annihilation for transformation.",
    motion: "Going down",
    primaryEnergy: "descending",
    temperature: "crossroads",
    phases: [
      { name: "The Summons", description: "Something calls the protagonist downward — crisis, duty, curiosity", order: 1 },
      { name: "The Threshold", description: "Crossing into the liminal zone — leaving the known world", order: 2 },
      { name: "The Abyss", description: "The fourth stage — dissolution, loss of identity, confrontation with chaos", order: 3 },
      { name: "The Ordeal", description: "The deepest point — death, dismemberment, or transformation", order: 4 },
      { name: "The Emergence", description: "Rising transformed — or destroyed — carrying something back", order: 5 }
    ],
    compatibleSecondary: ["sacrifice", "return", "encounter"],
    shadowType: "trickster",
    ancientSources: ["Osiris to Duat", "Inanna's Descent to Kur", "Orpheus in the Underworld", "Soyinka's Fourth Stage"],
    modernExamples: ["Wole Soyinka - The Road", "Wilson Harris - Palace of the Peacock", "Toni Morrison - Beloved"]
  },
  {
    id: "return",
    name: "Return",
    question: "What comes back from absence?",
    description: "Movement toward homeland — physical, spiritual, psychological, or impossible. The diaspora coming home changed. Includes failed returns where home no longer exists.",
    motion: "Coming back",
    primaryEnergy: "cyclical",
    temperature: "cool",
    phases: [
      { name: "The Separation", description: "Being taken away or leaving — the original wound of absence", order: 1 },
      { name: "The Wandering", description: "Time in exile — survival, transformation, longing", order: 2 },
      { name: "The Call", description: "The pull homeward — memory, duty, or destiny", order: 3 },
      { name: "The Journey", description: "The passage back — obstacles, revelations, changed self meeting changed home", order: 4 },
      { name: "The Arrival", description: "Homecoming — recognition, reunion, or discovering home is gone/transformed", order: 5 }
    ],
    compatibleSecondary: ["inheritance", "descent", "communion"],
    shadowType: "exile",
    ancientSources: ["Osiris rising", "Tammuz seasonal return", "Abiku cycle", "Odyssey"],
    modernExamples: ["Aimé Césaire - Notebook of a Return to the Native Land", "Chimamanda Adichie - Americanah", "Derek Walcott - Omeros"]
  },
  {
    id: "liberation",
    name: "Liberation",
    question: "What must be overthrown?",
    description: "Struggle against bondage toward freedom. The collective rising against oppression. Encompasses achieved, ongoing, and frustrated liberation.",
    motion: "Rising against",
    primaryEnergy: "ascending",
    temperature: "hot",
    phases: [
      { name: "The Bondage", description: "The state of oppression — what is endured, what is lost", order: 1 },
      { name: "The Awakening", description: "Consciousness shifts — the oppressed recognize their condition", order: 2 },
      { name: "The Gathering", description: "Collective formation — finding allies, building solidarity", order: 3 },
      { name: "The Struggle", description: "Direct confrontation — sacrifice, setbacks, small victories", order: 4 },
      { name: "The Reckoning", description: "Freedom achieved, frustrated, or ongoing — what comes after", order: 5 }
    ],
    compatibleSecondary: ["sacrifice", "communion", "trickster"],
    shadowType: "encounter",
    ancientSources: ["Horus vs. Set", "Exodus", "Sundiata reclaiming throne"],
    modernExamples: ["Ngũgĩ wa Thiong'o - The Trial of Dedan Kimathi", "Aimé Césaire - A Tempest", "Wole Soyinka - Kongi's Harvest"]
  },
  {
    id: "communion",
    name: "Communion",
    question: "What becomes one?",
    description: "Coming together in community, solidarity, or ritual. Strangers becoming kin. Ubuntu — 'I am because we are.' Includes failed communion where community fractures.",
    motion: "Convergence",
    primaryEnergy: "lateral",
    temperature: "cool",
    phases: [
      { name: "The Isolation", description: "Individuals apart — loneliness, fragmentation, disconnection", order: 1 },
      { name: "The Meeting", description: "First contact between those who will unite — recognition of shared condition", order: 2 },
      { name: "The Bonding", description: "Relationship deepens — trust built, vulnerability shared", order: 3 },
      { name: "The Test", description: "Community faces crisis — will it hold or fracture?", order: 4 },
      { name: "The Union", description: "Communion achieved or failed — new collective identity or dissolution", order: 5 }
    ],
    compatibleSecondary: ["return", "liberation", "sacrifice"],
    shadowType: "exile",
    ancientSources: ["Gilgamesh and Enkidu", "Ubuntu philosophy", "Communal ritual"],
    modernExamples: ["Athol Fugard - Master Harold and the Boys", "Zakes Mda - Ways of Dying", "Derek Walcott - Omeros (communal healing)"]
  },
  {
    id: "encounter",
    name: "Encounter",
    question: "What worlds collide?",
    description: "Contact between cultures, worldviews, or individuals across difference. Colonial first contact; tradition meeting modernity; self confronting the Other. Includes internalized encounter.",
    motion: "Contact",
    primaryEnergy: "lateral",
    temperature: "crossroads",
    phases: [
      { name: "The Separation", description: "Two worlds exist apart — each with its own logic", order: 1 },
      { name: "The Contact", description: "First meeting — curiosity, fear, misunderstanding", order: 2 },
      { name: "The Friction", description: "Worldviews clash — power dynamics emerge, violence or negotiation", order: 3 },
      { name: "The Transformation", description: "Both parties changed — hybridization, domination, or mutual destruction", order: 4 },
      { name: "The Aftermath", description: "Living with consequences — new synthesis or ongoing trauma", order: 5 }
    ],
    compatibleSecondary: ["descent", "inheritance", "trickster"],
    shadowType: "communion",
    ancientSources: ["Enkidu's civilization", "Spirit possession rituals", "Threshold guardian myths"],
    modernExamples: ["Wole Soyinka - Death and the King's Horseman", "Chinua Achebe - Things Fall Apart", "Tsitsi Dangarembga - Nervous Conditions"]
  },
  {
    id: "inheritance",
    name: "Inheritance",
    question: "What is passed down?",
    description: "What moves across generations. Ancestral debt; colonial legacy; transmitted trauma and memory; sacred obligation. The weight — and gift — of what came before.",
    motion: "Transmission",
    primaryEnergy: "cyclical",
    temperature: "cool",
    phases: [
      { name: "The Legacy", description: "What the ancestors left — gifts, debts, unfinished business", order: 1 },
      { name: "The Recipient", description: "The one who inherits — willing or unwilling, aware or ignorant", order: 2 },
      { name: "The Burden", description: "Carrying what was passed down — its weight, its expectations", order: 3 },
      { name: "The Reckoning", description: "Deciding what to do — accept, transform, reject, or be crushed", order: 4 },
      { name: "The Transmission", description: "Passing it forward — what this generation adds or subtracts", order: 5 }
    ],
    compatibleSecondary: ["return", "sacrifice", "origin"],
    shadowType: "liberation",
    ancientSources: ["Horus receiving the Eye", "Ori from Olodumare", "Ancestral curses/blessings"],
    modernExamples: ["Wole Soyinka - The Strong Breed", "Tsitsi Dangarembga - Nervous Conditions", "Toni Morrison - Song of Solomon"]
  },
  {
    id: "sacrifice",
    name: "Sacrifice",
    question: "What must be given up?",
    description: "Something precious surrendered for communal or cosmic benefit. The carrier/scapegoat; martyrdom for liberation; willing self-offering versus imposed victimhood.",
    motion: "Offering",
    primaryEnergy: "descending",
    temperature: "hot",
    phases: [
      { name: "The Need", description: "The community or cosmos requires something — imbalance, pollution, debt", order: 1 },
      { name: "The Selection", description: "Who or what will be sacrificed — chosen, volunteered, or forced", order: 2 },
      { name: "The Preparation", description: "Ritual readying — the sacrifice made sacred, separated from ordinary", order: 3 },
      { name: "The Offering", description: "The act itself — death, loss, or transformation of what is given", order: 4 },
      { name: "The Renewal", description: "What the sacrifice enables — purification, fertility, cosmic order restored", order: 5 }
    ],
    compatibleSecondary: ["descent", "liberation", "inheritance"],
    shadowType: "trickster",
    ancientSources: ["Osiris's death", "Ogun clearing the path", "Tammuz substituting for Inanna", "Scapegoat rituals"],
    modernExamples: ["Wole Soyinka - Death and the King's Horseman", "Wole Soyinka - The Strong Breed", "Ngũgĩ wa Thiong'o - A Grain of Wheat"]
  },
  {
    id: "trickster",
    name: "Trickster",
    question: "What disrupts the order?",
    description: "The cunning figure who breaks boundaries, resists power through wit, and transforms constraints into opportunities. The weak defeating the powerful through intelligence.",
    motion: "Disruption",
    primaryEnergy: "lateral",
    temperature: "hot",
    phases: [
      { name: "The Order", description: "The established system — rules, hierarchies, what seems fixed", order: 1 },
      { name: "The Trickster Appears", description: "The disruptor enters — marginal, underestimated, cunning", order: 2 },
      { name: "The Scheme", description: "The plan forms — exploiting gaps, turning rules against themselves", order: 3 },
      { name: "The Reversal", description: "The trick succeeds — power inverted, the mighty humbled", order: 4 },
      { name: "The New Order", description: "What remains — chaos, new rules, or the trickster moving on", order: 5 }
    ],
    compatibleSecondary: ["liberation", "encounter", "origin"],
    shadowType: "sacrifice",
    ancientSources: ["Eshu/Elegba", "Anansi", "Legba", "Loki (pre-Christianization)"],
    modernExamples: ["Wole Soyinka - The Lion and the Jewel", "Anansi stories across diaspora", "Ben Okri - spirit tricksters in The Famished Road"]
  },
  {
    id: "exile",
    name: "Exile",
    question: "What is permanently displaced?",
    description: "Permanent displacement from homeland without possibility of return. The condition of 'unhomeliness' — inhabiting the gap between worlds. Producing self-knowledge through separation.",
    motion: "Displacement",
    primaryEnergy: "static",
    temperature: "cool",
    phases: [
      { name: "The Expulsion", description: "Forced or chosen departure — what drove the exile out", order: 1 },
      { name: "The Wandering", description: "Movement without destination — searching for a place that doesn't exist", order: 2 },
      { name: "The Unhomeliness", description: "Neither here nor there — rejected by both origin and destination", order: 3 },
      { name: "The Adaptation", description: "Making meaning in displacement — new identity formed in the gap", order: 4 },
      { name: "The Dwelling", description: "Living in exile as permanent condition — not resolution but acceptance", order: 5 }
    ],
    compatibleSecondary: ["encounter", "inheritance", "descent"],
    shadowType: "return",
    ancientSources: ["Cain's wandering", "Babylonian captivity", "Ogun's self-exile"],
    modernExamples: ["V.S. Naipaul - The Enigma of Arrival", "Jamaica Kincaid - A Small Place", "Caryl Phillips - The Atlantic Sound"]
  }
];

// Helper functions
export const getTemplateById = (id: string): StoryTemplate | undefined =>
  storyTemplates.find(t => t.id === id);

export const getCompatibleTemplates = (id: string): StoryTemplate[] => {
  const template = getTemplateById(id);
  if (!template) return [];
  return template.compatibleSecondary
    .map(getTemplateById)
    .filter((t): t is StoryTemplate => t !== undefined);
};

export const getShadowTemplate = (id: string): StoryTemplate | undefined => {
  const template = getTemplateById(id);
  if (!template) return undefined;
  return getTemplateById(template.shadowType);
};

export const getTemplatesByTemperature = (temp: 'hot' | 'cool' | 'crossroads'): StoryTemplate[] =>
  storyTemplates.filter(t => t.temperature === temp);

export const getTemplatesByEnergy = (energy: StoryTemplate['primaryEnergy']): StoryTemplate[] =>
  storyTemplates.filter(t => t.primaryEnergy === energy);

// Temperature colors
export const temperatureColors = {
  hot: { bg: '#ef4444', text: '#fef2f2', border: '#dc2626' },
  cool: { bg: '#3b82f6', text: '#eff6ff', border: '#2563eb' },
  crossroads: { bg: '#8b5cf6', text: '#f5f3ff', border: '#7c3aed' },
};

// Energy icons/symbols
export const energySymbols = {
  ascending: '↑',
  descending: '↓',
  cyclical: '↻',
  lateral: '↔',
  static: '◉',
};
