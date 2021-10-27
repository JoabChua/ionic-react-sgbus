import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonContent,
  IonLoading,
} from "@ionic/react";
import { Geolocation, Position } from "@capacitor/geolocation";
import { useCallback, useEffect, useState } from "react";
import { BUS_STOP_API, LTA_ACCESSS_KEY } from "../configs/bus.config";
import "./BusArrival.scss";
import { BusStopModel, BusStopReponseModel } from "../models/bus.model";
import GoogleMap from "../components/GoogleMap";
import BusStopList from "../components/BusStopList";
import { Http } from "@capacitor-community/http";
import { isPlatform } from "@ionic/react";

const fetchBusStopHelper = (num: number) => {
  return Http.get({
    url: `${
      isPlatform("mobileweb") ? "https://cors-anywhere.herokuapp.com/" : ""
    }${BUS_STOP_API}${num === 0 ? "" : `?$skip=${num}`}`,
    headers: LTA_ACCESSS_KEY,
  });
};

const BusArrival: React.FC<{ setBusStop(busStop: BusStopModel): void }> = ({
  setBusStop,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [busStopLoading, setBusStopLoading] = useState(false);
  const [busStops, setBusStops] = useState([] as BusStopModel[]);
  const [coord, setCoord] = useState<GoogleMapStartingPoint>(
    {} as GoogleMapStartingPoint,
  );
  const [filteredBustops, setFilteredBustops] = useState<BusStopModel[]>([]);

  const fetchBusStops = useCallback(async () => {
    setBusStopLoading(true);
    let isDoneFetching = false;
    let count = 0;
    try {
      while (!isDoneFetching) {
        const temp = await fetchBusStopHelper(count * 500);
        if (temp.status !== 200) {
          isDoneFetching = true;
          throw new Error("Something went wrong!");
        }
        const data = temp.data as BusStopReponseModel;

        if (data.value.length === 500) {
          count++;
          setBusStops((prev) => prev.concat(data.value));
          setBusStopLoading(false);
          // isDoneFetching = true;
        } else {
          setBusStops((prev) => prev.concat(data.value));
          setBusStops((prev) => {
            const key = "BusStopCode";
            return [...new Map(prev.map((item) => [item[key], item])).values()];
          });
          isDoneFetching = true;
        }
      }
    } catch (err: any) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    if (busStops.length === 5053) {
      localStorage.setItem("allbusstops", JSON.stringify(busStops));
    }
  }, [busStops]);

  const fetchLocation = useCallback(async () => {
    setIsLoading(true);
    try {
      const geolocation: Position = await Geolocation.getCurrentPosition();
      setCoord({
        center: {
          lat: geolocation.coords.latitude,
          lng: geolocation.coords.longitude,
        },
        zoom: 16,
      });
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Bus Arrival</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {isLoading && <IonLoading isOpen={isLoading} message={"Loading..."} />}

        {busStopLoading && (
          <IonLoading isOpen={busStopLoading} message={"Loading Data..."} />
        )}

        <div className="map-container">
          {!isLoading && (
            <GoogleMap
              coord={coord}
              setBusStopList={setFilteredBustops}
              fetchBusStops={fetchBusStops}
              setCoord={setCoord}
            />
          )}
        </div>
        <div className="map-container">
          {!busStopLoading && (
            <BusStopList busStops={filteredBustops} setBusStop={setBusStop} />
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default BusArrival;

export interface GoogleMapStartingPoint {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
}
