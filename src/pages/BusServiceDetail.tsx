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
  IonList,
  IonButton,
  IonIcon,
} from "@ionic/react";
import { useCallback, useEffect, useState } from "react";
import {
  BusServiceModel,
  BusRouteModel,
  BusStopModel,
} from "../models/bus.model";
import "./BusServiceDetail.scss";
import { swapVerticalOutline } from "ionicons/icons";
import { useParams } from "react-router";

const BusServiceDetail: React.FC<{
  bus: BusServiceModel;
  setBusStop(bus: any): void;
}> = ({ bus, setBusStop }) => {
  const { busno } = useParams<{ busno: string }>();
  const [busRoute, setBusRoute] = useState<BusRouteModel[]>(
    [] as BusRouteModel[],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [direction, setDirection] = useState(1);
  const [showDirChange, setShowDirChange] = useState(false);

  const fetchBusRoute = useCallback(async (serviceNo: string) => {
    setIsLoading(true);
    try {
      let data: BusRouteModel[] =
        +serviceNo.charAt(0) < 5
          ? require("../services/busroute.json")
          : require("../services/busroute2.json");
      data = data.filter((br) => br.ServiceNo === serviceNo);

      let busStops: BusStopModel[] = require("../services/busstop.json");
      setShowDirChange(
        data.some((br) => br.Direction === 1) &&
          data.some((br) => br.Direction === 2),
      );
      data.forEach((br: BusRouteModel) => {
        const findobj = busStops.find(
          (bs) => bs.BusStopCode === br.BusStopCode,
        );
        if (findobj) {
          br.Description = findobj?.Description;
        }
      });
      setBusRoute(data);
    } catch (error: any) {
      setError(error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchBusRoute(busno);
  }, [fetchBusRoute, busno]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/busservices" />
          </IonButtons>
          <IonTitle>Bus No: {bus.ServiceNo}</IonTitle>
          {showDirChange && (
            <IonButtons slot="secondary">
              <IonButton
                onClick={() => setDirection((prev) => (prev === 1 ? 2 : 1))}
              >
                <IonIcon
                  slot="icon-only"
                  icon={swapVerticalOutline}
                  className={direction === 1 ? "normal" : "direction2"}
                />
              </IonButton>
            </IonButtons>
          )}
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonLoading isOpen={isLoading} message={"Please wait..."} />

        {!isLoading && !!error && <div>{error}</div>}

        {!isLoading && (
          <IonList>
            {busRoute.map((bus, index) => {
              const routeLink = `/busarrival/${bus.BusStopCode}`;

              return (
                direction === bus.Direction && (
                  <IonItem
                    key={index}
                    routerLink={routeLink}
                    routerDirection="forward"
                    onClick={() => setBusStop(bus)}
                  >
                    <div className="item">
                      <div className="service">{bus.ServiceNo}</div>
                      <div className="bus-desc">
                        <div className="title">{bus.Description}</div>
                        <div>{bus.BusStopCode}</div>
                      </div>
                    </div>
                  </IonItem>
                )
              );
            })}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default BusServiceDetail;
