import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule), canActivate:[authGuard]
  },
  {
    path: 'singup',
    loadChildren: () => import('./singup/singup.module').then( m => m.SingupPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'forgotpassword',
    loadChildren: () => import('./forgotpassword/forgotpassword.module').then( m => m.ForgotpasswordPageModule)
  },
  {
    path: 'homelogin',
    loadChildren: () => import('./homelogin/homelogin.module').then( m => m.HomeloginPageModule), canActivate:[authGuard]
  },
  {
    path: 'rancho-detail',
    loadChildren: () => import('./rancho-detail/rancho-detail.module').then( m => m.RanchoDetailPageModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./chat/chat.module').then( m => m.ChatPageModule)
  },
  {
    path: 'users',
    loadChildren: () => import('./users/users.module').then( m => m.UsersPageModule)
  },  {
    path: 'login-phone',
    loadChildren: () => import('./login-phone/login-phone.module').then( m => m.LoginPhonePageModule)
  },
  {
    path: 'price-becerros',
    loadChildren: () => import('./price-becerros/price-becerros.module').then( m => m.PriceBecerrosPageModule)
  },
  {
    path: 'price-becerras',
    loadChildren: () => import('./price-becerras/price-becerras.module').then( m => m.PriceBecerrasPageModule)
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
