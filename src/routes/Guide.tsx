import React from "react"
import { useState, useMemo } from "react"
import Image from "next/image";
import { createFileRoute } from '@tanstack/react-router'
import dummy from '../data/workoutData.json'
export const Route = createFileRoute('/Guide')({
  component: Guide,
})
function Guide(){
    const [searchQuery, setSearchQuery] = useState('')
    const filteredExercises = useMemo(()=> 
        {
            return dummy.exerciseLibrary.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    )},[searchQuery])
    return (
        <div>
            {/* header */}
            <div>
                <div>
                    <h1>Equipment & Exercise Guide</h1>
                    <p>Explore proper execution form, equipment tags, and technique tips
                    </p>
                </div>
                <input
                type="search"
                placeholder="Search exercises (e.g., Bench Press)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                ></input>
            </div>
            <div>
                {/* map excercises */}
                {filteredExercises.map((item)=>{
                    return(
                    <div key={item.id}>
                        {item.gifThumbnail && (
                                <img 
                                    src={item.gifThumbnail} 
                                    alt={item.name}
                                    className="w-full h-48 object-cover rounded-lg mb-3"
                                />
                            )}
                        <h2>{item.name}</h2>
                        <p>{item.description}</p>
                    </div>)
                })}
            </div>
        </div>
    )
}