import React from "react";
import { BusServiceModel, BusStopModel, FavStore } from "../models/bus.model";

export type BusContextModel = {
  busStop?: BusStopModel;
  busService?: BusServiceModel;
  favStore: FavStore;
  isLoading: boolean;
  updateVersion?: string;
  setBusStop: (selectedBusStop: BusStopModel) => void;
  setBusService: (selectedBusService: BusServiceModel) => void;
  setFavStore: (favStore: FavStore) => void;
  setIsLoading: (isLoading: boolean) => void;
  setUpdateVersion: (updateVersion: string) => void;
};

const BusContext = React.createContext<BusContextModel>({
  favStore: { busStop: [] },
  isLoading: false,
  setBusStop: (selectedBusStop: BusStopModel) => {},
  setBusService: (selectedBusService: BusServiceModel) => {},
  setFavStore: (favStore: FavStore) => {},
  setIsLoading: (isLoading: boolean) => {},
  setUpdateVersion: (updatedVersion: string) => {},
});

export default BusContext;
