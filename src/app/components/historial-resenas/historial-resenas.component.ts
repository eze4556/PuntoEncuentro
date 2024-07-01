import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-historial-resenas',
  templateUrl: './historial-resenas.component.html',
  styleUrls: ['./historial-resenas.component.scss'],
  standalone: true,
  imports: [
    CommonModule
  ]
})
export class HistorialResenasComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
