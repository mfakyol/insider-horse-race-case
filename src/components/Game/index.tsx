import clsx from "clsx";
import styles from "./styles.module.scss";
import gameService from "@/services/game.service";
import { useRaceStore } from "@/stores/useRaceStore";
import { useEffect, useRef, useCallback } from "react";
import { getNumberSuffix } from "@/utils/getNumberSuffix";
import { ReactComponent as HorseIcon } from "@/assets/horse.svg";

function Game() {
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const raceStatus = useRaceStore((state) => state.raceStatus);
  const currentRoundData = useRaceStore((state) => state.currentRoundData);
  const updateHorsePositions = useRaceStore(
    (state) => state.updateHorsePositions
  );

  const animate = useCallback(
    (currentTime: number) => {
      // FPS kontrolü (60 FPS için ~16.67ms)
      const deltaTime = currentTime - lastTimeRef.current;

      if (deltaTime >= 16.67) {
        // 60 FPS
        updateHorsePositions();
        lastTimeRef.current = currentTime;
      }

      // Yarış devam ediyorsa animasyonu sürdür
      if (raceStatus === "in_progress") {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    },
    [raceStatus, updateHorsePositions]
  );

  useEffect(() => {
    if (raceStatus === "in_progress") {
      // Animasyonu başlat
      lastTimeRef.current = performance.now();
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      // Animasyonu durdur
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }

    // Cleanup function
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [raceStatus, animate]); // updateHorsePositions dependency'sini kaldırdık

  return (
    <div className={styles.horseRaceGame}>
      <h1 className={styles.title}>
        {currentRoundData &&
          gameService.getLapText(
            currentRoundData.round,
            currentRoundData.distance
          )}
      </h1>
      {currentRoundData ? (
        <div className={styles.raceTrack}>
          <div className={styles.lanes}>
            {currentRoundData.participants.map((horse, index) => (
              <div key={horse.id} className={styles.lane}>
                <div
                  className={styles.startingGate}
                  style={{ backgroundColor: horse.color }}
                >
                  {index + 1}
                </div>

                <div className={styles.laneName}>{horse.name}</div>

                <div
                  className={clsx(styles.finishLine)}
                  style={{ backgroundColor: horse.color }}
                >
                  {
                    <span
                      className={clsx(styles.finishAreaText, {
                        [styles.show]: !!horse.position,
                      })}
                    >
                      {`${horse.position}${getNumberSuffix(horse.position)}`}
                    </span>
                  }
                </div>
                <div
                  className={clsx(styles.raceHorse, {
                    [styles.running]:
                      raceStatus === "in_progress" &&
                      horse.traveledDistance < currentRoundData.distance,
                  })}
                  style={
                    {
                      "--percent": `${
                        (horse.traveledDistance / currentRoundData.distance) *
                        100
                      }%`,
                    } as React.CSSProperties
                  }
                >
                  <HorseIcon
                    className={styles.raceHorseIcon}
                    style={{ fill: horse.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className={styles.noRace}>
          No race in progress. Please Generate Program
        </p>
      )}
    </div>
  );
}

export default Game;
