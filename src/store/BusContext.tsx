import React from "react";
import { BusServiceModel, BusStopModel } from "../models/bus.model";

export type BusContextModel = {
  busStop?: BusStopModel;
  busService?: BusServiceModel;
  setBusStop: (selectedBusStop: BusStopModel) => void;
  setBusService: (selectedBusService: BusServiceModel) => void;
};

const BusContext = React.createContext<BusContextModel>({
  setBusStop: (selectedBusStop: BusStopModel) => {},
  setBusService: (selectedBusService: BusServiceModel) => {},
});

export default BusContext;
