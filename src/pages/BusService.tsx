import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonContent,
  IonItem,
  IonLoading,
  IonAlert,
  IonButton,
  IonIcon,
  IonSearchbar,
} from "@ionic/react";
import { search } from "ionicons/icons";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  BUS_SERVICE_API,
  LTA_ACCESSS_KEY,
  THINGS_PROXY,
} from "../configs/bus.config";
import { BusServiceModel, BusServiceResponseModel } from "../models/bus.model";
import "./BusService.scss";
import { Virtuoso } from "react-virtuoso";
import { Http } from "@capacitor-community/http";
import { isPlatform } from "@ionic/react";

const compare = (a: BusServiceModel, b: BusServiceModel) => {
  // const reA = /[^a-zA-Z]/g;
  // const reN = /[^0-9]/g;
  // const aA = a.ServiceNo.replace(reA, "");
  // const bA = b.ServiceNo.replace(reA, "");
  // if (aA === bA) {
  //   const aN = parseInt(a.ServiceNo.replace(reN, ""), 10);
  //   const bN = parseInt(b.ServiceNo.replace(reN, ""), 10);
  //   return aN === bN ? 0 : aN > bN ? 1 : -1;
  // } else {
  //   return aA > bA ? 1 : -1;
  // }

  return a.ServiceNo.localeCompare(b.ServiceNo);
};

const BusServices: React.FC<{ setBus(bus: BusServiceModel): void }> = ({
  setBus,
}) => {
  const searchRef = useRef<any>();
  const [busServices, setBusServices] = useState<BusServiceModel[]>([]);
  const [unFilteredBusServices, setUnFilteredBusServices] = useState<
    BusServiceModel[]
  >([]);
  const [searchText, setSearchText] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>();

  const fetchBusStops = useCallback(async () => {
    setIsLoading(true);
    try {
      const endpoint1 = Http.get({
        url: `${isPlatform("mobileweb") ? THINGS_PROXY : ""}${BUS_SERVICE_API}`,
        headers: LTA_ACCESSS_KEY,
      });
      const endpoint2 = Http.get({
        url: `${
          isPlatform("mobileweb") ? THINGS_PROXY : ""
        }${BUS_SERVICE_API}?$skip=500`,
        headers: LTA_ACCESSS_KEY,
      });

      const [res1, res2] = await Promise.all([endpoint2, endpoint1]);
      if (res1.status !== 200 || res2.status !== 200) {
        throw new Error("Something went wrong!");
      }

      const [data1, data2]: [BusServiceResponseModel, BusServiceResponseModel] =
        [res1.data, res2.data];
      const key = "ServiceNo";
      const data = [
        ...new Map(
          data1.value.concat(data2.value).map((item) => [item[key], item]),
        ).values(),
      ];

      data.sort(compare);
      setBusServices(data);
      setUnFilteredBusServices(data);
    } catch (error: any) {
      setError(error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchBusStops();
  }, [fetchBusStops]);

  const filterSearchResult = (val: string) => {
    if (val === "") {
      setBusServices(unFilteredBusServices);
    }

    setSearchText(val);
    if (val && val.trim() !== "") {
      setBusServices(
        unFilteredBusServices.filter(
          (busService) => busService.ServiceNo.indexOf(val) > -1,
        ),
      );
    }
  };

  const showSearchAndFocus = () => {
    setShowSearch(true);
    setTimeout(() => {
      searchRef.current.setFocus();
    }, 300);
  };

  return (
    <IonPage>
      <IonHeader>
        {!showSearch && (
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Bus Services</IonTitle>
            <IonButtons slot="secondary">
              <IonButton onClick={() => showSearchAndFocus()}>
                <IonIcon slot="icon-only" icon={search} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        )}
        {showSearch && (
          <IonToolbar>
            <IonSearchbar
              ref={searchRef}
              value={searchText}
              animated
              debounce={300}
              showCancelButton="always"
              onIonCancel={() => setShowSearch(false)}
              onIonChange={(e) => filterSearchResult(e.detail.value!)}
            ></IonSearchbar>
          </IonToolbar>
        )}
      </IonHeader>

      <IonContent>
        <IonLoading isOpen={isLoading} message={"Please wait..."} />
        <IonAlert
          isOpen={!!error}
          onDidDismiss={() => setError(null)}
          header={"Error"}
          message={error}
          buttons={["OK"]}
        />
        {busServices.length > 0 && (
          <Virtuoso
            style={{ height: "100%" }}
            data={busServices}
            totalCount={busServices.length}
            itemContent={(index, bus: BusServiceModel) => {
              const customClass = `ops ${bus.Operator.toLowerCase()}`;
              const routeLink = `/busservices/${bus.ServiceNo}`;
              return (
                <IonItem
                  key={bus.ServiceNo}
                  detail
                  routerLink={routeLink}
                  routerDirection="forward"
                  onClick={() => setBus(bus)}
                >
                  <div className="item">
                    <div className="service">{bus.ServiceNo}</div>
                    <div className={customClass}>{bus.Operator}</div>
                  </div>
                </IonItem>
              );
            }}
          />
        )}
        {!isLoading && unFilteredBusServices.length === 0 && (
          <div className="refresh-wrapper">
            <IonButton shape="round">Refresh Page</IonButton>
          </div>
        )}
        {!isLoading && busServices.length === 0 && (
          <div className="no-result-found">
            <h2>Try another search key!</h2>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default BusServices;
