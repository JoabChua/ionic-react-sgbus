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
} from "@ionic/react";
import { Geolocation, Position } from "@capacitor/geolocation";
import { useCallback, useEffect, useRef, useState } from "react";
import "./BusArrival.scss";
import { BusStopModel } from "../models/bus.model";
import GoogleMap from "../components/GoogleMap";
import BusStopList from "../components/BusStopList";
import { locateSharp } from "ionicons/icons";
import { App } from "@capacitor/app";
import { SplashScreen } from "@capacitor/splash-screen";
import {
  AdMob,
  BannerAdOptions,
  BannerAdSize,
  BannerAdPosition,
} from "@capacitor-community/admob";

const BusArrival: React.FC<{ setBusStop(busStop: BusStopModel): void }> = ({
  setBusStop,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [coord, setCoord] = useState<GoogleMapStartingPoint>(
    {} as GoogleMapStartingPoint,
  );
  const [filteredBustops, setFilteredBustops] = useState<BusStopModel[]>([]);
  const [showToast, setShowToast] = useState(false);
  const lastTimePressBack = useRef(0);

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

  const ionRouter = useIonRouter();
  let timePeriodToExit = 2200;

  useEffect(() => {
    SplashScreen.hide();
    AdMob.initialize({
      requestTrackingAuthorization: true,
      testingDevices: [""],
      initializeForTesting: true,
    });
    const options: BannerAdOptions = {
      adId: "ca-app-pub-6451703586668878/7345039996",
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
      isTesting: true,
    };
    AdMob.showBanner(options);
    document.addEventListener("ionBackButton", (ev: any) => {
      if (!ionRouter.canGoBack()) {
        if (
          new Date().getTime() - lastTimePressBack.current <
          timePeriodToExit
        ) {
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
