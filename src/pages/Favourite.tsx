import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonContent,
  IonItem,
} from "@ionic/react";

const Favourite: React.FC = () => {
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

      <IonContent>
        <h1>Coming Soon</h1>
      </IonContent>
    </IonPage>
  );
};

export default Favourite;
