import Title from "@/components/Title";
import Table from "@/components/Table";
import styles from "./styles.module.scss";
import { useRaceStore } from "@/stores/useRaceStore";
import { getNumberSuffix } from "@/utils/getNumberSuffix";

function ResultList() {
  const raceResults = useRaceStore((state) => state.raceResults);

  return (
    <div className={styles.scheduleList}>
      <Title bgColor="var(--color-green)">Results</Title>
      {raceResults.length > 0 ? (
        raceResults.map((race) => (
          <div key={race.round} className={styles.raceCard}>
            <Title bgColor="var(--color-pink)" size="medium">
              {`${race.round}${getNumberSuffix(race.round, true)} Lap - ${
                race.distance
              }m`}
            </Title>
            <Table>
              <Table.THead>
                <Table.TR>
                  <Table.TH>Rank</Table.TH>
                  <Table.TH>Name</Table.TH>
                </Table.TR>
              </Table.THead>
              <Table.TBody>
                {race.results.map((r, index) => (
                  <Table.TR key={r.id}>
                    <Table.TD>{index + 1}</Table.TD>
                    <Table.TD>{r.name}</Table.TD>
                  </Table.TR>
                ))}
              </Table.TBody>
            </Table>
          </div>
        ))
      ) : (
        <p className={styles.noResults}>
          No results available. Please complete a race.
        </p>
      )}
    </div>
  );
}

export default ResultList;
