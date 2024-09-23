import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterPageForm } from './form/register.page.form';
import { FormBuilder } from '@angular/forms';
import { AppState } from 'src/store/AppState';
import { Store } from '@ngrx/store';
import { RegisterState } from 'src/store/register/RegisterState';
import { Subscription } from 'rxjs';
import { hide, show } from 'src/store/loading/loading.action';
import { register } from 'src/store/register/register.actions';
import { ToastController } from '@ionic/angular';
import { IpinfoService } from 'src/app/services/ipinfo.service'; // Import IpinfoService
import { IPINFO_SERVICE } from 'src/app/services/injection.token'; // Ganti dengan path yang benar
import { login } from 'src/store/login/login.actions';
import { OpenCageService } from 'src/app/services/opencage.service'; // Import OpenCageService

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit, OnDestroy {
  registerForm!: RegisterPageForm;
  toast: any;
  registerStateSubscription!: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    private toastController: ToastController,
    private ipinfoService: IpinfoService,
    private openCageService: OpenCageService // Tambahkan IpinfoService di sini
  ) {}

  ngOnInit() {
    this.createForm();
    this.getLocation(); // Panggil fungsi untuk mendapatkan lokasi
    this.watchRegisterState();
  }

  ngOnDestroy() {
    this.registerStateSubscription.unsubscribe();
  }

  register() {
    this.registerForm.getForm().markAllAsTouched();

    if (this.registerForm.getForm().valid) {
      this.store.dispatch(register({ userRegister: this.registerForm.getForm().value }));
    }
  }

  private createForm() {
    this.registerForm = new RegisterPageForm(this.formBuilder);
  }

  private watchRegisterState() {
    this.registerStateSubscription = this.store.select('register').subscribe(state => {
      this.toggleLoading(state);
      this.onRegistered(state);
      this.onError(state);
    });
  }

  private onRegistered(state: RegisterState) {
    if (state.isRegistered) {
      this.store.dispatch(login({
        email: this.registerForm.getForm().value.email,
        password: this.registerForm.getForm().value.password
      }));
    }
  }

  private onError(state: RegisterState) {
    if (state.error) {
      this.toastController.create({
        message: state.error.message,
        duration: 5000,
        header: 'Registration not done'
      }).then(toast => toast.present());
    }
  }

  private toggleLoading(state: RegisterState) {
    if (state.isRegistering) {
      this.store.dispatch(show());
    } else {
      this.store.dispatch(hide());
    }
  }

  // private getLocation() {
  //   this.ipinfoService.getLocation().subscribe(location => {
  //     if (location) {
  //       this.registerForm.getForm().patchValue({
  //         address: {
  //           state: location.region,
  //           city: location.city,
  //           zipCode: location.postal,
  //         }
  //       });
  //     }
  //   });
  // }

  private getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        this.openCageService.getReverseGeocode(lat, lng).subscribe(location => {
          if (location && location.results.length > 0) {
            const address = location.results[0].components;
            this.registerForm.getForm().patchValue({
              address: {
                number: address.house_number || '',
                state: address.state || '',
                city: address.county || '',
                zipCode: address.postcode || '',
                street: address.road || '',
                neighborhood: address.neighborhood || '', // Tambahkan ini untuk kecamatan
                complement: address.extra?.corner || '', // Tambahkan ini untuk complement
              }
            });

            // Notifikasi berhasil
            this.toastController.create({
              message: 'Alamat berhasil diisi dengan geolocation dari OpenCage!',
              duration: 10000,
              header: 'Info',
              cssClass: 'toast-custom',
            }).then(toast => toast.present());
          } else {
            // Notifikasi jika tidak ada hasil
            this.toastController.create({
              message: 'Tidak dapat menemukan alamat dari geolocation OpenCage.',
              duration: 3000,
              header: 'Info',
            }).then(toast => toast.present());
          }
        });
      }, error => {
        console.error('Geolocation error:', error);
        this.toastController.create({
          message: 'Gagal mendapatkan lokasi.',
          duration: 3000,
          header: 'Error',
        }).then(toast => toast.present());
      });
    } else {
      console.error('Geolocation not supported by this browser.');
      this.toastController.create({
        message: 'Geolocation tidak didukung oleh browser ini.',
        duration: 3000,
        header: 'Error',
      }).then(toast => toast.present());
    }
  }



}
