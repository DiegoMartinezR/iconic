import React from "react"
const DeliveryZonesKuchara = React.lazy(() => import('./DeliveryZones/DeliveryZonesKuchara'))

const DeliveryZone = ({ which,data, items }) => {
  const getDeliveryZone = () => {
    switch (which) {
      case 'DeliveryZonesKuchara':
        return <DeliveryZonesKuchara data={data} items={items} />
      default:
        return <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">- No Hay componente <b>{which}</b> -</div>
    }
  }
  return getDeliveryZone()
}

export default DeliveryZone