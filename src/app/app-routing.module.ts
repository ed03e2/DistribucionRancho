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
  },
  {
    path: 'price-becerros',
    loadChildren: () => import('./price-becerros/price-becerros.module').then( m => m.PriceBecerrosPageModule)
  },
  {
    path: 'price-becerros',
    loadChildren: () => import('./price-becerros/price-becerros.module').then( m => m.PriceBecerrosPageModule)
  },
  {
    path: 'grupos',
    loadChildren: () => import('./grupos/grupos.module').then( m => m.GruposPageModule)
  },
  {
    path: 'terms-modal',
    loadChildren: () => import('./terms-modal/terms-modal.module').then(m => m.TermsModalPageModule)
  },
  {
    path:'chat-admin',
    loadChildren: () => import('./chat-admin/chat-admin.module').then(m => m.ChatAdminPageModule)
  },
  {
    path: 'chat-user',
    loadChildren: () => import('./chat-user/chat-user.module').then(m => m.ChatUserPageModule)
  }
 

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
