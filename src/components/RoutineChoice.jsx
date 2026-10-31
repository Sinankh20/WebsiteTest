import React, { useState } from "react";
import dummy from "../data/workoutData.json";
import { Link } from "@tanstack/react-router";

export default function RoutineChoice() {
  const [activeRoutine, setActiveRoutine] = useState(
    dummy.routines.find((routine) => routine.isTemplate === true) ||
      dummy.routines[0],
  );

  return (
    <div className="border border-current rounded-2xl p-6 sm:p-8 space-y-8 max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-current/20">
        <label
          htmlFor="routine-select"
          className="text-base sm:text-lg font-bold"
        >
          Active Routine:
        </label>
        <select
          id="routine-select"
          className="bg-transparent border border-current rounded-xl px-4 py-2.5 text-base sm:text-lg font-medium cursor-pointer outline-none focus:ring-1 focus:ring-current"
          value={activeRoutine.name}
          onChange={(e) => {
            const selectedName = e.target.value;
            const newRoutine = dummy.routines.find(
              (routine) => routine.name === selectedName,
            );
            if (newRoutine) {
              dummy.routines.forEach(
                (routine) =>
                  (routine.isTemplate = routine.name === selectedName),
              );
              setActiveRoutine(newRoutine);
            }
          }}
        >
          {dummy.routines.map((routine) => (
            <option
              key={routine.name}
              value={routine.name}
              className="bg-white dark:bg-neutral-900"
            >
              {routine.name}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-4">
        <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider opacity-60">
          Select Workout
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {activeRoutine?.workouts?.map((workout, index) => (
            <Link
              key={workout.id || index}
              to="/ActiveSession/$id"
              params={{ id: String(workout.id || index) }}
              className="border border-current rounded-xl p-6 flex items-center justify-between font-medium text-lg sm:text-xl transition-all hover:bg-neutral-100 dark:hover:bg-neutral-800 active:scale-[0.99] [&.active]:font-bold"
            >
              <span>{workout.name}</span>
              <span className="opacity-60 text-lg">→</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
