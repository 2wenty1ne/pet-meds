import { useEffect, useState } from "react";
import type { DayTime, DestroyRequestObject, EntryData, Medication, MedicationEntryResponse } from "./types";
import { useNameStore } from "./store";

interface MedicationRowProps {
  handleCreateEntry: (date: string, entryData: EntryData) => void;
  isCreating: boolean;
  handleDeleteEntry: (date: string, destroyObject: DestroyRequestObject) => void;
  isDeleting: boolean;
  dayTimeEntries: MedicationEntryResponse[]
  date: string;
  dayPart: DayTime;
  petName: string;
  medication: Medication;
}

const MedicationRow: React.FC<MedicationRowProps> = ({
  handleCreateEntry,
  isCreating,
  handleDeleteEntry,
  isDeleting,
  dayTimeEntries,
  date,
  dayPart,
  petName,
  medication
}) => {
  const [currentEntry, setCurrentEntry] = useState<MedicationEntryResponse | null>(null)
  const [isChecked, setIsChecked] = useState(false)
  const [isErrored, setIsErrored] = useState(false)
  const username = useNameStore((state) => state.name)

  const medicationEntrie = dayTimeEntries.filter(entry => entry.medication === medication.name)

  useEffect(() => {
    if (medicationEntrie.length === 0) {
      setCurrentEntry(null)
      setIsChecked(false)
    }
    else if (medicationEntrie.length === 1) {
      setCurrentEntry(medicationEntrie[0])
      setIsChecked(true)
    }
    else {
      setIsErrored(true)
    }
  }, [medicationEntrie.length])


  function clicked_wrapper() {
    const entryData: EntryData = {
      date: date,
      day_part: dayPart,
      user: username,
      pet: petName,
      medication: medication.name
    }

    handleCreateEntry(date, entryData)
  }

  function unchecked_wrapper() {
    if (!currentEntry) {
      return
    }

    const destroyRequestObject: DestroyRequestObject = {
      id: currentEntry?.id,
      date: currentEntry.date
    }

    handleDeleteEntry(date, destroyRequestObject)
  }

  if (isErrored) {
    return <div>ERROR - To many entries!!!</div>
  }

  var checkedDateString

  if (currentEntry && isChecked) {
    const checkedDateObject = new Date(currentEntry?.updated_at)
    const hour = checkedDateObject.getHours();
    const minutes = checkedDateObject.getMinutes();

    checkedDateString = `${hour}:${minutes}`
  }

  return (
    <div className="flex flex-row justify-between mt-2 mb-8">
      {/* Left text section */}
      <div className="basis-2/3 opacity-75">
        <div className="text-2xl">
          {medication.name}
        </div>
        <div className="text-base">
          {medication.description}
        </div>
      </div>

      {/* Right button section */}
      <div className="basis-1/3 flex flex-row justify-center items-center gap-4 py-2">
        {/* Button */}
        <div className="flex-none inline-flex items-center">
          <label className="flex items-center cursor-pointer relative">
          <input 
            type="checkbox" id={`${date}${dayPart}`} name={medication.id} value={medication.id}
            className="peer size-7 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border-2 border-secondary-500 checked:bg-secondary-500"
            checked={isChecked}
            disabled={isCreating || isDeleting}
            onChange={(e) => {
              e.target.disabled = true
              if (e.target.checked) {
                clicked_wrapper()
              } else {
                unchecked_wrapper()
              }
            }}
          />
          <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <svg xmlns="http://www.w3.org/2000/svg" className="size-5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" stroke-width="1">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
          </span>
          </label>
        </div>

        {/* Clicked Text */}
        <div className="flex-1 text-base text-secondary-500">
          {checkedDateString && (
            <div>
              <div>{checkedDateString}</div>
              <div>{currentEntry?.user}</div>
            </div>
          )}
        </div>

      </div>

    </div>
  )
}

export default MedicationRow;