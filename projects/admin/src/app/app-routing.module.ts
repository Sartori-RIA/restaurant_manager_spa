import {NgModule} from '@angular/core';
import {ExtraOptions, PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {AuthenticatedGuard} from './core/guards/authenticated.guard';
import {DashComponent} from './dash/dash.component';
import {AdminLayoutComponent} from './layout/admin-layout/admin-layout.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/dash'
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthenticatedGuard],
    children: [
      {
        path: 'dash',
        component: DashComponent,
        data: {title: 'routes.dashboard'},
        canActivate: [AuthenticatedGuard]
      },
      {
        path: 'bebidas',
        loadChildren: () => import('./drinks/drinks.module').then((m) => m.DrinksModule),
        data: {title: 'routes.drinks'},
        canActivate: [AuthenticatedGuard]
      },
      {
        path: 'cardapio',
        loadChildren: () => import('./dishes/dishes.module').then((m) => m.DishesModule),
        data: {title: 'routes.dishes'},
        canActivate: [AuthenticatedGuard]
      },
      {
        path: 'cervejas',
        loadChildren: () => import('./beers/beers.module').then((m) => m.BeersModule),
        data: {title: 'routes.beers'},
        canActivate: [AuthenticatedGuard]
      },
      {
        path: 'alimentos',
        loadChildren: () => import('./foods/foods.module').then((m) => m.FoodsModule),
        data: {title: 'routes.foods'},
        canActivate: [AuthenticatedGuard]
      },
      {
        path: 'mesas',
        loadChildren: () => import('./tables/tables.module').then((m) => m.TablesModule),
        data: {title: 'routes.tables'},
        canActivate: [AuthenticatedGuard]
      },
      {
        path: 'pedidos',
        loadChildren: () => import('./orders/orders.module').then((m) => m.OrdersModule),
        data: {title: 'routes.orders'},
        canActivate: [AuthenticatedGuard]
      },
      {
        path: 'relatorios',
        loadChildren: () => import('./reports/reports.module').then((m) => m.ReportsModule),
        data: {title: 'routes.reports'},
        canActivate: [AuthenticatedGuard]
      },
      {
        path: 'estilos-cervejas',
        loadChildren: () => import('./beer-styles/beer-styles.module').then((m) => m.BeerStylesModule),
        data: {title: 'routes.beer_styles'},
        canActivate: [AuthenticatedGuard]
      },
      {
        path: 'estilos-vinhos',
        loadChildren: () => import('./wine-styles/wine-styles.module').then((m) => m.WineStylesModule),
        data: {title: 'routes.wine_styles'},
        canActivate: [AuthenticatedGuard]
      },
      {
        path: 'fabricantes',
        loadChildren: () => import('./makers/makers.module').then((m) => m.MakersModule),
        data: {title: 'routes.makers'},
        canActivate: [AuthenticatedGuard]
      },
      {
        path: 'cozinha',
        loadChildren: () => import('./kitchen/kitchen.module').then((m) => m.KitchenModule),
        data: {title: 'routes.kitchen'},
        canActivate: [AuthenticatedGuard],
        canLoad: [AuthenticatedGuard]
      },
      {
        path: 'perfil',
        loadChildren: () => import('./profile/profile.module').then((m) => m.ProfileModule),
        data: {title: 'routes.profile'},
        canActivate: [AuthenticatedGuard]
      },
      {
        path: 'vinhos',
        loadChildren: () => import('./wines/wines.module').then((m) => m.WinesModule),
        data: {title: 'routes.wines'},
        canActivate: [AuthenticatedGuard]
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/'
  }
];

const config: ExtraOptions = {
    preloadingStrategy: PreloadAllModules,
    anchorScrolling: 'enabled',
    onSameUrlNavigation: 'ignore',
    scrollPositionRestoration: 'enabled',
    useHash: true,
    enableTracing: false, // TODO never enable this in production, only to test
    relativeLinkResolution: 'corrected'
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
