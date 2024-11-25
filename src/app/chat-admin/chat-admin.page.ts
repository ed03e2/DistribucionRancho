import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat-admin',
  templateUrl: './chat-admin.page.html',
  styleUrls: ['./chat-admin.page.scss'],
})
export class ChatAdminPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }


  goBack() {
    this.router.navigate(['/grupos']);
  }


}
