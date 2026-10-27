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

    const handleAddSet = (exerciseId) => {
        setExercises(exercises.map(ex => {
            if (ex.id === exerciseId) {
                const newSetId = ex.sets.length > 0 ? ex.sets[ex.sets.length - 1].id + 1 : 1
                return {...ex,sets: [...ex.sets, { id: newSetId, weight: 0, reps: 0, done: false }]
                }
            }
            return ex
        }))
    }

    const totalVolume = exercises.reduce((acc, ex) => {
        return acc + ex.sets.reduce((setAcc, s) => setAcc + (s.done ? (Number(s.weight) * Number(s.reps)) : 0), 0)}, 0)

    const completedExercisesCount = exercises.filter(ex => ex.sets.some(s => s.done)).length

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
                    <h1>{sessionTitle}</h1>
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
            </div>

            {/* Exercises List */}
            <div>
                {exercises.map((exercise) => (
                    <div key={exercise.id}>
                        <h2>{exercise.name}</h2>

                        <div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Set</th>
                                        <th>Weight</th>
                                        <th>Reps</th>
                                        <th>Status</th>
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
                                                        setExercises(exercises.map(ex => ex.id === exercise.id ? {...ex,sets: ex.sets.map(s => s.id === set.id ? { ...s, weight: val } : s)} : ex))
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <input 
                                                    type="number" 
                                                    value={set.reps} 
                                                    onChange={(e) => {
                                                        const val = e.target.value
                                                        setExercises(exercises.map(ex => ex.id === exercise.id ? {...ex,sets: ex.sets.map(s => s.id === set.id ? { ...s, reps: val } : s)} : ex))
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