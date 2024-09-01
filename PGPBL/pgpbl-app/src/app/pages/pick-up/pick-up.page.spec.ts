import { PickUpPage } from './pick-up.page';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IonicModule } from '@ionic/angular';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { Router } from '@angular/router';

describe('PickUpPage', () => {
  let component: PickUpPage;
  let fixture: ComponentFixture<PickUpPage>;
  let router: Router;

  beforeEach(waitForAsync(() => {
   TestBed.configureTestingModule({
    declarations: [ PickUpPage ],
    imports: [
      IonicModule.forRoot(),
    AppRoutingModule
  ]
   }).compileComponents(); 

    component = fixture.componentInstance;

    fixture = TestBed.createComponent(PickUpPage);
    router = TestBed.get(Router);
  }));

  it('should go to home on create new pickup call', () => {
    spyOn(router, 'navigate');

    component.newPickupCall();

    expect(router.navigate).toHaveBeenCalledWith(['home']);
  })
});

