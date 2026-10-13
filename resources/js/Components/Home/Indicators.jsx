import React from "react"

const Indicators = ({ indicators }) => {
  return <section className='p-[5%] bg-amber-400'>
    <div className="flex flex-wrap gap-10 items-center justify-center font-semibold  text-[color:var(--Woodsmoke-950,#07090D)]">
      {
        indicators.map((item, index) => {
          return <div key={index} className="flex flex-col flex-1 shrink justify-center self-stretch my-auto basis-0 text-center max-md:w-full">
            <div
              className="text-xl not-italic tracking-tight leading-tight text-nowrap"
            >
              {item.description}
            </div>
            <div
              $name="420+"
              className="mt-6 text-7xl not-italic tracking-tighter leading-tight max-md:text-4xl"
            >
              {item.name}{item.symbol}
            </div>
          </div>
        })
      }
    </div>
  </section>
}

export default Indicators