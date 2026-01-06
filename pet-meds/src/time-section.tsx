import MedicationRow from "./medication-row";
import type { DayPart, DestroyRequestObject, EntryData, MedicationEntryResponse } from "./types";

interface TimeSectionProps {
  handleCreateEntry: (date: string, entryData: EntryData) => void;
  isCreating: boolean;
  handleDeleteEntry: (date: string, destroyObject: DestroyRequestObject) => void;
  isDeleting: boolean;
  todayEntries: MedicationEntryResponse[]
  date: string;
  dayPart: DayPart;
  petName: string;
}

const TimeSection: React.FC<TimeSectionProps> = ({
  handleCreateEntry,
  isCreating,
  handleDeleteEntry,
  isDeleting,
  todayEntries,
  date,
  dayPart,
  petName
}) => {
  const dayTimeEntries = todayEntries.filter(entry => entry.day_part == dayPart.part)

  return (
    <div className="px-4">
      <div className="text-4xl">{dayPart.part}</div>
      {dayPart.medication.map((medi, index) => (
        <MedicationRow
          key={index}
          handleCreateEntry={handleCreateEntry}
          isCreating={isCreating}
          handleDeleteEntry={handleDeleteEntry}
          isDeleting={isDeleting}
          dayTimeEntries={dayTimeEntries}
          date={date}
          dayPart={dayPart.part}
          petName={petName}
          medication={medi}
        />
      ))}
    </div>
  )
}

export default TimeSection;