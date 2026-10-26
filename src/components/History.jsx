import React from "react"
import { useState } from "react"
export default function history(){
    const [view,setView]=useState(view)
    return(
        <div>
            {/* top section */}
            <div>
                <div>
                    <h1>Workout History</h1>
                </div>
                <div>
                   <button>Log List</button>
                   <button>Calendar View</button>
                </div>
            </div>
            {/* Calendar view */}
            <div className="hidden">

            </div>
            {/* history mapping */}
            <div>

            </div>
        </div>
    )
}