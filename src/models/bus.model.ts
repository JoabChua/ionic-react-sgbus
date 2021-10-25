export interface BusServiceResponseModel {
  "odata.metadata": string;
  value: BusServiceModel[];
}

export interface BusServiceModel {
  ServiceNo: string;
  Operator: string;
  Direction: number;
  Category: string;
  OriginCode: string;
  DestinationCode: string;
  AM_Peak_Freq: string;
  AM_Offpeak_Freq: string;
  PM_Peak_Freq: string;
  PM_Offpeak_Freq: string;
  LoopDesc: string;
}

export interface BusRouteResponseModel {
  "odata.metadata": string;
  value: BusRouteModel[];
}

export interface BusRouteModel {
  ServiceNo: string;
  Operator: string;
  Direction: number;
  StopSequence: number;
  BusStopCode: string;
  Distance: number;
  WD_FirstBus: string;
  WD_LastBus: string;
  SAT_FirstBus: string;
  SAT_LastBus: string;
  SUN_FirstBus: string;
  SUN_LastBus: string;
}

export interface BusStopReponseModel {
  "odata.metadata": string;
  value: BusStopModel[];
}

export interface BusStopModel {
  BusStopCode: string;
  RoadName: string;
  Description: string;
  Latitude: number;
  Longitude: number;
}

export interface BusArrivalResponseModel {
  "odata.metadata": string;
  BusStopCode: string;
  Services: BusArrivalModel[];
}

export interface BusArrivalModel {
  ServiceNo: string;
  Operator: string;
  NextBus: NextBus;
  NextBus2: NextBus;
  NextBus3: NextBus;
}

export interface NextBus {
  OriginCode: string;
  DestinationCode: string;
  EstimatedArrival: string;
  Latitude: string;
  Longitude: string;
  VisitNumber: string;
  Load: string;
  Feature: string;
  Type: string;
}
