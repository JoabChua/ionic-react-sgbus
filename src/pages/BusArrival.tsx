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
  useIonRouter,
  IonToast,
  IonAlert,
} from "@ionic/react";
import {
  Geolocation,
  PermissionStatus,
  Position,
} from "@capacitor/geolocation";
import { useCallback, useEffect, useRef, useState } from "react";
import "./BusArrival.scss";
import { BusStopModel } from "../models/bus.model";
import GoogleMap from "../components/GoogleMap";
import BusStopList from "../components/BusStopList";
import { locateSharp } from "ionicons/icons";
import { App } from "@capacitor/app";
import { SplashScreen } from "@capacitor/splash-screen";
import { isPlatform } from "@ionic/react";

const BusArrival: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [coord, setCoord] = useState<GoogleMapStartingPoint>(
    {} as GoogleMapStartingPoint,
  );
  const [watchCoord, setWatchCoord] = useState<GoogleMapStartingPoint>(
    {} as GoogleMapStartingPoint,
  );
  const [filteredBustops, setFilteredBustops] = useState<BusStopModel[] | null>(
    null,
  );
  const [showToast, setShowToast] = useState(false);
  const lastTimePressBack = useRef(0);
  const watchIds = useRef<string[]>([]);

  const fetchLocation = useCallback(async () => {
    setIsLoading(true);
    try {
      await getCurrentLocation();
    } catch (err) {
      setError("Failed to fetch location");
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchLocation();
  }, []);

  const getCurrentLocation = async () => {
    const currentPermission: PermissionStatus =
      await Geolocation.checkPermissions();
    if (isPlatform("mobileweb")) {
      const geolocation: Position = await Geolocation.getCurrentPosition();
      setCoord({
        center: {
          lat: geolocation.coords.latitude,
          lng: geolocation.coords.longitude,
        },
        zoom: 16,
      });
      const watchId = await Geolocation.watchPosition(
        { enableHighAccuracy: true },
        (pos) => {
          if (pos) {
            const newPos = pos as Position;
            setWatchCoord({
              center: {
                lat: newPos.coords.latitude,
                lng: newPos.coords.longitude,
              },
              zoom: 16,
            });
          }
        },
      );
      watchIds.current.push(watchId);
    } else {
      if (
        currentPermission.location === "prompt" ||
        currentPermission.location === "prompt-with-rationale"
      ) {
        const getPermission = await Geolocation.requestPermissions();
        if (getPermission.location === "granted") {
          const geolocation: Position = await Geolocation.getCurrentPosition();
          setCoord({
            center: {
              lat: geolocation.coords.latitude,
              lng: geolocation.coords.longitude,
            },
            zoom: 16,
          });
          const watchId = await Geolocation.watchPosition(
            { enableHighAccuracy: true },
            (pos) => {
              const newPos = pos as Position;
              setWatchCoord({
                center: {
                  lat: newPos.coords.latitude,
                  lng: newPos.coords.longitude,
                },
                zoom: 16,
              });
            },
          );
          watchIds.current.push(watchId);
        }
      } else if (currentPermission.location === "granted") {
        const geolocation: Position = await Geolocation.getCurrentPosition();
        setCoord({
          center: {
            lat: geolocation.coords.latitude,
            lng: geolocation.coords.longitude,
          },
          zoom: 16,
        });
        const watchId = await Geolocation.watchPosition(
          { enableHighAccuracy: true },
          (pos) => {
            const newPos = pos as Position;
            setWatchCoord({
              center: {
                lat: newPos.coords.latitude,
                lng: newPos.coords.longitude,
              },
              zoom: 16,
            });
          },
        );
        watchIds.current.push(watchId);
      } else {
        alert(
          "Please go to Settings > Location Permission, to allow location for this application, for the app to work.",
        );
      }
    }
  };

  const ionRouter = useIonRouter();
  let timePeriodToExit = 2200;

  useEffect(() => {
    SplashScreen.hide();

    document.addEventListener("ionBackButton", () => {
      if (!ionRouter.canGoBack()) {
        if (
          new Date().getTime() - lastTimePressBack.current <
          timePeriodToExit
        ) {
          watchIds.current.forEach((id) => Geolocation.clearWatch({ id }));
          App.exitApp();
        } else {
          setShowToast(true);
          lastTimePressBack.current = new Date().getTime();
        }
      }
    });
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Bus Arrival</IonTitle>
          <IonButtons slot="primary">
            <IonButton onClick={() => fetchLocation()}>
              <IonIcon slot="icon-only" icon={locateSharp} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonAlert
          isOpen={!!error}
          onDidDismiss={() => setError("")}
          header={"Error"}
          message={error}
          buttons={[
            {
              text: "Reload",
              handler: () => {
                fetchLocation();
              },
            },
          ]}
        />

        {isLoading && <IonLoading isOpen={isLoading} message={"Loading..."} />}

        <div className="map-container">
          {!isLoading && (
            <GoogleMap
              coord={coord}
              setBusStopList={setFilteredBustops}
              setCoord={setCoord}
              watchCoord={watchCoord}
            />
          )}
        </div>
        <div className="map-container">
          {!isLoading && <BusStopList busStops={filteredBustops} />}
        </div>

        <IonToast
          isOpen={showToast}
          message="Press back again to exit"
          duration={2000}
          onDidDismiss={() => setShowToast(false)}
        />
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
