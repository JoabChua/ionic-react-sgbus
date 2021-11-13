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
import { BusRouteModel, BusStopModel } from "../models/bus.model";
import "./BusServiceDetail.scss";
import { arrowForward, swapVerticalOutline } from "ionicons/icons";
import { useParams } from "react-router";

const BusServiceDetail: React.FC = () => {
  const { busServiceNo } = useParams<{ busServiceNo: string }>();
  const [busRoute, setBusRoute] = useState<BusRouteModel[]>(
    [] as BusRouteModel[],
  );
  const [busRoute2, setBusRoute2] = useState<BusRouteModel[]>(
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
          br.RoadName = findobj?.RoadName;
        }
      });

      setBusRoute(data.filter((busRoute1) => busRoute1.Direction === 1));
      setBusRoute2(data.filter((busRoute2) => busRoute2.Direction === 2));
    } catch (error: any) {
      setError(error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchBusRoute(busServiceNo);
  }, [fetchBusRoute, busServiceNo]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/busservices" />
          </IonButtons>
          <IonTitle>Bus No: {busServiceNo}</IonTitle>
          {showDirChange && (
            <IonButtons slot="primary">
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
          <div>
            {
              <div className="service-direction">
                <span className="first">
                  {" "}
                  {direction === 1
                    ? busRoute[0].Description
                    : busRoute2[0].Description}
                </span>
                <IonIcon icon={arrowForward} />
                <span className="last">
                  {direction === 1
                    ? busRoute[busRoute.length - 1].Description
                    : busRoute2[busRoute2.length - 1].Description}
                </span>
              </div>
            }
            <IonList lines={"full"}>
              {(direction === 1 ? busRoute : busRoute2).map((bus, index) => {
                const routeLink = `/busarrival/${bus.BusStopCode}/${bus.Description}/${bus.RoadName}`;
                return (
                  direction === bus.Direction && (
                    <IonItem
                      key={index}
                      routerLink={routeLink}
                      routerDirection="forward"
                    >
                      <div className="item">
                        <div className="bus-hour">
                          <span>
                            Mon-Fri:{bus.WD_FirstBus}-{bus.WD_LastBus}
                          </span>
                          <span>
                            Sat:{bus.SAT_FirstBus}-{bus.SAT_LastBus}
                          </span>
                          <span>
                            Sun:{bus.SUN_FirstBus}-{bus.SUN_LastBus}
                          </span>
                        </div>
                        <div className="bus-desc">
                          <div className="title">{bus.Description}</div>
                          <div className="sub-title">{bus.RoadName}</div>
                          <div className="code">{bus.BusStopCode}</div>
                        </div>
                      </div>
                    </IonItem>
                  )
                );
              })}
            </IonList>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default BusServiceDetail;
