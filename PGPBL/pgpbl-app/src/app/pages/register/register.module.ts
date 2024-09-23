import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IpinfoService } from 'src/app/services/ipinfo.service';
import { IonicModule } from '@ionic/angular';

import { RegisterPageRoutingModule } from './register-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { RegisterPage } from './register.page';
import { ErrorMessageModule } from 'src/app/components/error-message/error-message.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterPageRoutingModule,
    ReactiveFormsModule,
    ErrorMessageModule,
    HttpClientModule
  ],
  providers: [IpinfoService],
  declarations: [
    RegisterPage]
})
export class RegisterPageModule { }
