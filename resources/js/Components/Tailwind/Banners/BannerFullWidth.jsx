import React from "react";
import { resolveSystemAsset } from "./bannerUtils";

const BannerFullWidth = ({ data }) => {
    const backgroundUrl = resolveSystemAsset(data?.background);
    const imageUrl = resolveSystemAsset(data?.image);
    const isRounded = data?.rounded_button !== false && data?.rounded_button !== "false";

    return (
        <section
            id={data?.element_id || null}
            className="bg-gray-50 overflow-hidden max-h-max relative"
            style={{
                backgroundImage: `url('${backgroundUrl}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            <div className="absolute inset-0 bg-black opacity-50 z-10"></div>

            <div className="px-[5%] 2xl:px-0 2xl:max-w-7xl h-full w-full mx-auto py-[5%] md:py-[2.5%] relative z-20">
                <div className="grid aspect-[1/1] md:aspect-[4/2]">
                    <div className="w-full flex flex-col max-w-xl xl:max-w-3xl items-start justify-center">
                        <h2 className="text-3xl md:text-6xl xl:text-8xl text-white font-bold mb-2 lg:mb-6 whitespace-pre-line">
                            {data?.name?.split("*").map((part, index) =>
                                index % 2 === 0 ? (
                                    <span key={index}>{part}</span>
                                ) : (
                                    <span
                                        key={index}
                                        className="customtext-primary"
                                    >
                                        {part}
                                    </span>
                                ),
                            )}
                        </h2>
                        <p className="text-white text-sm md:text-base xl:text-xl mb-4">{data?.description}</p>
                        {data?.button_link && data?.button_text && (
                            <a
                                href={data?.button_link}
                                className={`px-8 py-3 inline-flex items-center bg-primary text-white text-sm xl:text-base shadow-md transition-all hover:scale-105 duration-300 ${isRounded ? "rounded-full" : "rounded-none"
                                    }`}
                            >
                                {data?.button_text}
                                <i className="mdi mdi-arrow-top-right ms-2"></i>
                            </a>
                        )}
                    </div>
                    <div className="hidden  items-center justify-center">
                        {imageUrl && (
                            <img
                                src={imageUrl}
                                className="w-full aspect-auto object-contain object-bottom"
                                alt=""
                            />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BannerFullWidth;
