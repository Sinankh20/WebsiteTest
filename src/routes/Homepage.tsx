import React from 'react'
import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import RoutineChoice from '../components/RoutineChoice'

export const Route = createFileRoute('/Homepage')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate=useNavigate()
  const [choiceContainerView, setChoiceContainerView] = useState('hidden')
  const handleStartWorkout=()=>{
    let oldSession=null
    for (let i=0;i<localStorage.length;i++){
      const key=localStorage.key(i)
      if(key && key.startsWith('session_')){
        oldSession=key
        break
      }
    }
    if (oldSession){
      const saved=localStorage.getItem(oldSession)
      const prevSessionTitle= JSON.parse(saved)?.sessionTitle
      console.log(oldSession)
      const confirm=window.confirm(`You already have an active ${prevSessionTitle} session! Would you like to continue where you left off or Delete the old session`)
      if (confirm){
        const part=oldSession.split("_")[1]
        const prevId=part.replace(/-\d+$/,'')
        console.log(prevId)
        
        navigate({to: `/ActiveSession/${prevId}`})
      } else{
        localStorage.clear()
        setChoiceContainerView('')
      }
    } else setChoiceContainerView('')
  }
  //hours per week
  const startOfTheWeek=(date)=>{
    const dateobj=new Date(date)
    const day=dateobj.getDay()
    
  }
  return (
    <div>
      <div className={choiceContainerView}>
        <RoutineChoice />
      </div>
      {choiceContainerView=='hidden' &&(
        <button onClick={handleStartWorkout}>Start Workout</button>
      )}
      <div>
        <h2>This week you trained for:</h2>

      </div>
      
    </div>
  )
}