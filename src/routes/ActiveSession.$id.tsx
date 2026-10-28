import { createFileRoute, useRouter } from '@tanstack/react-router'
import React, { useState, useEffect } from "react"

export const Route = createFileRoute("/ActiveSession/$id")({
  component: ActiveSession,
})

export default function ActiveSession() {
    const router = useRouter()
    const { id } = Route.useParams()
    console.log("Current Workout ID:", id)

    const [sessionTitle, setSessionTitle] = useState(`Active Workout #${id}`)
    const [exercises, setExercises] = useState([
        {
            id: 1,
            name: "Barbell Bench Press",
            sets: [
                { id: 1, weight: 60, reps: 10, done: false },
                { id: 2, weight: 60, reps: 8, done: false }
            ]
        }
    ])
    
    // Timer
    const [seconds, setSeconds] = useState(0)
    useEffect(() => {
        const timer = setInterval(() => {
            setSeconds(prev => prev + 1)
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    const formatTimer = (totalSeconds) => {
        const mins = Math.floor(totalSeconds / 60)
        const secs = totalSeconds % 60
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    }

    const handleToggleSet = (exerciseId, setId) => {
        setExercises(exercises.map(ex => {
            if (ex.id === exerciseId) {
                return {
                    ...ex,
                    sets: ex.sets.map(s => s.id === setId ? { ...s, done: !s.done } : s)
                }
            }
            return ex
        }))
    }

    const handleAddExercise = () => {
        const safeExercises = Array.isArray(exercises) ? exercises : []
        const newExId = safeExercises.length > 0 ? safeExercises[safeExercises.length - 1].id + 1 : 1
        setExercises([
            ...safeExercises,
            {
                id: newExId,
                name: "New Exercise",
                sets: [{ id: 1, weight: 0, reps: 0, done: false }],
            },
        ])
    }

    const handleDeleteExercise = (exerciseId) => {
        setExercises(exercises.filter((item) => item.id !== exerciseId))
    }

    const handleAddSet = (exerciseId) => {
        setExercises(exercises.map(ex => {
            if (ex.id === exerciseId) {
                const safeSets = Array.isArray(ex.sets) ? ex.sets : []
                const newSetId = safeSets.length > 0 ? safeSets[safeSets.length - 1].id + 1 : 1
                return {
                    ...ex,
                    sets: [...safeSets, { id: newSetId, weight: 0, reps: 0, done: false }]
                }
            }
            return ex
        }))
    }

    const handleDeleteSet = (exerciseId, setId) => {
        setExercises(
            exercises.map((item) => {
                if (item.id === exerciseId) {
                    const safeSets = Array.isArray(item.sets) ? item.sets : []
                    return { ...item, sets: safeSets.filter((set) => set.id !== setId) }
                }
                return item
            })
        )
    }

    const totalVolume = exercises.reduce((acc, ex) => {
        return acc + (Array.isArray(ex.sets) ? ex.sets.reduce((setAcc, s) => setAcc + (s.done ? (Number(s.weight) * Number(s.reps)) : 0), 0) : 0)
    }, 0)

    const completedExercisesCount = exercises.filter(ex => Array.isArray(ex.sets) && ex.sets.some(s => s.done)).length

    const handleFinish = () => {
        router.navigate({ to: '/Homepage' })
    }

    const handleDiscard = () => {
        router.navigate({ to: '/Homepage' })
    }

    return (
        <div>
            {/* Header */}
            <div>
                <div>
                    <input
                        type="text"
                        value={sessionTitle}
                        onChange={(e) => setSessionTitle(e.target.value)}
                    />
                    <span>● Live Workout (ID: {id})</span>
                </div>

                <div>
                    <div>
                        <span>Duration</span>
                        <span>{formatTimer(seconds)}</span>
                    </div>
                    <div>
                        <span>Exercises</span>
                        <span>{completedExercisesCount}/{exercises.length}</span>
                    </div>
                    <div>
                        <span>Volume</span>
                        <span>{totalVolume} Kg</span>
                    </div>
                </div>
                <button onClick={handleAddExercise}>+ Add Exercise</button>
            </div>

            {/* Exercises List */}
            <div>
                {exercises.map((exercise) => (
                    <div key={exercise.id}>
                        <div>
                            <input
                                type="text"
                                value={exercise.name}
                                onChange={(e) => {
                                    const val = e.target.value
                                    setExercises(
                                        exercises.map((item) =>
                                            item.id === exercise.id
                                                ? { ...item, name: val }
                                                : item
                                        )
                                    )
                                }}
                            />
                            <button onClick={() => handleDeleteExercise(exercise.id)}>
                                Delete Exercise
                            </button>
                        </div>

                        <div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Set</th>
                                        <th>Weight</th>
                                        <th>Reps</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {exercise.sets.map((set, index) => (
                                        <tr key={set.id}>
                                            <td>#{index + 1}</td>
                                            <td>
                                                <input 
                                                    type="number" 
                                                    value={set.weight} 
                                                    onChange={(e) => {
                                                        const val = e.target.value
                                                        setExercises(exercises.map(ex => ex.id === exercise.id ? {
                                                            ...ex,
                                                            sets: ex.sets.map(s => s.id === set.id ? { ...s, weight: val } : s)
                                                        } : ex))
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <input 
                                                    type="number" 
                                                    value={set.reps} 
                                                    onChange={(e) => {
                                                        const val = e.target.value
                                                        setExercises(exercises.map(ex => ex.id === exercise.id ? {
                                                            ...ex,
                                                            sets: ex.sets.map(s => s.id === set.id ? { ...s, reps: val } : s)
                                                        } : ex))
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <button 
                                                    onClick={() => handleToggleSet(exercise.id, set.id)}
                                                >
                                                    {set.done ? "✓ Done" : "Mark"}
                                                </button>
                                            </td>
                                            <td>
                                                <button 
                                                    onClick={() => handleDeleteSet(exercise.id, set.id)}
                                                >
                                                    🗑️
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <button onClick={() => handleAddSet(exercise.id)}>
                            + Add Set
                        </button>
                    </div>
                ))}
            </div>

            {/* footer */}
            <div>
                <button onClick={handleDiscard}>
                    Discard Workout
                </button>
                <button onClick={handleFinish}>
                    Complete Session
                </button>
            </div>
        </div>
    )
}