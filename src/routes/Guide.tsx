import React from "react";
import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import dummy from "../data/workoutData.json";
import WorkoutDetails from "../components/WorkoutDetails";

export const Route = createFileRoute("/Guide")({
  component: Guide,
});

function Guide() {
  const [searchQuery, setSearchQuery] = useState("");
  const [detailsView, setDetailsView] = useState(false);
  const [dataHandoffToDetails, setDataHandOffToDetails] = useState({});

  const foundExercise = useMemo(() => {
    return dummy.exerciseLibrary.find(
      (exercise) => exercise.name.toLowerCase() === searchQuery.toLowerCase(),
    );
  }, [searchQuery]);

  const filteredExercises = useMemo(() => {
    return dummy.exerciseLibrary.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  const filteredHistory = useMemo(() => {
    if (!foundExercise) return [];
    return dummy.history.filter((item) =>
      item.completedExercises?.some(
        (ex) => ex.toLowerCase() === foundExercise.name.toLowerCase()
      )
    );
  }, [foundExercise]);

  return (
    <div className="p-6 w-full max-w-6xl mx-auto flex flex-col gap-6 relative">
      {/* Details modal */}
      <div className={`fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-2 md:p-4 overflow-y-auto transition-all duration-500 ${detailsView ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'}`}>
        <div className="bg-white w-full h-full md:h-auto md:max-h-[90vh] md:max-w-6xl md:rounded-2xl shadow-2xl p-4 md:p-6 overflow-y-auto flex flex-col transition-all duration-300">
          <WorkoutDetails
            data={dataHandoffToDetails}
            handleExit={() => setDetailsView(false)}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">Exercises Guide</h1>
        <p className="text-sm text-gray-500">
          Explore proper execution form, equipment tags, and technique tips
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 md:gap-6 w-full items-start">
        {/* detail container*/}
        <div className="w-full flex flex-col gap-6">
          {foundExercise ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm flex flex-col gap-5">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {foundExercise.name}
                </h2>
              </div>

              {foundExercise.gifThumbnail && (
                <img
                  className="w-full max-w-md rounded-xl border border-gray-200"
                  src={foundExercise.gifThumbnail}
                  alt={foundExercise.name}
                />
              )}

              <p className="text-sm leading-relaxed text-gray-700 max-w-prose">
                {foundExercise.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-5 border-t border-gray-200">
                <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                  <span className="block text-xs text-gray-600 mb-1">Category</span>
                  <span className="text-base font-bold text-gray-900">
                    {foundExercise.category}
                  </span>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                  <span className="block text-xs text-gray-600 mb-1">Equipment</span>
                  <span className="text-base font-bold text-gray-900">
                    {foundExercise.equipment}
                  </span>
                </div>
              </div>

              {/* newest addtion adding performed history */}
              <div className="pt-5 border-t border-gray-200 flex flex-col gap-4">
                <h3 className="text-base font-bold text-gray-800">
                  You performed {foundExercise.name} on:
                </h3>

                {filteredHistory.length > 0 ? (
                  <div className="space-y-4">
                    {filteredHistory.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-base font-bold text-gray-800">{item.title}</h2>
                            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full font-medium">
                              {item.date}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mb-2">
                            Duration: {item.durationMinutes < 60 ? `${item.durationMinutes} mins` : `${Math.round(item.durationMinutes / 60)} ${Math.round(item.durationMinutes / 60) > 1 ? 'hrs' : 'hr'} ${(Math.round(item.durationMinutes) % 60)} mins`} • Volume: {item.totalVolumeKg} Kg • PRs: {item.prsAchieved}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {item.completedExercises.map((ex, idx) => (
                              <span
                                key={idx}
                                className={`text-xs px-2 py-0.5 rounded-md border ${
                                  ex.toLowerCase() === foundExercise.name.toLowerCase()
                                    ? "bg-gray-900 text-white border-gray-900 font-semibold"
                                    : "bg-gray-50 text-gray-700 border-gray-200"
                                }`}
                              >
                                {ex}
                              </span>
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setDataHandOffToDetails(item);
                            setDetailsView(true);
                          }}
                          className="text-xs bg-gray-50 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-xl font-medium transition border border-gray-300"
                        >
                          View Details
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 p-6 rounded-xl border border-dashed border-gray-200 text-center text-gray-400 text-xs font-medium">
                    No workout history logged for this exercise yet.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="w-full rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center text-sm text-gray-600">
              Select an exercise to see details.
            </div>
          )}
        </div>

        {/* search and list*/}
        <div className="w-full sm:w-1/3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm flex flex-col gap-4">
          <div>
            <input
              type="search"
              placeholder="Search exercises (e.g., Bench Press)"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-gray-900 focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredExercises.map((item) => {
              const isSelected = foundExercise?.id === item.id;
              return (
                <div key={item.id}>
                  <button
                    onClick={() => {
                      setSearchQuery(item.name);
                    }}
                    className={`w-full text-left rounded-xl border px-3 py-2.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 ${
                      isSelected
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {item.name}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}