import React from "react";
import { useState } from "react";

export default function WorkoutEditor({
  data = { title: "New Workout", exercises: [] },
  routineName,
  handleSave,
  handleDelete,
  handleCancel,
}) {
  const initialTitle = data?.title || "New Workout";
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 border rounded-lg space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col gap-1 w-full md:w-auto">
            <label className="text-xs">Session Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-bold border-b focus:outline-none px-1 py-0.5 w-full"
            />
          </div>
          <button
            onClick={handleAddExercise}
            className="border px-4 py-2 rounded text-sm font-medium whitespace-nowrap"
          >
            + Add Exercise
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t text-center">
          <div className="p-3 border rounded-lg">
            <span className="block text-xs mb-1">Duration</span>
            <span className="text-base font-bold">-</span>
          </div>
          <div className="p-3 border rounded-lg">
            <span className="block text-xs mb-1">PRs</span>
            <span className="text-base font-bold">-</span>
          </div>
          <div className="p-3 border rounded-lg">
            <span className="block text-xs mb-1">Exercises</span>
            <span className="text-base font-bold">
              {safeExercisesList.length}
            </span>
          </div>
          <div className="p-3 border rounded-lg">
            <span className="block text-xs mb-1">Volume</span>
            <span className="text-base font-bold">-</span>
          </div>
        </div>
      </div>

      {/* Exercises */}
      <div className="space-y-6">
        {safeExercisesList.map((exercise) => {
          const safeSets = Array.isArray(exercise.sets) ? exercise.sets : [];

          return (
            <div key={exercise.id} className="p-6 border rounded-lg space-y-4">
              <div className="flex justify-between items-center gap-4">
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
                  className="text-base font-bold border-b focus:outline-none px-1 py-0.5 w-full"
                />
                <button
                  onClick={() => handleDeleteExercise(exercise.id)}
                  className="border px-3 py-1.5 rounded text-xs whitespace-nowrap"
                >
                  Delete Exercise
                </button>
              </div>

              {/* Sets tables */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b text-xs font-semibold">
                      <th className="py-2 px-3">Sets</th>
                      <th className="py-2 px-3">Weight</th>
                      <th className="py-2 px-3">Reps</th>
                      <th className="py-2 px-3 text-center">TEST</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {safeSets.map((set, index) => {
                      return (
                        <tr key={set.id}>
                          <td className="py-3 px-3 text-xs font-bold">
                            #{index + 1}
                          </td>
                          <td className="py-3 px-3">
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
                              className="w-15 border rounded px-2.5 py-1.5 text-xs focus:outline-none"
                            />
                          </td>
                          <td className="py-3 px-3">
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
                              className="w-15 border rounded px-2.5 py-1.5 text-xs focus:outline-none"
                            />
                          </td>
                          <td className="py-3 px-3 text-center">
                            <button
                              className="text-sm p-1"
                              onClick={() =>
                                handleDeleteSet(exercise.id, set.id)
                              }
                            >
                              🗑️
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
                className="border px-4 py-2 rounded text-xs font-medium w-full md:w-auto"
              >
                + Add Set
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border rounded-lg flex flex-1 justify-between items-center gap-4">
        {handleDelete && (
          <button
            onClick={handleDelete}
            className="border px-5 py-2.5 rounded text-sm font-medium "
          >
            Delete
          </button>
        )}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCancel}
            className="border px-3.5 py-2.5 rounded text-sm font-medium"
          >
            Discard
          </button>
          <button
            onClick={() => handleSave({ title, exercises })}
            className="border px-6 py-2.5 rounded text-sm font-medium"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
