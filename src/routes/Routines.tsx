import React from "react"
import { useState } from "react"
import { createFileRoute } from '@tanstack/react-router'
import dummy from '../data/workoutData.json'
export const Route = createFileRoute('/Routines')({
  component: Routines,
})
function Routines() {
  const [routines, setRoutines] = useState(dummy.routines)
  const activeRoutine = routines.find(routine => routine.id === "routine-1") || routines[0]
  return (
    <div>
      {/* Top container */}
      <div>
        <div>
          <h1>Your Routines</h1>
          <p> Add Your Routines Of Choice</p>
        </div>
        <button>+ Add Routine</button>
      </div>
      {/* User routines */}
      <div className="space-y-6 mb-8">
        {routines.map((routine) => (
          <div key={routine.id} className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">{routine.name}</h2>
              <button className="bg-purple-100 text-purple-700 hover:bg-purple-200 px-4 py-1.5 rounded-xl text-sm font-medium transition">
                Add Workout
              </button>
            </div>
            
            {/* workout chip buttons */}
            <div className="flex flex-wrap gap-2">
              {routine.workouts.map((workout) => (
                <span 
                  key={workout.id} 
                  className="px-4 py-2 bg-purple-50 text-purple-800 rounded-full text-sm font-medium border border-purple-100"
                >
                  {workout.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Active routine */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Active Routine</h2>
        <div className="p-5 bg-purple-50 rounded-xl border border-purple-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-base font-bold text-purple-900">{activeRoutine.name}</h3>
            <p className="text-xs text-purple-600 mb-2">Status: In Progress ({dummy.activeSession.title})</p>
            <div className="flex flex-wrap gap-1.5">
              {activeRoutine.workouts.map((workout) => (
                <span key={workout.id} className="text-xs bg-white text-purple-700 px-2.5 py-1 rounded-full border border-purple-200 font-medium">
                  {workout.name}
                </span>
              ))}
            </div>
          </div>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-sm hover:bg-purple-700 transition whitespace-nowrap">
            Start Workout
          </button>
        </div>
      </div>
    </div>
  )
}