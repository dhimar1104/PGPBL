

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { PickupCallsPageRoutingModule } from './pickup-calls-routing.module';
import { PickupCallsPage } from './pickup-calls.page';
import { HomePageModule } from '../home/home.module';  // Import HomePageModule

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PickupCallsPageRoutingModule,
    HomePageModule  // Include HomePageModule here
  ],
  declarations: [
    PickupCallsPage
  ]
})
export class PickupCallsPageModule {}