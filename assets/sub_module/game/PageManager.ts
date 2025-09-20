import { _decorator, Component, Node, Color } from 'cc';
import { Utils } from '../utils/Utils';
const { ccclass, property } = _decorator;

@ccclass('PageManager')
export class PageManager extends Component {

    @property({ type: Node, displayName: 'UI共用Mask' })
    public commonMask: Node = null;

    private properties = {};

    public loading = true;

    public static instance: PageManager = null;
    protected onLoad(): void {
        PageManager.instance = this;
        PageManager.nowOpenPage = null;
    }

    public start(): void {
        this.loading = false;
        PageManager.holdCommonMask = false;
    }

    public static get nowOpenPage() { return PageManager.instance.properties['nowOpenPage']; }
    public static set nowOpenPage(value) { PageManager.instance.properties['nowOpenPage'] = value; }

    public maskColor : Color[] = [new Color(0, 0, 0, 0), new Color(0, 0, 0, 200)];

    public static async activeCommonMask(active: boolean, targetUI: Node = null) {
        if ( PageManager.instance.loading === true ) return;

        const mask = PageManager.instance.commonMask;
        if ( mask.active === active ) return;
        if ( PageManager.holdCommonMask === true ) return;
        if ( targetUI != null ) {
            let idx = targetUI.getSiblingIndex();
            idx -= 1;
            if ( idx < 0 ) {
                mask.setSiblingIndex(0);
                targetUI.setSiblingIndex(1);
            } else {
                mask.setSiblingIndex(idx);
            }
        }
        mask.active = true;
        await Utils.commonFadeIn(mask, !active, PageManager.instance.maskColor);
        mask.active = active;
    }

    public static set holdCommonMask(hold: boolean) { PageManager.instance.properties['holdCommonMask'] = hold; }
    public static get holdCommonMask() { return PageManager.instance.properties['holdCommonMask']; }

    public static async openPage(page: Node, closeOther: boolean = true) {
        
        if ( PageManager.instance.loading === true ) return;
        if ( PageManager.nowOpenPage != null && closeOther) {
            PageManager.nowOpenPage.active = false;
        }

        await PageManager.activeCommonMask(true, page);
        PageManager.nowOpenPage = page;
        await Utils.delay(100);
    }

    public static closePage(page:Node, closeMask: boolean = true) {
        if ( PageManager.instance.loading === true ) return;
        if ( closeMask ) PageManager.activeCommonMask(false);
        if ( PageManager.nowOpenPage === page ) PageManager.nowOpenPage = null;
    }
}

