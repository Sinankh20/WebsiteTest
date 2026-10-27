import React from "react";
import { useState } from "react";
export default function WorkoutEditor({
  data = { title: "New Routine", exercises: [] },
  handleSave,
  handleCancle,
}) {

    const initialTitle = data?.title || "New Routine";
    const initialExercises = data?.exercises && data.exercises.length > 0
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
    const newExId =
      exercises.length > 0 ? exercises[exercises.length - 1].id + 1 : 1;
    setExercises([
      ...exercises,
      {
        id: newExId,
        name: "New Exercise",
        sets: [{ id: 1, weight: 0, reps: 0 }],
      },
    ]);
  };
  const handleDeleteExercise = (exercisesId) => {
    setExercises(exercises.filter((item) => item.id !== exercisesId));
  };
  const handleAddSet = (exercisesId) => {
    setExercises(
      exercises.map((item) => {
        if (exercisesId == item.id) {
          const newSetId =
            item.sets.length > 0 ? item.sets[item.sets.length - 1].id + 1 : 1;
          return {
            ...item,
            sets: [...item.sets, { id: newSetId, weight: 0, reps: 0 }],
          };
          
        }
        return item;
      }),
    );
  };
  const handleDeleteSet = (exercisesId, setId) => {
    setExercises(
      exercises.map((item) => {
        if (item.id === exercisesId) {
          return { ...item, sets: item.sets.filter((set) => set.id !== setId) };
        } else return item;
      }),
    );
  };
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
        <button onClick={handleAddExercise}>+ Add Exercise</button>
      </div>
      {/* exercises */}
      <div>
        {exercises.map((exercise) => {
          return (
            <div>
              <div>
                <input
                  type="text"
                  value={exercise.name}
                  onChange={(e) =>
                    setExercises(
                      exercises.map((item) =>
                        item.id === exercise.id
                          ? { ...item, name: e.target.value }
                          : item,
                      ),
                    )
                  }
                ></input>
                <button onClick={handleDeleteExercise(exercise.id)}>
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
                    {exercise.sets.map((set, index) => {
                      return (
                        <tr key={set.id}>
                          <td>{index + 1}</td>
                          <td>
                            <input
                              type="number"
                              value={set.weight}
                              onChange={(e) => {
                                setExercises(
                                  exercises.map((item) =>
                                    item.id === exercise.id
                                      ? {
                                          ...item,
                                          sets: item.sets.map((itemSet) =>
                                            itemSet.id === set.id
                                              ? {
                                                  ...itemSet,
                                                  weight: e.target.value,
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
                                setExercises(
                                  exercises.map((item) =>
                                    item.id === exercise.id
                                      ? {
                                          ...item,
                                          sets: item.sets.map((itemSet) =>
                                            itemSet.id === set.id
                                              ? {
                                                  ...itemSet,
                                                  reps: e.target.value,
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
                              {/* temp trash icon placeholder */}
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
        <button onClick={handleCancle}>Discard Workout</button>
        <button onClick={handleSave}>Complete Session</button>
      </div>
    </div>
  );
}
