import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import TimeSection from "./time-section";
import type { ApiResponse, DestroyRequestObject, EntryData, MedicationEntryResponse, Pet } from "./types";
import { sendRequest } from "./helper";

type DayTileProps = {
  pet: Pet;
  date: string;
  today: string;
  nextDayHandler: () => void;
  prevDayHandler: () => void;
}

export default function DayTile({ pet, date, today ,nextDayHandler, prevDayHandler }: DayTileProps) {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: ({ 
        date: _date, 
        entryData 
      }: {
        date: string,
        entryData: EntryData
      }) => sendRequest("POST", entryData, "medicine"),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['entries', variables.date]
      })
    }
  })

  const destroyMutation = useMutation({
    mutationFn: ({
        date: _date,
        destroyObject
      }: {
        date: string,
        destroyObject: DestroyRequestObject
      }) => sendRequest("DELETE", destroyObject, "medicine"),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["entries", variables.date]
      })
    }
  })


  const {
    data: response,
    error,
  } = useQuery<ApiResponse<MedicationEntryResponse[]>>({
    queryKey: ['entries', date],
    queryFn: () => sendRequest("GET", {}, "medicine", date),
    placeholderData: (previousData) => previousData
  })

  if (error || !response) {
    return <div>Error loading day tile data {error && (error.message)}</div>
  }

  var entries = response.data

  if (entries == null) {
    entries = []
  }

  const todayEntries = entries.filter(entry => entry.date == date)


  const handleCreateEntry = async(date: string, entryData: EntryData) => {
    await createMutation.mutateAsync({
      date: date,
      entryData: entryData
    })
  }

  const handleDeleteEntry = async(date: string, destroyObject: DestroyRequestObject) => {
    await destroyMutation.mutateAsync({
      date: date,
      destroyObject: destroyObject
    })
  }


  return (
    <div className="flex-1 self-stretch my-16 text-3xl border-2 border-text-500 rounded-md">
      <div className='flex justify-center align-middle gap-10 py-8'>
          <button 
            className="disabled:opacity-50" 
            onClick={prevDayHandler}
          >
            &lt;
          </button>
          <div>{date}</div>
          <button 
            className="disabled:opacity-50" 
            onClick={nextDayHandler} 
            disabled={date === today || createMutation.isPending || destroyMutation.isPending}
          >
            &gt;
          </button>
      </div>
      {pet.dayParts.map((dayPart, index) => (
        <TimeSection
          key={index}
          handleCreateEntry={handleCreateEntry}
          isCreating={createMutation.isPending}
          handleDeleteEntry={handleDeleteEntry}
          isDeleting={destroyMutation.isPending}
          todayEntries={todayEntries}
          date={date}
          dayPart={dayPart}
          petName={pet.name}
        />
      ))}
    </div>
  )
}