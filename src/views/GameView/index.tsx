import Game from "@/components/Game";
import Header from "@/components/Header";
import styles from "./styles.module.scss";
import HorseList from "@/components/HorseList";
import ResultList from "@/components/ResultList";
import ScheduleList from "@/components/ScheduleList";

function GameView() {
  return (
    <div className={styles.gameView}>
      <Header />
      <main className={styles.main}>
        <HorseList />
        <Game />
        <ScheduleList />
        <ResultList />
      </main>
    </div>
  );
}

export default GameView;
