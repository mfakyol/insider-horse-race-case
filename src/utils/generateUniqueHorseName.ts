import { HORSE_ADJECTIVES, HORSE_NOUNS } from "@/constants/horseNames";

export function generateUniqueHorseName(): string {
  const usedNames = new Set<string>();

  let attempts = 0;
  const maxAttempts = 100;

  while (attempts < maxAttempts) {
    const adjective =
      HORSE_ADJECTIVES[Math.floor(Math.random() * HORSE_ADJECTIVES.length)];
    const noun = HORSE_NOUNS[Math.floor(Math.random() * HORSE_NOUNS.length)];
    const name = `${adjective} ${noun}`;

    if (!usedNames.has(name)) {
      usedNames.add(name);
      return name;
    }

    attempts++;
  }

  let counter = 1;
  let baseName: string;
  do {
    const adjective =
      HORSE_ADJECTIVES[Math.floor(Math.random() * HORSE_ADJECTIVES.length)];
    const noun = HORSE_NOUNS[Math.floor(Math.random() * HORSE_NOUNS.length)];
    baseName = `${adjective} ${noun} ${counter}`;
    counter++;
  } while (usedNames.has(baseName));

  usedNames.add(baseName);
  return baseName;
}
