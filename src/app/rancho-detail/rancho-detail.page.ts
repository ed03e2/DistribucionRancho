import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rancho-detail',
  templateUrl: './rancho-detail.page.html',
  styleUrls: ['./rancho-detail.page.scss'],
})
export class RanchoDetailPage implements OnInit {
  ranchoNombre: string | undefined;
  ranchoDescripcion: string | undefined;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    // Retrieve query parameters and set them to variables
    this.route.queryParams.subscribe(params => {
      this.ranchoNombre = params['nombre'];
      this.ranchoDescripcion = params['descripcion'];
    });
  }
  openChat(){
    this.router.navigate(['/chat'])
  }

  openUser(){
    this.router.navigate(['/users'])
  }
}
