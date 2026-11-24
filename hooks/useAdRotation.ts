import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type AdKey = "faceJerusalem" | "mmov";

const STORAGE_KEY = "desk-ad-rotation";

interface RotationState {
  adKey: AdKey;
  opens: number;
  switchAt: number;
}

function randomSwitchAt() {
  // Switches after a random 3-5 openings on the current ad.
  return 3 + Math.floor(Math.random() * 3);
}

// Tracks how many times the Desk screen has opened on the current ad and
// swaps to the other one once a random 3-5 opens is reached, persisting
// across app launches.
export function useAdRotation(): AdKey {
  const [adKey, setAdKey] = useState<AdKey>("faceJerusalem");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      let state: RotationState;
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        state = raw ? (JSON.parse(raw) as RotationState) : { adKey: "faceJerusalem", opens: 0, switchAt: randomSwitchAt() };
      } catch {
        state = { adKey: "faceJerusalem", opens: 0, switchAt: randomSwitchAt() };
      }

      const opens = state.opens + 1;
      const shouldSwitch = opens >= state.switchAt;
      const next: RotationState = shouldSwitch
        ? { adKey: state.adKey === "faceJerusalem" ? "mmov" : "faceJerusalem", opens: 0, switchAt: randomSwitchAt() }
        : { ...state, opens };

      if (!cancelled) setAdKey(next.adKey);
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Non-fatal — worst case the rotation resets next launch.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return adKey;
}
