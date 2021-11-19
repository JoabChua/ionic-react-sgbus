import React, { useEffect, useState } from "react";
import { BusServiceModel, BusStopModel, FavStore } from "../models/bus.model";
import BusContext, { BusContextModel } from "./BusContext";

const BusContextProvider: React.FC = (props) => {
  const [busStop, setBusStop] = useState<BusStopModel>();
  const [busService, setBusService] = useState<BusServiceModel>();
  const [favStore, setFavStore] = useState<FavStore>({ busStop: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [updateVersion, setUpdateVersion] = useState<string>();

  const setBusStopHandler = (selectedBusStop: BusStopModel) => {
    setBusStop(selectedBusStop);
  };

  const setBusServiceHandler = (selectedBusService: BusServiceModel) => {
    setBusService(selectedBusService);
  };

  const setFavStoreHandler = (fav: FavStore) => {
    setFavStore(fav);
    localStorage.setItem("favStore", JSON.stringify(fav));
  };

  const setIsLoadingHandler = (isLoading: boolean) => {
    setIsLoading(!isLoading);
  };

  const setUpdateVersionHandler = (updatedVersion: string) => {
    setUpdateVersion(updatedVersion);
    localStorage.setItem("updateVersion", updatedVersion);
  };

  useEffect(() => {
    const fav = localStorage.getItem("favStore")
      ? (JSON.parse(localStorage.getItem("favStore")!) as FavStore)
      : false;
    if (!!fav) {
      setFavStore(fav);
    }

    const version = localStorage.getItem("updateVersion");
    if (!version || version !== "1") {
      if (fav) {
        fav.busStop.forEach((bs) => {
          bs.BusStopCode = bs.busStopCode!;
          bs.Description = bs.busStopName!;
          bs.RoadName = bs.roadName!;
          delete bs.busStopCode;
          delete bs.busStopName;
          delete bs.roadName;
        });
        setFavStoreHandler(fav);
        setUpdateVersionHandler("1");
      }
    }
  }, []);

  const contextValue: BusContextModel = {
    busStop,
    busService,
    favStore,
    isLoading,
    updateVersion,
    setBusStop: setBusStopHandler,
    setBusService: setBusServiceHandler,
    setFavStore: setFavStoreHandler,
    setIsLoading: setIsLoadingHandler,
    setUpdateVersion: setUpdateVersionHandler,
  };

  return (
    <BusContext.Provider value={contextValue}>
      {props.children}
    </BusContext.Provider>
  );
};

export default BusContextProvider;
