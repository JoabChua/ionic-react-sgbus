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
import GoogleMapReact from "google-map-react";
import { MAP_KEY } from "../configs/bus.config";
import "./BusArrival.scss";

const BusArrival: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [coord, setCoord] = useState<GoogleMapStartingPoint>(
    {} as GoogleMapStartingPoint,
  );

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

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Bus Arrival</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="map-container">
          {!isLoading && (
            <GoogleMapReact
              bootstrapURLKeys={{
                key: MAP_KEY,
              }}
              defaultCenter={coord.center}
              zoom={coord.zoom}
              yesIWantToUseGoogleMapApiInternals={true}
            ></GoogleMapReact>
          )}
          {isLoading && (
            <IonLoading isOpen={isLoading} message={"Loading..."} />
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default BusArrival;

interface GoogleMapStartingPoint {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
}
