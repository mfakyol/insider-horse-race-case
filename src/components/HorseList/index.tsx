import Title from "@/components/Title";
import Table from "@/components/Table";
import styles from "./styles.module.scss";
import { useRaceStore } from "@/stores/useRaceStore";
import { ReactComponent as HorseIcon } from "@/assets/horse.svg";

function HorseList() {
  const horses = useRaceStore((state) => state.allHorses);
  const currentRoundData = useRaceStore((state) => state.currentRoundData);

  return (
    <div className={styles.horseList}>
      <Title bgColor="var(--color-yellow)">
        Horse List (1 - {horses.length})
      </Title>
      <Table>
        <Table.THead>
          <Table.TR>
            <Table.TH>Name</Table.TH>
            <Table.TH>Condition</Table.TH>
            <Table.TH>Appearance</Table.TH>
          </Table.TR>
        </Table.THead>
        <Table.TBody>
          {horses.map((horse) => (
            <Table.TR
              key={horse.id}
              className={
                currentRoundData?.participants.some((h) => h.id === horse.id)
                  ? styles.activeHorse
                  : ""
              }
            >
              <Table.TD>{horse.name}</Table.TD>
              <Table.TD>{horse.condition}</Table.TD>
              <Table.TD>
                <HorseIcon
                  className={styles.horseIcon}
                  aria-label={`${horse.name} icon`}
                  style={{ fill: horse.color }}
                />
              </Table.TD>
            </Table.TR>
          ))}
        </Table.TBody>
      </Table>
    </div>
  );
}

export default HorseList;
