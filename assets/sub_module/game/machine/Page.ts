import { _decorator, Component, Node, NodeEventType } from 'cc';
import { PageManager } from '../PageManager';
import { Utils } from '../../utils/Utils';

const { ccclass, property } = _decorator;

@ccclass('Page')
export class Page extends Component {

    protected onLoad(): void {
        this.node.setPosition(0, 0, 0);
        this.node.active = false;
    }


    protected async onEnable() {
        PageManager.openPage(this.node);
    }

    protected async onDisable() {
        PageManager.closePage(this.node);

    }

}

