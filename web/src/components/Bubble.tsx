import React, { useState, useLayoutEffect, useRef } from 'react'

function Bubble({ children }: { children: React.ReactNode }) {
  const [arrowTop, setArrowTop] = useState(false)
  const popoverRef = useRef(null)

  useLayoutEffect(() => {
      if (popoverRef.current) {
          const popoverRect = (popoverRef.current as HTMLElement).getBoundingClientRect()
          const distanceToTop = popoverRect.top
          const threshold = 100

          setArrowTop(distanceToTop < threshold)
      }
  }, [])

    return (
      <div ref={popoverRef} className={`absolute z-10 ${arrowTop ? 'top-[calc(50%+20px)]' : 'bottom-[calc(50%+20px)]'} w-80 h-50 bg-green-950 border border-solid rounded-lg cursor-default`}>
        <div className="relative w-full h-full flex items-center justify-center p-4">
          {children}
          {arrowTop ?
            <div className="absolute z-10 top-0 left-1/2 transform -translate-x-1/2 -translate-y-full w-0 h-0 border-8 border-transparent border-b-slate-700"></div> :
            <div className="absolute z-10 bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-8 border-transparent border-t-slate-700"></div>
          }
        </div>
      </div>
    )
}

export default Bubble