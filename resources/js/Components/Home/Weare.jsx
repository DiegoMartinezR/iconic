import React from "react"
import em from "../../Utils/em";

const Weare = ({ info, isAbout = false }) => {
  const array = [
    <img
      src="/assets/resources/about.png"
      backgroundSize="contain"
      className="lg:col-span-2 flex relative self-stretch my-auto rounded-none object-contain object-center aspect-[1.064]"
      aspectRatio={1.064}
      noWebp={false}
      onError={e => e.target.src = '/assets/resources/cover-404.svg'}
    />,
    <div className="lg:col-span-3 flex flex-col justify-center self-stretch my-auto">
      <div
        className="text-xl md:text-2xl lg:text-4xl not-italic  text-[#2B384F] max-md:max-w-full"
      >
        {em(info)}
      </div>
      {
        !isAbout &&
        <a href="/about" className="flex gap-2 justify-center items-center self-start px-6 py-4 mt-10 text-base font-medium tracking-normal leading-none text-white uppercase rounded-3xl bg-[color:var(--Woodsmoke-800,#2E405E)] max-md:px-5">
          <div className="self-stretch my-auto">
            sobre nosotros
          </div>
          <i className="mdi mdi-arrow-top-right shrink-0 self-stretch my-auto w-6"></i>
        </a>
      }
    </div>
  ];
  return <section className={`p-[5%] grid md:grid-cols-2 lg:grid-cols-5 gap-16 w-full ${isAbout && 'bg-slate-100'}`}>
    {
      isAbout
        ? array.reverse().map((item) => item)
        : array.map((item) => item)
    }
  </section>
}

export default Weare