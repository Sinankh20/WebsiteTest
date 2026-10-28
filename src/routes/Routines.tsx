import React from "react"
import { useState } from "react"
import { createFileRoute } from '@tanstack/react-router'
import dummy from '../data/workoutData.json'
import WorkoutEditor from "../components/WorkoutEditor"

export const Route = createFileRoute('/Routines')({
  component: Routines,
})
function Routines() {
  const [view, setView] = useState('none')  // none,editor,active
  const [selectedRoutine, setSelectedRoutine] = useState(null)
  const [targetRoutineId, setTargetRoutineId] = useState(null)
  const [routines, setRoutines] = useState(dummy.routines)
  
  const activeRoutine = routines.find(routine => routine.isTemplate === true) || routines[0]
  const targetRoutine = routines.find(routine => routine.id === targetRoutineId)

  const handleRoutineNameChange = (routineId, newName) => {
    const updatedRoutines = routines.map(routine => {
      if (routine.id === routineId) {
        return { ...routine, name: newName }
      }
      return routine
    })
    setRoutines(updatedRoutines)
    dummy.routines = updatedRoutines
  }
const handleDeleteRoutine = (routineId) => {
    const confirm = window.confirm("Are you sure you want to delete this routine?")
    if (confirm) {
      const updatedRoutines = routines.filter(routine => routine.id !== routineId)
      setRoutines(updatedRoutines)
      dummy.routines = updatedRoutines
    }
  }
  return (
    <div>
    {view === "editor" && (
                <WorkoutEditor 
                    data={selectedRoutine}
                    routineName={targetRoutine?.name}
                    handleSave={(newWorkoutData) => {
                      /// temp database update
                        alert("Workout saved successfully!")
                        console.log("Saved routine:", newWorkoutData)
                        
                        const newWorkout = {
                          id: `workout-${Date.now()}`,
                          name: newWorkoutData.title,
                          exercises: newWorkoutData.exercises
                        }

                        const updatedRoutines = routines.map(routine => {
                          if (routine.id === targetRoutineId) {
                            return {
                              ...routine,
                              workouts: [...routine.workouts, newWorkout]
                            }
                          }
                          return routine
                        })

                        setRoutines(updatedRoutines)
                        dummy.routines = updatedRoutines
                        setView("none")
                    }}
                    handleDelete={selectedRoutine ? () => {
                        const confirm = window.confirm("Are you sure you want to delete this workout?")
                        if (confirm) {
                          const updatedRoutines = routines.map(routine => {
                            if (routine.id === targetRoutineId) {
                              return {
                                ...routine,
                                workouts: routine.workouts.filter(w => w.id !== selectedRoutine.id)
                              }
                            }
                            return routine
                          })
                          setRoutines(updatedRoutines)
                          dummy.routines = updatedRoutines
                          setView("none")
                        }
                      } : null}
                    handleCancel={() => {
                      const confirm = window.confirm("Are you sure you want to discard this workout?")
                      if (confirm) {
                        setView("none")
                      }
                    }}
                />
              )}
      {/* {view === "active" && (
                <ActiveSession 
                    data={selectedRoutine}
                    onDiscard={() => setView("none")}
                    onComplete={(summary) => {
                      // temp database update
                        console.log("Saved workout summary:", summary)
                        setView("none")
                    }}
                />
            )} */}
    
      {view==="none"&& (
        <>
      // {/* Top container */}
      <div>
        <div>
          <h1>Your Routines</h1>
          <p> Add Your Routines Of Choice</p>
        </div>
        <button
          onClick={() => {
            const newRoutine = {
              id: `routine-${Date.now()}`,
              name: `New Routine ${routines.length + 1}`,
              isTemplate: false,
              workouts: []
            }
            const updatedRoutines = [...routines, newRoutine]
            setRoutines(updatedRoutines)
            dummy.routines = updatedRoutines
              }}
        >+ Add Routine</button>
      </div>
      {/* User routines */}
      <div className="space-y-6 mb-8">
        {routines.map((routine) => (
          <div key={routine.id} className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100">
            <div className="flex justify-between items-center mb-4">
              <input
                    type="text"
                    value={routine.name}
                    onChange={(e) => handleRoutineNameChange(routine.id, e.target.value)}
                    className="text-lg font-semibold text-gray-800 bg-transparent border-b border-transparent hover:border-purple-200 focus:border-purple-600 focus:outline-none px-1 py-0.5 transition"
                  />
                <div className="flex items-center gap-2">
                  <button
                      onClick={() => handleDeleteRoutine(routine.id)}
                      className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-xl text-sm font-medium transition"
                  >
                        Delete Routine
                  </button>
                    <button
                        onClick={() => {
                        setTargetRoutineId(routine.id)
                        setSelectedRoutine(null)
                        setView("editor")
                      }}
                        className="bg-purple-100 text-purple-700 hover:bg-purple-200 px-4 py-1.5 rounded-xl text-sm font-medium transition">
                  Add Workout
                    </button>
                </div>
            </div>
            
            {/* workout chip buttons */}
            <div className="flex flex-wrap gap-2">
              {routine.workouts.map((workout) => (
                <button
                 className="cursor-pointer"
                 onClick={()=>{
                  setTargetRoutineId(routine.id)
                  setSelectedRoutine(workout)
                  setView("editor")
                }}
                 >
                  <span
                    key={workout.id}
                    className="px-4 py-2 bg-purple-50 text-purple-800 rounded-full text-sm font-medium border border-purple-100"
                  >
                    {workout.name}
                  </span>
                </button>
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
          <button 
            onClick={() => {
                    // setSelectedRoutine(activeRoutine)
                    setView("active")
                  }}
            className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-sm hover:bg-purple-700 transition whitespace-nowrap">
            Start Workout
          </button>
        </div>
      </div>
      </>
      )}
    </div>
  )
}