import React from "react"
import { useState } from "react"
import { createFileRoute } from '@tanstack/react-router'
import dummy from '../data/workoutData.json'
import WorkoutEditor from "../components/WorkoutEditor"

export const Route = createFileRoute('/Routines')({
  component: Routines,
})

function Routines() {
  const [view, setView] = useState('none')  // none, editor, active
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
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {view === "editor" && (
        <WorkoutEditor 
            data={selectedRoutine}
            routineName={targetRoutine?.name}
            handleSave={(newWorkoutData) => {
              // temp database change
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
    
      {view === "none" && (
        <>
          {/* Top container */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 border rounded-lg">
            <div>
              <h1 className="text-xl font-bold">Your Routines</h1>
              <p className="text-xs">Add Your Routines Of Choice</p>
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
              className="border px-4 py-2 rounded text-sm font-medium whitespace-nowrap"
            >
              + Add Routine
            </button>
          </div>

          {/* User routines */}
          <div className="space-y-6">
            {routines.map((routine) => (
              <div key={routine.id} className="p-6 border rounded-lg space-y-4">
                <div>
                  <input
                    type="text"
                    value={routine.name}
                    onChange={(e) => handleRoutineNameChange(routine.id, e.target.value)}
                    className="text-base font-bold border-b focus:outline-none px-1 py-0.5 w-full"
                  />
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  {/* Workout chip buttons on the left */}
                  <div className="flex flex-wrap gap-2 w-full md:w-auto">
                    {routine.workouts.map((workout) => (
                      <button
                        key={workout.id}
                        className="border px-4 py-2 rounded-full text-xs font-medium cursor-pointer"
                        onClick={() => {
                          setTargetRoutineId(routine.id)
                          setSelectedRoutine(workout)
                          setView("editor")
                        }}
                      >
                        {workout.name}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <button
                      onClick={() => handleDeleteRoutine(routine.id)}
                      className="border px-3 py-1.5 rounded text-xs"
                    >
                      Delete Routine
                    </button>
                    <button
                      onClick={() => {
                        setTargetRoutineId(routine.id)
                        setSelectedRoutine(null)
                        setView("editor")
                      }}
                      className="border px-4 py-1.5 rounded text-xs font-medium"
                    >
                      Add Workout
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Active routine */}
          <div className="p-6 border rounded-lg space-y-4">
            <h2 className="text-base font-bold">Active Routine</h2>
            <div className="p-5 border rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-bold">{activeRoutine.name}</h3>
                <p className="text-xs">Status: In Progress ({dummy.activeSession.title})</p>
                <div className="flex flex-wrap gap-1.5">
                  {activeRoutine.workouts.map((workout) => (
                    <span key={workout.id} className="text-xs border px-2.5 py-1 rounded-full font-medium">
                      {workout.name}
                    </span>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => {
                  setView("active")
                }}
                className="border px-4 py-2 rounded text-xs font-medium whitespace-nowrap"
              >
                Start Workout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}