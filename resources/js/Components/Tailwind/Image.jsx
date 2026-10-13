import React from "react"

const ImageSimple = React.lazy(() => import('./Images/ImageSimple'))

const Image = ({ which, data }) => {
  const getImage = () => {
    switch (which) {
      case 'ImageSimple':
        return <ImageSimple data={data} />
      default:
        return <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">- No Hay componente <b>{which}</b> -</div>
    }
  }
  return getImage()
}

export default Image