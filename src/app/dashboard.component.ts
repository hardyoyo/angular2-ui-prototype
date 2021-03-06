import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import { TranslatePipe } from "ng2-translate/ng2-translate";

import { BreadcrumbService } from './navigation/services/breadcrumb.service';
import { DSpaceDirectory } from './dspace/dspace.directory';

import { PaginationComponent } from './navigation/components/pagination.component';
import { TreeComponent } from './navigation/components/tree.component';

import { Breadcrumb } from './navigation/models/breadcrumb.model';

/**
 * The dashboard component is the main index for browsing. Layout contains a 
 * sidebar context along with the community/collection/item tree.
 */
@Component({
    selector: "directory",
    pipes: [ TranslatePipe ],
    directives: [ TreeComponent ],
    template: `
                <tree [directories]="dspace.directory"></tree>
              `
})
export class DashboardComponent {
        
    private breadcrumb: Breadcrumb = new Breadcrumb('dashboard', true);

    /**
     *
     * @param dspace 
     *      DSpaceDirectory is a singleton service to interact with the dspace directory.
     * @param breadcrumbService
     *      BreadcrumbService is a singleton service to interact with the breadcrumb component.
     */
    constructor(private dspace: DSpaceDirectory,
                private breadcrumbService: BreadcrumbService) {
        breadcrumbService.visit(this.breadcrumb);
    }

}
