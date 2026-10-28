import React from "react";
import { useState, useMemo } from "react";
import Image from "next/image";
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
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-4">
        <div className="mb-3">
            <h1>Exercises Guide</h1>
                <p>
                 Explore proper execution form, equipment tags, and technique tips
                </p>
        </div>
      <div className="flex flex-col sm:flex-row gap-6 w-full items-start">
          {/* detail container*/}
          <div className={` w-full flex flex-col gap-6`}>
                {foundExercise ? (
                  <div className="p-6 rounded-xl border shadow-sm">
                    <h2 className="text-xl font-bold">{foundExercise.name}</h2>
                    {foundExercise.gifThumbnail && (
                      <img 
                        className="my-3"
                      src={foundExercise.gifThumbnail} alt={foundExercise.name} />
                    )}
                    <p className="mb-2.5">{foundExercise.description}</p>
                    <p>
                      <strong>Category:</strong> {foundExercise.category}
                    </p>
                    <p>
                      <strong>Equipment:</strong> {foundExercise.equipment}
                    </p>
                  </div>
                ) : (
                  <div className="text-center w-full">Select an exercise to see details.</div>
                )}
          </div>
          {/* search and list*/}
          <div className="w-full sm:w-1/3 bg-white p-4 rounded-xl border shadow-sm flex flex-col gap-4">
            <div>
              <input
                type="search"
                placeholder="Search exercises (e.g., Bench Press)"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
                className="w-full border border-gray-300 p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-1">
              {/* map exercises */}
              {filteredExercises.map((item) => {
                return (
                  <div key={item.id}>
                    <button
                      onClick={() => {
                        setSearchQuery(item.name);
                        setdetailsView("");
                      }}
                      className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors border border-gray-100"
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
