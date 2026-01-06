
export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
}

export type DayTime = "Morgens" | "Mittags" | "Abends"

export type EntryData = {
  date: string;
  day_part: DayTime;
  user: string;
  pet: string;
  medication: string;
}

export type MedicationEntryResponse = {
  id: string;
  date: string;
  day_part: DayTime;
  user: string;
  pet: string;
  medication: string;
  updated_at: string;
}

export type DestroyRequestObject = {
  id: string;
  date: string;
}


export type Medication = {
  id: string;
  name: string;
  description: string;
}

export type DayPart = {
  part: DayTime;
  medication: Medication[];
}

export type Pet = {
  name: string;
  titleName: string;
  dayParts: DayPart[];
}

export type TemplateResponse = {
  pet: Pet[];
}
