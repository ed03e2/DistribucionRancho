import { CanActivateFn, Router } from '@angular/router';
import { inject, Inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AngularFireAuth);
  const router= inject(Router);

  return auth.authState.pipe(
    map(user => {
      if(user){
        return true
      }else{
        router.navigate(['/login']);
        return false;
      }
    })
  )
};
