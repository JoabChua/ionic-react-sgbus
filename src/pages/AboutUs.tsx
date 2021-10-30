import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonContent,
} from "@ionic/react";
import "./AboutUs.scss";

const AboutUs: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>About Us</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="main-content">
          <div className="info-row">
            <div className="title">App Data</div>:{" "}
            <div className="info">LTA Singapore</div>
          </div>
          <div className="info-row">
            <div className="title">App Developer</div>:{" "}
            <div className="info">Joab Chua</div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AboutUs;
