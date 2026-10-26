import React from "react"
import { useState } from "react"
export default function WorkoutEditor({data={title:"New Routine", exercises:[]}}, handleSave,handleCancle){
    const [title, setTitle] = useState(data.title)
    const [exercises, setExercises] = useState(initialData.exercises.length > 0 ? initialData.exercises : [
        {
            id: 1,
            name: "Barbell Bench Press",
            sets: [
                { id: 1, weight: 80, reps: 10 },
                { id: 2, weight: 85, reps: 8 }
            ]
        }
    ])
    const handleAddExercise = () => {
        const newExId = exercises.length > 0 ? exercises[exercises.length - 1].id + 1 : 1
        setExercises([
            ...exercises,
            {
                id: newExId,
                name: "New Exercise",
                sets: [{ id: 1, weight: 0, reps: 0 }]
            }
        ])
    }
    return (
        <div>
            {/* Header */}
            <div>
                <label>
                    Session Title
                    <input type="text" value={}></input>
                </label>
                 <div>
                        <span>Duration</span>
                        {/* Timer */}
                    </div>
                    <div>
                        <span>PRs</span>
                        {/* Pr Counter */}
                    </div>
                    <div>
                        <span>Exercises</span>
                        {/* Counter 0/2 */}
                    </div>
                    <div>
                        <span>Volume</span>
                        {/* 1000 Kg */}
                    </div>
                    <button>+ Add Exercise</button>
            </div>
            {/* exercises */}
            <div>
                <div>
                    <div>
                        <h1>Excercise</h1>
                        <table>
                            <th>Set</th>
                            <th>Weight</th>
                            <th>Reps</th>
                            <th>Rest</th>
                            <th>Done</th>
                        </table>
                    </div>
                    <div>
                        <button>+ Add Set</button>
                        <button>Delete</button>
                    </div>
                </div>

            </div>
            {/* footer */}
            <div>
                <button>Discard Workout</button>
                <button>Complete Session</button>
            </div>
        </div>
        >
    )}