import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms'; // Pastikan ReactiveFormsModule diimpor
import { LoginPage } from './login.page';
import { Store, StoreModule, StoreRootModule } from '@ngrx/store';
import { loadingReducer } from 'src/store/loading/loading.reducers';
import { loginReducer } from 'src/store/login/login.reducers';
import { AppState } from 'src/store/AppState';
import { login, loginFail, loginSuccess, recoverPassword, recoverPasswordFail, recoverPasswordSuccess } from 'src/store/login/login.actions';
import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from 'src/app/model/User';
import { Observable, throwError } from 'rxjs';
import { of } from 'rxjs';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment.prod';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let router: Router;
  let page: HTMLElement;
  let store: Store<AppState>;
  let toastController: ToastController;



  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule,
        ReactiveFormsModule, // Pastikan ReactiveFormsModule diimpor
        StoreModule.forRoot([]),
        StoreModule.forFeature("loading", loadingReducer),
        StoreModule.forFeature("login", loginReducer),
        AngularFireModule.initializeApp(environment.firebaseConfig)
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    router = TestBed.inject(Router); // Gunakan TestBed.inject alih-alih TestBed.get yang sudah deprecated
    store = TestBed.get(Store);
    toastController = TestBed.get(ToastController);

    component = fixture.componentInstance;
    page = fixture.debugElement.nativeElement;
    //fixture.detectChanges(); // Jalankan deteksi perubahan
  }));

  it('should create form on init', () => {
    component.ngOnInit(); // Pastikan ngOnInit dipanggil sebelum memeriksa form
    expect(component.form).toBeDefined(); // Memeriksa bahwa form telah didefinisikan
  });

  it('should go to register page on register', () => {
    spyOn(router, 'navigate'); // Memata-matai (spy) metode 'navigate' dari router
    component.register(); // Panggil metode 'register' yang seharusnya mengarahkan ke halaman 'register'
    expect(router.navigate).toHaveBeenCalledWith(['register']); // Memeriksa apakah 'navigate' dipanggil dengan argumen ['register']
  });

  it('should recover email/password on forgot email/password', () => {
    
    fixture.detectChanges();
    component.form.get('email')?.setValue("valid@email.com");
    // page.querySelector("#recoverPasswordButton")?.click();
    const buttonDebugElement: DebugElement = fixture.debugElement.query(By.css('#recoverPasswordButton'));
    buttonDebugElement.nativeElement.click();
  

    store.select('login').subscribe(loginState => {
      expect(loginState.isRecoveringPassword).toBeTruthy(); 
    }) 
    store.select('loading').subscribe(loadingState => {
      expect(loadingState.show).toBeTruthy();
    })
  })

  it('given user is recovering password, when success, then hide loading and show success message', () => {
    spyOn(toastController, 'create').and.returnValue(<any> Promise.resolve({present: () => {}}));

    fixture.detectChanges();
    store.dispatch(recoverPassword({email: "any@email.com"}));
    store.dispatch(recoverPasswordSuccess());
    store.select('loading').subscribe(loadingState => {
      expect(loadingState.show).toBeFalsy();
    })

    expect(toastController.create).toHaveBeenCalledTimes(1);
  })

  it('given user is recovering password, when fail, then hide loading and show error message', () => {
    spyOn(toastController, 'create').and.returnValue(<any> Promise.resolve({present: () => {}}));

    fixture.detectChanges();
    store.dispatch(recoverPassword({email: "any@email.com"}));
    store.dispatch(recoverPasswordFail({error: "message"}));
    store.select('loading').subscribe(loadingState => {
      expect(loadingState.show).toBeFalsy();
    })

    expect(toastController.create).toHaveBeenCalledTimes(1);
  })

  it('should show loading and start login when logging in', () => {
    
    fixture.detectChanges();
    component.form.get('email')?.setValue('valid@email.com');
    component.form.get('password')?.setValue('anyPassword');
    //page.querySelector('#loginButton')?.click();

    const loginButtonDebugElement: DebugElement = fixture.debugElement.query(By.css('#loginButton'));
    loginButtonDebugElement.nativeElement.click();

    store.select('loading').subscribe(loadingState => {
      expect(loadingState.show).toBeTruthy();
    })
    store.select('login').subscribe(loginState => {
      expect
      (loginState.isLoggingIn).toBeTruthy();
    })
  })

  it('given user is logging in, when success, then hide loading and send user to home page', () => {
    spyOn(router, 'navigate');
    
    fixture.detectChanges();
    store.dispatch(login({email: "valid@email.com", password: "anyPassword"}));
    store.dispatch(loginSuccess({user: new User()}));

    
    store.select('loading').subscribe(loadingState => {
      expect(loadingState.show).toBeFalsy();
    })
    store.select('login').subscribe(loginState => {
      expect
      (loginState.isLoggedIn).toBeTruthy();
    })
    expect(router.navigate).toHaveBeenCalledWith(['home']);
  })

  it ('given user is logging in, when fail, then hide loading and show error message', () => {
    spyOn(toastController, 'create').and.returnValue(<any> Promise.resolve({present: () => {}}));

    fixture.detectChanges();
    store.dispatch(login({email: "valid@email.com", password: "anyPassword"}));
    store.dispatch(loginFail({error: {message: 'error message'}}));

    store.select('loading').subscribe(loadingState => {
      expect(loadingState.show).toBeFalsy();
    })
    expect(toastController.create).toHaveBeenCalledTimes(1);
  })
});
