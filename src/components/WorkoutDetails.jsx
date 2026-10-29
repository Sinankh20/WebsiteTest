import React from "react";

const EMPTY = { title: "New Workout", exercises: [] };

export default function WorkoutDetails({ data = EMPTY, handleExit }) {
  const title = data?.title ?? data?.name ?? "Untitled workout";
  const exercises = Array.isArray(data?.exercises) ? data.exercises : [];

  const stats = [
    { label: "Duration", value: data?.durationMinutes<60 ? data?.durationMinutes : `${Math.round(data?.durationMinutes/60)} ${Math.round(data?.durationMinutes/60)>1 ? 'hrs' : 'hr'} ${data?.durationMinutes%60}` ?? data?.duration ?? "-", unit: "min" },
    { label: "Volume", value: data?.totalVolumeKg ?? data?.totalVolumeKG ?? "-", unit: "kg" },
    { label: "PRs", value: data?.prsAchieved ?? "-" },
    { label: "Exercises", value: exercises.length },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-1">
          <div>
            <p className="text-xs font-medium text-gray-500">Workout</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{title}</h2>
          </div>
          {data?.date && (
            <span className="self-start md:self-auto text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1 rounded-full">
              {data.date}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-5 pt-5 border-t border-gray-200">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3"
            >
              <span className="block text-xs text-gray-600 mb-1">{s.label}</span>
              <span className="text-xl font-bold text-gray-900">
                {s.value}
                {s.unit && s.value !== "-" && (
                  <span className="ml-1 text-xs font-medium text-gray-500">{s.unit}</span>
                )}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Exercises two columns on desktop */}
      {exercises.length > 0 ? (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {exercises.map((exercise, exIndex) => {
            const sets = Array.isArray(exercise.sets) ? exercise.sets : [];

            return (
              <article
                key={exercise.id ?? exIndex}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <h3 className="text-base font-bold text-gray-800">{exercise.name}</h3>
                  <span className="text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 px-2.5 py-0.5 rounded-full">
                    {sets.length} {sets.length === 1 ? "set" : "sets"}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-xs font-semibold text-gray-500 border-b border-gray-200">
                        <th className="py-2 px-3 w-16">Set</th>
                        <th className="py-2 px-3">Weight</th>
                        <th className="py-2 px-3">Reps</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {sets.map((set, index) => (
                        <tr key={set.id ?? index} className="odd:bg-white even:bg-gray-50">
                          <td className="py-2.5 px-3 text-xs font-bold text-gray-600">
                            {index + 1}
                          </td>
                          <td className="py-2.5 px-3 text-sm text-gray-800">
                            {set.weightKg ?? set.weight ?? "-"}
                            <span className="ml-1 text-xs text-gray-400">kg</span>
                          </td>
                          <td className="py-2.5 px-3 text-sm text-gray-800">
                            {set.reps ?? "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center text-sm text-gray-600">
          No exercise details were saved for this workout.
        </div>
      )}

      {/* Footer */}
      <footer className="sticky bottom-0 -mx-4 md:-mx-6 -mb-4 md:-mb-6 flex justify-end gap-3 border-t border-gray-200 bg-white/90 backdrop-blur px-4 md:px-6 py-4">
        <button
          onClick={handleExit}
          className="rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
        >
          Close
        </button>
      </footer>
    </div>
  );
}