import {
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonToolbar,
} from "@ionic/react";

import { useLocation } from "react-router-dom";
import {
  busOutline,
  busSharp,
  starSharp,
  timeOutline,
  timeSharp,
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
    title: "Favourite",
    url: "/fav",
    iosIcon: starSharp,
    mdIcon: starSharp,
  },
  // {
  //   title: "About Us",
  //   url: "/aboutus",
  //   iosIcon: personCircleOutline,
  //   mdIcon: personCircleSharp,
  // },
];

const Menu: React.FC = () => {
  const location = useLocation();

  return (
    <IonMenu contentId="main" type="overlay">
      <IonHeader className="menu-header">
        <IonToolbar>
          <div className="toolbar-custom">
            <img src="assets/img/icon.png" alt="bus" width="50" height="50" />
            <IonLabel>SG Transport Guardian</IonLabel>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-no-padding">
        <IonList id="inbox-list">
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
      <IonFooter>
        <IonToolbar>
          <div className="email-add">Developed By: Joab Chua</div>
          <div className="copyright">Copyright 2021</div>
        </IonToolbar>
      </IonFooter>
    </IonMenu>
  );
};

export default Menu;
