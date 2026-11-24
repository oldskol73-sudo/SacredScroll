// `@instantdb/react-native` unconditionally imports `react-native-get-random-values`
// to back `uuid`'s `crypto.getRandomValues`. That package's native-module detection
// is stale (last updated for "Expo SDK 45-48") and throws `Native module not found`
// on current Expo Go. Expo's own `expo-crypto` isn't a fix either — its native
// `ExpoCrypto` module also isn't present in current Expo Go builds.
//
// InstantDB only uses this to generate opaque, collision-resistant row IDs (via
// uuid v4), not anything security-sensitive like tokens or keys — so a pure-JS,
// Math.random()-backed implementation is perfectly adequate here, and has zero
// native-module dependency, so it works identically in Expo Go, a dev client, or
// a production build.
//
// This file must be the very first import in app/_layout.tsx —
// react-native-get-random-values only installs its (broken) fallback when
// `global.crypto.getRandomValues` isn't already a function, so setting it first
// makes that fallback a no-op.
type TypedIntArray =
  | Int8Array
  | Uint8Array
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Uint8ClampedArray;

function getRandomValues<T extends TypedIntArray>(array: T): T {
  for (let i = 0; i < array.length; i++) {
    array[i] = Math.floor(Math.random() * 256);
  }
  return array;
}

type CryptoLike = { getRandomValues: typeof getRandomValues };

const g = globalThis as unknown as { crypto?: CryptoLike };

if (typeof g.crypto !== "object" || g.crypto === null) {
  g.crypto = {} as CryptoLike;
}
if (typeof g.crypto.getRandomValues !== "function") {
  g.crypto.getRandomValues = getRandomValues;
}
