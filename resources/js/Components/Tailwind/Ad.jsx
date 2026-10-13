import React, { Suspense } from "react"

const AdSubscription = React.lazy(() => import('./Ads/AdSubscription'))
const AdModal = React.lazy(() => import('./Ads/AdModal'))
const AdModalTwenty = React.lazy(() => import('./Ads/AdModalTwenty'))
const AdBanner = React.lazy(() => import('./Ads/AdBanner'))
const AdStoreSelector = React.lazy(() => import('./Ads/AdStoreSelector'))

const Ad = ({ which, data, items, generals, stores }) => {
  const getAd = () => {
    switch (which) {
      case 'AdSubscription':
        return <AdSubscription data={data} items={items} generals={generals} />
      case 'AdModal':
        return <AdModal data={data} items={items} />
      case 'AdModalTwenty':
        return <AdModalTwenty data={data} items={items} />
      case 'AdStoreSelector':
        return <AdStoreSelector data={data} stores={stores || items} />
      /* case 'AdBanner':
        return <AdBanner data={data} items={items} />*/
      default:
        return <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">- No Hay componente <b>{which}</b> -</div>
    }
  }
  return (
    <Suspense fallback={<div className="w-full h-10"></div>}>
      {getAd()}
    </Suspense>
  )
}

export default Ad