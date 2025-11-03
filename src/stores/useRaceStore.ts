import gameService from "@/services/game.service";
import type {
  ICurrentRoundData,
  IHorse,
  IRaceResult,
  IRaceSchedule,
  IRaceStatus,
} from "@/types";
import { create } from "zustand";

type IRaceStore = {
  allHorses: IHorse[];
  raceSchedule: IRaceSchedule[];
  raceResults: IRaceResult[];
  currentRoundData?: ICurrentRoundData;
  currentRound: number;
  raceStatus:
    | "not_initiated"
    | "not_started"
    | "in_progress"
    | "finished"
    | "paused";

  initializeRaceSchedule: () => void;
  startNextRound: () => void;
  updateRaceStatus: (status: IRaceStatus) => void;
  updateHorsePositions: () => void;
};

export const useRaceStore = create<IRaceStore>((set, get) => ({
  allHorses: gameService.generateRaceHorses(20),
  raceSchedule: [],
  raceResults: [],
  currentRound: -1,
  raceStatus: "not_initiated",

  initializeRaceSchedule: () => {
    const { allHorses, startNextRound } = get();
    set({
      raceSchedule: gameService.initializeRaceSchedule(6, allHorses, 10),
      currentRound: -1,
      currentRoundData: undefined,
      raceStatus: "not_started",
      raceResults: [],
    });
    startNextRound();
  },

  startNextRound: () => {
    const { currentRound, raceSchedule } = get();
    const nextRound = currentRound + 1;

    if (nextRound < raceSchedule.length) {
      const currentRoundData = {
        round: raceSchedule[nextRound].round,
        distance: raceSchedule[nextRound].distance,
        participants: raceSchedule[nextRound].participants.map((horse) => ({
          ...horse,
          traveledDistance: 0,
          position: 0,
        })),
      };

      set({ currentRound: nextRound, currentRoundData });
    }
  },

  updateRaceStatus: (status: IRaceStatus) => {
    set({ raceStatus: status });
  },

  updateHorsePositions: () => {
    const { currentRoundData } = get();

    if (!currentRoundData) {
      return set({ raceStatus: "not_started" });
    }
    const finishedData = [] as { index: number; priority: number }[];
    const updatedParticipants = currentRoundData.participants.map(
      (horse, index) => {
        const newTraveledDistance =
          horse.traveledDistance + horse.condition * 0.1;
        if (
          newTraveledDistance >= currentRoundData.distance &&
          horse.position === 0
        ) {
          finishedData.push({ index, priority: newTraveledDistance });
        }
        return {
          ...horse,
          traveledDistance: Math.min(
            newTraveledDistance,
            currentRoundData.distance
          ),
        };
      }
    );

    if (finishedData.length > 0) {
      let lastPosition = currentRoundData.participants.filter(
        (h) => h.position > 0
      ).length;

      finishedData
        .sort((a, b) => {
          if (b.priority !== a.priority) {
            return b.priority - a.priority;
          }
          return a.index - b.index;
        })
        .forEach((data) => {
          lastPosition += 1;
          updatedParticipants[data.index].position = lastPosition;
        });
    }

    if (currentRoundData.participants.every((horse) => horse.position > 0)) {
      set({
        raceResults: [
          ...get().raceResults,
          {
            round: currentRoundData.round,
            distance: currentRoundData.distance,
            results: [...updatedParticipants]
              .sort((a, b) => a.position - b.position)
              .map((horse) => ({
                id: horse.id,
                name: horse.name,
                color: horse.color,
                position: horse.position,
              })),
          },
        ],
      });

      set({ raceStatus: "finished" });
    }

    set({
      currentRoundData: {
        ...currentRoundData,
        participants: updatedParticipants,
      },
    });
  },
}));
