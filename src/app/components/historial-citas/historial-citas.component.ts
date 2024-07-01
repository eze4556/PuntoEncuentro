import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-historial-citas',
  templateUrl: './historial-citas.component.html',
  styleUrls: ['./historial-citas.component.scss'],
  standalone: true,
  imports: [
    CommonModule
  ]
})
export class HistorialCitasComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
