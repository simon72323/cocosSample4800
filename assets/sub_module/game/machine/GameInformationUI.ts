import { _decorator, Component, instantiate, Label, PageView, ScrollView, Node, Button, UITransform } from 'cc';
import { Machine } from './Machine';
import { DATA_TYPE, Utils } from '../../utils/Utils';
import { Page } from './Page';
import { SoundManager } from './SoundManager';
const { ccclass, property, requireComponent } = _decorator;


export var SymbolPayTable = {
    1: {  3: 10,    4: 30,   5: 80   }, // 法老
    2: {  3: 10,    4: 30,   5: 80   }, // 艷后
    3: {  3: 4,     4: 24,   5: 40   }, // 阿努比斯
    4: {  3: 4,     4: 24,   5: 40   }, // 人面獅身
    5: {  3: 2,     4: 16,   5: 30 }, // A
    6: {  3: 2,     4: 16,   5: 30 }, // K
    7: {  3: 2,     4: 16,   5: 30 }, // Q
    8: {  3: 2,     4: 16,   5: 30 }, // J
};

@ccclass('GameInformationUI')
export class GameInformationUI extends Component {

    public onload = {
        'ui' : {
            'PageView'      : {[DATA_TYPE.TYPE]: PageView,      [DATA_TYPE.NODE_PATH]: 'PageView'},
            'ScrollView'    : {[DATA_TYPE.TYPE]: ScrollView,    [DATA_TYPE.NODE_PATH]: 'ScrollView'},
            'pageContent'   : {[DATA_TYPE.TYPE]: Node,          [DATA_TYPE.NODE_PATH]: 'PageView/view/content'},
            'scrollContent' : {[DATA_TYPE.TYPE]: Node,          [DATA_TYPE.NODE_PATH]: 'ScrollView/view/content'},
            'closeButton'   : {[DATA_TYPE.TYPE]: Button,        [DATA_TYPE.NODE_PATH]: 'Close'},
        }
    };

    public properties = {};

    private get machine() { return Machine.Instance; }

    public static Instance: GameInformationUI = null;

    public onLoad(): void {
        GameInformationUI.Instance = this;
        this.node.active = false;
        Utils.initData(this.onload, this);
        this.node.on(Node.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
    }

    public onMouseWheel(event) {
        let scroll : ScrollView = this.properties['ui']['ScrollView'].component;
        let offset = scroll.getScrollOffset();
        offset.y -= (event.getScrollY()/2);
        scroll.scrollToOffset(offset, 0.3);
    }

    protected start() {

    }

    /**
     * 廢棄中
     * 將 PageView 的內容複製到 ScrollView
     * @deprecated 淘汰翻頁顯示
     */
    private copyPageToScrollView() {
        let pageContent = this.properties['ui']['pageContent'].node;
        let scrollContent = this.properties['ui']['scrollContent'].node;

        pageContent.children.forEach((node)=>{
            let newNode : Node = instantiate(node);
            let uiTransform = newNode.getComponent(UITransform);
            let size = uiTransform.contentSize;
            uiTransform.setContentSize(size.width*0.8, size.height*0.8);
            newNode.setScale(0.75,0.75,1);
            scrollContent.addChild(newNode);
        });
    }

    /**
     * 廢棄中
     * 將 PageView 的內容複製到 ScrollView
     * @deprecated 淘汰翻頁顯示
     */
    private infinityPageView() {
        const pageContent = this.properties['ui']['pageContent'].node;
        const children = pageContent.children;
        // 複製第一頁到最後一頁
        const firstPage = children[0];
        const lastPage = children[children.length-1];
        const newPage = instantiate(firstPage);
        const newlastPage = instantiate(lastPage);
        pageContent.addChild(newPage);
        pageContent.addChild(newlastPage);
        newlastPage.setSiblingIndex(0);

        // 設定事件
        let pageView = this.properties['ui']['PageView'].component;
        pageView.node.on(PageView.EventType.PAGE_TURNING, this.onPageEvent, this);
    }

    public onPageEvent(pageView:PageView, args) {
        const curPageIdx = pageView.curPageIdx;
        const length = pageView.content.children.length;
        if ( curPageIdx === 0 ) {
            pageView.scrollToPage(length - 2, 0.01);
        } else if ( curPageIdx === length - 1 ) {
            pageView.scrollToPage(1, 0.01);
        }
    }

    // 紀錄 paytable 的 label
    public paytableSymbols = {};

    // 加入 paytable 的 label
    public addPaytableSymbol(label:Label, symbol:number) { 
        if ( this.paytableSymbols[symbol] == null ) this.paytableSymbols[symbol] = [];
        if ( this.paytableSymbols[symbol].includes(label) === true ) return;
        this.paytableSymbols[symbol].push(label);
        this.paytableSymbolLabel(label, symbol);
    }

    public onStartAddPaytableSymbol(node, customEventData) {
        if ( node == null ) return;
        let label = node.getComponent(Label);

        if ( label == null ) return;

        let symbol = parseInt(customEventData);
        this.addPaytableSymbol(label, symbol);
    }

    // 改變 paytable 的 label
    public changePaytableSymbol() {
        for(let symbol in this.paytableSymbols) {
            this.paytableSymbols[symbol].forEach((label:Label)=> { this.paytableSymbolLabel(label, parseInt(symbol)); });
        }
    }

    public displayNumber(value:number) : string {
        return Utils.changeUnit(value, true); 
    }

    // 取得 paytable 的 label
    public paytableLabelString(symbol:number) {
        if ( SymbolPayTable[symbol] == null ) return '';
        let totalBet = this.machine.totalBet;
        let lineAmount = 30;
        let paytable = SymbolPayTable[symbol];
        let value = [ this.displayNumber(totalBet/30*paytable[3]),this.displayNumber(totalBet/30*paytable[4]),this.displayNumber(totalBet/30*paytable[5]) ];
        let str = `3  ${value[0]}\n`
                + `4  ${value[1]}\n`
                + `5  ${value[2]}`;

        return str;
    }
    
    public paytableSymbolLabel(label:Label, symbol:number) { label.string = this.paytableLabelString(symbol); }

    public static OpenUI() { GameInformationUI.Instance.openUI(); }
    public openUI() {
        this.changePaytableSymbol();
        Utils.tweenAlpha(this.node, false);

        this.properties['ui']['ScrollView'].component.scrollToTop(0);
    }

    public closeUI() {
        if ( this.node.active === false ) return;
        Utils.tweenAlpha(this.node, true);
        SoundManager.PlayButtonSound();
    }

    public addVerisonLabel(node:Node) {
        const label = node.getComponent(Label);
        if ( label == null ) return;

        const version = Utils.getVersion();
        label.string = `Version ${version}`;
    }
}

