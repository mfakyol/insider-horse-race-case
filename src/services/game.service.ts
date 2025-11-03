import type { IHorse, IRaceSchedule } from "@/types";
import { getNumberSuffix } from "@/utils/getNumberSuffix";
import { generateRandomColor } from "@/utils/generateRandomColor";
import { generateUniqueHorseName } from "@/utils/generateUniqueHorseName";
import { selectRandomHorses } from "@/utils/selectRandomHorses";

function generateRaceHorses(numHorses: number): IHorse[] {
  const horses: IHorse[] = [];
  for (let i = 0; i < numHorses; i++) {
    horses.push({
      id: i,
      name: generateUniqueHorseName(),
      color: generateRandomColor(),
      condition: 80 + Math.floor(Math.random() * 21),
    });
  }
  return horses;
}

function initializeRaceSchedule(
  rounds: number,
  horses: IHorse[],
  participantsPerRace: number
): IRaceSchedule[] {
  const schedule = [] as IRaceSchedule[];
  for (let i = 0; i < rounds; i++) {
    const participants = selectRandomHorses(horses, participantsPerRace);
    schedule.push({ round: i + 1, participants, distance: 1200 + i * 200 });
  }
  return schedule;
}

function getLapText(round: number, distance: number): string {
  return `${round}${getNumberSuffix(round)} Lap ${distance}m`;
}

const gameService = {
  generateRaceHorses,
  initializeRaceSchedule,
  getLapText,
};

export default gameService;
