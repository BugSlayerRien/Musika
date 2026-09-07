/* ============================================================
   MUSIKA — The catalogue
   ------------------------------------------------------------
   Entries are written as compact tuples and expanded below, so
   adding a track is one line rather than fifteen.

     [id, title, artist, year, album, seconds, bpm, tags, note, by]

   `note` is the community blurb — the reason a member filed the
   song under "classic". `by` is the member who submitted it.

   No licensed audio ships with the app. Each track carries a
   deterministic `seed`; the player synthesises a short original
   motif from it so every entry has an audible signature, and the
   real recording is one outbound link away.
   ============================================================ */

const RAW = [
  /* ---------------- Philippines ---------------- */
  ['ph-dawn-enveloped', 'Enveloped Ideas', 'the-dawn', 1986, 'The Dawn', 262, 148,
    ['new wave', 'jangle', 'manila'],
    'The song that proved a Manila band could write in English without sounding like an import. Still the first track anyone puts on when they argue about the eighties.',
    'kuyaramon'],
  ['ph-eheads-julie', 'Julie Tearjerky', 'eraserheads', 1995, 'Cutterpillow', 201, 132,
    ['alt', 'guitar pop', 'nineties'],
    'The Eraserheads are remembered for the Tagalog singles, but this is the one that got played to death in every UP dorm corridor.',
    'circusgirl'],
  ['ph-eheads-finetime', 'Fine Time', 'eraserheads', 1994, 'Circus', 224, 118,
    ['alt', 'nineties'],
    'Loose, funny and completely unbothered. Proof the band could sit in English for four minutes and still sound exactly like themselves.',
    'circusgirl'],
  ['ph-introvoys-line', 'Line to Heaven', 'introvoys', 1993, 'Line to Heaven', 268, 76,
    ['ballad', 'radio', 'nineties'],
    'Graduation, funeral, reunion, karaoke — this song has been at every important room in the country at least once.',
    'titasofmanila'],
  ['ph-sidea-forevermore', 'Forevermore', 'side-a', 1990, 'Side A', 279, 68,
    ['ballad', 'wedding', 'harmony'],
    'The national wedding song. Try getting through the second chorus at a Filipino reception without somebody crying.',
    'titasofmanila'],
  ['ph-rivermaya-safe', "You'll Be Safe Here", 'rivermaya', 2003, 'Between the Stars and Waves', 249, 84,
    ['alt', 'ballad', 'two-thousands'],
    'The English single that travelled furthest out of the country. Filipinos abroad tend to hear the first bar and go quiet.',
    'ridethewave'],
  ['ph-urbandub-summer', 'First of Summer', 'urbandub', 2005, 'Embrace', 259, 142,
    ['post-hardcore', 'cebu', 'two-thousands'],
    'Filed under Cebu, loudly. The scene did not begin and end in Manila and this is the exhibit.',
    'sugbuanon'],
  ['ph-truefaith-perfect', 'Perfect', 'true-faith', 1994, 'Perfect', 258, 92,
    ['sophisti-pop', 'soul', 'nineties'],
    'Silk arrangement, devastating lyric. One of the most quietly sophisticated things on nineties Philippine radio.',
    'kuyaramon'],
  ['ph-alamid-yourlove', 'Your Love', 'alamid', 1996, 'Alamid', 291, 72,
    ['ballad', 'karaoke', 'nineties'],
    'Every Filipino knows the opening line. Every Filipino also knows they cannot actually hit the last chorus.',
    'videokeking'],
  ['ph-wolfgang-arise', 'Arise', 'wolfgang', 1997, 'Semenelin', 246, 138,
    ['hard rock', 'heavy', 'nineties'],
    'The heaviest thing that got daytime airplay in that decade. English lyrics, delivered like an accusation.',
    'metalpinoy'],
  ['ph-sugarhiccup-five', 'Five Years', 'sugar-hiccup', 1996, 'Oracle', 268, 96,
    ['dream pop', 'ethereal', 'nineties'],
    'Filipino ethereal wave. Reverb to the ceiling, English syllables floating loose of their meaning. The cult record.',
    'reverbdiwata'],

  /* ---------------- Sweden ---------------- */
  ['se-cardigans-lovefool', 'Lovefool', 'the-cardigans', 1996, 'First Band on the Moon', 197, 112,
    ['indie pop', 'nineties'],
    'Sounds like sunshine, reads like a breakdown. The gap between the arrangement and the lyric is the entire point.',
    'nordicpop'],
  ['se-cardigans-erase', 'Erase / Rewind', 'the-cardigans', 1998, 'Gran Turismo', 210, 104,
    ['indie pop', 'electronic', 'nineties'],
    'Where the band swapped sunlight for chrome. Colder, tighter, and better than it had any right to be.',
    'nordicpop'],
  ['se-roxette-listen', 'Listen to Your Heart', 'roxette', 1988, 'Look Sharp!', 331, 88,
    ['power ballad', 'eighties'],
    'A masterclass in the Swedish power ballad: restraint for two minutes, then the roof comes off.',
    'halmstadhifi'],
  ['se-roxette-look', 'The Look', 'roxette', 1988, 'Look Sharp!', 236, 122,
    ['pop rock', 'eighties'],
    'Written in English by people who studied English-language hits like engineering diagrams. It shows, in the best way.',
    'halmstadhifi'],
  ['se-abba-dancingqueen', 'Dancing Queen', 'abba', 1976, 'Arrival', 231, 101,
    ['disco', 'seventies', 'harmony'],
    'The argument-ender for anyone who claims writing in a second language is a handicap. Not one wasted syllable.',
    'nordicpop'],
  ['se-abba-winner', 'The Winner Takes It All', 'abba', 1980, 'Super Trouper', 295, 92,
    ['ballad', 'eighties'],
    'A divorce recorded by the people going through it, in their second language, and somehow the most precise lyric they ever wrote.',
    'vinylnina'],

  /* ---------------- Norway ---------------- */
  ['no-aha-takeonme', 'Take On Me', 'a-ha', 1985, 'Hunting High and Low', 225, 169,
    ['synth-pop', 'eighties'],
    'Three Norwegians, one keyboard riff, and the highest note in mainstream pop. Rejected repeatedly before it broke worldwide.',
    'osloarcade'],
  ['no-aha-sunshines', 'The Sun Always Shines on T.V.', 'a-ha', 1985, 'Hunting High and Low', 285, 116,
    ['synth-pop', 'eighties'],
    'The better song and everyone in Norway knows it. Enormous, cold, and genuinely sad under the synths.',
    'osloarcade'],

  /* ---------------- Iceland ---------------- */
  ['is-sugarcubes-birthday', 'Birthday', 'the-sugarcubes', 1987, 'Life’s Too Good', 244, 108,
    ['art-pop', 'post-punk', 'eighties'],
    'English lyrics arriving from an angle nobody else was standing at. It still does not sound like anything else.',
    'reykjavikrain'],
  ['is-bjork-human', 'Human Behaviour', 'bjork', 1993, 'Debut', 251, 90,
    ['art-pop', 'electronic', 'nineties'],
    'She sings English like she is discovering each vowel in real time. The phrasing is the instrument.',
    'reykjavikrain'],

  /* ---------------- Netherlands ---------------- */
  ['nl-shockingblue-venus', 'Venus', 'shocking-blue', 1969, 'At Home', 180, 138,
    ['garage', 'psych', 'sixties'],
    'One riff, one voice, and a chorus that has outlived every band that has covered it. Nederbeat at maximum efficiency.',
    'haagsebeat'],
  ['nl-goldenearring-radar', 'Radar Love', 'golden-earring', 1973, 'Moontan', 386, 136,
    ['hard rock', 'seventies', 'road song'],
    'The greatest driving song not written in America. That drum break has been sampled into oblivion and still hits.',
    'haagsebeat'],

  /* ---------------- Ireland ---------------- */
  ['ie-cranberries-linger', 'Linger', 'the-cranberries', 1993, 'Everybody Else Is Doing It…', 274, 88,
    ['alt', 'jangle', 'nineties'],
    'Strings, jangle, and a vocal that treats English vowels the way a traditional singer treats a slow air.',
    'limerickfm'],
  ['ie-cranberries-dreams', 'Dreams', 'the-cranberries', 1992, 'Everybody Else Is Doing It…', 251, 130,
    ['alt', 'nineties'],
    'The most hopeful thing in their catalogue and it still has that ache underneath.',
    'limerickfm'],
  ['ie-thinlizzy-boys', 'The Boys Are Back in Town', 'thin-lizzy', 1976, 'Jailbreak', 268, 116,
    ['hard rock', 'twin guitar', 'seventies'],
    'A short story with two lead guitars. Every character in it exists, and you know exactly which bar this is.',
    'dublinsteel'],

  /* ---------------- Germany ---------------- */
  ['de-scorpions-wind', 'Wind of Change', 'scorpions', 1990, 'Crazy World', 311, 76,
    ['ballad', 'stadium', 'nineties'],
    'A German band, an English lyric, and a decade turning over in real time. The whistle alone dates it to the month.',
    'hannoverhaus'],
  ['de-nena-99', '99 Red Balloons', 'nena', 1984, '99 Luftballons', 232, 96,
    ['new wave', 'protest', 'eighties'],
    'The rare English re-recording where the anger survives translation completely intact.',
    'berlinwelle'],

  /* ---------------- New Zealand ---------------- */
  ['nz-splitenz-igotyou', 'I Got You', 'split-enz', 1980, 'True Colours', 205, 132,
    ['new wave', 'art-pop', 'eighties'],
    'Paranoid, jerky, and impossibly catchy. New Zealand art-pop turning into pure new wave without losing the strangeness.',
    'aucklandjangle'],
  ['nz-crowdedhouse-dream', "Don't Dream It's Over", 'crowded-house', 1986, 'Crowded House', 236, 78,
    ['pop rock', 'eighties', 'harmony'],
    'That organ solo. One of the cleanest melodic instincts in English-language pop, from the far end of the world.',
    'aucklandjangle'],

  /* ---------------- Australia ---------------- */
  ['au-acdc-highway', 'Highway to Hell', 'acdc', 1979, 'Highway to Hell', 208, 116,
    ['pub rock', 'riff', 'seventies'],
    'Nothing in it that a room full of strangers cannot immediately shout back. That is the whole craft.',
    'sydneypub'],
  ['au-inxs-nevertear', 'Never Tear Us Apart', 'inxs', 1988, 'Kick', 186, 68,
    ['rock', 'eighties'],
    'Half the words of a normal pop song and twice the weight. The pauses are doing the work.',
    'sydneypub'],

  /* ---------------- Canada ---------------- */
  ['ca-guesswho-american', 'American Woman', 'the-guess-who', 1970, 'American Woman', 305, 118,
    ['rock', 'riff', 'seventies'],
    'A Canadian band breaking the American charts with a song about keeping America at arm’s length.',
    'winnipegwax'],
  ['ca-rush-tomsawyer', 'Tom Sawyer', 'rush', 1981, 'Moving Pictures', 276, 88,
    ['prog', 'eighties'],
    'English lyrics written like a philosophy seminar, and somehow still the song every drummer learns first.',
    'torontoprog'],

  /* ---------------- Japan ---------------- */
  ['jp-loudness-crazy', 'Crazy Nights', 'loudness', 1985, 'Thunder in the East', 271, 140,
    ['metal', 'eighties', 'shred'],
    'Recorded in English specifically to break the international market — and it worked, as the first Japanese metal band to do it.',
    'osakavolt'],
  ['jp-shonenknife-twist', 'Twist Barbie', 'shonen-knife', 1983, 'Burning Farm', 168, 156,
    ['pop punk', 'cult', 'eighties'],
    'Total sincerity, zero irony, three chords. English as pure joyful texture.',
    'osakavolt'],

  /* ---------------- Indonesia ---------------- */
  ['id-darapuspita-believe', 'Believe Me', 'dara-puspita', 1966, 'Jang Pertama', 172, 134,
    ['garage', 'fuzz', 'sixties'],
    'An all-female Indonesian garage band cutting fuzz-drenched English sides in 1966. Records now dug for worldwide.',
    'jakartafuzz'],
  ['id-whiteshoes-nothing', 'Nothing to Fear', 'white-shoes', 2010, 'Vakansi', 214, 108,
    ['retro pop', 'lounge', 'two-thousands'],
    'Seventies Indonesian pop revived by art students, with orchestration far too lush for the budget.',
    'jakartafuzz'],

  /* ---------------- Singapore ---------------- */
  ['sg-quests-shanty', 'Shanty', 'the-quests', 1964, 'Shanty', 148, 128,
    ['instrumental', 'surf', 'sixties'],
    'The single that briefly outsold the Beatles locally. Clean guitar, no words needed, exported across the whole region.',
    'kampongsurf'],

  /* ---------------- India ---------------- */
  ['in-parikrama-butitrained', 'But It Rained', 'parikrama', 1996, 'Single', 380, 72,
    ['rock', 'violin', 'nineties'],
    'Delhi rock built for the college-festival circuit, with violin folded into an English-language arrangement that keeps growing.',
    'delhistage'],

  /* ---------------- Nigeria ---------------- */
  ['ng-fela-zombie', 'Zombie', 'fela-kuti', 1976, 'Zombie', 738, 112,
    ['afrobeat', 'protest', 'seventies'],
    'English and pidgin chosen precisely so the point could not be contained by one country. Twelve minutes, no wasted bar.',
    'lagosgroove'],

  /* ---------------- South Africa ---------------- */
  ['za-clegg-scatterlings', 'Scatterlings of Africa', 'johnny-clegg', 1987, 'Third World Child', 265, 124,
    ['crossover', 'eighties', 'protest'],
    'English and Zulu traded line for line by a band whose existence broke the law they were singing about.',
    'joburgcrossing'],

  /* ---------------- Brazil ---------------- */
  ['br-sepultura-roots', 'Roots Bloody Roots', 'sepultura', 1996, 'Roots', 186, 96,
    ['metal', 'percussion', 'nineties'],
    'The moment they stopped imitating their influences and put Brazilian percussion in the front of the mix instead.',
    'bhpercussao'],

  /* ---------------- Italy ---------------- */
  ['it-pfm-celebration', 'Celebration', 'pfm', 1973, 'Photos of Ghosts', 213, 126,
    ['prog', 'symphonic', 'seventies'],
    'An Italian album re-recorded with English lyrics for export — and abroad, this became the canonical version.',
    'milanoprog'],

  /* ---------------- France ---------------- */
  ['fr-phoenix-1901', '1901', 'phoenix', 2009, 'Wolfgang Amadeus Phoenix', 193, 144,
    ['indie', 'two-thousands'],
    'Versailles indie pop: vowels kept cool, guitars kept dry, and a chorus that detonates anyway.',
    'versaillestape'],
  ['fr-air-sexyboy', 'Sexy Boy', 'air', 1998, 'Moon Safari', 292, 106,
    ['downtempo', 'electronic', 'nineties'],
    'English vocals used as one more texture in an already beautiful mix. Nobody has copied this successfully.',
    'versaillestape'],

  /* ---------------- Finland ---------------- */
  ['fi-him-joinme', 'Join Me in Death', 'him', 1999, 'Razorblade Romance', 216, 84,
    ['gothic', 'ballad', 'nineties'],
    'They invented a genre name for this — love metal — because nothing existing quite covered it.',
    'helsinkigloom'],
  ['fi-hanoirocks-dontyou', "Don't You Ever Leave Me", 'hanoi-rocks', 1984, 'Two Steps from the Move', 250, 122,
    ['glam', 'eighties'],
    'Finnish glam punk whose look and English-language swagger were quietly borrowed by half the following decade.',
    'helsinkigloom'],

  /* ---------------- Denmark ---------------- */
  ['dk-aqua-barbie', 'Barbie Girl', 'aqua', 1997, 'Aquarium', 197, 132,
    ['eurodance', 'nineties'],
    'File it under classic and argue with the numbers, not with me. Cartoon-bright English hooks, engineered to the millimetre.',
    'kobenhavnkid'],
  ['dk-mew-comforting', 'Comforting Sounds', 'mew', 2003, 'Frengers', 528, 74,
    ['dream pop', 'prog', 'two-thousands'],
    'Eight minutes that keep sneaking progressive rock structures past you while you are busy being moved.',
    'kobenhavnkid'],

  /* ---------------- Greece ---------------- */
  ['gr-aphrodite-rain', 'Rain and Tears', 'aphrodites-child', 1968, 'End of the World', 197, 70,
    ['psych', 'baroque', 'sixties'],
    'Greek musicians in Paris making English-language psych-pop that still sounds like it was recorded underwater.',
    'athenspsych'],

  /* ---------------- Poland ---------------- */
  ['pl-riverside-secondlife', 'Second Life Syndrome', 'riverside', 2005, 'Second Life Syndrome', 934, 68,
    ['prog', 'atmospheric', 'two-thousands'],
    'Fifteen minutes written in English as long-form narrative. Patient, cold, and enormous when it finally opens up.',
    'warszawaprog'],

  /* ---------------- Spain ---------------- */
  ['es-dover-devil', 'Devil Came to Me', 'dover', 1997, 'Devil Came to Me', 183, 152,
    ['grunge', 'indie', 'nineties'],
    'Madrid siblings who chose English for the speed of it and ended up with one of the biggest Spanish rock records of the decade.',
    'madridgarage'],
];

/* ---- deterministic pseudo-stats so the catalogue feels lived-in ---- */
function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export const SONGS = RAW.map(
  ([id, title, artist, year, album, seconds, bpm, tags, note, by]) => {
    const h = hash(id);
    return {
      id,
      title,
      artist,
      year,
      album,
      seconds,
      bpm,
      tags,
      note,
      submittedBy: by,
      seed: h,
      plays: 1200 + (h % 480000),
      hearts: 40 + ((h >>> 7) % 9600),
      addedDaysAgo: (h >>> 11) % 900,
    };
  },
);

export const songById = (id) => SONGS.find((s) => s.id === id);
export const songsByArtist = (artistId) => SONGS.filter((s) => s.artist === artistId);

export const formatDuration = (sec) => {
  const total = Math.max(0, Math.floor(sec || 0));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
};

export const formatCount = (n) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
};

export const ALL_TAGS = [...new Set(SONGS.flatMap((s) => s.tags))].sort();

export const DECADES = [
  { id: '1960s', label: '60s', from: 1960, to: 1969 },
  { id: '1970s', label: '70s', from: 1970, to: 1979 },
  { id: '1980s', label: '80s', from: 1980, to: 1989 },
  { id: '1990s', label: '90s', from: 1990, to: 1999 },
  { id: '2000s', label: '00s', from: 2000, to: 2009 },
  { id: '2010s', label: '10s', from: 2010, to: 2019 },
];

export const decadeOf = (year) => `${Math.floor(year / 10) * 10}s`;
