import React, { useState } from "react";
import dummy from '../data/workoutData.json';
import { Link } from '@tanstack/react-router'

export default function RoutineChoice() {
    const [activeRoutine, setActiveRoutine] = useState(
        dummy.routines.find(routine => routine.isTemplate === true) || dummy.routines[0]
    );

    return (
        <div>
            <div>
                <label>
                    Current active Routine:
                    <select
                        value={activeRoutine.name}
                        onChange={(e) => {
                            const selectedName = e.target.value;
                            const newRoutine = dummy.routines.find(routine => routine.name === selectedName);
                            if (newRoutine) {
                                dummy.routines.forEach(routine => routine.isTemplate = (routine.name === selectedName));
                                setActiveRoutine(newRoutine);
                            }
                        }}
                    >
                        {dummy.routines.map((routine) => (
                            <option key={routine.name} value={routine.name}>
                                {routine.name}
                            </option>
                        ))}
                    </select>
                </label>

                <div>
                    <h2>Choose Workout</h2>
                    <div>
                        {activeRoutine?.workouts?.map((workout, index) => (
                            <Link 
                                key={workout.id || index}
                                to={`/ActiveSession/$id`} 
                                params={{ id: String(workout.id || index) }}
                                className="block p-2 my-1 bg-gray-200 rounded text-center [&.active]:font-bold"
                            >
                                {workout.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}