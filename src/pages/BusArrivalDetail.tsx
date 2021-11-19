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
  IonIcon,
  IonButton,
  useIonToast,
} from "@ionic/react";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  BUS_ARRIVAL_API,
  LTA_ACCESSS_KEY,
  THINGS_PROXY,
} from "../configs/bus.config";
import {
  BusArrivalModel,
  BusArrivalResponseModel,
  FavBusItem,
} from "../models/bus.model";
import "./BusArrivalDetail.scss";
import {
  arrowDownCircleOutline,
  chevronDownCircleOutline,
  star,
  starOutline,
} from "ionicons/icons";
import { RefresherEventDetail } from "@ionic/core";
import { Http } from "@capacitor-community/http";
import { isPlatform } from "@ionic/react";
import { useParams } from "react-router";
import TimeArrival from "../components/TimeArrival";
import BusContext from "../store/BusContext";

const BusArrivalDetail: React.FC = () => {
  const { favStore, setFavStore } = useContext(BusContext);
  const { busStopCode, busStopName, roadName } =
    useParams<{ busStopCode: string; busStopName: string; roadName: string }>();

  const [busArrival, setBusArrival] = useState<BusArrivalModel[]>(
    [] as BusArrivalModel[],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [favIndex, setFavIndex] = useState(-1);
  const [present, dismiss] = useIonToast();

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
    } catch (error: any) {
      setError("Failed to fetch information");
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetchBusArrival(busStopCode).then(() => {
      setIsLoading(false);
    });
  }, [fetchBusArrival, busStopCode]);

  useEffect(() => {
    if (favStore) {
      const idx = favStore.busStop.findIndex(
        (favBusItem) => favBusItem.BusStopCode === busStopCode,
      );
      if (idx > -1) {
        setFavIndex(idx);
        setIsFav(true);
      } else {
        setFavIndex(-1);
        setIsFav(false);
      }
    }
  }, [busStopCode, favStore]);

  const refreshHandler = (event: CustomEvent<RefresherEventDetail>) => {
    setIsRefreshing(true);
    fetchBusArrival(busStopCode).then(() => {
      setTimeout(() => {
        event.detail.complete();
        setIsRefreshing(false);
      }, 500);
    });
  };

  const setFavBusStopHandler = (checked: boolean) => {
    dismiss();
    setTimeout(() => {
      if (checked) {
        const favObj: FavBusItem = {
          BusStopCode: busStopCode,
          RoadName: roadName,
          Description: busStopName.replace("_", "/"),
          favBusStop: true,
        };
        const newArr = [favObj, ...favStore.busStop];
        setFavIndex(0);
        setIsFav(true);
        setFavStore({
          ...favStore,
          busStop: newArr,
        });
        present("Bus Stop added to Favourite.", 2000);
      } else {
        const newArr = [...favStore.busStop];
        newArr.splice(favIndex, 1);
        setFavStore({
          ...favStore,
          busStop: newArr,
        });
        setFavIndex(-1);
        setIsFav(false);
        present("Bus Stop removed from Favourite.", 2000);
      }
    }, 400);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/busarrival" />
          </IonButtons>
          <IonTitle>
            <div className="title">{busStopName.replace("_", "/")}</div>
            <div className="subtitle">
              {roadName} | {busStopCode}
            </div>
          </IonTitle>
          <IonButtons slot="primary">
            <IonButton onClick={() => setFavBusStopHandler(!isFav)}>
              <IonIcon
                style={{ color: "gold" }}
                slot="icon-only"
                icon={isFav ? star : starOutline}
              />
            </IonButton>
          </IonButtons>
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
          <div>
            <div className="legend-row">
              <div className="legend-item">
                <img
                  src="assets/img/singledeck.png"
                  alt="bus"
                  width="20"
                  height="20"
                />
                Single
              </div>
              <div className="legend-item">
                <img
                  src="assets/img/doubledeck.png"
                  alt="bus"
                  width="20"
                  height="20"
                />
                Double
              </div>
              <div className="legend-item">
                <img
                  src="assets/img/bendy.png"
                  alt="bus"
                  width="20"
                  height="20"
                />
                Bendy
              </div>
              <div className="legend-item">
                <img
                  src="assets/img/wheelchair.png"
                  alt="bus"
                  width="20"
                  height="20"
                />
                Wheelchair
              </div>
            </div>
            <IonList>
              {busArrival.map((busArrival, index) => {
                const routeLink = `/busservices/${busArrival.ServiceNo}/${busStopCode}`;

                return (
                  <IonItem
                    key={index}
                    routerLink={routeLink}
                    routerDirection="forward"
                  >
                    <div className="arrival-item">
                      <div className="desc">{busArrival.ServiceNo}</div>
                      <div className="timing">
                        <TimeArrival NextBus={busArrival.NextBus} />
                        <TimeArrival NextBus={busArrival.NextBus2} />
                        <TimeArrival NextBus={busArrival.NextBus3} />
                      </div>
                    </div>
                  </IonItem>
                );
              })}
            </IonList>
            <div className="refresh-text">
              <IonIcon icon={arrowDownCircleOutline} />
              Pull down to refresh
            </div>
          </div>
        )}

        {!isLoading && busArrival.length === 0 && (
          <div className="no-info">No Bus Information Available</div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default BusArrivalDetail;
