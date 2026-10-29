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

  const btnSecondary =
    "rounded-xl border border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
  const btnPrimary =
    "rounded-xl bg-gray-900 text-white hover:bg-black text-sm font-medium shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"

  return (
    <div className="p-6 w-full max-w-6xl mx-auto flex flex-col gap-6 relative">
      {/* workouteditor */}

        <div className={`fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-2 md:p-4 overflow-y-auto transition-all duration-500 ${view==='editor' ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'}`}>
          <div className="bg-white w-full h-full md:h-auto md:max-h-[90vh] md:max-w-6xl md:rounded-2xl shadow-2xl p-4 md:p-6 overflow-y-auto flex flex-col transition-all duration-300">
            <WorkoutEditor 
                key={selectedRoutine?.id}
                data={selectedRoutine}
                routineName={targetRoutine?.name}
                handleSave={(newWorkoutData) => {
                const updatedRoutines = routines.map(routine => {
                  if (routine.id !== targetRoutineId) return routine
                  if (newWorkoutData.id) {
                    return {
                      ...routine,
                      workouts: routine.workouts.map(workout =>
                        workout.id === newWorkoutData.id
                          ? { ...workout, name: newWorkoutData.name, exercises: newWorkoutData.exercises }
                          : workout
                      )
                    }
                  }
                  return {
                    ...routine,
                    workouts: [
                      ...routine.workouts,
                      {
                        id: `workout-${Date.now()}`,
                        name: newWorkoutData.name,
                        exercises: newWorkoutData.exercises
                      }
                    ]
                  }
                })
                alert("Workout saved successfully!")
                console.log("Saved routine:", newWorkoutData)

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
          </div>
        </div>

    
       
        <>
          {/* Top container */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Your Routines</h1>
              <p className="text-sm text-gray-500">Add Your Routines Of Choice</p>
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
              className={`${btnPrimary} px-5 py-2.5 whitespace-nowrap`}
            >
              + Add Routine
            </button>
          </div>

          {/* User routines */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 items-start">
            {routines.map((routine) => (
              <div key={routine.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
                <div>
                  <input
                    type="text"
                    value={routine.name}
                    onChange={(e) => handleRoutineNameChange(routine.id, e.target.value)}
                    className="text-base font-bold text-gray-800 border-b border-gray-300 focus:border-gray-900 focus:outline-none px-1 py-0.5 w-full"
                  />
                </div>
                <div className="flex flex-col gap-4">
                  {/* Workout chip buttons on the left */}
                  <div className="flex flex-wrap gap-2 w-full ">
                    {routine.workouts.map((workout) => (
                      <button
                        key={workout.id}
                        className="rounded-full border border-gray-300 bg-gray-50 px-4 py-2 text-md sm:text-xs font-medium text-gray-700 hover:bg-gray-100 transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
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
                  <div className="flex items-center justify-end gap-2 whitespace-nowrap pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleDeleteRoutine(routine.id)}
                      className={`${btnSecondary} px-3 py-1.5 text-md sm:text-xs`}
                    >
                      Delete Routine
                    </button>
                    <button
                      onClick={() => {
                        setTargetRoutineId(routine.id)
                        setSelectedRoutine(null)
                        setView("editor")
                      }}
                      className={`${btnPrimary} px-4 py-1.5 text-md sm:text-xs`}
                    >
                      Add Workout
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Active routine */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-gray-800">Active Routine</h2>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-gray-900">{activeRoutine.name}</h3>
                <p className="text-xs text-gray-600">Status: In Progress ({dummy.activeSession.title})</p>
                <div className="flex flex-wrap gap-1.5">
                  {activeRoutine.workouts.map((workout) => (
                    <span key={workout.id} className="text-xs border border-gray-200 bg-white text-gray-700 px-2.5 py-1 rounded-full font-medium">
                      {workout.name}
                    </span>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => {
                  setView("active")
                }}
                className={`${btnPrimary} px-5 py-2.5 whitespace-nowrap`}
              >
                Start Workout
              </button>
            </div>
          </div>
        </>
      
    </div>
  )
}