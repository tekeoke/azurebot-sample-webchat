import React from 'react'
import ReactWebChat, { createDirectLine } from 'botframework-webchat'
import './index.css'

const App: React.FC = () => {
  const TOKEN = 'CVkrtsgJAU0.GGLsFawOFPToEXKmPCan4vwakjKOXYioB2bu_nTRBvQ'
  return (
    <div>
      <ReactWebChat directLine={createDirectLine({ token: TOKEN })} />
    </div>
  )
}

export default App
