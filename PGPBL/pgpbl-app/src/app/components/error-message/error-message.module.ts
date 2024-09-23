import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorMessageComponent } from 'src/app/components/error-message/error-message.component';
import { IonicModule } from '@ionic/angular'; // Import IonicModule

@NgModule({
  declarations: [ErrorMessageComponent],
  imports: [
    CommonModule,
    IonicModule // Tambahkan IonicModule ke dalam imports
  ],
  exports: [ErrorMessageComponent]
})
export class ErrorMessageModule { }
