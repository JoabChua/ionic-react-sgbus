import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonContent,
  IonItem,
  IonBackButton,
  IonRefresher,
  IonRefresherContent,
  IonLoading,
  IonList,
  IonAlert,
} from "@ionic/react";
import { useCallback, useEffect, useState } from "react";
import {
  BUS_ARRIVAL_API,
  LTA_ACCESSS_KEY,
  THINGS_PROXY,
} from "../configs/bus.config";
import {
  BusArrivalModel,
  BusArrivalResponseModel,
  BusStopModel,
} from "../models/bus.model";
import "./BusArrivalDetail.scss";
import { chevronDownCircleOutline } from "ionicons/icons";
import { RefresherEventDetail } from "@ionic/core";
import { Http } from "@capacitor-community/http";
import { isPlatform } from "@ionic/react";
import { useParams } from "react-router";

const diff_minutes = (dt1: string) => {
  if (dt1 === "") {
    return "NA";
  }
  var diff = (new Date().getTime() - new Date(dt1).getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff))
    ? Math.abs(Math.round(diff)) + " mins"
    : "Arr";
};

const BusArrivalDetail: React.FC<{
  busStop: BusStopModel;
  setBusStop(bus: any): void;
}> = ({ busStop, setBusStop }) => {
  const { busarrivalno } = useParams<{ busarrivalno: string }>();
  const [busArrival, setBusArrival] = useState<BusArrivalModel[]>(
    [] as BusArrivalModel[],
  );
  const [localBusStopInfo, setlocalBusStopInfo] = useState<BusStopModel>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchBusArrival = useCallback(async (busService: string) => {
    try {
      const res1 = await Http.get({
        url: `${
          isPlatform("mobileweb") ? THINGS_PROXY : ""
        }${BUS_ARRIVAL_API}?BusStopCode=${busService}`,
        headers: {
          ...LTA_ACCESSS_KEY,
        },
      });

      if (res1.status !== 200) {
        throw new Error("Something went wrong!");
      }

      const data = res1.data as BusArrivalResponseModel;

      setBusArrival(data.Services);

      if (busStop) {
        setlocalBusStopInfo(busStop);
      }
    } catch (error: any) {
      setError("Failed to fetch information");
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetchBusArrival(busarrivalno).then(() => {
      setIsLoading(false);
    });
  }, [fetchBusArrival, busarrivalno]);

  const refreshHandler = (event: CustomEvent<RefresherEventDetail>) => {
    setIsRefreshing(true);
    fetchBusArrival(busarrivalno).then(() => {
      setTimeout(() => {
        event.detail.complete();
        setIsRefreshing(false);
      }, 500);
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/busarrival" />
          </IonButtons>
          <IonTitle>
            {localBusStopInfo?.Description} - {localBusStopInfo?.BusStopCode}
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonRefresher
          slot="fixed"
          onIonRefresh={refreshHandler}
          className={isRefreshing ? "refresh" : ""}
        >
          <IonRefresherContent
            pullingIcon={chevronDownCircleOutline}
            pullingText="Pull to refresh"
            refreshingSpinner="circles"
            refreshingText="Refreshing..."
          ></IonRefresherContent>
        </IonRefresher>

        <IonAlert
          isOpen={!!error}
          onDidDismiss={() => setError("")}
          header={"Error"}
          message={error}
          buttons={["OK"]}
        />

        {isLoading && <IonLoading isOpen={isLoading} message={"Loading..."} />}

        {!isLoading && busArrival.length > 0 && (
          <IonList>
            {busArrival.map((busArrival, index) => {
              const routeLink = `/busservices/${busArrival.ServiceNo}`;

              return (
                <IonItem
                  key={index}
                  routerLink={routeLink}
                  routerDirection="forward"
                  onClick={() => setBusStop(busArrival)}
                >
                  <div className="arrival-item">
                    <div className="desc">{busArrival.ServiceNo}</div>
                    <div className="timing">
                      <div className={"time " + busArrival.NextBus.Load}>
                        {diff_minutes(busArrival.NextBus.EstimatedArrival)}
                      </div>
                      <div className={"time " + busArrival.NextBus2.Load}>
                        {diff_minutes(busArrival.NextBus2.EstimatedArrival)}
                      </div>
                      <div className={"time " + busArrival.NextBus3.Load}>
                        {diff_minutes(busArrival.NextBus3.EstimatedArrival)}
                      </div>
                    </div>
                  </div>
                </IonItem>
              );
            })}
          </IonList>
        )}

        {!isLoading && busArrival.length === 0 && (
          <div className="no-info">No Bus Information Available</div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default BusArrivalDetail;
