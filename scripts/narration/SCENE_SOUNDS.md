# Scene sounds — plan, cue sheets and sources for approval

Status: **the app can play the layer and has the on/off switch (Settings → Scene Sounds); no real sounds are
installed yet.** Nothing below may be used until you approve it. I cannot verify licences automatically, and
terms change — **confirm each sound's licence on its own page before it goes in the app**, and keep the record
(`assets/scene-sounds/LICENSES.json`; the installer refuses sounds that have none).

## How it works
- Separate layer, not baked into the narration. Listeners switch it on/off in Settings (on by default, stored on the phone).
- Only chosen passages have a cue sheet (`constants/audio/sceneSounds.ts`), e.g. Genesis 1 and Matthew 11:16–19.
  A cue plays while the narration is inside its verse range and fades in/out; it follows the voice, so re-recording
  the voice never breaks it. Works with the iPhone voice too.
- Sounds ship inside the app (about 40 short loops would be roughly 12–20 MB), so the switch is instant and works offline.

## Draft cue sheets (react to these)
**Genesis 1 — the creation**
| Verses | Sound | Notes |
|---|---|---|
| 2 | wind over water | "the Spirit of God moved upon the face of the waters" |
| 3 | soft light shimmer | once, just after "Let there be light" |
| 6–8 | high wind | the firmament |
| 9–10 | ocean waves | waters gathered, the seas |
| 11–13 | breeze in leaves | grass, herbs, fruit trees |
| 20–23 | dawn birdsong; a splash at v.21 | waters bring forth, fowl, great whales |
| 24–25 | field animals (cattle, sheep, far off) | beasts of the earth |
| 31 | gentle birdsong, fading | "it was very good" |

**Matthew 11:16–19 — the children in the marketplace**
| Verses | Sound | Notes |
|---|---|---|
| 16–19 | marketplace crowd murmur | under the whole passage |
| 16–17 | children playing | "children sitting in the markets" |
| 17 | shepherd's pipe (once, at the start) | "We have piped unto you" |
| 17 | distant mourning/wailing (fades in ~5 s later) | "we have mourned unto you" |
| 18 | desert wind | John "neither eating nor drinking" |
| 19 | banquet chatter, cups | "eating and drinking" |

Sounds to source for these two scenes: wind-over-water, light-shimmer, wind-high, ocean-waves, leaves-breeze,
birds-dawn, water-splash, animals-field, marketplace-crowd, children-playing, shepherd-pipe, mourning-wail,
desert-wind, banquet-chatter (14). Format: AAC (.m4a) or .mp3, 30–60 s seamless loops, stereo, ~96 kbps.

## Sites for your approval
Commercial-use friendly, as I understand their terms today (verify on the page):

| Site | Licence (as I understand it) | Fit | Notes |
|---|---|---|---|
| **Freesound.org**, filtered to **CC0** | CC0 = public domain, no credit needed | Best all-round | Use only CC0. Avoid "CC BY" (needs credit) and anything "NonCommercial". Keep each sound's page URL. |
| **Sonniss GameAudioGDC bundles** | Royalty-free for commercial use, no credit | Highest quality ambiences | Free yearly packs of professional recordings; large downloads; you may not resell the files on their own. |
| **Pixabay Sound Effects** | Pixabay Content Licence: free commercial use, no credit | Quick, decent range | Cannot be redistributed as standalone files; fine embedded in an app. Read the current licence. |
| **Mixkit** (Envato) | Mixkit Sound Effects licence: free commercial use, no credit | Smaller, curated set | Same standalone-redistribution limit. |
| **Wikimedia Commons / Internet Archive** | Varies per file (public domain / CC0 / CC BY) | Rare/ancient sounds (pipe, crowd) | Check each file; skip anything that needs credit unless you will add credits. |
| **Zapsplat** | Free tier needs a credit line; paid tier no credit | Large library | Only if you accept an attribution screen or pay. |
| **AI sound generation** (e.g. ElevenLabs Sound Effects, Stable Audio) | Depends on the plan/model licence | Custom scenes ("shepherd's pipe in a market") | Needs a paid plan with commercial rights for ElevenLabs; check Stable Audio's licence before use. Good for sounds nothing else has. |

**Do not use:** the BBC Sound Effects archive (personal/educational/research use only — not for an app you sell),
any "NonCommercial" Creative Commons sound, or sounds ripped from films, games or YouTube.

Recommendation: start with Freesound (CC0), Sonniss and Pixabay; use AI generation only for the few sounds you cannot find
(the shepherd's pipe, the mourning). Tell me which sites you approve and I will search them, list candidates for each of
the 14 sounds with their licence and URL for you to pick, then download, loop-edit and install the ones you choose.
