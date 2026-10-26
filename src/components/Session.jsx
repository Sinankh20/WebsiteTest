import React from "react"
import { useState } from "react"
export default function Session(){
    return (
        <div>
            {/* Header */}
            <div>
                <label>
                    Session Title
                    <input type="text" value={}></input>
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
                    <button>+ Add Exercise</button>
            </div>
            {/* exercises */}
            <div>
                <div>
                    <div>
                        <h1>Excercise</h1>
                        <table>
                            <th>Set</th>
                            <th>Weight</th>
                            <th>Reps</th>
                            <th>Rest</th>
                            <th>Done</th>
                        </table>
                    </div>
                    <div>
                        <button>+ Add Set</button>
                        <button>Delete</button>
                    </div>
                </div>

            </div>
            {/* footer */}
            <div>
                <button>Discard Workout</button>
                <button>Complete Session</button>
            </div>
        </div>
        >
    )}