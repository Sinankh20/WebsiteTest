import React from 'react'
import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import RoutineChoice from '../components/RoutineChoice'

export const Route = createFileRoute('/Homepage')({
  component: RouteComponent,
})

function RouteComponent() {
  const [choiceContainerView, setChoiceContainerView] = useState('hidden')
  
  return (
    <div>
      <div className={choiceContainerView}>
        <RoutineChoice />
      </div>
      <button onClick={() => setChoiceContainerView('')}>Start Workout</button>
    </div>
  )
}