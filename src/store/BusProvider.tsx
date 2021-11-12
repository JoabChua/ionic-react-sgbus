import React, { useState } from "react";
import { BusServiceModel, BusStopModel } from "../models/bus.model";
import BusContext, { BusContextModel } from "./BusContext";

const BusContextProvider: React.FC = (props) => {
  const [busStop, setBusStop] = useState<BusStopModel>();
  const [busService, setBusService] = useState<BusServiceModel>();

  const setBusStopHandler = (selectedBusStop: BusStopModel) => {
    setBusStop(selectedBusStop);
  };

  const setBusServiceHandler = (selectedBusService: BusServiceModel) => {
    setBusService(selectedBusService);
  };

  const contextValue: BusContextModel = {
    busStop,
    busService,
    setBusStop: setBusStopHandler,
    setBusService: setBusServiceHandler,
  };

  return (
    <BusContext.Provider value={contextValue}>
      {props.children}
    </BusContext.Provider>
  );
};

export default BusContextProvider;
