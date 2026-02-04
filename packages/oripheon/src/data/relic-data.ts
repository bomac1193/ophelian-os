/**
 * Relic Generator Data
 * 9 object categories, era data, sacred numbers, modern symbolism, tweet templates, pseudonyms
 * Ported from Slayt characterGenerator.js
 */

// ============================================================================
// 9 RELIC OBJECT CATEGORY POOLS
// ============================================================================

export const RELIC_OBJECTS = {
  natural: [
    'a petrified tree branch',
    'a river stone that hums',
    'a feather from an unknown bird',
    'a seed that never grows',
    'a jar of perpetual rain',
    'a fossilized flower',
    'a vial of moonlight',
    'a splinter of lightning-struck oak',
    'roots that move when unobserved',
    'a shell that echoes distant seas',
    'a pinecone that smells of futures',
    'a leaf that changes with moods',
    'a bone from something that never lived',
    'an acorn containing a whole forest',
    'a thorn from the first rose',
  ],
  furniture: [
    'an IKEA chair that whispers assembly instructions',
    'a Victorian settee that remembers its sitters',
    'a three-legged stool from a witch\'s kitchen',
    'a mirror that shows yesterday',
    'a grandfather clock frozen at a significant hour',
    'a doorknob from a house that no longer exists',
    'a chandelier crystal that catches impossible light',
    'a drawer that opens to different rooms',
    'a wardrobe key to nowhere',
    'a rocking chair that moves on its own',
    'a lamp that casts shadows of the future',
    'a table that sets itself for ghosts',
  ],
  fashion: [
    'Harrods stilettos that never touch the ground',
    'a Chanel scarf woven with sigils',
    'vintage Levi\'s from a parallel 1955',
    'a Hermès bag that holds more than possible',
    'opera gloves that remember every hand they\'ve touched',
    'a top hat that tips itself to the worthy',
    'a monocle that sees through lies',
    'cufflinks made from meteorite',
    'a silk tie that tightens around betrayers',
    'a brooch containing a trapped whisper',
    'boots that have walked through dreams',
    'a coat that adjusts to any climate or dimension',
    'vintage spurs from a wheelbarrow that crossed the Styx',
    'a veil worn at seven weddings and three funerals',
    'a belt buckle shaped like a closed eye',
  ],
  strange: [
    'a compass that points to regret',
    'a music box playing songs not yet written',
    'a photograph of someone you\'ll meet',
    'a candle that burns memories',
    'a typewriter that finishes your sentences',
    'a radio tuned to frequencies between stations',
    'a pocket watch that counts down to something',
    'a snow globe containing a real blizzard',
    'a telephone connected to the recently departed',
    'a locket holding a heartbeat',
    'a book whose pages rewrite themselves',
    'a chess piece that moves between games',
    'a vinyl record of silence',
    'a bottle of preserved argument',
    'a jar of someone else\'s tears',
    'a key that fits locks not yet made',
  ],
  mundane_twisted: [
    'a coffee mug that\'s always the wrong temperature',
    'a pen that writes in extinct languages',
    'a pair of glasses that show auras',
    'a wallet containing currency from dead empires',
    'a phone that receives calls from alternate selves',
    'a lighter that ignites emotions',
    'an umbrella that repels more than rain',
    'a wristwatch that tracks lifespans',
    'a notebook of automatic writing',
    'a USB drive containing deleted realities',
    'a thermos of liquid time',
    'a pillbox of crystallized decisions',
  ],
  symbolic: [
    'a broom that sweeps away sins',
    'a tambourine with a bell that speaks prophecy',
    'a hand mirror stolen from a sibyl',
    'a chalice that turns water to oaths',
    'an hourglass filled with someone else\'s time',
    'a spindle that weaves fate',
    'a scale that weighs intentions',
    'a lantern lit by a dying star',
    'a bell that rings for the unborn',
    'a quill dipped in finality',
    'a mortar and pestle that grinds memories',
    'a sickle that harvests words',
    'a thurible that burns regrets',
    'an ankh that unlocks the dead',
    'a crystal ball showing roads not taken',
    'a tarot card that changes its meaning',
  ],
  stolen_from_beings: [
    'a flute stolen from a satyr',
    'a mirror pried from an archon\'s throne',
    'a thread from the Fates\' loom',
    'a coin from Charon\'s collection',
    'a feather from Thoth\'s wing',
    'ink from a demon\'s contract',
    'a tooth freely given by a dragon',
    'a fingernail from a sleeping titan',
    'a tear crystallized from an angel',
    'a whisper caught from a jinn',
    'a shadow severed from a trickster',
    'a scale from Anubis\' balance',
    'a string from Orpheus\' lyre',
    'a page torn from the Akashic records',
    'dust from the Sandman\'s pouch',
    'a splinter from Yggdrasil',
  ],
  tools: [
    'a hammer that builds and destroys equally',
    'a needle that sews souls',
    'scissors that cut ties',
    'a chisel that carves truth from stone',
    'a saw that cuts through time',
    'an awl that pierces veils',
    'pliers that grip the intangible',
    'a level that measures worth',
    'a file that smooths rough karma',
    'a trowel that buries secrets',
    'an axe that felled the world tree\'s branch',
    'a wrench that adjusts reality',
  ],
  vessels: [
    'an amphora containing the last echo',
    'a gourd holding liquid dreams',
    'a cauldron that stirs itself',
    'a teapot that pours what you need',
    'a basin for washing away names',
    'a censer burning forgotten prayers',
    'a flask of distilled starlight',
    'an urn of ashes that speak',
    'a bottle with a message from yourself',
    'a grail stained with something holy',
    'a pitcher that never empties of sorrow',
    'a box that shouldn\'t be opened',
  ],
};

export type RelicCategory = keyof typeof RELIC_OBJECTS;

export const RELIC_CATEGORIES: RelicCategory[] = [
  'natural', 'furniture', 'fashion', 'strange', 'mundane_twisted',
  'symbolic', 'stolen_from_beings', 'tools', 'vessels',
];

// ============================================================================
// 12 RELIC ORIGIN STRINGS
// ============================================================================

export const RELIC_ORIGINS = [
  'inherited from a stranger who knew their name',
  'found in a place that shouldn\'t exist',
  'won in a game against something ancient',
  'gifted by a god in disguise',
  'pulled from a dream that refused to end',
  'discovered the moment they were born',
  'traded for a memory they can\'t recall',
  'materialized during their first death',
  'stolen from a museum of impossible things',
  'left behind by their future self',
  'grown from their shadow',
  'assembled from fragments of coincidence',
];

// ============================================================================
// RELIC ACTIONS
// ============================================================================

export const RELIC_ACTIONS = [
  'gifted by',
  'stolen from',
  'traded with',
  'won from',
  'inherited from',
  'found beside',
  'rescued from',
  'bargained from',
  'freed by',
  'entrusted by',
  'abandoned by',
  'surrendered by',
  'blessed by',
  'cursed by',
  'forgotten by',
];

// ============================================================================
// ARCHAIC ERA DATA
// ============================================================================

export const RELIC_ERA_ARCHAIC = {
  objects: [
    'clay tablet, language dead',
    'bronze mirror showing elsewhere',
    'amphora, still sealed, still humming',
    'the spindle—yes, that one',
    'a forgotten king\'s crown of thorns',
    'the first weaver\'s needle, threaded',
    'saint\'s skull, hollowed into chalice',
    'prophet\'s tooth, roots and all',
    'flint knife. It remembers.',
    'scroll. It unrolls forever.',
    'shroud. It refuses.',
    'wax seal broken between gods',
    'incense still burning from Eden',
    'quill plucked mid-flight from an angel',
    'pilgrimage staff, walked itself to hell',
    'one astrolabe, stars extinct',
    'mosaic tile: Babylon, 2nd dynasty',
    'canopic jar (contents: present)',
    'codex, dragonhide binding, unread',
    'sundial casting yesterday\'s shadow',
    'loom shuttle trailing silver fate',
    'singing bowl that won\'t stop',
    'the third key (first two: missing)',
    'half a clay mask, expression unknown',
    'rope from a bell that rang once',
    'altar stone, still warm',
    'funeral coins for a living man',
    'wine turned to something else',
    'door hinge from a temple that walked away',
    'bone dice, loaded toward doom',
    'hourglass sand flowing upward',
    'torch that casts darkness',
  ],
  givers: [
    'a blind god',
    'a temple priestess',
    'a dying oracle',
    'a hermit saint',
    'a wandering prophet',
    'a deposed pharaoh',
    'a sibyl in her cave',
    'a keeper of sacred flames',
    'a monk who took vows of impossibility',
    'a witch burned seven times',
    'a knight who broke every oath',
    'a queen who married death',
    'a scribe of forbidden texts',
    'an alchemist seeking the stone',
    'a flagellant walking to Jerusalem',
    'a virgin sacrificed to volcanoes',
    'a shaman of extinct peoples',
    'a druid at the last grove',
    'a pope who never existed',
    'an emperor buried alive',
  ],
  contexts: [
    'at a horse race between dead kings',
    'in a library that burns every midnight',
    'at the crossroads where three empires fell',
    'in a garden grown from tears',
    'at a masquerade where no one wore faces',
    'during an auction of forgotten things',
    'in a cathedral built by spiders',
    'at the wedding of two storms',
    'during a trial held in dreams',
    'at a feast where the food ate back',
    'in a temple before it was ruined',
    'during the fall of a great city',
    'at the signing of a cursed treaty',
    'in a crypt beneath forgotten mountains',
    'during the last mass of a dead religion',
    'at a coronation attended by ghosts',
    'in a scriptorium copying lies',
    'during an eclipse that lasted years',
    'at a ritual that should never have worked',
    'in the tomb of something still alive',
  ],
};

// ============================================================================
// MODERN ERA DATA
// ============================================================================

export const RELIC_ERA_MODERN = {
  objects: [
    'half a lottery ticket, winning',
    'three AA batteries, one dead',
    'someone\'s left AirPod, still playing',
    'the wrong half of a torn photo',
    'your childhood teddy bear\'s missing eye',
    'a stranger\'s house key that fits your door',
    'the phone number you were too afraid to call',
    'a charger that fits nothing you own',
    'an app icon for something uninstalled',
    'a password written down for an account that doesn\'t exist',
    'IKEA furniture missing one screw',
    'a Polaroid developing into the future',
    'Nokia 3310, one voicemail, never played',
    'Tupperware still holding last Tuesday',
    'vape smoke spelling warnings',
    'USB stick: DO NOT OPEN',
    'dropped car keys to somewhere else',
    'cracked phone screen showing different cracks each time',
    'expired coupon for eternal youth',
    'a laptop charger borrowed and never returned',
    'gift card with exactly enough for nothing',
    'library book seventeen years overdue',
    'one Croc, men\'s size 11, immortal',
    'CCTV footage of yesterday\'s tomorrow',
    'parking meter frozen at 0:00',
    'suspiciously heavy fidget spinner',
    'uncomfortably warm doorknob',
    'a perfectly normal lamp (wrong)',
    'a Roomba that witnessed something',
    'Ring doorbell footage of you arriving home (you weren\'t there)',
    'Kindle full of books with your name as author',
    'a QR code that scans you back',
    'receipt for a purchase you don\'t remember making',
    'lanyard for CONFERENCE 2019 (it\'s always 2019)',
    'Post-it note in your handwriting you didn\'t write',
    'plastic bag orbiting a streetlight since 2003',
    'yoga mat that unrolls into somewhere else',
  ],
  givers: [
    'a one-armed butcher',
    'a tattoo artist with no skin',
    'a barista who remembers every order',
    'an Uber driver between worlds',
    'a security guard at an empty mall',
    'a dental hygienist who speaks in tongues',
    'a personal trainer for the deceased',
    'a wedding DJ playing at funerals',
    'a real estate agent selling haunted properties',
    'a life coach for the already damned',
    'an influencer with zero followers',
    'a food blogger who eats memories',
    'a yoga instructor bent wrong',
    'a podcaster interviewing the dead',
    'a dog walker whose dogs are invisible',
    'a locksmith who opens wrong doors',
    'a notary public for demonic contracts',
    'a Lyft driver to the underworld',
    'a telemarketer calling from beyond',
    'an IT guy fixing reality',
    'a crossing guard at impossible intersections',
    'a plumber unclogging the river Styx',
  ],
  contexts: [
    'at a Black Friday sale at 3am',
    'in a parking garage that goes down forever',
    'during a gender reveal that summoned something',
    'at an IKEA after closing time',
    'in a 24-hour laundromat at the wrong hour',
    'during a Zoom call with no participants',
    'at a self-checkout that became sentient',
    'in an Airbnb with too many rooms',
    'during an HOA meeting about the occult',
    'at a drive-through between dimensions',
    'in a WeWork for dead startups',
    'during a TED talk on unspeakable things',
    'at an escape room with no exit',
    'in a Spirit Halloween that never closed',
    'during a podcast recording in a void',
    'at a farmer\'s market selling intangibles',
    'in a co-working space for demons',
    'during an open mic night in purgatory',
    'at a CrossFit box for the damned',
    'in a CVS at the end of time',
  ],
};

// ============================================================================
// TIMELESS ERA DATA — quantum trickster fusion of high/low, old/new,
// luxury/hood, sacred/profane
// ============================================================================

export const RELIC_ERA_TIMELESS = {
  objects: [
    // High-low culture collision
    'one-legged Primark mannequin wearing a Byzantine halo',
    'Hermès birkin made of council estate radiator covers',
    'Fabergé egg containing a Greggs steak bake, still warm',
    'Versace durag stitched from the Shroud of Turin',
    'Louis Vuitton carrier bag from Argos, receipt from Babylon',
    'Nike Air Max 95s resoled with marble from the Parthenon',
    'Gucci belt with a buckle forged at Vulcan\'s anvil',
    'Supreme hoodie embroidered by Cistercian monks',
    'Balenciaga crocs blessed by a Vodou priestess',
    'Cartier sovereign ring with a stone from the Kaaba',
    // Sacred mundane horror
    'Starbucks loyalty card, infinite stars, accepted in purgatory',
    'Tesco Clubcard with points accrued across seven incarnations',
    'Deliveroo bag that delivers offerings to dead ancestors',
    'JD Sports receipt signed by Hermes (the god, not the courier)',
    'B&M Bargains candle that burns with foxfire since the Crusades',
    'Aldi middle aisle find: one (1) Holy Grail, slightly chipped',
    'Sports Direct mug containing the wine-dark sea',
    'a Wetherspoons menu written in Enochian',
    // Objects between eras
    'obsidian iPhone case that answers prayers on silent mode',
    'cathedral window made of vape juice and stained glass',
    'medieval tapestry depicting a McDonald\'s drive-through at 3am',
    'clay tablet with cuneiform TikTok comments',
    'pharaoh\'s sceptre doubling as a Dyson Airwrap',
    'Viking longship steering oar repurposed as an e-scooter handlebar',
    'Roman mosaic of someone\'s Uber rating: 1 star',
    'bando smoke alarm that detects spiritual presence',
    // Quantum trickster objects
    'betting slip from Paddy Power, odds on the apocalypse',
    'Oyster card valid in the underworld (Zone 6+)',
    'NHS prescription for immortality, out of stock',
    'council tax bill for a dimension that doesn\'t exist yet',
    'Sainsbury\'s Taste the Difference ambrosia, nectar of the gods (reduced)',
    'parking ticket issued by an archangel, unpaid',
    'an ASOS return label for your mortal body',
    'a Shein haul from the court of Versailles',
    'Poundland tiara that crowns actual monarchs',
    'a £1 fish from the fishmonger who sold Jonah\'s whale',
  ],
  givers: [
    'a Deliveroo rider on Sleipnir',
    'a market trader selling relics out of a chariot',
    'a shaman who also does Avon',
    'an oracle moonlighting as a TikTok psychic',
    'a grime MC channeling dead poets',
    'a bouncer at the gates of Valhalla',
    'a nail tech who paints sigils',
    'a barber who cuts fate\'s threads',
    'a corner-shop owner descended from pharaohs',
    'a fishmonger whose ancestors fished the Styx',
    'a kebab shop mystic, third eye and chilli sauce',
    'a bookies cashier who reads the bones',
    'a market-stall prophet with a megaphone',
    'a nan who remembers before the world started',
    'a bus driver on the night route through limbo',
    'a postman delivering letters between epochs',
    'a charity shop volunteer sorting through centuries',
    'a park warden guarding sacred groves in Zone 4',
    'a lollipop lady at the crossroads of destiny',
    'a chip shop philosopher with oil-burn stigmata',
  ],
  contexts: [
    'at a car boot sale in a ley-line car park',
    'in the Primark changing rooms during a blood moon',
    'at a council estate bonfire summoning old gods',
    'during a rave in a deconsecrated cathedral',
    'at a Wetherspoons pub quiz on sacred geometry',
    'in a Turkish barbershop between worlds',
    'during a hen do that accidentally became a ritual',
    'at a Lidl middle aisle sale where time folded',
    'in a nail salon where the UV lamps open portals',
    'during a wake that turned into an exorcism',
    'at a jumble sale in a mosque built over a henge',
    'in the queue at Greggs when the veil thinned',
    'at a youth club on the ruins of a Roman bath',
    'during a block party on consecrated ground',
    'in a laundrette whose spin cycle bends spacetime',
    'at a bingo hall built over a plague pit',
    'during Sports Day at an academy on a burial mound',
    'at a chip shop at the edge of a fairy ring',
    'in a betting shop where all the odds are prophecy',
    'during a freestyle cypher in a stone circle',
  ],
};

// ============================================================================
// SACRED NUMBER MAP
// ============================================================================

export const ARCHETYPE_NUMBERS: Record<string, number[]> = {
  // Tarot - based on card numbers
  fool: [0, 22], magician: [1, 11], high_priestess: [2, 13], empress: [3, 12],
  emperor: [4, 40], hierophant: [5, 14], lovers: [6, 15], chariot: [7, 77],
  strength: [8, 11], hermit: [9, 99], wheel_of_fortune: [10, 1000], justice: [11, 8],
  hanged_man: [12, 3], death: [13, 4], temperance: [14, 7], devil: [15, 6],
  tower: [16, 1], star: [17, 8], moon: [18, 9], sun: [19, 1], judgement: [20, 7], world: [21, 4],
  // Jung
  innocent: [1, 7], sage: [3, 9], explorer: [5, 12], outlaw: [6, 13],
  hero: [1, 8], lover: [2, 6], jester: [0, 3], everyman: [4, 10],
  caregiver: [2, 9], ruler: [1, 4], creator: [3, 7],
  // Kabbalah - sephirot positions
  kether: [1, 620], chokmah: [2, 73], binah: [3, 67], chesed: [4, 72],
  geburah: [5, 216], tiphareth: [6, 1081], netzach: [7, 148], hod: [8, 15],
  yesod: [9, 80], malkuth: [10, 496], thaumiel: [11, 2], ghagiel: [12, 3],
  satariel: [13, 60], gamchicoth: [14, 4], golachab: [15, 5], thagirion: [16, 6],
  harab_serapel: [17, 7], samael: [18, 8], gamaliel: [19, 9], lilith: [20, 480],
  // Orisha - sacred numbers
  obatala: [8, 16], ogun: [3, 7], shango: [6, 12], yemoja: [7, 21],
  oshun: [5, 25], eshu: [3, 21], oya: [9, 99], orunmila: [16, 4],
  osanyin: [1, 7], babalu_aye: [17, 13], olokun: [7, 9], aganju: [6, 9],
  // Norse - associated numbers
  odin: [9, 3], thor: [3, 8], freya: [13, 7], loki: [0, 3],
  tyr: [1, 11], heimdall: [9, 27], baldur: [12, 1], hel: [9, 13],
  frigg: [12, 7], njord: [9, 11], skadi: [3, 9], idun: [11, 7],
};

// ============================================================================
// MODERN SYMBOLISM CATEGORIES (5 brand sets)
// ============================================================================

export const MODERN_SYMBOLISM = {
  brands_sacred: [
    'Hermès aura', 'Cartier halo', 'Chanel frequency', 'Dior wavelength',
    'Tiffany resonance', 'Rolex alignment', 'Louis Vuitton coordinates',
    'Gucci vibration', 'Prada dimension', 'Balenciaga axis',
  ],
  brands_mundane: [
    'Asda receipt', 'Tesco meal deal', 'Lidl middle aisle', 'Aldi special buy',
    'Primark tag', 'Poundland prophecy', 'Greggs wrapper', 'Sports Direct mug',
    'Iceland frozen moment', 'B&M bargain', 'Home Bargains blessing',
  ],
  brands_universal: [
    'McDonald\'s golden arc', 'Starbucks siren call', 'KFC secret scripture',
    'Subway footlong path', 'Domino\'s chain reaction', 'Uber surge',
    'Amazon Prime timeline', 'Netflix queue', 'Spotify algorithm',
    'TikTok loop', 'Instagram filter', 'WhatsApp blue tick',
  ],
  street_culture: [
    'bando frequencies', 'trap house coordinates', 'block cipher',
    'ends theorem', 'mandem energy', 'roadman resonance', 'yard blessing',
    'corner shop oracle', 'chicken shop chronicles', 'off-license liturgy',
    'estate psalm', 'postcode prophecy', 'link up ritual', 'peng alignment',
  ],
  sacred_mundane_mix: [
    'Starbucks communion', 'IKEA pilgrimage', 'Amazon prayer',
    'Deliveroo deliverance', 'Uber rapture', 'Netflix nirvana',
    'Tesco enlightenment', 'Lidl transcendence', 'Aldi awakening',
    'McDonald\'s sacrament', 'Greggs gospel', 'Primark parable',
  ],
};

export type ModernSymbolismCategory = keyof typeof MODERN_SYMBOLISM;

export const MODERN_SYMBOLISM_CATEGORIES: ModernSymbolismCategory[] = [
  'brands_sacred', 'brands_mundane', 'brands_universal',
  'street_culture', 'sacred_mundane_mix',
];

// ============================================================================
// SAMPLE TWEET TEMPLATES (5 tones)
// ============================================================================

export const MODERN_RELIC_TWEETS = {
  cryptic: [
    'they not ready for what I know about the self-checkout at 3am',
    'can\'t explain it but the parking meter understood me',
    'some of y\'all never been followed home by a plastic bag and it shows',
    'the receipt said thank you but it meant something else',
    'that IKEA lamp saw what you did in 2019',
    'you think the QR code scans you? lol',
    'why did the vape smoke spell my government name',
    'the Roomba knows. the Roomba always knew.',
    'told my alexa my plans and now the algorithm is different',
  ],
  unhinged_wisdom: [
    'normalize leaving your body at the Tesco self checkout',
    'the McDonald\'s ice cream machine works in dimensions you can\'t perceive',
    'that USB stick has your search history from a different timeline',
    'Greggs sausage roll is just a vessel. you know this.',
    'the corner shop ting knows your destiny fr',
    'why is no one talking about what happens in the Lidl middle aisle at exactly 3:33am',
    'the Uber driver ain\'t human and we all know it',
  ],
  profound_mundane: [
    'we live in a society where the charger that fits nothing is the most honest object in your house',
    'your password manager contains prayers you forgot you wrote',
    'that "seen" message at 2am altered the timeline',
    'every sports direct mug holds exactly one universe',
    'the voicemail you never played is louder than the one you did',
    'poundland prophecy: everything has a price but nothing has value',
    'the bando isn\'t a place it\'s a state of being and your ring doorbell agrees',
  ],
  chaotic_energy: [
    'bestie the yoga mat unrolls both ways and only one leads back',
    'no thoughts just the parking meter frozen at 0:00',
    'me: normal day. the cracked phone screen: not quite luv',
    'they put a spirit halloween in the void???? oh this is sick actually',
    'the lanyard says 2019 but the conference hasn\'t happened yet?',
    'POV: the fidget spinner gets heavier every full moon',
    'it\'s giving haunted airpod playing frequencies only dogs hear',
  ],
  street_mystic: [
    'fam the chicken shop lights different at certain hours trust me',
    'man said the corner shop uncle is a prophet and I\'m starting to believe it',
    'the offy knows things about the ends that google maps don\'t',
    'certain blocks got different physics and that\'s just facts',
    'the mandem don\'t talk about what happened at that bus stop',
    'your postcode is a spell whether you know it or not',
    'trap house mathematics: the bag never weighs what it should',
  ],
};

export type TweetTone = keyof typeof MODERN_RELIC_TWEETS;

export const TWEET_TONES: TweetTone[] = [
  'cryptic', 'unhinged_wisdom', 'profound_mundane',
  'chaotic_energy', 'street_mystic',
];

// ============================================================================
// PSEUDONYM PATTERNS
// ============================================================================

export const RELIC_PSEUDONYMS = [
  // Single syllable - primal
  'Vex', 'Nul', 'Kex', 'Zyn', 'Qor', 'Jax', 'Pyx', 'Wren', 'Flux', 'Crux',
  'Hex', 'Lux', 'Rex', 'Vox', 'Nix', 'Pax', 'Dux', 'Fex', 'Mox', 'Tux',
  // Two letter - minimal
  'Ix', 'Oz', 'Ax', 'Ex', 'Ox', 'Uz', 'Az', 'Yx', 'Qi', 'Xu',
  // Invented short
  'Kiv', 'Zael', 'Pyth', 'Quex', 'Vorn', 'Jeth', 'Brix', 'Cael', 'Drem', 'Fyn',
  'Grix', 'Hael', 'Ixen', 'Jyn', 'Kael', 'Lem', 'Myx', 'Neth', 'Orix', 'Pael',
  // Strange designations
  'Null-7', 'Void-9', 'Echo-3', 'Static', 'Glitch', 'Relic-0', 'Lost-1', 'Found-X',
  // Object-like
  'Shard', 'Sliver', 'Scrap', 'Husk', 'Shell', 'Core', 'Node', 'Seed', 'Spool', 'Cog',
  // Whispered names
  'Shh', 'Psst', 'Hnn', 'Tsk', 'Pfft', 'Hmm',
  // Numbers as names
  'Zero', 'Nil', 'Nought', 'Rien', 'Nada',
  // Glyphs spoken
  'Tilde', 'Caret', 'Pipe', 'Slash', 'Dot', 'Dash',
];
