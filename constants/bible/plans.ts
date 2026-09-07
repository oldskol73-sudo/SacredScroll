export interface SinPrecept {
  ref: string;
  note: string;
}

export type SinBattleSource = "mark" | "romans";

export interface SinBattle {
  key: string;
  sin: string;
  source: SinBattleSource;
  precepts: SinPrecept[];
}

export const SIN_BATTLES: SinBattle[] = [
  {
    key: "evil-thoughts",
    sin: "Evil Thoughts",
    source: "mark",
    precepts: [
      { ref: "Philippians 4:8", note: "think on things that are true, honest, just, pure, lovely" },
      { ref: "2 Corinthians 10:5", note: "casting down imaginations, bringing every thought into captivity" },
      { ref: "Romans 12:2", note: "be transformed by the renewing of your mind" },
      { ref: "Proverbs 23:7", note: "as a man thinketh in his heart, so is he" },
    ],
  },
  {
    key: "adulteries",
    sin: "Adulteries",
    source: "mark",
    precepts: [
      { ref: "Matthew 5:28", note: "whosoever looketh on a woman to lust hath committed adultery already" },
      { ref: "Hebrews 13:4", note: "marriage honourable, the bed undefiled; whoremongers and adulterers God will judge" },
      { ref: "Proverbs 6:32", note: "whoso committeth adultery destroyeth his own soul" },
      { ref: "Job 31:1", note: "I made a covenant with mine eyes" },
    ],
  },
  {
    key: "fornications",
    sin: "Fornications",
    source: "mark",
    precepts: [
      { ref: "1 Corinthians 6:18", note: "flee fornication; he that committeth it sinneth against his own body" },
      { ref: "1 Thessalonians 4:3-5", note: "abstain from fornication; possess your vessel in sanctification" },
      { ref: "1 Corinthians 6:19-20", note: "your body is the temple of the Holy Ghost" },
      { ref: "Galatians 5:16", note: "walk in the Spirit and ye shall not fulfil the lust of the flesh" },
    ],
  },
  {
    key: "murders",
    sin: "Murders",
    source: "mark",
    precepts: [
      { ref: "Matthew 5:21-22", note: "anger without cause is the root murder grows from" },
      { ref: "1 John 3:15", note: "whosoever hateth his brother is a murderer" },
      { ref: "Romans 12:19-21", note: "avenge not yourselves; overcome evil with good" },
      { ref: "Genesis 9:6", note: "the seriousness of shedding man’s blood" },
    ],
  },
  {
    key: "thefts",
    sin: "Thefts",
    source: "mark",
    precepts: [
      { ref: "Ephesians 4:28", note: "let him that stole steal no more, but labour, working with his hands" },
      { ref: "Leviticus 19:11", note: "ye shall not steal, neither deal falsely" },
      { ref: "1 Thessalonians 4:11-12", note: "study to be quiet, and to do your own business" },
    ],
  },
  {
    key: "covetousness",
    sin: "Covetousness",
    source: "mark",
    precepts: [
      { ref: "Hebrews 13:5", note: "be content; for he hath said, I will never leave thee" },
      { ref: "1 Timothy 6:6-10", note: "godliness with contentment is great gain" },
      { ref: "Luke 12:15", note: "a man’s life consisteth not in the abundance of things" },
      { ref: "Colossians 3:5", note: "mortify covetousness, which is idolatry" },
    ],
  },
  {
    key: "wickedness",
    sin: "Wickedness",
    source: "mark",
    precepts: [
      { ref: "Proverbs 4:14-15", note: "enter not into the path of the wicked; avoid it" },
      { ref: "Isaiah 55:7", note: "let the wicked forsake his way, and return unto the LORD" },
      { ref: "Psalm 1:1", note: "blessed is the man that walketh not in the counsel of the ungodly" },
      { ref: "James 4:7-8", note: "submit to God, resist the devil, and he will flee from you" },
    ],
  },
  {
    key: "deceit",
    sin: "Deceit",
    source: "mark",
    precepts: [
      { ref: "Psalm 34:13", note: "keep thy tongue from evil, and thy lips from speaking guile" },
      { ref: "Ephesians 4:25", note: "put away lying; speak every man truth with his neighbour" },
      { ref: "Proverbs 12:22", note: "lying lips are abomination; they that deal truly are his delight" },
      { ref: "Colossians 3:9", note: "lie not one to another" },
    ],
  },
  {
    key: "lasciviousness",
    sin: "Lasciviousness",
    source: "mark",
    precepts: [
      { ref: "Romans 13:13-14", note: "walk honestly, not in chambering and wantonness" },
      { ref: "1 Peter 4:3", note: "we have wrought the will of the Gentiles, but no longer" },
      { ref: "Titus 2:11-12", note: "grace teaches us to deny worldly lusts, and live soberly" },
      { ref: "Galatians 5:16", note: "walk in the Spirit and ye shall not fulfil the lust of the flesh" },
    ],
  },
  {
    key: "evil-eye",
    sin: "An Evil Eye",
    source: "mark",
    precepts: [
      { ref: "James 3:14-16", note: "where envying and strife is, there is confusion and every evil work" },
      { ref: "1 Corinthians 13:4", note: "charity envieth not" },
      { ref: "Galatians 5:26", note: "let us not be desirous of vain glory, envying one another" },
      { ref: "Proverbs 23:6", note: "eat not the bread of him that hath an evil eye" },
    ],
  },
  {
    key: "blasphemy",
    sin: "Blasphemy",
    source: "mark",
    precepts: [
      { ref: "Ephesians 4:29", note: "let no corrupt communication proceed out of your mouth" },
      { ref: "Colossians 3:8", note: "put off blasphemy, filthy communication out of your mouth" },
      { ref: "James 3:9-10", note: "the tongue should not both bless God and curse men" },
      { ref: "Psalm 19:14", note: "let the words of my mouth be acceptable in thy sight" },
    ],
  },
  {
    key: "pride",
    sin: "Pride",
    source: "mark",
    precepts: [
      { ref: "Proverbs 16:18", note: "pride goeth before destruction, and an haughty spirit before a fall" },
      { ref: "James 4:6-10", note: "God resisteth the proud; humble yourselves in the sight of the Lord" },
      { ref: "Philippians 2:3-5", note: "let nothing be done through vainglory, but lowliness of mind" },
      { ref: "Proverbs 11:2", note: "with the lowly is wisdom" },
    ],
  },
  {
    key: "foolishness",
    sin: "Foolishness",
    source: "mark",
    precepts: [
      { ref: "Proverbs 1:7", note: "the fear of the LORD is the beginning of knowledge" },
      { ref: "Proverbs 9:10", note: "the fear of the LORD is the beginning of wisdom" },
      { ref: "Ephesians 5:15-17", note: "walk circumspectly, not as fools, but understanding the will of the Lord" },
      { ref: "Psalm 14:1", note: "the fool hath said in his heart, There is no God" },
    ],
  },
  {
    key: "unrighteousness",
    sin: "Unrighteousness",
    source: "romans",
    precepts: [
      { ref: "1 John 1:9", note: "if we confess our sins, he is faithful and just to cleanse us from all unrighteousness" },
      { ref: "Romans 6:13", note: "yield yourselves unto God, as instruments of righteousness" },
      { ref: "Matthew 5:6", note: "blessed are they which do hunger and thirst after righteousness" },
      { ref: "Proverbs 11:5", note: "the righteousness of the perfect shall direct his way" },
    ],
  },
  {
    key: "fornication",
    sin: "Fornication",
    source: "romans",
    precepts: [
      { ref: "1 Corinthians 6:18", note: "flee fornication; he that committeth it sinneth against his own body" },
      { ref: "1 Thessalonians 4:3", note: "this is the will of God, even your sanctification, that ye should abstain from fornication" },
      { ref: "Hebrews 13:4", note: "marriage is honourable in all, and the bed undefiled" },
    ],
  },
  {
    key: "wickedness-romans",
    sin: "Wickedness",
    source: "romans",
    precepts: [
      { ref: "Isaiah 55:7", note: "let the wicked forsake his way, and return unto the LORD" },
      { ref: "Psalm 34:14", note: "depart from evil, and do good; seek peace, and pursue it" },
      { ref: "Proverbs 8:13", note: "the fear of the LORD is to hate evil" },
    ],
  },
  {
    key: "covetousness-romans",
    sin: "Covetousness",
    source: "romans",
    precepts: [
      { ref: "Luke 12:15", note: "take heed, and beware of covetousness" },
      { ref: "Hebrews 13:5", note: "let your conversation be without covetousness; be content" },
      { ref: "1 Timothy 6:6-10", note: "godliness with contentment is great gain" },
    ],
  },
  {
    key: "maliciousness",
    sin: "Maliciousness",
    source: "romans",
    precepts: [
      { ref: "Ephesians 4:31", note: "let all bitterness, wrath, anger, and malice, be put away from you" },
      { ref: "1 Peter 2:1", note: "laying aside all malice, and all guile, and hypocrisies, and envies" },
      { ref: "1 Corinthians 5:8", note: "let us keep the feast, not with the leaven of malice, but with sincerity and truth" },
    ],
  },
  {
    key: "envy",
    sin: "Envy",
    source: "romans",
    precepts: [
      { ref: "1 Corinthians 13:4", note: "charity envieth not; charity vaunteth not itself, is not puffed up" },
      { ref: "Galatians 5:26", note: "let us not be desirous of vain glory, envying one another" },
      { ref: "Proverbs 14:30", note: "envy is the rottenness of the bones" },
    ],
  },
  {
    key: "murder",
    sin: "Murder",
    source: "romans",
    precepts: [
      { ref: "Exodus 20:13", note: "thou shalt not kill" },
      { ref: "Matthew 5:21-22", note: "anger without cause is the root murder grows from" },
      { ref: "1 John 3:15", note: "whosoever hateth his brother is a murderer" },
    ],
  },
  {
    key: "debate",
    sin: "Debate",
    source: "romans",
    precepts: [
      { ref: "Proverbs 20:3", note: "it is an honour for a man to cease from strife" },
      { ref: "Titus 3:9", note: "avoid foolish questions, and strivings about the law" },
      { ref: "Philippians 2:14", note: "do all things without murmurings and disputings" },
    ],
  },
  {
    key: "deceit-romans",
    sin: "Deceit",
    source: "romans",
    precepts: [
      { ref: "Psalm 34:13", note: "keep thy tongue from evil, and thy lips from speaking guile" },
      { ref: "Ephesians 4:25", note: "put away lying; speak every man truth with his neighbour" },
      { ref: "Proverbs 12:22", note: "lying lips are abomination; they that deal truly are his delight" },
    ],
  },
  {
    key: "malignity",
    sin: "Malignity",
    source: "romans",
    precepts: [
      { ref: "Ephesians 4:32", note: "be ye kind one to another, tenderhearted, forgiving one another" },
      { ref: "Romans 12:17", note: "recompense to no man evil for evil" },
      { ref: "1 Peter 3:9", note: "not rendering evil for evil, or railing for railing" },
    ],
  },
  {
    key: "whisperers",
    sin: "Whisperers",
    source: "romans",
    precepts: [
      { ref: "Proverbs 16:28", note: "a whisperer separateth chief friends" },
      { ref: "Proverbs 26:20", note: "where there is no talebearer, the strife ceaseth" },
      { ref: "Leviticus 19:16", note: "thou shalt not go up and down as a talebearer among thy people" },
    ],
  },
  {
    key: "backbiters",
    sin: "Backbiters",
    source: "romans",
    precepts: [
      { ref: "Psalm 15:1,3", note: "who shall abide in thy tabernacle? he that backbiteth not with his tongue" },
      { ref: "Proverbs 25:23", note: "a backbiting tongue" },
      { ref: "James 4:11", note: "speak not evil one of another, brethren" },
    ],
  },
  {
    key: "haters-of-god",
    sin: "Haters of God",
    source: "romans",
    precepts: [
      { ref: "Romans 8:7", note: "the carnal mind is enmity against God" },
      { ref: "James 4:4", note: "the friendship of the world is enmity with God" },
      { ref: "1 John 4:20", note: "he that loveth not his brother whom he hath seen, how can he love God whom he hath not seen?" },
    ],
  },
  {
    key: "despiteful",
    sin: "Despiteful",
    source: "romans",
    precepts: [
      { ref: "1 Peter 3:9", note: "not rendering evil for evil, or railing for railing: but contrariwise blessing" },
      { ref: "Matthew 5:44", note: "love your enemies, bless them that curse you" },
      { ref: "Romans 12:14", note: "bless them which persecute you: bless, and curse not" },
    ],
  },
  {
    key: "proud",
    sin: "Proud",
    source: "romans",
    precepts: [
      { ref: "James 4:6", note: "God resisteth the proud, but giveth grace unto the humble" },
      { ref: "Philippians 2:3", note: "let nothing be done through strife or vainglory; in lowliness of mind" },
      { ref: "Proverbs 16:18", note: "pride goeth before destruction, and an haughty spirit before a fall" },
    ],
  },
  {
    key: "boasters",
    sin: "Boasters",
    source: "romans",
    precepts: [
      { ref: "Proverbs 27:1", note: "boast not thyself of to morrow; for thou knowest not what a day may bring forth" },
      { ref: "James 4:16", note: "ye rejoice in your boastings: all such rejoicing is evil" },
      { ref: "1 Corinthians 1:29,31", note: "that no flesh should glory in his presence... he that glorieth, let him glory in the Lord" },
    ],
  },
  {
    key: "inventors-of-evil-things",
    sin: "Inventors of Evil Things",
    source: "romans",
    precepts: [
      { ref: "Micah 2:1", note: "woe to them that devise iniquity, and work evil upon their beds" },
      { ref: "Psalm 36:4", note: "he deviseth mischief upon his bed; he setteth himself in a way that is not good" },
      { ref: "Romans 12:21", note: "be not overcome of evil, but overcome evil with good" },
    ],
  },
  {
    key: "disobedient-to-parents",
    sin: "Disobedient to Parents",
    source: "romans",
    precepts: [
      { ref: "Ephesians 6:1", note: "children, obey your parents in the Lord: for this is right" },
      { ref: "Exodus 20:12", note: "honour thy father and thy mother" },
      { ref: "Colossians 3:20", note: "children, obey your parents in all things: for this is well pleasing unto the Lord" },
    ],
  },
  {
    key: "without-understanding",
    sin: "Without Understanding",
    source: "romans",
    precepts: [
      { ref: "Proverbs 3:5", note: "trust in the LORD with all thine heart; and lean not unto thine own understanding" },
      { ref: "Proverbs 4:7", note: "wisdom is the principal thing; therefore get wisdom: and with all thy getting get understanding" },
      { ref: "Hosea 4:6", note: "my people are destroyed for lack of knowledge" },
    ],
  },
  {
    key: "covenantbreakers",
    sin: "Covenantbreakers",
    source: "romans",
    precepts: [
      { ref: "Psalm 15:4", note: "he that sweareth to his own hurt, and changeth not" },
      { ref: "Ecclesiastes 5:4-5", note: "when thou vowest a vow unto God, defer not to pay it" },
      { ref: "Malachi 2:14", note: "the LORD hath been witness between thee and the wife of thy covenant, against whom thou hast dealt treacherously" },
    ],
  },
  {
    key: "without-natural-affection",
    sin: "Without Natural Affection",
    source: "romans",
    precepts: [
      { ref: "Romans 12:10", note: "be kindly affectioned one to another with brotherly love" },
      { ref: "1 Timothy 5:8", note: "if any provide not for his own... he hath denied the faith" },
      { ref: "1 John 3:17", note: "whoso hath this world’s good, and seeth his brother have need, and shutteth up his bowels of compassion from him" },
    ],
  },
  {
    key: "implacable",
    sin: "Implacable",
    source: "romans",
    precepts: [
      { ref: "Matthew 5:23-24", note: "leave there thy gift... first be reconciled to thy brother" },
      { ref: "Ephesians 4:26", note: "let not the sun go down upon your wrath" },
      { ref: "Colossians 3:13", note: "forbearing one another, and forgiving one another" },
    ],
  },
  {
    key: "unmerciful",
    sin: "Unmerciful",
    source: "romans",
    precepts: [
      { ref: "Matthew 5:7", note: "blessed are the merciful: for they shall obtain mercy" },
      { ref: "James 2:13", note: "he shall have judgment without mercy, that hath shewed no mercy" },
      { ref: "Luke 6:36", note: "be ye therefore merciful, as your Father also is merciful" },
    ],
  },
];

// Chronological 1-year plan: which book/chapter ranges happened in what order.
const CHRONO_SEGMENTS: [string, number, number][] = [
  ["Genesis", 1, 11], ["Job", 1, 42], ["Genesis", 12, 50], ["Exodus", 1, 40], ["Leviticus", 1, 27],
  ["Numbers", 1, 36], ["Deuteronomy", 1, 34], ["Joshua", 1, 24], ["Judges", 1, 21], ["Ruth", 1, 4],
  ["1 Samuel", 1, 31], ["Psalms", 1, 72], ["2 Samuel", 1, 24], ["1 Kings", 1, 11], ["Psalms", 73, 150],
  ["Proverbs", 1, 31], ["Ecclesiastes", 1, 12], ["Song of Solomon", 1, 8], ["1 Kings", 12, 22],
  ["1 Chronicles", 1, 29], ["2 Chronicles", 1, 9], ["2 Kings", 1, 17], ["2 Chronicles", 10, 36],
  ["Obadiah", 1, 1], ["Joel", 1, 3], ["Jonah", 1, 4], ["Amos", 1, 9], ["Hosea", 1, 14], ["Isaiah", 1, 66],
  ["Micah", 1, 7], ["Nahum", 1, 3], ["Habakkuk", 1, 3], ["Zephaniah", 1, 3], ["2 Kings", 18, 25],
  ["Jeremiah", 1, 52], ["Lamentations", 1, 5], ["Ezekiel", 1, 48], ["Daniel", 1, 12], ["Esther", 1, 10],
  ["Ezra", 1, 10], ["Haggai", 1, 2], ["Zechariah", 1, 14], ["Nehemiah", 1, 13], ["Malachi", 1, 4],
  ["Matthew", 1, 28], ["Mark", 1, 16], ["Luke", 1, 24], ["John", 1, 21], ["Acts", 1, 28], ["Romans", 1, 16],
  ["1 Corinthians", 1, 16], ["2 Corinthians", 1, 13], ["Galatians", 1, 6], ["Ephesians", 1, 6],
  ["Philippians", 1, 4], ["Colossians", 1, 4], ["1 Thessalonians", 1, 5], ["2 Thessalonians", 1, 3],
  ["1 Timothy", 1, 6], ["2 Timothy", 1, 4], ["Titus", 1, 3], ["Philemon", 1, 1], ["Hebrews", 1, 13],
  ["James", 1, 5], ["1 Peter", 1, 5], ["2 Peter", 1, 3], ["1 John", 1, 5], ["2 John", 1, 1],
  ["3 John", 1, 1], ["Jude", 1, 1], ["Revelation", 1, 22],
];

const CHRONO_MONTH_LEN = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const CHRONO_MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const CHRONO_QUARTER_END = [90, 181, 273, 365];

export interface ChronoDay {
  day: number;
  label: string;
  groups: { book: string; from: number; to: number }[];
}

export interface ChronoWeek {
  week: number;
  from: number;
  to: number;
  days: ChronoDay[];
}

export interface ChronoMonth {
  name: string;
  from: number;
  to: number;
  days: ChronoDay[];
}

export interface ChronoQuarter {
  quarter: number;
  from: number;
  to: number;
  days: ChronoDay[];
}

function buildChronoPlan() {
  const flat: { book: string; ch: number }[] = [];
  CHRONO_SEGMENTS.forEach(([book, from, to]) => {
    for (let ch = from; ch <= to; ch++) flat.push({ book, ch });
  });
  const total = flat.length;
  const chunks: { book: string; ch: number }[][] = [];
  let idx = 0;
  for (let d = 0; d < 365; d++) {
    const end = Math.round(((d + 1) * total) / 365);
    chunks.push(flat.slice(idx, end));
    idx = end;
  }
  const dayList: ChronoDay[] = chunks.map((chunk, i) => {
    const groups: { book: string; from: number; to: number }[] = [];
    chunk.forEach((c) => {
      const last = groups[groups.length - 1];
      if (last && last.book === c.book && c.ch === last.to + 1) last.to = c.ch;
      else groups.push({ book: c.book, from: c.ch, to: c.ch });
    });
    const label = groups
      .map((g) => (g.from === g.to ? `${g.book} ${g.from}` : `${g.book} ${g.from}-${g.to}`))
      .join("; ");
    return { day: i + 1, label, groups };
  });

  const weeks: ChronoWeek[] = [];
  for (let w = 0; w < 53; w++) {
    const wDays = dayList.slice(w * 7, w * 7 + 7);
    if (!wDays.length) break;
    weeks.push({ week: w + 1, days: wDays, from: wDays[0].day, to: wDays[wDays.length - 1].day });
  }

  const months: ChronoMonth[] = [];
  let mIdx = 0;
  CHRONO_MONTH_LEN.forEach((len, i) => {
    const mDays = dayList.slice(mIdx, mIdx + len);
    months.push({ name: CHRONO_MONTH_NAMES[i], from: mDays[0].day, to: mDays[mDays.length - 1].day, days: mDays });
    mIdx += len;
  });

  const quarters: ChronoQuarter[] = [];
  let qStart = 0;
  CHRONO_QUARTER_END.forEach((end, i) => {
    const qDays = dayList.slice(qStart, end);
    quarters.push({ quarter: i + 1, from: qDays[0].day, to: qDays[qDays.length - 1].day, days: qDays });
    qStart = end;
  });

  return { dayList, weeks, months, quarters };
}

export const CHRONO_PLAN = buildChronoPlan();
