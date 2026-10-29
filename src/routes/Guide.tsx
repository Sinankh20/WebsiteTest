import React from "react";
import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import dummy from "../data/workoutData.json";

export const Route = createFileRoute("/Guide")({
  component: Guide,
});

function Guide() {
  const [searchQuery, setSearchQuery] = useState("");
  const [detailsView, setdetailsView] = useState("hidden");

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

  return (
    <div className="p-6 w-full max-w-6xl mx-auto flex flex-col gap-6">
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
            <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800">
                {foundExercise.name}
              </h2>
              {foundExercise.gifThumbnail && (
                <img
                  className="my-4 w-full max-w-md rounded-xl border border-gray-200"
                  src={foundExercise.gifThumbnail}
                  alt={foundExercise.name}
                />
              )}
              <p className="mb-5 text-sm leading-relaxed text-gray-700 max-w-prose">
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
            {/* map exercises */}
            {filteredExercises.map((item) => {
              const isSelected = foundExercise?.id === item.id;
              return (
                <div key={item.id}>
                  <button
                    onClick={() => {
                      setSearchQuery(item.name);
                      setdetailsView("");
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