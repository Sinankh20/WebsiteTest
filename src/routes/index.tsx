import React from "react";
import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import RoutineChoice from "../components/RoutineChoice";
import dummy from "../data/workoutData.json";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const [choiceContainerView, setChoiceContainerView] = useState("hidden");

  const handleStartWorkout = () => {
    let oldSession = null;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("session_")) {
        oldSession = key;
        break;
      }
    }
    if (oldSession) {
      const saved = localStorage.getItem(oldSession);
      const prevSessionTitle = JSON.parse(saved)?.sessionTitle || "Workout";
      const confirm = window.confirm(
        `You already have an active ${prevSessionTitle} session! Would you like to continue where you left off or Cancel the old session`,
      );
      if (confirm) {
        const part = oldSession.split("_")[1];
        const prevId = part.replace(/-\d+$/, "");
        navigate({ to: `/ActiveSession/${prevId}` });
      } else {
        localStorage.clear();
        setChoiceContainerView("");
      }
    } else {
      setChoiceContainerView("");
    }
  };

  // Hours per week calculation helper
  const getWeeklyWorkouts = () => {
    const now = new Date();
    const startWeekDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - now.getDay(),
    );
    const endOfTheWeek = new Date(
      startWeekDay.getFullYear(),
      startWeekDay.getMonth(),
      startWeekDay.getDate() + 7,
    );

    return dummy.history.filter((item) => {
      const [yyyy, mm, dd] = item.date.split("-").map(Number);
      const itemDate = new Date(yyyy, mm - 1, dd);
      return itemDate >= startWeekDay && itemDate < endOfTheWeek;
    });
  };

  const weeklyWorkouts = getWeeklyWorkouts();
  const minPerWeek = weeklyWorkouts.reduce(
    (acc, item) => item.durationMinutes + acc,
    0,
  );
  const h = Math.floor(minPerWeek / 60);
  const m = minPerWeek % 60;

  const weeklyVolume = weeklyWorkouts.reduce(
    (acc, item) => item.totalVolumeKg + acc,
    0,
  );
  const lastWorkout = dummy.history[0];

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Routine choice container */}
      <div className={choiceContainerView}>
        <RoutineChoice />
      </div>

      {choiceContainerView === "hidden" && (
        <div className="border border-current rounded-xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-black tracking-tight">
              Ready to Train?
            </h2>
            <p className="text-xs opacity-60 mt-1">
              Pick up a routine or jump straight into an active session
            </p>
          </div>
          <button
            className="w-full sm:w-auto text-lg font-bold border-2 border-black rounded-lg px-6 py-3 text-purple-800 hover:text-purple-300 hover:bg-neutral-800 transition-all active:scale-[0.98]"
            onClick={handleStartWorkout}
          >
            Start Workout →
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Link
          to="/Guide"
          className="border border-current rounded-lg p-3 text-center text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 hover:text-slate-100 transition-colors"
        >
          📖 Exercise Library
        </Link>
        <Link
          to="/History"
          className="border border-current rounded-lg p-3 text-center text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 hover:text-slate-100 transition-colors"
        >
          📅 Workout History
        </Link>
      </div>

      {/* Weekly Stats */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-current pb-2">
          <h3 className="text-xs font-black uppercase tracking-widest opacity-80">
            Weekly Stats
          </h3>
          <span className="text-[10px] font-mono opacity-50">
            7-Day Summary
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="border border-current rounded-xl p-5 flex flex-col justify-between hover:text-slate-100 hover:bg-neutral-900 transition-colors">
            <span className="text-xs uppercase tracking-wider font-semibold opacity-70">
              Time Trained
            </span>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-3xl font-black tracking-tight">{h}</span>
              <span className="text-sm font-bold opacity-60">h</span>
              <span className="text-3xl font-black tracking-tight ml-1">
                {m}
              </span>
              <span className="text-sm font-bold opacity-60">m</span>
            </div>
          </div>

          <div className="border border-current rounded-xl p-5 flex flex-col justify-between hover:text-slate-100 hover:bg-neutral-900 transition-colors">
            <span className="text-xs uppercase tracking-wider font-semibold opacity-70">
              Total Volume
            </span>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-3xl font-black tracking-tight">
                {weeklyVolume.toLocaleString()}
              </span>
              <span className="text-sm font-bold opacity-60">Kg</span>
            </div>
          </div>

          <div className="border border-current rounded-xl p-5 flex flex-col justify-between hover:text-slate-100 hover:bg-neutral-900 transition-colors">
            <span className="text-xs uppercase tracking-wider font-semibold opacity-70">
              Completed
            </span>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-3xl font-black tracking-tight">
                {weeklyWorkouts.length}
              </span>
              <span className="text-sm font-bold opacity-60">sessions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Last Logged Workout */}
      {lastWorkout && (
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-current pb-2">
            <h3 className="text-xs font-black uppercase tracking-widest opacity-80">
              Last Session
            </h3>
            <span className="text-[10px] font-mono opacity-50">
              {lastWorkout.date}
            </span>
          </div>

          <div className="border border-current rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:text-slate-100 hover:bg-neutral-900 transition-colors">
            <div>
              <h4 className="text-base font-bold">{lastWorkout.title}</h4>
              <p className="text-xs opacity-60 mt-1">
                {lastWorkout.durationMinutes} mins • {lastWorkout.totalVolumeKg}{" "}
                Kg • {lastWorkout.prsAchieved} PRs
              </p>
            </div>
            <Link
              to="/History"
              className="text-xs font-bold border border-current rounded-lg px-3 py-1.5 hover:bg-neutral-700 hover:text-white transition-colors"
            >
              View Log
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
