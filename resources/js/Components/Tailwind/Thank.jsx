import React from "react"

const ThankSimple = React.lazy(() => import('./Thanks/ThankSimple'))

const Thank = ({ which, item,  data }) => {
  const getThank = () => {
    switch (which) {
      case 'ThankSimple':
        return <ThankSimple data={data} item={item} />
      default:
        return <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">- No Hay componente <b>{which}</b> -</div>
    }
  }
  return getThank()
}

export default Thank;