import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet, IonList, IonHeader } from '@ionic/angular/standalone';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonHeader, IonList, IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {}
}
