import { Injectable } from "@angular/core";
import { createEffect, ofType, Actions } from "@ngrx/effects";
import { catchError, map, switchMap } from "rxjs/operators";
import { AuthService } from "src/app/services/auth/auth.service";
import { of } from "rxjs";
import { register, registerFail, registerSuccess } from "./register.actions";
import { UserRegister } from "src/app/model/user/UserRegister";

@Injectable()
export class RegisterEffects {

  constructor(private actions$: Actions, private authService: AuthService) {}

  // Effect untuk menangani proses registrasi
  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(register), // Mendengarkan action 'register'
      switchMap(({ userRegister }) =>  // Destrukturisasi langsung payload
        this.authService.register(userRegister).pipe(
          map(() => registerSuccess()), // Jika berhasil, dispatch registerSuccess
          catchError(error => of(registerFail({ error }))) // Jika gagal, dispatch registerFail dengan error
        )
      )
    )
  );
}
