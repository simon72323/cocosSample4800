import { _decorator, Color, Node, Button, Label, Sprite } from 'cc';
import { Machine } from './Machine';
import { gameInformation } from '../GameInformation';
import { Utils, DATA_TYPE } from '../../utils/Utils';
import { Reel } from './Reel';
import { Paytable } from './pay/PayTable';
import { Controller } from './controller_folder/Controller';
import { AutoSpin } from '../AutoSpin';
import { SoundManager } from './SoundManager';
const { ccclass, property } = _decorator;

/**
 * 購買FeatureGame介面操作
 */
@ccclass( 'BuyFeatureGameUI' )
export class BuyFeatureGameUI {
    private static _instance: BuyFeatureGameUI;
    public static get Instance() { return BuyFeatureGameUI._instance; }

    public get machine ()   : Machine    { return Machine.Instance }
    public get reel ()      : Reel       { return this.machine.reel; }
    public get paytable ()  : Paytable   { return this.machine.paytable; }
    public get controller() : Controller { return this.machine.controller; }
    public get betIdx()     : number     { return this.properties.totalBet.idx; }
    public set betIdx(value)             { this.properties.totalBet.idx = value; }

    public set totalBet(value) { 
        this.properties.totalBet.value = value;
        this.properties['BuyFeatureGameUI']['valueLabel'].component.string = Utils.numberComma(value); 
    }

    public get totalBet() { return this.properties.totalBet.value; }

    public properties = {
        'BuyFeatureGameUI' : {
            'ui' : null,
            'buyButton' : null,
            'closeButton' : null,
            'valueLabel' : null,
            'addBetButton' : null,
            'subBetButton' : null,
         },
         'totalBet': {
            'idx' : 0,
            'value' : 0,
         },
    };

    public get node() { return this.properties.BuyFeatureGameUI['ui'].node; }

    public init(inspector:any) {
        BuyFeatureGameUI._instance = this;
        const onLoadData = {
            'BuyFeatureGameUI' : {
                'ui'            : { [DATA_TYPE.TYPE] : Node,   [DATA_TYPE.SCENE_PATH] : inspector.buyFeatureGameUI.getPathInHierarchy()},
                'valueLabel'    : { [DATA_TYPE.TYPE] : Label,  [DATA_TYPE.SCENE_PATH] : inspector.valueLabelNode.getPathInHierarchy()  },
                'buyButton'     : { [DATA_TYPE.TYPE] : Button, [DATA_TYPE.SCENE_PATH] : inspector.buyButtonNode.getPathInHierarchy(),    [DATA_TYPE.CLICK_EVENT]: this.clickBuyFeatureGameConfirm  },
                'closeButton'   : { [DATA_TYPE.TYPE] : Button, [DATA_TYPE.SCENE_PATH] : inspector.closeButtonNode.getPathInHierarchy(),  [DATA_TYPE.CLICK_EVENT]: this.onClickCloseBuyFGUI, },
                'addBetButton'  : { [DATA_TYPE.TYPE] : Button, [DATA_TYPE.SCENE_PATH] : inspector.addBetButtonNode.getPathInHierarchy(), [DATA_TYPE.CLICK_EVENT]: this.addBet },
                'subBetButton'  : { [DATA_TYPE.TYPE] : Button, [DATA_TYPE.SCENE_PATH] : inspector.subBetButtonNode.getPathInHierarchy(), [DATA_TYPE.CLICK_EVENT]: this.subBet},
                'openButton'    : { [DATA_TYPE.TYPE] : Button, [DATA_TYPE.SCENE_PATH] : inspector.mainGameBuyFeatureGameButtonNode.getPathInHierarchy(), [DATA_TYPE.CLICK_EVENT]: this.onClickOpenBuyFGUI },
            }
        };

        Utils.initData(onLoadData, this);
        this.node.active = false;
        this.node.setPosition(0, 0, 0);
    }

    public onClickCloseBuyFGUI() { 
        if ( this.node.active === false ) return;
        SoundManager.PlaySoundByID('default_button');
        // this.controller.maskActive(false);
        Utils.commonActiveUITween(this.node, false); 
    }

    public static CloseUI(confirm:boolean=false) { 
        if ( BuyFeatureGameUI.Instance == null ) return;
        BuyFeatureGameUI.Instance.onClickCloseBuyFGUI(); 
    }

    public async onClickOpenBuyFGUI() { 
        if ( this.machine.isBusy ) return;
        if ( this.machine.controller.clickOptionBack() === true ) return;
        if ( await this.machine.paytable.onClickOpenBuyFGUI() === false ) return;

        this.betIdx = this.controller.betIdx;
        this.refreshTotalBet();
        this.checkActiveBuyButton();
        // this.controller.maskActive(true);
        Utils.commonActiveUITween(this.node, true); 
        Utils.GoogleTag('OpenBuyFeatureGame', {'event_category':'BuyFeatureGame', 'event_label':'OpenBuyFeatureGame' });
    }

    public refreshTotalBet() {
        this.totalBet = this.betValue;
    }

    public addBet() { 
        SoundManager.PlaySoundByID('default_button');
        this.setBet(1); 
        this.paytable.addBet();
    }
    public subBet() { 
        SoundManager.PlaySoundByID('default_button');
        this.setBet(-1);
        this.paytable.subBet();
    }

    private setBet(add:number) {
        let idx = this.betIdx;
        const coinValueArray = gameInformation.coinValueArray;
        const max = coinValueArray.length;
        idx += add;
        if ( idx < 0 ) idx = max - 1;
        if ( idx >= max ) idx = 0;
        this.betIdx = idx;
        
        this.refreshTotalBet();
        this.refreshControllerTotalBet(idx);
        this.checkActiveBuyButton();
    }

    private checkActiveBuyButton() : boolean{
        let total_bet = this.totalBet;
        let userCredit = this.machine.userCredit;
        let active = (total_bet <= userCredit);
        this.activeBuyButton(active);
        return active;
    }
    private activeBuyButton(active:boolean) { 
        const button : Button = this.properties.BuyFeatureGameUI['buyButton'].component;
        const sprite = button.node.getComponent(Sprite);
        if ( sprite === null ) return;
        sprite.color = active ? Color.WHITE : Color.GRAY;
        // button.interactable = active;
    }

    /**
     * 連動 Controller 的 TotalBet
     * @param idx 
     * @returns 
     */
    private refreshControllerTotalBet(idx:number) {
        const bet_available_idx = gameInformation.bet_available_idx;
        //console.log('refreshControllerTotalBet', idx, bet_available_idx);
        if ( idx !== bet_available_idx - 1 ) return this.controller.changeTotalBetIdx(idx);
        
        const totalBet = this.controller.calculateTotalBet(idx);
        this.controller.changeTotalBetIdx(bet_available_idx);
        // this.machine.eventChangeTotalBet();
        this.machine.paytable.changeTotalBet(totalBet);
    }

    private get betValue() { 
        const [ coinValue, lineBet, lineTotal, multiplier ] = [
            gameInformation.coinValueArray[this.betIdx],
            gameInformation.lineBet,
            gameInformation.lineTotal,
            gameInformation.buyInformation.multiplier,
        ];

        return coinValue * 1000 * lineBet * lineTotal * multiplier / 1000;
    }

    public async clickBuyFeatureGameConfirm() {
        if ( this.machine.isBusy ) return;
        if ( this.checkActiveBuyButton() === false ) return;
        if ( this.paytable.checkBuyFeatureGame() === false ) return;
        if ( await this.machine.buyFeatureGame(this.betIdx) === false ) return;
        if ( await this.paytable.clickBuyFeatureGameConfirm() === false ) return;

        Utils.GoogleTag('BuyFeatureGame', {'event_category':'BuyFeatureGame', 'event_label':'BuyFeatureGame', 'value': this.betIdx });
        this.onClickCloseBuyFGUI();
    }
}
