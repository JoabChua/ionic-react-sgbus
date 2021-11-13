import React from "react";
import { BusServiceModel, BusStopModel, FavStore } from "../models/bus.model";

export type BusContextModel = {
  busStop?: BusStopModel;
  busService?: BusServiceModel;
  favStore: FavStore;
  setBusStop: (selectedBusStop: BusStopModel) => void;
  setBusService: (selectedBusService: BusServiceModel) => void;
  setFavStore: (favStore: FavStore) => void;
};

const BusContext = React.createContext<BusContextModel>({
  favStore: { busStop: [] },
  setBusStop: (selectedBusStop: BusStopModel) => {},
  setBusService: (selectedBusService: BusServiceModel) => {},
  setFavStore: (favStore: FavStore) => {},
});

export default BusContext;
