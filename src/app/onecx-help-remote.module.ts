import { HttpClient, HttpClientModule } from '@angular/common/http'
import { BrowserModule } from '@angular/platform-browser'
import { APP_INITIALIZER, DoBootstrap, Injector, NgModule } from '@angular/core'
import { Router, RouterModule, Routes } from '@angular/router'
import { MissingTranslationHandler, TranslateLoader, TranslateModule } from '@ngx-translate/core'

import {
  AppStateService,
  ConfigurationService,
  createTranslateLoader,
  PortalApiConfiguration,
  PortalCoreModule,
  PortalMissingTranslationHandler
} from '@onecx/portal-integration-angular'
import { addInitializeModuleGuard } from '@onecx/angular-integration-interface'
import { createAppEntrypoint, initializeRouter, startsWith } from '@onecx/angular-webcomponents'
import { AppEntrypointComponent } from './app-entrypoint.component'
import { AngularAuthModule } from '@onecx/angular-auth'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { environment } from 'src/environments/environment'
import { Configuration } from './shared/generated'

function apiConfigProvider(configService: ConfigurationService, appStateService: AppStateService) {
  return new PortalApiConfiguration(Configuration, environment.apiPrefix, configService, appStateService)
}

const routes: Routes = [
  {
    matcher: startsWith(''),
    loadChildren: () => import('./help/help.module').then((m) => m.HelpModule)
  }
]
@NgModule({
  declarations: [AppEntrypointComponent],
  imports: [
    AngularAuthModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    PortalCoreModule.forMicroFrontend(),
    RouterModule.forRoot(addInitializeModuleGuard(routes)),
    TranslateModule.forRoot({
      isolate: true,
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient, AppStateService]
      },
      missingTranslationHandler: { provide: MissingTranslationHandler, useClass: PortalMissingTranslationHandler }
    })
  ],
  exports: [],
  providers: [
    ConfigurationService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeRouter,
      multi: true,
      deps: [Router, AppStateService]
    },
    { provide: Configuration, useFactory: apiConfigProvider, deps: [ConfigurationService, AppStateService] }
  ],
  schemas: []
})
export class OneCXHelpModule implements DoBootstrap {
  constructor(private readonly injector: Injector) {
    console.info('OneCX Help Module constructor')
  }

  ngDoBootstrap(): void {
    createAppEntrypoint(AppEntrypointComponent, 'ocx-help-component', this.injector)
  }
}
