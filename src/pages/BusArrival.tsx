import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonContent,
  IonLoading,
  IonButton,
  IonIcon,
} from "@ionic/react";
import { Geolocation, Position } from "@capacitor/geolocation";
import { useCallback, useEffect, useState } from "react";
import "./BusArrival.scss";
import { BusStopModel } from "../models/bus.model";
import GoogleMap from "../components/GoogleMap";
import BusStopList from "../components/BusStopList";
import { locateSharp } from "ionicons/icons";

const BusArrival: React.FC<{ setBusStop(busStop: BusStopModel): void }> = ({
  setBusStop,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [coord, setCoord] = useState<GoogleMapStartingPoint>(
    {} as GoogleMapStartingPoint,
  );
  const [filteredBustops, setFilteredBustops] = useState<BusStopModel[]>([]);

  const fetchLocation = useCallback(async () => {
    setIsLoading(true);
    try {
      await getCurrentLocation();
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  const getCurrentLocation = async () => {
    const geolocation: Position = await Geolocation.getCurrentPosition();
    setCoord({
      center: {
        lat: geolocation.coords.latitude,
        lng: geolocation.coords.longitude,
      },
      zoom: 16,
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Bus Arrival</IonTitle>
          <IonButtons slot="secondary">
            <IonButton onClick={() => fetchLocation()}>
              <IonIcon slot="icon-only" icon={locateSharp} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {isLoading && <IonLoading isOpen={isLoading} message={"Loading..."} />}

        <div className="map-container">
          {!isLoading && (
            <GoogleMap
              coord={coord}
              setBusStopList={setFilteredBustops}
              setCoord={setCoord}
              setBusStop={setBusStop}
            />
          )}
        </div>
        <div className="map-container">
          {!isLoading && (
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
