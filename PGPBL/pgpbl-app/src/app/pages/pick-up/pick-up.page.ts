import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pick-up',
  templateUrl: './pick-up.page.html',
  styleUrls: ['./pick-up.page.scss'],
})
export class PickUpPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  newPickupCall(){
    this.router.navigate(['home']);
  }

}
