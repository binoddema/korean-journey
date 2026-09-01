let cached: SpeechSynthesisVoice[] = [];

const loadVoices = (): SpeechSynthesisVoice[] => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return [];
  if (cached.length === 0) cached = window.speechSynthesis.getVoices();
  return cached;
};

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    cached = window.speechSynthesis.getVoices();
  };
}

export const koreanVoice = (): SpeechSynthesisVoice | null =>
  loadVoices().find((v) => v.lang.toLowerCase().startsWith("ko")) ?? null;

export const speechSupported = (): boolean =>
  typeof window !== "undefined" && "speechSynthesis" in window;

/** Stato dell'audio, usato per avvisare l'utente senza rompere l'app. */
export type SpeechState = "ok" | "no-korean-voice" | "unsupported";

export const speechState = (): SpeechState => {
  if (!speechSupported()) return "unsupported";
  return koreanVoice() ? "ok" : "no-korean-voice";
};

export const speak = (text: string, slow = false): SpeechState => {
  const state = speechState();
  if (state === "unsupported") return state;
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "ko-KR";
  u.rate = slow ? 0.65 : 0.95;
  const v = koreanVoice();
  if (v) u.voice = v;
  synth.speak(u);
  return state;
};
