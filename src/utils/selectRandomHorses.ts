import type { IHorse } from "@/types";

export function selectRandomHorses(horses: IHorse[], count: number): IHorse[] {
  const shuffled = [...horses].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
