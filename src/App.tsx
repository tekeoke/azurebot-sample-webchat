import * as React from 'react'
import { useEffect, useState, useMemo } from 'react'
import ReactWebChat from 'botframework-webchat'
import { createDirectLine } from 'botframework-webchat/lib/index-es5'
import './index.css'

const App = (): JSX.Element => {
  const directLine = useMemo(
    () =>
      createDirectLine({
        token: 'your_token',
      }),
    []
  )

  return (
    <div style={{height: '560px'}}>
      <ReactWebChat directLine={directLine} />
    </div>
  )
}

export default App
