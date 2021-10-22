import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLoading,
  IonAlert,
  IonButton,
  IonIcon,
} from "@ionic/react";
import { search } from "ionicons/icons";
import { useCallback, useEffect, useState } from "react";
import { BUS_SERVICE_API, LTA_ACCESSS_KEY } from "../configs/bus.config";
import "./BusService.scss";

const compare = (a: BusServiceModel, b: BusServiceModel) => {
  const reA = /[^a-zA-Z]/g;
  const reN = /[^0-9]/g;
  const aA = a.ServiceNo.replace(reA, "");
  const bA = b.ServiceNo.replace(reA, "");
  if (aA === bA) {
    const aN = parseInt(a.ServiceNo.replace(reN, ""), 10);
    const bN = parseInt(b.ServiceNo.replace(reN, ""), 10);
    return aN === bN ? 0 : aN > bN ? 1 : -1;
  } else {
    return aA > bA ? 1 : -1;
  }

  // return a.ServiceNo.localeCompare(b.ServiceNo);
};

const BusServices: React.FC = () => {
  const [busServices, setBusServices] = useState<BusServiceModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>();

  const fetchBusStops = useCallback(async () => {
    setIsLoading(true);
    try {
      const endpoint1 = fetch(
        `https://cors-anywhere.herokuapp.com/${BUS_SERVICE_API}`,
        { headers: LTA_ACCESSS_KEY },
      );
      const endpoint2 = fetch(
        `https://cors-anywhere.herokuapp.com/${BUS_SERVICE_API}?$skip=500`,
        { headers: LTA_ACCESSS_KEY },
      );

      const [res1, res2] = await Promise.all([endpoint2, endpoint1]);
      if (!res1.ok || !res2.ok) {
        throw new Error("Something went wrong!");
      }

      const [data1, data2]: [BusResponseModel, BusResponseModel] =
        await Promise.all([res1.json(), res2.json()]);
      const key = "ServiceNo";
      const data = [
        ...new Map(
          data1.value.concat(data2.value).map((item) => [item[key], item]),
        ).values(),
      ];

      data.sort(compare);
      setBusServices(data);
    } catch (error: any) {
      setError(error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchBusStops();
  }, [fetchBusStops]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Bus Services</IonTitle>
          <IonButtons slot="secondary">
            <IonButton>
              <IonIcon slot="icon-only" icon={search} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Bus Services</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonLoading isOpen={isLoading} message={"Please wait..."} />
        <IonAlert
          isOpen={!!error}
          onDidDismiss={() => setError(null)}
          header={"Error"}
          message={error}
          buttons={["OK"]}
        />
        {busServices.length > 0 && (
          <IonList>
            {busServices.map((bus) => {
              const customClass = `ops ${bus.Operator.toLowerCase()}`;
              return (
                <IonItem key={bus.ServiceNo} detail>
                  <div className="item">
                    <div className="service">{bus.ServiceNo}</div>
                    <div className={customClass}>{bus.Operator}</div>
                  </div>
                </IonItem>
              );
            })}
          </IonList>
        )}
        {busServices.length === 0 && (
          <div className="refresh-wrapper">
            <IonButton shape="round">Refresh Page</IonButton>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default BusServices;

interface BusResponseModel {
  "odata.metadata": string;
  value: BusServiceModel[];
}

interface BusServiceModel {
  ServiceNo: string;
  Operator: string;
  Direction: number;
  Category: string;
  OriginCode: string;
  DestinationCode: string;
  AM_Peak_Freq: string;
  AM_Offpeak_Freq: string;
  PM_Peak_Freq: string;
  PM_Offpeak_Freq: string;
  LoopDesc: string;
}
