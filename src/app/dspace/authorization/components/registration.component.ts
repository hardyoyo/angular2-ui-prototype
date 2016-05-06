import { Component } from 'angular2/core';
import { TranslateService, TranslatePipe } from "ng2-translate/ng2-translate";

import { BreadcrumbService } from '../../../navigation/services/breadcrumb.service';

/**
 * Registration component.
 */
@Component({
    selector: 'register',
    pipes: [ TranslatePipe ],
    template: `
                
              `
})
export class RegistrationComponent {

    /**
     *
     * @param breadcrumbService
     *      BreadcrumbService is a singleton service to interact with the breadcrumb component.
     * @param translate
     *      TranslateService
     */
    constructor(private breadcrumbService: BreadcrumbService,
                private translate: TranslateService) {
        breadcrumbService.visit({
            name: 'Register',
            type: 'register',
            component: '/Register',
            root: true,
        });
        translate.setDefaultLang('en');
        translate.use('en');
    }

}
