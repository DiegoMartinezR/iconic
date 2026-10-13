import React, { useRef, useState } from "react";
import YouTube from "react-youtube";
import em from "../../Utils/em";

const AboutHeader = ({ summary, details }) => {
  const [playing, setPlaying] = useState(false);
  const [player, setPlayer] = useState(null)

  const opts = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 0,
      controls: 0,
    },
  };

  const onPlay = () => {
    if (playing) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
    setPlaying(!playing);
  };

  return (
    <section className="relative mt-16">
      <YouTube
        videoId="OeYZwD13oHk"
        className="aspect-[16/9] md:aspect-[64/25] w-full border-0"
        onPause={e => setPlaying(false)}
        opts={opts}
        onReady={(event) => {
          setPlayer(event.target)
        }}
      />
      {!playing && (
        <>
          <img
            src="https://i.ytimg.com/vi/OeYZwD13oHk/hq720.jpg"
            className="aspect-[16/9] md:aspect-[64/25] w-full border-0 object-cover object-center absolute top-0 left-0"
            alt={details?.["about.title"]}
          />
          <div className="absolute top-0 left-0 right-0 bottom-0 p-[10%] flex items-center justify-center">
            <div className="text-center max-w-xl">
              <h1 className="text-[24px] md:text-[48px] md:[line-height:60px] text-2xl text-white font-bold text-shadow mb-2 md:mb-4">
                {em(details?.["about.title"])}
              </h1>
              <div className="md:text-lg text-white text-shadow mb-2 md:mb-4">
                {em(details?.["about.description"])}
              </div>
              <button
                onClick={onPlay}
                className="inline-flex gap-1 text-white bg-[#F8B62C] px-3 py-1 rounded-full text-lg"
              >
                <i className="mdi mdi-play-circle-outline"></i>
                <span>{playing ? "Pause" : "Play"}</span>
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default AboutHeader;
