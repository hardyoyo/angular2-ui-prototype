import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {TranslatePipe} from "ng2-translate/ng2-translate";

import {Item} from '../../../models/item.model';
import {Metadatum} from '../../../models/metadatum.model';
import {MetadataHelper} from '../../../../utilities/metadata.helper';
import {TruncatePipe} from '../../../../utilities/pipes/truncate.pipe';
import {TruncateDatePipe} from '../../../../utilities/pipes/truncatedate.pipe';
import {ObjectUtil} from "../../../../utilities/commons/object.util";

/**
 * This component will display some metadata of the item in the list view.
 * We can select which metadata we want to show here.
 * Once again, we can pass an array of metadata.
 */
@Component({
    selector: 'item-list-metadata',
    inputs: ['item'],
    directives: [ROUTER_DIRECTIVES],
    pipes: [TranslatePipe, TruncatePipe, TruncateDatePipe],
    template:
              `
                <!-- create a router link to the simple item-view -->
                <a [routerLink]="[item.component, {id:item.id}]" class="item-list-url">{{ item.name }}</a>
                <h5 *ngIf="shouldRenderHeader()">{{author}} <span *ngIf="shouldRenderDate()">({{date | truncatedate}})</span></h5>
                <!-- the abstract truncated -->

                <p *ngIf="shouldRenderAbstract()">{{abstract | truncate : 200}}</p>

              `
})

export class ListMetadataComponent
{

    private item : Item;
    private author : String;
    private abstract : String;
    private date : String;

    ngOnInit() {
        let helper = new MetadataHelper();
        let filteredData:Metadatum[] = helper.filterMetadata(this.item.metadata, ["dc.contributor.author", "dc.creator", "dc.contributor", "dc.description.abstract","dc.date.accessioned"]);

        if (filteredData != null)
        {
            for (let i:number = 0; i < filteredData.length; i++) {
                if (filteredData[i].element == "creator") {
                    this.author = (filteredData[i].value);
                }
                if (filteredData[i].element == "description" && filteredData[i].value!="Not available") {
                    this.abstract = filteredData[i].value;
                }
                if(filteredData[i].element == "date")
                {
                    this.date = filteredData[i].value;
                }
            }
        }
    }

    shouldRenderHeader()
    {
        return ObjectUtil.hasValue(this.author) || this.shouldRenderDate();
    }

    shouldRenderDate()
    {
        return ObjectUtil.hasValue(this.date);
    }

    shouldRenderAbstract()
    {
        return ObjectUtil.hasValue(this.abstract);
    }
}
