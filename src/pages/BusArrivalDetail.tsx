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
} from "@ionic/react";
import { useCallback, useEffect, useState } from "react";
import { BUS_ARRIVAL_API, LTA_ACCESSS_KEY } from "../configs/bus.config";
import {
  BusArrivalModel,
  BusArrivalResponseModel,
  BusStopModel,
} from "../models/bus.model";
import { Virtuoso } from "react-virtuoso";
import "./BusArrivalDetail.scss";
import { chevronDownCircleOutline } from "ionicons/icons";
import { RefresherEventDetail } from "@ionic/core";

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

const BusArrivalDetail: React.FC<{ busStop: BusStopModel }> = ({ busStop }) => {
  const [busArrival, setBusArrival] = useState<BusArrivalModel[]>(
    [] as BusArrivalModel[],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchBusArrival = useCallback(async () => {
    try {
      const res1 = await fetch(
        `https://cors-anywhere.herokuapp.com/${BUS_ARRIVAL_API}?BusStopCode=${busStop.BusStopCode}`,
        { headers: LTA_ACCESSS_KEY },
      );

      if (!res1.ok) {
        throw new Error("Something went wrong!");
      }

      const data = (await res1.json()) as BusArrivalResponseModel;

      setBusArrival(data.Services);
    } catch (error: any) {
      setError(error);
    }
  }, [busStop.BusStopCode]);

  useEffect(() => {
    setIsLoading(true);
    fetchBusArrival().then(() => {
      setIsLoading(false);
    });
  }, [fetchBusArrival]);

  const refreshHandler = (event: CustomEvent<RefresherEventDetail>) => {
    setIsRefreshing(true);
    fetchBusArrival().then(() => {
      event.detail.complete();
      setIsRefreshing(false);
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/busarrival" />
          </IonButtons>
          <IonTitle>Bus Stop Code: {busStop.BusStopCode}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">
              Bus Stop Code: {busStop.BusStopCode}
            </IonTitle>
          </IonToolbar>
        </IonHeader>

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

        {isLoading && <IonLoading isOpen={isLoading} message={"Loading..."} />}

        {!isLoading && busArrival.length > 0 && (
          <Virtuoso
            style={{ height: "100%" }}
            data={busArrival}
            totalCount={busArrival.length}
            itemContent={(index, busArrival: BusArrivalModel) => {
              return (
                <IonItem key={busArrival.ServiceNo}>
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
                    {/* <div className="code">{busArrival.Operator}</div> */}
                  </div>
                </IonItem>
              );
            }}
          />
        )}

        {!isLoading && busArrival.length === 0 && (
          <div className="no-info">No Bus Information Available</div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default BusArrivalDetail;
