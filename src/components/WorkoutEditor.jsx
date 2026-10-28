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
    const initialExercises = Array.isArray(data?.exercises) && data.exercises.length > 0
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
      safeExercises.length > 0 ? safeExercises[safeExercises.length - 1].id + 1 : 1;
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
    <div>
      {/* Header */}
      <div>
        <label>
          Session Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          ></input>
        </label>
        <div>
          <span>Duration</span>
        </div>
        <div>
          <span>PRs</span>
        </div>
        <div>
          <span>Exercises</span>
        </div>
        <div>
          <span>Volume</span>
        </div>
        <button onClick={handleAddExercise}>+ Add Exercise</button>
      </div>

      {/* Exercises */}
      <div>
        {safeExercisesList.map((exercise) => {
          const safeSets = Array.isArray(exercise.sets) ? exercise.sets : [];

          return (
            <div key={exercise.id}>
              <div>
                <input
                  type="text"
                  value={exercise.name}
                  onChange={(e) => {
                    const currentExercises = Array.isArray(exercises) ? exercises : [];
                    setExercises(
                      currentExercises.map((item) =>
                        item.id === exercise.id
                          ? { ...item, name: e.target.value }
                          : item,
                      ),
                    );
                  }}
                ></input>
                <button onClick={() => handleDeleteExercise(exercise.id)}>
                  Delete Exercise
                </button>
              </div>

              {/* sets tables */}
              <div>
                <table>
                  <thead>
                    <tr>
                      <th>Sets</th>
                      <th>Weight</th>
                      <th>Reps</th>
                      <th>TEST</th>
                    </tr>
                  </thead>
                  <tbody>
                    {safeSets.map((set, index) => {
                      return (
                        <tr key={set.id}>
                          <td>{index + 1}</td>
                          <td>
                            <input
                              type="number"
                              value={set.weight}
                              onChange={(e) => {
                                const val = e.target.value;
                                const currentExercises = Array.isArray(exercises) ? exercises : [];
                                setExercises(
                                  currentExercises.map((item) =>
                                    item.id === exercise.id
                                      ? {
                                          ...item,
                                          sets: (Array.isArray(item.sets) ? item.sets : []).map((itemSet) =>
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
                            ></input>
                          </td>
                          <td>
                            <input
                              type="number"
                              value={set.reps}
                              onChange={(e) => {
                                const val = e.target.value;
                                const currentExercises = Array.isArray(exercises) ? exercises : [];
                                setExercises(
                                  currentExercises.map((item) =>
                                    item.id === exercise.id
                                      ? {
                                          ...item,
                                          sets: (Array.isArray(item.sets) ? item.sets : []).map((itemSet) =>
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
                            ></input>
                          </td>
                          <td>
                            <button
                              className="cursor-pointer"
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
              <button onClick={() => handleAddSet(exercise.id)}>
                + Add Set
              </button>
            </div>
          );
        })}
      </div>

      {/* footer */}
      <div>
        <button onClick={handleCancel}>Discard</button>
        {handleDelete && (
        <button onClick={handleDelete} style={{ color: "red" }}>
          Delete Workout
        </button>
        )}
        <button onClick={() => handleSave({ title, exercises })}>Save Workout</button>
      </div>
    </div>
  );
}