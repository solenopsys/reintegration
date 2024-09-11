import {NgModule} from '@angular/core';
import {RouterModule} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";
import {TechnologyComponent} from "./technology/technology.component";
import {PcbGenComponent} from "./pcb-gen/pcb-gen.component";

@NgModule({
    declarations: [TechnologyComponent, PcbGenComponent],
    imports: [
        HttpClientModule,
        RouterModule.forChild([{
            path: "",
            component: TechnologyComponent,
        }]),
    ],
    providers: [],
})

export class RemoteEntryModule {
}
