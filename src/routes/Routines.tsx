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

  const handleSetActiveRoutine = (routineId) => {
    const updatedRoutines = routines.map(routine => ({
      ...routine,
      isTemplate: routine.id === routineId
    }))
    setRoutines(updatedRoutines)
    dummy.routines = updatedRoutines
  }

  const btnSecondary =
    "rounded-xl border border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 text-xs sm:text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
  const btnPrimary =
    "rounded-xl bg-gray-900 text-white hover:bg-black text-xs sm:text-sm font-medium shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"

  return (
    <div className="p-4 sm:p-6 w-full max-w-6xl mx-auto flex flex-col gap-6 relative">
      {/* workouteditor modal */}
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Your Routines</h1>
            <p className="text-xs sm:text-sm text-gray-500">Add Your Routines Of Choice</p>
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
            className={`${btnPrimary} px-4 py-2 sm:px-5 sm:py-2.5 w-full sm:w-auto text-center`}
          >
            + Add Routine
          </button>
        </div>

        {/* User routines */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 items-start">
          {routines.map((routine) => {
            const isCurrentActive = routine.isTemplate;
            return (
              <div key={routine.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={routine.name}
                    onChange={(e) => handleRoutineNameChange(routine.id, e.target.value)}
                    className="text-base font-bold text-gray-800 border-b border-gray-300 focus:border-gray-900 focus:outline-none px-1 py-0.5 w-full"
                  />
                  {isCurrentActive && (
                    <span className="text-[10px] font-semibold bg-gray-900 text-white px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0">
                      Active
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-4">
                  {/* Workout chip buttons */}
                  <div className="flex flex-wrap gap-2 w-full">
                    {routine.workouts.map((workout) => (
                      <button
                        key={workout.id}
                        className="rounded-full border border-gray-300 bg-gray-50 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-100 transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
                        onClick={() => {
                          setTargetRoutineId(routine.id)
                          setSelectedRoutine(workout)
                          setView("editor")
                        }}
                      >
                        {workout.name}
                      </button>
                    ))}
                    {routine.workouts.length === 0 && (
                      <p className="text-xs text-gray-400 italic">No workouts added yet.</p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleDeleteRoutine(routine.id)}
                      className={`${btnSecondary} px-3 py-1.5`}
                    >
                      Delete
                    </button>

                    <div className="flex items-center gap-2">
                      {!isCurrentActive && (
                        <button
                          onClick={() => handleSetActiveRoutine(routine.id)}
                          className={`${btnSecondary} px-3 py-1.5`}
                        >
                          Set Active
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setTargetRoutineId(routine.id)
                          setSelectedRoutine(null)
                          setView("editor")
                        }}
                        className={`${btnPrimary} px-3.5 py-1.5`}
                      >
                        + Add Workout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Active routine summary */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-gray-800">Active Routine Summary</h2>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-gray-900">{activeRoutine.name}</h3>
                <span className="text-[10px] bg-gray-900 text-white px-2 py-0.5 rounded-full font-medium">
                  Current
                </span>
              </div>
              <p className="text-xs text-gray-600">Status: In Progress ({dummy.activeSession?.title || 'No active session'})</p>
              <div className="flex flex-wrap gap-1.5">
                {activeRoutine.workouts.map((workout) => (
                  <span key={workout.id} className="text-xs border border-gray-200 bg-white text-gray-700 px-2.5 py-1 rounded-full font-medium">
                    {workout.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  )
}