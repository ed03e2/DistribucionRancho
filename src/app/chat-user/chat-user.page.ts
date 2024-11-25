import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat-user',
  templateUrl: './chat-user.page.html',
  styleUrls: ['./chat-user.page.scss'],
})
export class ChatUserPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }


  goBack() {
    this.router.navigate(['/rancho-detail']);
  }


}
