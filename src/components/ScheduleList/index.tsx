import Table from "@/components/Table";
import Title from "@/components/Title";
import styles from "./styles.module.scss";
import { useRaceStore } from "@/stores/useRaceStore";
import { getNumberSuffix } from "@/utils/getNumberSuffix";

function ScheduleList() {
  const raceSchedule = useRaceStore((state) => state.raceSchedule);

  return (
    <div className={styles.scheduleList}>
      <Title bgColor="var(--color-blue)">Program</Title>
      {raceSchedule.length > 0 ? (
        raceSchedule.map((race) => (
          <div key={race.round} className={styles.raceCard}>
            <Title bgColor="var(--color-pink)" size="medium">
              {`${race.round}${getNumberSuffix(race.round, true)} Lap - ${
                race.distance
              }m`}
            </Title>

            <Table>
              <Table.THead>
                <Table.TR>
                  <Table.TH>Track</Table.TH>
                  <Table.TH>Name</Table.TH>
                </Table.TR>
              </Table.THead>
              <Table.TBody>
                {race.participants.map((horse, index) => (
                  <Table.TR key={horse.id}>
                    <Table.TD>{index + 1}</Table.TD>
                    <Table.TD>{horse.name}</Table.TD>
                  </Table.TR>
                ))}
              </Table.TBody>
            </Table>
          </div>
        ))
      ) : (
        <p className={styles.noProgram}>
          No program available. Please generate a program.
        </p>
      )}
    </div>
  );
}

export default ScheduleList;
