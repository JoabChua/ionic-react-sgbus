import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonContent,
  IonBackButton,
  IonLoading,
  IonItem,
} from "@ionic/react";
import { useCallback, useEffect, useState } from "react";
import { BUS_ROUTE_API, LTA_ACCESSS_KEY } from "../configs/bus.config";
import {
  BusServiceModel,
  BusRouteModel,
  BusRouteResponseModel,
} from "../models/bus.model";
import { Virtuoso } from "react-virtuoso";

const BusServiceDetail: React.FC<{ bus: BusServiceModel }> = (props) => {
  const [busRoute, setBusRoute] = useState<BusRouteModel[]>(
    [] as BusRouteModel[],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBusRoute = useCallback(async () => {
    setIsLoading(true);
    try {
      const res1 = await fetch(
        `https://cors-anywhere.herokuapp.com/${BUS_ROUTE_API}`,
        { headers: LTA_ACCESSS_KEY },
      );

      if (!res1.ok) {
        throw new Error("Something went wrong!");
      }

      const data = (await res1.json()) as BusRouteResponseModel;

      setBusRoute(data.value);
    } catch (error: any) {
      setError(error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchBusRoute();
  }, [fetchBusRoute]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/busservices" />
          </IonButtons>
          <IonTitle>Bus No: {props.bus.ServiceNo}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Bus No: {props.bus.ServiceNo}</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonLoading isOpen={isLoading} message={"Please wait..."} />

        {!isLoading && !!error && <div>{error}</div>}

        {!isLoading && (
          <Virtuoso
            style={{ height: "100%" }}
            data={busRoute}
            totalCount={busRoute.length}
            itemContent={(index, bus: BusRouteModel) => {
              return (
                <IonItem key={bus.ServiceNo}>
                  <div className="item">
                    <div className="service">{bus.ServiceNo}</div>
                    <div className="service">{bus.BusStopCode}</div>
                  </div>
                </IonItem>
              );
            }}
          />
        )}
      </IonContent>
    </IonPage>
  );
};

export default BusServiceDetail;
