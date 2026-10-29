import { createFileRoute, useRouter, useBlocker } from "@tanstack/react-router";
import React, { useState, useEffect } from "react";
import dummy from "../data/workoutData.json";

export const Route = createFileRoute("/ActiveSession/$id")({
  component: ActiveSession,
});
export default function ActiveSession() {
  const router = useRouter();
  const { id } = Route.useParams();
  console.log("Current Workout ID:", id);

  const keyLocalStorage = `session_${id}`;

  useBlocker({
    shouldBlockFn: () => {
      const sessionIsActive = localStorage.getItem(keyLocalStorage);
      if (!sessionIsActive) {
        return false;
      }
      return !window.confirm(
        "You have an active workout session! Leaving this page will keep your data saved in local storage, but are you sure you want to navigate away?",
      );
    },
  });

  const [sessionTitle, setSessionTitle] = useState(() => {
    const saved = localStorage.getItem(keyLocalStorage);
    if (saved) {
      try {
        if (typeof JSON.parse(saved).sessionTitle === "string") {
          return JSON.parse(saved).sessionTitle;
        }
      } catch (e) {}
    }
    return `#${id}`;
  });

  const [exercises, setExercises] = useState(() => {
    const saved = localStorage.getItem(keyLocalStorage);
    if (saved) {
      try {
        return JSON.parse(saved).exercises;
      } catch (e) {}
    }
    return [
      {
        id: 1,
        name: "Barbell Bench Press",
        sets: [
          { id: 1, weight: 60, reps: 10, done: false },
          { id: 2, weight: 60, reps: 8, done: false },
        ],
      },
    ];
  });

  // Timer
  const [startTime, setStartTimer] = useState(() => {
    const saved = localStorage.getItem(keyLocalStorage);
    if (saved) {
      try {
        return JSON.parse(saved).startTime;
      } catch (e) {}
    } else return Date.now();
  });
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const sessionData = {
      sessionTitle,
      exercises,
      startTime,
    };
    localStorage.setItem(keyLocalStorage, JSON.stringify(sessionData));
  }, [sessionTitle, exercises, startTime, keyLocalStorage]);

  useEffect(() => {
    setSeconds(Math.floor((Date.now() - startTime) / 1000));
    const timer = setInterval(() => {
      setSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    if (mins>=60){
      const hrs= mins%60
      return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
    }
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  };

  const handleToggleSet = (exerciseId, setId) => {
    setExercises(
      exercises.map((ex) => {
        if (ex.id === exerciseId) {
          return {
            ...ex,
            sets: ex.sets.map((s) =>
              s.id === setId ? { ...s, done: !s.done } : s,
            ),
          };
        }
        return ex;
      }),
    );
  };

  const handleAddExercise = () => {
    const safeExercises = Array.isArray(exercises) ? exercises : [];
    const newExId =
      safeExercises.length > 0
        ? safeExercises[safeExercises.length - 1].id + 1
        : 1;
    setExercises([
      ...safeExercises,
      {
        id: newExId,
        name: "New Exercise",
        sets: [{ id: 1, weight: 0, reps: 0, done: false }],
      },
    ]);
  };

  const handleDeleteExercise = (exerciseId) => {
    setExercises(exercises.filter((item) => item.id !== exerciseId));
  };

  const handleAddSet = (exerciseId) => {
    setExercises(
      exercises.map((ex) => {
        if (ex.id === exerciseId) {
          const safeSets = Array.isArray(ex.sets) ? ex.sets : [];
          const newSetId =
            safeSets.length > 0 ? safeSets[safeSets.length - 1].id + 1 : 1;
          return {
            ...ex,
            sets: [
              ...safeSets,
              { id: newSetId, weight: 0, reps: 0, done: false },
            ],
          };
        }
        return ex;
      }),
    );
  };

  const handleDeleteSet = (exerciseId, setId) => {
    setExercises(
      exercises.map((item) => {
        if (item.id === exerciseId) {
          const safeSets = Array.isArray(item.sets) ? item.sets : [];
          return { ...item, sets: safeSets.filter((set) => set.id !== setId) };
        }
        return item;
      }),
    );
  };

  const safeExercises = Array.isArray(exercises) ? exercises : [];
  const totalVolume = safeExercises.reduce((acc, ex) => {
    const safeSets = Array.isArray(ex.sets) ? ex.sets : [];
    return (
      acc +
      safeSets.reduce(
        (setAcc, s) =>
          setAcc + (s.done ? Number(s.weight) * Number(s.reps) : 0),
        0,
      )
    );
  }, 0);

  const completedExercisesCount = safeExercises.filter(
    (ex) => Array.isArray(ex.sets) && ex.sets.some((s) => s.done),
  ).length;

  const handleFinish = () => {
    const formatDateString = (dateObj) => {
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const filteredExercises = exercises
      .map((ex) => ({
        ...ex,
        sets: (ex.sets || []).filter((s) => s.done),
      }))
      .filter((ex) => ex.sets.length > 0);

    const thisWorkout = {
      id: `workout-${Date.now()}`,
      date: formatDateString(new Date()),
      title: sessionTitle,
      durationMinutes: Math.round(seconds / 60),
      totalVolumeKg: totalVolume,
      prsAchieved: 1,
      completedExercises: filteredExercises.map((ex) => ex.name),
      exercises: filteredExercises,
    };

    dummy.history = [...dummy.history, thisWorkout];
    localStorage.clear();
    router.navigate({ to: "/" });
  };

  const handleDiscard = () => {
    const confirm = window.confirm(
      "Are you sure you want to discard this workout",
    );
    if (confirm) {
      localStorage.clear();
      router.navigate({ to: "/" });
    }
  };

  const btnSecondary =
    "rounded-xl border border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400";
  const btnPrimary =
    "rounded-xl bg-gray-900 text-white hover:bg-black text-sm font-medium shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2";
  const numInput =
    "w-20 rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-gray-800 focus:border-gray-900 focus:outline-none";

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col gap-1 w-full md:w-auto md:min-w-96">
            <input
              type="text"
              value={sessionTitle}
              onChange={(e) => setSessionTitle(e.target.value)}
              className="text-2xl font-bold text-gray-800 border-b border-gray-300 focus:border-gray-900 focus:outline-none px-1 py-0.5 w-full"
            />
            <span className="text-xs text-gray-500 px-1">Live Workout (ID: {id})</span>
          </div>
          <button
            onClick={handleAddExercise}
            className={`${btnSecondary} px-4 py-2 whitespace-nowrap`}
          >
            + Add Exercise
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 md:gap-4 pt-5 border-t border-gray-200">
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
            <span className="block text-xs text-gray-600 mb-1">Duration</span>
            <span className="text-xl font-bold text-gray-900">{formatTimer(seconds)}</span>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
            <span className="block text-xs text-gray-600 mb-1">Exercises</span>
            <span className="text-xl font-bold text-gray-900">
              {completedExercisesCount}/{exercises.length}
            </span>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
            <span className="block text-xs text-gray-600 mb-1">Volume</span>
            <span className="text-xl font-bold text-gray-900">
              {totalVolume}
              <span className="ml-1 text-xs font-medium text-gray-500">Kg</span>
            </span>
          </div>
        </div>
      </div>

      {/* Exercises List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 items-start">
        {exercises.map((exercise) => (
          <div
            key={exercise.id}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4"
          >
            <div className="flex justify-between items-center gap-3">
              <input
                type="text"
                value={exercise.name}
                onChange={(e) => {
                  const val = e.target.value;
                  setExercises(
                    exercises.map((item) =>
                      item.id === exercise.id ? { ...item, name: val } : item,
                    ),
                  );
                }}
                className="text-base font-bold text-gray-800 border-b border-gray-300 focus:border-gray-900 focus:outline-none px-1 py-0.5 w-full"
              />
              <button
                onClick={() => handleDeleteExercise(exercise.id)}
                className={`${btnSecondary} px-3 py-1.5 text-xs whitespace-nowrap`}
              >
                Delete Exercise
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-xs font-semibold text-gray-500">
                    <th className="py-2 px-3">Set</th>
                    <th className="py-2 px-3">Weight (Kg)</th>
                    <th className="py-2 px-3">Reps</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {exercise.sets.map((set, index) => (
                    <tr key={set.id} className="odd:bg-white even:bg-gray-50">
                      <td className="py-2.5 px-3 text-xs font-bold text-gray-600">
                        #{index + 1}
                      </td>
                      <td className="py-2.5 px-3">
                        <input
                          type="number"
                          value={set.weight}
                          onChange={(e) => {
                            const val = e.target.value;
                            setExercises(
                              exercises.map((ex) =>
                                ex.id === exercise.id
                                  ? {
                                      ...ex,
                                      sets: ex.sets.map((s) =>
                                        s.id === set.id
                                          ? { ...s, weight: val }
                                          : s,
                                      ),
                                    }
                                  : ex,
                              ),
                            );
                          }}
                          className={numInput}
                        />
                      </td>
                      <td className="py-2.5 px-3">
                        <input
                          type="number"
                          value={set.reps}
                          onChange={(e) => {
                            const val = e.target.value;
                            setExercises(
                              exercises.map((ex) =>
                                ex.id === exercise.id
                                  ? {
                                      ...ex,
                                      sets: ex.sets.map((s) =>
                                        s.id === set.id
                                          ? { ...s, reps: val }
                                          : s,
                                      ),
                                    }
                                  : ex,
                              ),
                            );
                          }}
                          className={numInput}
                        />
                      </td>
                      <td className="py-2.5 px-3">
                        <button
                          onClick={() => handleToggleSet(exercise.id, set.id)}
                          className={`${set.done ? btnPrimary : btnSecondary} px-3 py-1.5 text-xs`}
                        >
                          {set.done ? "✓ Done" : "Mark"}
                        </button>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => handleDeleteSet(exercise.id, set.id)}
                          aria-label="Delete set"
                          className="rounded-lg px-2 py-1 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={() => handleAddSet(exercise.id)}
              className={`${btnSecondary} px-4 py-2 text-xs w-full md:w-auto`}
            >
              + Add Set
            </button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm flex justify-between items-center gap-4">
        <button
          onClick={handleDiscard}
          className={`${btnSecondary} px-5 py-2.5`}
        >
          Discard Workout
        </button>
        <button
          onClick={handleFinish}
          className={`${btnPrimary} px-6 py-2.5`}
        >
          Complete Session
        </button>
      </div>
    </div>
  );
}