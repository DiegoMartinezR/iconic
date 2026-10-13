import React from "react"

const FrameSimple = React.lazy(() => import('./Frames/FrameSimple'))
const FrameFull = React.lazy(() => import('./Frames/FrameFull'))

const Frame = ({ which, data }) => {
  const getFrame = () => {
    switch (which) {
      case 'Simple':
        return <FrameSimple data={data} />
      case 'Full':
        return <FrameFull data={data} />
      default:
        return <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">- No Hay componente <b>{which}</b> -</div>
    }
  }
  return getFrame()
}

export default Frame