import React, { useEffect, useState } from "react";

const Sliders = ({ sliders }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliders.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliders.length) % sliders.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide(); // Cambia al siguiente slide cada 5 segundos
    }, 5000);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
  }, [currentSlide, sliders.length]);

  const slider = sliders[currentSlide];

  return (
    <section className="relative h-screen pt-16">
      <img
        className="absolute top-0 left-0 w-full h-full object-cover"
        src={`/storage/images/slider/${slider.bg_image}`}
        alt={slider.name}
        onError={e => e.target.src = `https://placehold.co/600x400?text=${slider.name}`}
      />
      <div className="absolute bottom-0 w-full bg-black bg-opacity-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 justify-between items-center p-[5%] md:py-[2.5%]">
          <div className="lg:col-span-3 flex flex-col justify-center self-stretch my-auto font-medium max-md:max-w-full">
            <div className="text-4xl tracking-tighter leading-10 text-white max-md:max-w-full">
              <span className="">{slider.name.split(' ')[0]}</span>{" "}
              <span className="font-bold text-white">
                {slider.name.split(' ').slice(1).join(' ')}
              </span>
            </div>
            <a
              href={slider.button_link}
              className="flex gap-2 justify-center items-center self-start px-6 py-4 mt-10 text-base tracking-normal leading-none uppercase bg-white rounded-3xl text-[color:var(--Woodsmoke-950,#07090D)] max-md:px-5"
            >
              <div className="self-stretch my-auto not-italic">
                {slider.button_text}
              </div>
              <i className="mdi mdi-arrow-top-right"></i>
            </a>
          </div>
          <div className="lg:col-span-2 flex flex-col justify-center self-stretch my-auto">
            <div className="flex gap-6 justify-center items-center w-full">
              <div className="flex flex-1 shrink gap-6 items-center self-stretch my-auto text-4xl font-medium tracking-tighter leading-tight text-white whitespace-nowrap min-w-[240px]">
                {String(currentSlide + 1).padStart(2, '0')}
              </div>
              <div className="flex gap-3 justify-center items-center self-stretch my-auto">
                <button onClick={prevSlide} className="text-white">
                  <i className="mdi mdi-arrow-left text-2xl"></i>
                </button>
                <button onClick={nextSlide} className="text-white">
                  <i className="mdi mdi-arrow-right text-2xl"></i>
                </button>
              </div>
            </div>
            <hr className="my-4"/>
            <div className="mt-6 text-sm leading-5 text-white">
              {slider.description}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sliders;