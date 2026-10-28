import React, { useState } from "react"
import { createFileRoute } from '@tanstack/react-router'
import Calendar from 'react-calendar'
import dummy from '../data/workoutData.json'

export const Route = createFileRoute('/History')({
  component: History,
})

function History() {
    const [view, setView] = useState("list") // "list" or "calendar"
    const [date, setDate] = useState(new Date())

    const [currentPage,setCurrentPage]=useState(1)
    const itemsPerPage=5
    
    const historyList = dummy.history
    const pages= Math.ceil(historyList.length/itemsPerPage)
    const startingIndex= (currentPage-1)*itemsPerPage
    const finalHistoryList=historyList.slice(startingIndex,startingIndex+itemsPerPage)

    const handlePrevPage=()=> setCurrentPage(Math.max(prev=> prev-1,1))
    const handleNextPage=()=>setCurrentPage(Math.min(prev=> prev+1,pages))
    const formatDateString = (dateObj) => {
        const year = dateObj.getFullYear()
        const month = String(dateObj.getMonth() + 1).padStart(2, '0')
        const day = String(dateObj.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
    }

    const selectedDateString = formatDateString(date)
    const selectedWorkouts = historyList.filter(item => item.date === selectedDateString)

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const formatted = formatDateString(date)
            const workout = historyList.find(item => item.date === formatted)
            if (workout) {
                return (
                    <div className="flex flex-col items-center mt-1">
                        <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                        <span className="text-[9px] text-purple-800 font-semibold truncate max-w-[40px]">
                            {workout.title}
                        </span>
                    </div>
                )
            }
        }
        return null
    }

    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const formatted = formatDateString(date)
            const workout = historyList.find(item => item.date === formatted)
            if (workout) {
                return "!bg-purple-100 !rounded-xl font-bold text-purple-900 hover:!bg-purple-200"
            }
        }
        return "rounded-xl hover:!bg-gray-100 p-2"
    }

    // date formating
    const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;

    return (
        <div className="p-6 max-w-4xl mx-auto bg-[#f4effa] min-h-screen">
            {/* Top section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 bg-white p-6 rounded-2xl shadow-sm border border-purple-100 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Workout History</h1>
                    <p className="text-sm text-gray-500">Track your past sessions and view calendar consistency</p>
                </div>
                
                {/* Toggle view */}
                <div className="flex bg-purple-50 p-1 rounded-xl border border-purple-100">
                    <button 
                        onClick={() => setView("list")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                            view === "list" ? "bg-purple-600 text-white shadow-sm" : "text-purple-700 hover:bg-purple-100"
                        }`}
                    >
                        Log List
                    </button>
                    <button 
                        onClick={() => setView("calendar")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                            view === "calendar" ? "bg-purple-600 text-white shadow-sm" : "text-purple-700 hover:bg-purple-100"
                        }`}
                    >
                        Calendar View
                    </button>
                </div>
            </div>

            {/* Calendar view*/}
            {view === "calendar" && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100 mb-6 flex flex-col items-center">
                    <Calendar 
                        onChange={setDate} 
                        value={date}
                        tileContent={tileContent}
                        tileClassName={tileClassName}
                        className="w-full border-none rounded-xl text-gray-700 font-sans p-2 bg-white"
                    />

                    {/*selected day summary */}
                    <div className="w-full mt-6 pt-6 border-t border-purple-100">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-sm font-bold text-gray-800">
                                Selected Date Summary
                            </h3>
                            <span className="text-xs text-purple-600 font-medium bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
                                {formattedDate}
                            </span>
                        </div>

                        {selectedWorkouts.length > 0 ? (
                            <div className="space-y-3">
                                {selectedWorkouts.map((workout) => (
                                    <div key={workout.id} className="bg-purple-50 p-4 rounded-xl border border-purple-200 flex flex-col gap-3">
                                        <div className="flex justify-between items-center">
                                            <h4 className="font-bold text-purple-900 text-base">{workout.title}</h4>
                                            <span className="text-xs bg-purple-600 text-white px-2.5 py-0.5 rounded-full font-medium">
                                                Completed
                                            </span>
                                        </div>
                                        <p className="text-xs text-purple-700">
                                            Duration: <span className="font-semibold">{workout.durationMinutes} mins</span> • Volume: <span className="font-semibold">{workout.totalVolumeKg} Kg</span> • PRs: <span className="font-semibold">{workout.prsAchieved}</span>
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {workout.completedExercises.map((ex, idx) => (
                                                <span key={idx} className="text-xs bg-white text-purple-800 px-2.5 py-1 rounded-md border border-purple-200 font-medium">
                                                    {ex}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-gray-50 p-6 rounded-xl border border-dashed border-gray-200 text-center text-gray-400 text-xs font-medium">
                                No workout logged for this date. Take a well-deserved rest day!
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* history mapping*/}
           {view === "list" && (
                <div className="space-y-4">
                    {finalHistoryList.map((item) => (
                        <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-purple-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h2 className="text-base font-bold text-gray-800">{item.title}</h2>
                                    <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-medium">
                                        {item.date}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mb-2">
                                    Duration: {item.durationMinutes} mins • Volume: {item.totalVolumeKg} Kg • PRs: {item.prsAchieved}
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    {item.completedExercises.map((ex, idx) => (
                                        <span key={idx} className="text-xs bg-purple-50 text-purple-800 px-2 py-0.5 rounded-md border border-purple-100">
                                            {ex}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <button className="text-xs bg-purple-50 text-purple-700 hover:bg-purple-100 px-3 py-2 rounded-xl font-medium transition border border-purple-200">
                                View Details
                            </button>
                        </div>
                    ))}

                    {/* pagination */}
                    {pages > 1 && (
                        <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-purple-100 mt-6">
                            <button 
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                className={`px-4 py-2 rounded-xl text-xs font-medium transition border ${
                                    currentPage === 1 
                                        ? "bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed" 
                                        : "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
                                }`}
                            >
                                Previous
                            </button>
                            
                            <span className="text-xs font-semibold text-gray-600">
                                Page {currentPage} of {pages}
                            </span>

                            <button 
                                onClick={handleNextPage}
                                disabled={currentPage === pages}
                                className={`px-4 py-2 rounded-xl text-xs font-medium transition border ${
                                    currentPage === pages 
                                        ? "bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed" 
                                        : "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
                                }`}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}