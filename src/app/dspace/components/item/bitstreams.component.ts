import {Component, Input} from 'angular2/core';
import {TranslatePipe} from "ng2-translate/ng2-translate";

import {Bitstream} from "../../models/bitstream.model"
import {ViewElementComponent} from './view-element.component'

/**
 * Component that displays the bitstreams (just the name) of an item in the simple-item-view.
 * Download on click.
 */
@Component({
    selector: 'item-bitstreams',
    directives: [ViewElementComponent],
    pipes: [TranslatePipe],
    template: `
                <view-element [header]="componentTitle | translate">
                    <div *ngFor="let bitstream of itemBitstreams;">
                        <a [attr.href]="bitstream.retrieveLink">
                            <i aria-hidden="true" class="glyphicon glyphicon-file"></i>
                            <span>{{bitstream.name}}</span>
                        </a>
                    </div>
                </view-element>
              `
})
export class BitstreamsComponent {

    /**
     * 
     */
    @Input() private itemBitstreams: Array<Bitstream>;

    /**
     * 
     */
    private componentTitle: string = "item-view.bitstreams.title";

}
