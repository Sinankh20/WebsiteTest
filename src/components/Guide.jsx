import React from "react"
import { useState } from "react"
export default function guide(){
    return (
        <div>
            {/* header */}
            <div>
                <div>
                    <h1>Equipment & Exercise Guide</h1>
                    <p>Explore proper execution form, equipment tags, and technique tips
                    </p>
                </div>
                <input type="search" placeholder="Search exercises (e.g., Bench Press)"></input>
            </div>
            <div>
                {/* map excercises */}
            </div>
        </div>
    )
}