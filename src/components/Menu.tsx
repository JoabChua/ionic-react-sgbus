import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from "@ionic/react";

import { useLocation } from "react-router-dom";
import {
  busOutline,
  busSharp,
  personCircleOutline,
  personCircleSharp,
  starSharp,
  timeOutline,
  timeSharp,
  trainOutline,
  trainSharp,
} from "ionicons/icons";
import "./Menu.scss";

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: "Bus Arrival Time",
    url: "/busarrival",
    iosIcon: timeOutline,
    mdIcon: timeSharp,
  },
  {
    title: "Bus Services",
    url: "/busservices",
    iosIcon: busOutline,
    mdIcon: busSharp,
  },
  {
    title: "Favorite",
    url: "/fav",
    iosIcon: starSharp,
    mdIcon: starSharp,
  },
  {
    title: "About Us",
    url: "/aboutus",
    iosIcon: personCircleOutline,
    mdIcon: personCircleSharp,
  },
];

const Menu: React.FC = () => {
  const location = useLocation();

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>SG Kitty Journey</IonListHeader>
          <IonNote>cyberdevjo@gmail.com</IonNote>
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem
                  className={
                    location.pathname === appPage.url ? "selected" : ""
                  }
                  routerLink={appPage.url}
                  routerDirection="none"
                  lines="none"
                  detail={false}
                >
                  <IonIcon
                    slot="start"
                    ios={appPage.iosIcon}
                    md={appPage.mdIcon}
                  />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
