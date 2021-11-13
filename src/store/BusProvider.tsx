import React, { useEffect, useState } from "react";
import { BusServiceModel, BusStopModel, FavStore } from "../models/bus.model";
import BusContext, { BusContextModel } from "./BusContext";

const BusContextProvider: React.FC = (props) => {
  const [busStop, setBusStop] = useState<BusStopModel>();
  const [busService, setBusService] = useState<BusServiceModel>();
  const [favStore, setFavStore] = useState<FavStore>({ busStop: [] });

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

  useEffect(() => {
    const fav = localStorage.getItem("favStore")
      ? JSON.parse(localStorage.getItem("favStore")!)
      : false;
    if (!!fav) {
      setFavStore(fav);
    }
    console.log(fav);
  }, []);

  const contextValue: BusContextModel = {
    busStop,
    busService,
    favStore,
    setBusStop: setBusStopHandler,
    setBusService: setBusServiceHandler,
    setFavStore: setFavStoreHandler,
  };

  return (
    <BusContext.Provider value={contextValue}>
      {props.children}
    </BusContext.Provider>
  );
};

export default BusContextProvider;
