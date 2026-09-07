/* ============================================================
   MUSIKA — Artists
   Bands and solo acts whose best-known work was written and
   performed in English, filed by the country they came up in.
   `formed` is the year the act started; `city` is where the
   scene actually happened.
   ============================================================ */

export const ARTISTS = [
  /* ---------------- Philippines ---------------- */
  {
    id: 'eraserheads', name: 'Eraserheads', country: 'ph', formed: 1989,
    city: 'Quezon City', genre: 'Alternative Rock',
    tags: ['campus rock', 'alt', 'nineties'],
    blurb:
      'Four University of the Philippines students who rewired what an OPM band was allowed to sound like. Mostly Tagalog, but the English cuts are where the guitar pop lives.',
  },
  {
    id: 'the-dawn', name: 'The Dawn', country: 'ph', formed: 1985,
    city: 'Manila', genre: 'New Wave',
    tags: ['new wave', 'eighties', 'post-punk'],
    blurb:
      'Martial-law-era new wave with chiming guitars and English lyrics sharp enough to get quoted back at you. The band that made the Manila underground legible to everyone else.',
  },
  {
    id: 'introvoys', name: 'Introvoys', country: 'ph', formed: 1987,
    city: 'Manila', genre: 'Pop Rock',
    tags: ['ballad', 'nineties', 'radio'],
    blurb:
      'The band your tita requests at every reunion. English-language pop rock built entirely around a chorus you already know.',
  },
  {
    id: 'side-a', name: 'Side A', country: 'ph', formed: 1985,
    city: 'Manila', genre: 'Soft Rock',
    tags: ['ballad', 'wedding', 'harmony'],
    blurb:
      'Career-long specialists in the English wedding ballad. Four-part harmony, one enormous key change, no apologies.',
  },
  {
    id: 'rivermaya', name: 'Rivermaya', country: 'ph', formed: 1994,
    city: 'Manila', genre: 'Alternative Rock',
    tags: ['alt', 'nineties', 'anthem'],
    blurb:
      'A rotating cast around a permanent instinct for the big chorus. Their English singles travelled further out of the country than almost any OPM band of the era.',
  },
  {
    id: 'urbandub', name: 'Urbandub', country: 'ph', formed: 2000,
    city: 'Cebu City', genre: 'Post-Hardcore',
    tags: ['cebu', 'post-hardcore', 'two-thousands'],
    blurb:
      'Proof that the scene did not begin and end in Manila. Cebu post-hardcore, entirely in English, loud enough to be heard from the next island.',
  },
  {
    id: 'true-faith', name: 'True Faith', country: 'ph', formed: 1992,
    city: 'Manila', genre: 'Sophisti-Pop',
    tags: ['ballad', 'nineties', 'soul'],
    blurb:
      'Silk-smooth English pop-soul. The arrangements are doing far more work than the radio edit lets on.',
  },
  {
    id: 'alamid', name: 'Alamid', country: 'ph', formed: 1994,
    city: 'Manila', genre: 'Pop Rock',
    tags: ['ballad', 'nineties'],
    blurb:
      'One colossal English ballad and a lifetime of karaoke royalties. Every Filipino knows the first line whether they want to or not.',
  },
  {
    id: 'wolfgang', name: 'Wolfgang', country: 'ph', formed: 1995,
    city: 'Manila', genre: 'Hard Rock',
    tags: ['metal', 'nineties', 'heavy'],
    blurb:
      'The heaviest thing on nineties Manila radio. English lyrics delivered like a threat, riffs built for a small sweaty room.',
  },
  {
    id: 'sugar-hiccup', name: 'Sugar Hiccup', country: 'ph', formed: 1993,
    city: 'Manila', genre: 'Dream Pop',
    tags: ['ethereal', 'dream pop', 'nineties'],
    blurb:
      'Filipino ethereal wave — reverb to the ceiling, English syllables floating free of their meaning. The cult record collectors still chase.',
  },

  /* ---------------- Sweden ---------------- */
  {
    id: 'the-cardigans', name: 'The Cardigans', country: 'se', formed: 1992,
    city: 'Jönköping', genre: 'Indie Pop',
    tags: ['indie pop', 'nineties', 'lounge'],
    blurb:
      'A metal-loving rhythm section playing sunlit sixties pop, with lyrics far bleaker than the arrangement admits.',
  },
  {
    id: 'roxette', name: 'Roxette', country: 'se', formed: 1986,
    city: 'Halmstad', genre: 'Pop Rock',
    tags: ['eighties', 'power ballad', 'radio'],
    blurb:
      'A duo who studied the anatomy of the international hit single and then produced them on demand for a decade.',
  },
  {
    id: 'abba', name: 'ABBA', country: 'se', formed: 1972,
    city: 'Stockholm', genre: 'Pop',
    tags: ['seventies', 'disco', 'harmony'],
    blurb:
      'The definitive argument that writing pop in a second language can sharpen it. Every word carries weight because none of them are wasted.',
  },

  /* ---------------- Norway ---------------- */
  {
    id: 'a-ha', name: 'a-ha', country: 'no', formed: 1982,
    city: 'Oslo', genre: 'Synth-Pop',
    tags: ['synth', 'eighties', 'falsetto'],
    blurb:
      'Three Norwegians who moved to London with a demo and a keyboard riff, and left with one of the most recognisable songs on earth.',
  },

  /* ---------------- Iceland ---------------- */
  {
    id: 'the-sugarcubes', name: 'The Sugarcubes', country: 'is', formed: 1986,
    city: 'Reykjavík', genre: 'Alternative Rock',
    tags: ['art-pop', 'eighties', 'post-punk'],
    blurb:
      'A poetry collective that became a band almost as a side effect. English lyrics arriving from an angle nobody else was standing at.',
  },
  {
    id: 'bjork', name: 'Björk', country: 'is', formed: 1977,
    city: 'Reykjavík', genre: 'Art-Pop',
    tags: ['art-pop', 'electronic', 'nineties'],
    blurb:
      'Sings English as if she is discovering each vowel in real time — which is precisely why the phrasing never sounds like anyone else.',
  },

  /* ---------------- Netherlands ---------------- */
  {
    id: 'shocking-blue', name: 'Shocking Blue', country: 'nl', formed: 1967,
    city: 'The Hague', genre: 'Psych Rock',
    tags: ['sixties', 'psych', 'garage'],
    blurb:
      'Nederbeat at its most direct: one riff, one voice, and a chorus that has outlived every band that has covered it.',
  },
  {
    id: 'golden-earring', name: 'Golden Earring', country: 'nl', formed: 1961,
    city: 'The Hague', genre: 'Hard Rock',
    tags: ['seventies', 'hard rock', 'road song'],
    blurb:
      'One of the longest-running rock bands anywhere, and the authors of a driving song that refuses to leave FM radio.',
  },

  /* ---------------- Ireland ---------------- */
  {
    id: 'the-cranberries', name: 'The Cranberries', country: 'ie', formed: 1989,
    city: 'Limerick', genre: 'Alternative Rock',
    tags: ['nineties', 'alt', 'jangle'],
    blurb:
      'Jangling guitars under a voice that treats English vowels like a traditional singer treats a slow air.',
  },
  {
    id: 'thin-lizzy', name: 'Thin Lizzy', country: 'ie', formed: 1969,
    city: 'Dublin', genre: 'Hard Rock',
    tags: ['seventies', 'twin guitar', 'storytelling'],
    blurb:
      'Twin lead guitars and a frontman who wrote in English like a balladeer — every song has a character and an exit.',
  },

  /* ---------------- Germany ---------------- */
  {
    id: 'scorpions', name: 'Scorpions', country: 'de', formed: 1965,
    city: 'Hannover', genre: 'Hard Rock',
    tags: ['stadium', 'ballad', 'eighties'],
    blurb:
      'German hard rock that aimed squarely at the world and got it, with an English-language ballad that ended up soundtracking a decade turning over.',
  },
  {
    id: 'nena', name: 'Nena', country: 'de', formed: 1982,
    city: 'Berlin', genre: 'Neue Deutsche Welle',
    tags: ['new wave', 'eighties', 'protest'],
    blurb:
      'A German new-wave hit re-recorded in English and sent worldwide — the rare crossover where the anger survives translation.',
  },

  /* ---------------- New Zealand ---------------- */
  {
    id: 'split-enz', name: 'Split Enz', country: 'nz', formed: 1972,
    city: 'Auckland', genre: 'Art-Pop',
    tags: ['art-pop', 'new wave', 'theatrical'],
    blurb:
      'Costumes, odd meters and impossibly sturdy songwriting. New Zealand art-pop that turned into pure new wave without losing the strangeness.',
  },
  {
    id: 'crowded-house', name: 'Crowded House', country: 'nz', formed: 1985,
    city: 'Melbourne', genre: 'Pop Rock',
    tags: ['eighties', 'songwriting', 'harmony'],
    blurb:
      'Formed out of the end of Split Enz, and built around one of the cleanest melodic instincts in English-language pop.',
  },

  /* ---------------- Australia ---------------- */
  {
    id: 'acdc', name: 'AC/DC', country: 'au', formed: 1973,
    city: 'Sydney', genre: 'Hard Rock',
    tags: ['pub rock', 'riff', 'seventies'],
    blurb:
      'The most economical rock band ever assembled. Nothing is added that a room full of people cannot immediately shout back.',
  },
  {
    id: 'inxs', name: 'INXS', country: 'au', formed: 1977,
    city: 'Sydney', genre: 'Rock / Funk',
    tags: ['eighties', 'funk', 'stadium'],
    blurb:
      'Pub-rock stamina welded onto a rhythm section that could have played anywhere. English lyrics kept deliberately spare.',
  },

  /* ---------------- Canada ---------------- */
  {
    id: 'the-guess-who', name: 'The Guess Who', country: 'ca', formed: 1965,
    city: 'Winnipeg', genre: 'Rock',
    tags: ['seventies', 'riff', 'canrock'],
    blurb:
      'Winnipeg rock that broke the American charts by writing, pointedly, about America from the outside.',
  },
  {
    id: 'rush', name: 'Rush', country: 'ca', formed: 1968,
    city: 'Toronto', genre: 'Progressive Rock',
    tags: ['prog', 'trio', 'eighties'],
    blurb:
      'Three musicians and roughly nine parts each. English lyrics written like science fiction essays and somehow still singable.',
  },

  /* ---------------- Japan ---------------- */
  {
    id: 'loudness', name: 'Loudness', country: 'jp', formed: 1981,
    city: 'Osaka', genre: 'Heavy Metal',
    tags: ['metal', 'eighties', 'shred'],
    blurb:
      'The first Japanese metal band to sign a major international deal, re-cutting records in English to get there.',
  },
  {
    id: 'shonen-knife', name: 'Shonen Knife', country: 'jp', formed: 1981,
    city: 'Osaka', genre: 'Pop Punk',
    tags: ['punk', 'eighties', 'cult'],
    blurb:
      'Three-chord English pop-punk about food, animals and weather, played with total sincerity and zero irony.',
  },

  /* ---------------- Indonesia ---------------- */
  {
    id: 'dara-puspita', name: 'Dara Puspita', country: 'id', formed: 1964,
    city: 'Surabaya', genre: 'Garage Rock',
    tags: ['sixties', 'garage', 'all-female'],
    blurb:
      'An all-female Indonesian garage band who toured Europe in the sixties and cut fuzz-drenched English sides along the way.',
  },
  {
    id: 'white-shoes', name: 'White Shoes & The Couples Company', country: 'id', formed: 2002,
    city: 'Jakarta', genre: 'Retro Pop',
    tags: ['retro', 'lounge', 'two-thousands'],
    blurb:
      'Art students reviving seventies Indonesian pop with English lyrics and orchestration too lush for the budget.',
  },

  /* ---------------- Singapore ---------------- */
  {
    id: 'the-quests', name: 'The Quests', country: 'sg', formed: 1961,
    city: 'Singapore', genre: 'Instrumental Rock',
    tags: ['sixties', 'instrumental', 'surf'],
    blurb:
      'The band that briefly outsold the Beatles locally. Clean guitar instrumentals and English vocal sides cut for the whole region.',
  },

  /* ---------------- India ---------------- */
  {
    id: 'parikrama', name: 'Parikrama', country: 'in', formed: 1991,
    city: 'New Delhi', genre: 'Rock',
    tags: ['nineties', 'violin', 'live'],
    blurb:
      'Delhi rock built for the college-festival circuit, with violin and tabla folded into English-language rock arrangements.',
  },
  {
    id: 'indian-ocean', name: 'Indian Ocean', country: 'in', formed: 1990,
    city: 'New Delhi', genre: 'Fusion Rock',
    tags: ['fusion', 'instrumental', 'nineties'],
    blurb:
      'Long instrumental passages, Indian classical rhythm cycles, and English vocals arriving only when the music asks for them.',
  },

  /* ---------------- Nigeria ---------------- */
  {
    id: 'fela-kuti', name: 'Fela Kuti & Africa 70', country: 'ng', formed: 1969,
    city: 'Lagos', genre: 'Afrobeat',
    tags: ['afrobeat', 'protest', 'seventies'],
    blurb:
      'Afrobeat as constructed political argument. English and pidgin chosen precisely so the point could not be contained by one country.',
  },

  /* ---------------- South Africa ---------------- */
  {
    id: 'johnny-clegg', name: 'Johnny Clegg & Savuka', country: 'za', formed: 1986,
    city: 'Johannesburg', genre: 'Crossover Pop',
    tags: ['eighties', 'crossover', 'protest'],
    blurb:
      'English and Zulu traded line for line, by a band whose existence was itself a violation of the law they were singing about.',
  },

  /* ---------------- Brazil ---------------- */
  {
    id: 'sepultura', name: 'Sepultura', country: 'br', formed: 1984,
    city: 'Belo Horizonte', genre: 'Metal',
    tags: ['metal', 'percussion', 'nineties'],
    blurb:
      'Brazilian metal that stopped imitating its influences the moment it started putting Brazilian percussion in the front of the mix.',
  },

  /* ---------------- Italy ---------------- */
  {
    id: 'pfm', name: 'Premiata Forneria Marconi', country: 'it', formed: 1970,
    city: 'Milan', genre: 'Progressive Rock',
    tags: ['prog', 'seventies', 'symphonic'],
    blurb:
      'Italian symphonic prog that re-recorded its albums with English lyrics for the international market — and those became the canonical versions abroad.',
  },

  /* ---------------- France ---------------- */
  {
    id: 'phoenix', name: 'Phoenix', country: 'fr', formed: 1995,
    city: 'Versailles', genre: 'Indie Pop',
    tags: ['indie', 'two-thousands', 'french touch'],
    blurb:
      'Versailles indie pop, sung in English with the vowels kept deliberately cool and the guitars kept deliberately dry.',
  },
  {
    id: 'air', name: 'Air', country: 'fr', formed: 1995,
    city: 'Versailles', genre: 'Downtempo',
    tags: ['electronic', 'nineties', 'ambient'],
    blurb:
      'Analogue synth downtempo with English vocals used as one more texture in an already beautiful mix.',
  },

  /* ---------------- Finland ---------------- */
  {
    id: 'him', name: 'HIM', country: 'fi', formed: 1991,
    city: 'Helsinki', genre: 'Gothic Rock',
    tags: ['gothic', 'ballad', 'nineties'],
    blurb:
      'Coined its own genre name — love metal — and wrote English-language ballads heavy enough to justify it.',
  },
  {
    id: 'hanoi-rocks', name: 'Hanoi Rocks', country: 'fi', formed: 1979,
    city: 'Helsinki', genre: 'Glam Punk',
    tags: ['glam', 'punk', 'eighties'],
    blurb:
      'Finnish glam punk whose look and English-language swagger were quietly borrowed by half of the following decade.',
  },

  /* ---------------- Denmark ---------------- */
  {
    id: 'aqua', name: 'Aqua', country: 'dk', formed: 1989,
    city: 'Copenhagen', genre: 'Eurodance',
    tags: ['nineties', 'eurodance', 'pop'],
    blurb:
      'Danish-Norwegian eurodance built on cartoon-bright English hooks and a production sheen you can hear from another room.',
  },
  {
    id: 'mew', name: 'Mew', country: 'dk', formed: 1995,
    city: 'Hellerup', genre: 'Dream Pop',
    tags: ['dream pop', 'prog', 'two-thousands'],
    blurb:
      'Enormous, weightless English-language pop that keeps sneaking progressive rock structures past you.',
  },

  /* ---------------- Greece ---------------- */
  {
    id: 'aphrodites-child', name: "Aphrodite's Child", country: 'gr', formed: 1967,
    city: 'Athens / Paris', genre: 'Psych Pop',
    tags: ['sixties', 'psych', 'baroque'],
    blurb:
      'Greek musicians who left for Paris and made lush English-language psych-pop that still sounds like it was recorded underwater.',
  },

  /* ---------------- Poland ---------------- */
  {
    id: 'riverside', name: 'Riverside', country: 'pl', formed: 2001,
    city: 'Warsaw', genre: 'Progressive Rock',
    tags: ['prog', 'atmospheric', 'two-thousands'],
    blurb:
      'Polish progressive rock written in English as long-form narrative — patient, cold, and enormous when it finally opens up.',
  },

  /* ---------------- Spain ---------------- */
  {
    id: 'dover', name: 'Dover', country: 'es', formed: 1992,
    city: 'Madrid', genre: 'Grunge / Indie',
    tags: ['nineties', 'grunge', 'indie'],
    blurb:
      'Madrid siblings who chose English for the speed of it and ended up with one of the biggest Spanish rock records of the nineties.',
  },
];

export const artistById = (id) => ARTISTS.find((a) => a.id === id);

export const artistsByCountry = (countryId) => ARTISTS.filter((a) => a.country === countryId);

export const GENRES = [...new Set(ARTISTS.map((a) => a.genre))].sort();
