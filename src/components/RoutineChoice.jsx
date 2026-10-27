import React, { useState, useRef } from "react";
import dummy from '../data/workoutData.json';
import { Link } from '@tanstack/react-router'

export default function RoutineChoice() {
    const inputRef = useRef(null);
    const [activeRoutine, setActiveRoutine] = useState(
        dummy.routines.find(routine => routine.isTemplate === true) || dummy.routines[0]);
    const [routineQuery, setRoutineQuery] = useState(activeRoutine?.name || "");
    const [queryContainer, setQueryContainer] = useState('hidden');

    const filteredRoutines = dummy.routines.filter((routine) => 
        routine.name.toLowerCase().includes(routineQuery.toLowerCase())
    );

    return (
        <div>
            <div>
                <label>Current active Routine
                    <input
                        ref={inputRef}
                        value={routineQuery}
                        onChange={(e) => {
                            setQueryContainer('');
                            setRoutineQuery(e.target.value);
                        }}
                    />
                </label>
                <button
                    onClick={() => {
                        const typedName = inputRef.current?.value;
                        const newRoutine = dummy.routines.find(routine => routine.name === typedName);
                        if (newRoutine) {
                            activeRoutine.isTemplate = false;
                            newRoutine.isTemplate = true;
                            setActiveRoutine(newRoutine);
                            setQueryContainer('hidden');
                        }
                    }}
                >
                    Set Active
                </button>
            
                <div className={queryContainer}>
                    {filteredRoutines.map((routine) => (
                        <button
                            key={routine.name}
                            onClick={() => {
                                if (inputRef.current) {
                                    inputRef.current.value = routine.name;
                                }
                                setRoutineQuery(routine.name);
                                setQueryContainer('hidden');
                            }}
                        >
                            {routine.name}
                        </button>
                    ))}
                </div>
                <div>
                    <h2>Choose Workout</h2>
                    <div>
                        {activeRoutine?.workouts?.map((workout, index) => (
                            <Link 
                            to={`/ActiveSession/$id`} 
                            params={{ id: String(workout.id)}}
                            className="[&.active]:font-bold">
                            <button
                            key={index}
                            >{workout.name}</button>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}



