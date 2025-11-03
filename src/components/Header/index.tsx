import Button from "@/components/Button";
import styles from "./styles.module.scss";
import { useRaceStore } from "@/stores/useRaceStore";

function Header() {
  const currentRound = useRaceStore((state) => state.currentRound);
  const isLastRound = useRaceStore(
    (state) => state.currentRound === state.raceSchedule.length - 1
  );

  const raceStatus = useRaceStore((state) => state.raceStatus);

  const initializeRaceSchedule = useRaceStore(
    (state) => state.initializeRaceSchedule
  );
  const startNextRound = useRaceStore((state) => state.startNextRound);

  const handleStartRace = () => {
    const currentStatus = useRaceStore.getState().raceStatus;
    if (currentStatus === "not_started" || currentStatus === "paused") {
      useRaceStore.getState().updateRaceStatus("in_progress");
    } else if (currentStatus === "in_progress") {
      useRaceStore.getState().updateRaceStatus("paused");
    } else if (currentStatus === "finished") {
      startNextRound();
      useRaceStore.getState().updateRaceStatus("in_progress");
    }
  };

  const { text: startButtonText, disabled: startButtonDisabled } =
    getStartButtonAttr(raceStatus, currentRound, isLastRound);

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Horse Racing</h1>
      <div className={styles.buttons}>
        <Button variant="primary" onClick={initializeRaceSchedule}>
          Generate Program
        </Button>
        <Button
          variant="success"
          onClick={handleStartRace}
          disabled={startButtonDisabled}
        >
          {startButtonText}
        </Button>
      </div>
    </header>
  );
}

export default Header;

const getStartButtonAttr = (
  raceStatus: string,
  round: number,
  isLastRound: boolean
) => {
  let text = "";

  if (raceStatus === "in_progress") {
    text = "Pause Race";
  } else if (raceStatus === "paused") {
    text = "Resume Race";
  } else if (raceStatus === "finished") {
    text = round === 3 ? "Restart Race" : "Next Round";
  } else {
    text = "Start Race";
  }

  const disabled =
    raceStatus === "not_initiated" ||
    (raceStatus === "finished" && isLastRound);

  return { text, disabled };
};
