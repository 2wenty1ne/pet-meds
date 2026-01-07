import { useQuery, useQueryClient } from '@tanstack/react-query';
import './App.css'
import DayTile from './day-tile';
import { dateToString, sendRequest } from './helper';
import type { ApiResponse, TemplateResponse } from './types';
import { NamePicker } from './namePicker';
import { useNameStore } from './store';
import { useEffect, useState } from 'react';

function App() {
  const ip = import.meta.env.VITE_WEBSERVER_IP
  const port = import.meta.env.VITE_WEBSERVER_PORT

  const queryClient = useQueryClient();

  const [selectedDate, setSelectedDate] = useState(new Date())
  const today = new Date()

  const changeName = useNameStore((state) => state.setName)
  const initialName = useNameStore((state) => state.name)

  const names = ["Vikkes", "Sus", "Herwi", "Hanni", "Pips"]

  //? WEBSOCKET
  useEffect(() => {
    console.log("Connectig to " + `ws://${ip}:${port}/api/v1/ws`)
    const ws = new WebSocket(`ws://${ip}:${port}/api/v1/ws`)

    ws.onopen = () => {
      console.log("Websocket connected")
    }

    ws.onmessage = (event) => {
      const date = event.data
      console.log("Invalidating date: " + date)

      queryClient.invalidateQueries({ queryKey: ["entries", date] })
    }

    ws.onerror = (error) => {
      console.log("Websocket error: ", error)
    }

    return () => ws.close()
  }, [])


  //? TEMPLATE query
  const {
    data: response,
    error,
  } = useQuery<ApiResponse<TemplateResponse>>({
    queryKey: ["template"],
    queryFn: () => sendRequest("GET", {}, "template"),
    staleTime: Infinity,
  })

  if (error || !response) {
    return <div>Error loading the template {error && (error.message)}</div>
  }

  const template = response.data

  const carlotta = template.pet.find(p => p.name === "carlotta")

  if (!carlotta) {
    return <div>Error loading carlotta</div>
  }


  function nextDayHandler() {
  setSelectedDate(prevDate => {
    const date = new Date(prevDate)
    date.setDate(date.getDate() + 1)
    return date
  })
  }
  
  function prevDayHandler() {
  setSelectedDate(prevDate => {
    const date = new Date(prevDate)
    date.setDate(date.getDate() - 1)
    return date
  })
  }


  return (
    <div className="font-default min-h-screen overflow-hidden bg-background-500 text-text-500 px-8 py-4">
      <div className='flex flex-col justify-center items-center'>
        <div className='flex flex-row justify-end w-full'>
          <NamePicker 
            options={names}
            initialValue={initialName}
            onChange={changeName}
          />
        </div>
        <div className="flex-none mt-32 text-4xl">{carlotta.titleName} Medizin</div>
        
        <DayTile
          pet={carlotta}
          date={dateToString(selectedDate)}
          today={dateToString(today)}
          nextDayHandler={nextDayHandler}
          prevDayHandler={prevDayHandler}
        />
      </div>
    </div>
  );
}

export default App;
