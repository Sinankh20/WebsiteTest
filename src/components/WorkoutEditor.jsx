import React from "react";
import { useState } from "react";

export default function WorkoutEditor({
  data = { name: "New Workout", exercises: [] },
  handleSave,
  handleDelete,
  handleCancel,
}) {
  const initialTitle = data?.name || "New Workout";
  const initialExercises =
    Array.isArray(data?.exercises) && data.exercises.length > 0
      ? data.exercises
      : [
          {
            id: 1,
            name: "Barbell Bench Press",
            sets: [
              { id: 1, weight: 80, reps: 10 },
              { id: 2, weight: 85, reps: 8 },
            ],
          },
        ];

  const [title, setTitle] = useState(initialTitle);
  const [exercises, setExercises] = useState(initialExercises);

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
        sets: [{ id: 1, weight: 0, reps: 0 }],
      },
    ]);
  };

  const handleDeleteExercise = (exercisesId) => {
    const safeExercises = Array.isArray(exercises) ? exercises : [];
    setExercises(safeExercises.filter((item) => item.id !== exercisesId));
  };

  const handleAddSet = (exercisesId) => {
    const safeExercises = Array.isArray(exercises) ? exercises : [];
    setExercises(
      safeExercises.map((item) => {
        if (exercisesId === item.id) {
          const safeSets = Array.isArray(item.sets) ? item.sets : [];
          const newSetId =
            safeSets.length > 0 ? safeSets[safeSets.length - 1].id + 1 : 1;
          return {
            ...item,
            sets: [...safeSets, { id: newSetId, weight: 0, reps: 0 }],
          };
        }
        return item;
      }),
    );
  };

  const handleDeleteSet = (exercisesId, setId) => {
    const safeExercises = Array.isArray(exercises) ? exercises : [];
    setExercises(
      safeExercises.map((item) => {
        if (item.id === exercisesId) {
          const safeSets = Array.isArray(item.sets) ? item.sets : [];
          return { ...item, sets: safeSets.filter((set) => set.id !== setId) };
        } else return item;
      }),
    );
  };

  const safeExercisesList = Array.isArray(exercises) ? exercises : [];

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
            <label className="text-xs font-medium text-gray-500">Workout Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-bold text-gray-800 border-b border-gray-300 focus:border-gray-900 focus:outline-none px-1 py-0.5 w-full"
            />
          </div>
          <button
            onClick={handleAddExercise}
            className={`${btnSecondary} px-4 py-2 whitespace-nowrap`}
          >
            + Add Exercise
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 pt-5 border-t border-gray-200">
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
            <span className="block text-xs text-gray-600 mb-1">Duration</span>
            <span className="text-xl font-bold text-gray-900">-</span>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
            <span className="block text-xs text-gray-600 mb-1">PRs</span>
            <span className="text-xl font-bold text-gray-900">-</span>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
            <span className="block text-xs text-gray-600 mb-1">Exercises</span>
            <span className="text-xl font-bold text-gray-900">
              {safeExercisesList.length}
            </span>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
            <span className="block text-xs text-gray-600 mb-1">Volume</span>
            <span className="text-xl font-bold text-gray-900">-</span>
          </div>
        </div>
      </div>

      {/* Exercises */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 items-start">
        {safeExercisesList.map((exercise) => {
          const safeSets = Array.isArray(exercise.sets) ? exercise.sets : [];

          return (
            <div
              key={exercise.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4"
            >
              <div className="flex justify-between items-center gap-3">
                <input
                  type="text"
                  value={exercise.name}
                  onChange={(e) => {
                    const currentExercises = Array.isArray(exercises)
                      ? exercises
                      : [];
                    setExercises(
                      currentExercises.map((item) =>
                        item.id === exercise.id
                          ? { ...item, name: e.target.value }
                          : item,
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

              {/* Sets tables */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-xs font-semibold text-gray-500">
                      <th className="py-2 px-3">Sets</th>
                      <th className="py-2 px-3">Weight</th>
                      <th className="py-2 px-3">Reps</th>
                      <th className="py-2 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {safeSets.map((set, index) => {
                      return (
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
                                const currentExercises = Array.isArray(
                                  exercises,
                                )
                                  ? exercises
                                  : [];
                                setExercises(
                                  currentExercises.map((item) =>
                                    item.id === exercise.id
                                      ? {
                                          ...item,
                                          sets: (Array.isArray(item.sets)
                                            ? item.sets
                                            : []
                                          ).map((itemSet) =>
                                            itemSet.id === set.id
                                              ? {
                                                  ...itemSet,
                                                  weight: val,
                                                }
                                              : itemSet,
                                          ),
                                        }
                                      : item,
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
                                const currentExercises = Array.isArray(
                                  exercises,
                                )
                                  ? exercises
                                  : [];
                                setExercises(
                                  currentExercises.map((item) =>
                                    item.id === exercise.id
                                      ? {
                                          ...item,
                                          sets: (Array.isArray(item.sets)
                                            ? item.sets
                                            : []
                                          ).map((itemSet) =>
                                            itemSet.id === set.id
                                              ? {
                                                  ...itemSet,
                                                  reps: val,
                                                }
                                              : itemSet,
                                          ),
                                        }
                                      : item,
                                  ),
                                );
                              }}
                              className={numInput}
                            />
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <button
                              aria-label="Delete set"
                              className="rounded-lg px-2 py-1 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition"
                              onClick={() =>
                                handleDeleteSet(exercise.id, set.id)
                              }
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      );
                    })}
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
          );
        })}
      </div>

      {/* Footer */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm flex flex-1 justify-between items-center gap-4">
        {handleDelete && (
          <button
            onClick={handleDelete}
            className={`${btnSecondary} px-5 py-2.5`}
          >
            Delete
          </button>
        )}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={handleCancel}
            className={`${btnSecondary} px-4 py-2.5`}
          >
            Discard
          </button>
          <button
            onClick={() => handleSave({ id: data?.id, name: title, exercises })}
            className={`${btnPrimary} px-6 py-2.5`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}