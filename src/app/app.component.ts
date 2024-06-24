import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet, IonList, IonHeader } from '@ionic/angular/standalone';
import { MenuController } from '@ionic/angular';
import { ReviewsComponent } from './components/reviews/reviews.component';
import { CitaComponent } from './components/cita/cita.component';
import { ProfileComponent } from './views/profile/profile.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [RouterModule,IonHeader, IonList, IonApp, IonRouterOutlet, ReviewsComponent, CitaComponent, ProfileComponent],
})
export class AppComponent {
  constructor() {}
}
