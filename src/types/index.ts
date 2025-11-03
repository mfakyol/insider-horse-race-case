export interface IHorse {
  id: number;
  name: string;
  color: string;
  condition: number;
}

export interface IRaceSchedule {
  round: number;
  participants: IHorse[];
  distance: number;
}

export interface IRaceResult {
  round: number;
  distance: number;
  results: {
    id: number;
    name: string;
    color: string;
    position: number;
  }[];
}

export interface ICurrentRoundData {
  round: number;
  distance: number;
  participants: {
    traveledDistance: number;
    id: number;
    name: string;
    color: string;
    condition: number;
    position: number;
  }[];
}

export type IRaceStatus =
  | "not_initiated"
  | "not_started"
  | "in_progress"
  | "finished"
  | "paused";
