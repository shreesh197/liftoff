import React, { createContext } from 'react'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'

export const FullScreenContext: any = createContext('')

export const FullScreenProvider = (props: any) => {
  const handleFullScreen = useFullScreenHandle()

  // console.log(`isFullScreen ====> ${isFullScreen}`)

  return (
    <FullScreenContext.Provider value={{ handleFullScreen }}>
      <FullScreen handle={handleFullScreen}>{props.children}</FullScreen>
    </FullScreenContext.Provider>
  )
}
