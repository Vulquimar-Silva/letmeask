import { useEffect, useState } from "react";
import { RadioBrowserApi } from "radio-browser-api";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

import "./index.scss"

export function RadioN() {
  
  const [stations, setStations] = useState();
  const [stationFilter, setStationFilter] = useState("all");

  useEffect(() => {
    setupApi(stationFilter).then((data) => {
      //console.log(data);
      setStations(data);
    });
  }, [stationFilter]);

  const setupApi = async (stationFilter) => {
    const api = new RadioBrowserApi(fetch.bind(window), "letmeRadio");

    const stations = await api
      .searchStations({
        language: "english",
        tag: stationFilter,
        limit: 1,
      })
      .then((data) => {
        return data;
      });

    return stations;
  };

  const filters = [
    "all",
    "jazz",
    "country",
    "dance",
    "retro",
    "rap",
  ];



return (

      <div className="radio">
      <div className="filters" style={{ marginTop: "20px"}}>
        {filters.map((filter) => (
          <span
            className={stationFilter === filter ? "selected" : ""}
            onClick={() => setStationFilter(filter)}
          >
            {filter}
          </span>
        ))}
      </div>
      <div className="stations" style={{display:"flex", flexDirection:"column", justifyContent: "center", alignItems: "center"}}>
        {stations &&
          stations.map((station, index) => {
            return (
              <div className="station" key={index}>
                <div className="stationName">
                  <img
                    className="logo"
                    src={station.favicon}
                    alt="station logo"
                  />
                  <div className="name">{station.name}</div>
                </div>

                <AudioPlayer
                  autoPlay
                  className="player"
                  src={station.urlResolved}
                  showJumpControls={false}
                  layout="stacked"
                  customProgressBarSection={[]}
                  customControlsSection={["MAIN_CONTROLS", "VOLUME_CONTROLS"]}
                  autoPlayAfterSrcChange={false}
                />
              </div>
            );
          })}
      </div>
    </div>

  
  )
}
