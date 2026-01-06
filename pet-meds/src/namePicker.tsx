import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react"
import { useState } from "react"
import { ChevronDown } from 'lucide-react'

type NamePickerDrops = {
    options: string[]
    initialValue?: string
    onChange?: (value: string) => void
}

export function NamePicker({ options, initialValue, onChange }: NamePickerDrops) {
  const [selected, setSelected] = useState(initialValue || "---")

  const handleChange = (value: string) => {
    setSelected(value)
    onChange?.(value)
  }

  return (
    <Listbox value={selected} onChange={handleChange}>
      {({ open }) => (
        <div className={`relative min-w-26 z-10 ${open ? "rounded-t" : "rounded"} bg-secondary-500 text-background-500`}>
          <ListboxButton className={`px-2 py-1 text-md w-full flex justify-end items-center gap-2 border-b ${open ? " border-text-500" : "border-background-500"}`}>
            {selected}
            <ChevronDown className="w-4 h-4" />
          </ListboxButton>

          <ListboxOptions className={`bg-secondary-500 text-background-500 w-full absolute right-0 py-1.5 ${open ? "rounded-b" : "rounded"} text-sm`}>
            {options.map((option, index) => (
              <ListboxOption
                key={index}
                value={option}
                className={`px-2.5 py-1 cursor-pointer hover:bg-gray-200 text-left`}
              >
                {option}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      )}
    </Listbox>
  )
}