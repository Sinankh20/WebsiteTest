import React from 'react'
import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import RoutineChoice from '../components/RoutineChoice'
import dummy from '../data/workoutData.json'
export const Route = createFileRoute('/')({
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
  const minWorkoutThisWeek=()=>{
    const now= new Date()
    const startWeekDay= new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
    const endOfTheWeek= new Date(startWeekDay.getFullYear(), startWeekDay.getMonth(), startWeekDay.getDate() + 7)
    const sum=dummy.history.filter(item=>{
      const [yyyy,mm,dd]= item.date.split('-').map(Number)
      const itemDate=new Date(yyyy,mm-1,dd)
      return itemDate>=startWeekDay && itemDate<endOfTheWeek
    }).reduce((acc,item)=> (item.durationMinutes+acc),0)
    return sum
  }
  const minPerWeek=minWorkoutThisWeek()
    const h = Math.floor(minPerWeek / 60)
    const m = minPerWeek % 60

  const weeklyVolume=()=>{
    const now= new Date()
    const startWeekDay= new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
    const endOfTheWeek= new Date(startWeekDay.getFullYear(), startWeekDay.getMonth(), startWeekDay.getDate() + 7)
    const sum=dummy.history.filter(item=>{
      const [yyyy,mm,dd]= item.date.split('-').map(Number)
      const itemDate=new Date(yyyy,mm-1,dd)
      return itemDate>=startWeekDay && itemDate<endOfTheWeek
    }).reduce((acc,item)=> (item.totalVolumeKg+acc),0)
    return sum
  }
  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <div className={choiceContainerView}>
        <RoutineChoice />
      </div>

      {choiceContainerView === 'hidden' && (
        <button
          className="text-xl font-bold border border-current rounded px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          onClick={handleStartWorkout}
        >
          Start Workout
        </button>
      )}

      {/* weekly stats cards */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-bold uppercase tracking-wider opacity-60">Weekly Stats</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="border border-current rounded-lg p-4 flex flex-col justify-between">
            <span className="text-sm opacity-70">This week you trained for:</span>
            <span className="text-xl font-bold mt-2">{h}h {m}min</span>
          </div>

          {/* Card 2: Total Volume Lifted */}
          <div className="border border-current rounded-lg p-4 flex flex-col justify-between">
            <span className="text-sm opacity-70">You also lifted:</span>
            <span className="text-xl font-bold mt-2">{weeklyVolume()} Kgs</span>
          </div>
        </div>
      </div>
    </div>
  )
}