import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonContent,
  IonItem,
  IonList,
  IonIcon,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonAlert,
  useIonViewDidEnter,
  useIonToast,
} from "@ionic/react";
import { trash } from "ionicons/icons";
import { useContext, useReducer, useRef, useState } from "react";
import { FavBusItem } from "../models/bus.model";
import BusContext from "../store/BusContext";

const Favourite: React.FC = () => {
  const { favStore, setFavStore } = useContext(BusContext);
  const slidingRef = useRef<HTMLIonListElement>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [removeBusStop, setRemoveBusStop] = useState<FavBusItem>();
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [present, dismiss] = useIonToast();

  const promptAlert = (busStop: FavBusItem) => {
    const slider = slidingRef.current?.firstChild as HTMLIonItemSlidingElement;
    slider.closeOpened();
    setShowAlert(true);
    setRemoveBusStop(busStop);
  };

  const removeFavHandler = () => {
    dismiss();
    const idx = favStore.busStop.findIndex(
      (favBus) => favBus.busStopCode === removeBusStop?.busStopCode,
    );
    if (idx > -1) {
      favStore.busStop.splice(idx, 1);
      setFavStore(favStore);
      present("Bus Stop removed from Favourite.", 2000);
    }
  };

  useIonViewDidEnter(() => {
    forceUpdate();
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Favourite</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header={"Are you sure?"}
        message={"<strong>Remove bus stop from favourite list?</strong>"}
        buttons={[
          {
            text: "Cancel",
            role: "cancel",
          },
          {
            text: "Yes",
            handler: () => {
              removeFavHandler();
            },
          },
        ]}
      />

      <IonContent>
        {favStore.busStop.length > 0 && (
          <IonList ref={slidingRef}>
            {favStore.busStop.map((busStop) => {
              const routeLink = `/busarrival/${busStop.busStopCode}/${busStop.busStopName}/${busStop.roadName}`;
              return (
                <IonItemSliding key={busStop.busStopCode + busStop.busStopName}>
                  <IonItem routerLink={routeLink} routerDirection="forward">
                    <div className="stop">
                      <div className="left">
                        <div className="desc">{busStop.busStopName}</div>
                        <div className="road">{busStop.roadName}</div>
                      </div>
                      <div className="code">{busStop.busStopCode}</div>
                    </div>
                  </IonItem>
                  <IonItemOptions>
                    <IonItemOption
                      color="danger"
                      onClick={() => promptAlert(busStop)}
                    >
                      <IonIcon slot="icon-only" icon={trash} />
                    </IonItemOption>
                  </IonItemOptions>
                </IonItemSliding>
              );
            })}
          </IonList>
        )}
        {favStore.busStop.length === 0 && (
          <div className="no-info">No Favourite Available</div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Favourite;
