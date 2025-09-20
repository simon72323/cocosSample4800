import { _decorator, Component, find, sp, Mask, EventTarget, Graphics, Button, Color, screen, sys } from 'cc';
import { AutoSpin }         from '../AutoSpin';
import { Controller }       from './controller_folder/Controller';
import { gameInformation }  from '../GameInformation';
import { DataManager }      from '../../data/DataManager';
import { DialogUI }         from '../DialogUI';
import { Reel, SPIN_MODE }  from './Reel';
import { StateManager }     from '../StateManager';
import { slotData }         from '../SlotData';
import { Paytable }         from './pay/PayTable';
import { BigWin }           from './BigWin';
import { SoundManager }     from './SoundManager';
import E2ETest              from '../../utils/E2E_Test';
import { Utils, _utilsDecorator } from '../../utils/Utils';
const  { ccclass, property } = _decorator;
const  { isDevelopFunction } = _utilsDecorator;

@ccclass('Machine')
export class Machine extends Component {
    public get isFullScreen() { return screen.fullScreen(); }

    public fullscreen(active:boolean) {
        if ( active === true ) return screen.requestFullScreen();
        return screen.exitFullScreen();
    }

    public static readonly SPIN_MODE = SPIN_MODE;

    public static readonly SPEED_MODE = { NORMAL: 0, TURBO: 2, QUICK: 1,  DEFAULT:1, MAX:2 };

    public static readonly SPIN_STATE = { 
        PRELOAD       : -1,     // 預載中
        IDLE          : 0,      // 閒置中
        PERFORM_SCORE : 1,      // 閒置中, 輪流顯示分數
        SPINNING      : 2,      // SPIN中
        STOPPING      : 3,      // 停止中
    };

    // 是否正在SPIN
    public get spinning() { return this.properties.spinState > Machine.SPIN_STATE.PERFORM_SCORE; }

    // 是否忙碌中
    public get isBusy() : boolean { 
        if ( this.featureGame === true ) return true;
        if ( AutoSpin.isActive() === true ) return true;
        return this.spinning;
    }
    public set state(value:number) { this.properties.spinState = value; }
    public get state() { return this.properties.spinState; }

    // 是否正在快速停止
    public get fastStopping() { return this.properties.fastStopping; }
    public set fastStopping(value:boolean) { this.properties.fastStopping = value; }

    // 是否在特色遊戲
    public get featureGame() { return this.properties.featureGame; }
    public set featureGame(value:boolean) { this.properties.featureGame = value; }

    public get reel() : Reel { return this.properties.reel; }
    public set reel(value) { this.properties.reel = value; }

    public get bigwin() :BigWin { return BigWin.Instance; }
    public static SetReel(reel) { Machine.Instance.reel = reel; }
    public get spinEvent() : EventTarget { return this.properties.spinEvent; }

    public clearSpinEvent() : EventTarget {
        let spinEvent = this.spinEvent;
        if ( spinEvent == null ) {
            this.properties['spinEvent'] = new EventTarget();
            return this.spinEvent;
        }

        // spinEvent.removeAll('done');
        spinEvent['result'] = null;
        spinEvent['spinning'] = false;
        spinEvent['buy'] = null;
        return spinEvent;
    }

    public set buyFeatureGameButton(button:Button) { 
        if ( button == null ) return;
        this.properties['buyFeatureGameButton'] = button; 
        this.controller.addDisableButtons(button);
        Utils.AddHandHoverEvent(button.node);
    }
    public get buyFeatureGameButton() { return this.properties['buyFeatureGameButton']; }

    public activeBuyFGButton(active:boolean) {
        if ( this.buyFeatureGameButton == null ) return;
        this.buyFeatureGameButton.interactable = active;
        Utils.changeMainColor(this.buyFeatureGameButton.node, active ? Color.WHITE : Color.GRAY);
    }

    protected properties = {
        'reel' : null,
        'paytable' : null,
        'bigwin' : null,
        'controller' : null,
        'speedMode' : Machine.SPIN_MODE.QUICK,
        'spinState' : Machine.SPIN_STATE.IDLE,
        'fastStopping' : false,
        'featureGame' : false,
        'spinEvent' : null,
        'spinData' : null,
        'event' : new EventTarget(),
    };

    public setSpeedMode(mode:number) {
        this.properties['speedMode'] = mode;
        AutoSpin.ChangeSpeedMode(mode);
        return mode;
    }
    public get Event() : EventTarget { return this.properties['event']; }

    public get SpeedMode() { return this.properties['speedMode']; }
    public get controller() : Controller { return Controller.Instance; }

    public get paytable() : Paytable { return this.properties['paytable']; }
    public set paytable(value) { this.properties['paytable'] = value; }

    public get spinData() { return this.properties['spinData']; }
    
    public static Instance: Machine = null;
    protected onLoad(): void {
        Machine.Instance = this;
        slotData.machine = this;
        this.properties['spinEvent'] = new EventTarget();
        this.properties['event'] = new EventTarget();
        screen.on('fullscreen-change', this.fullscreenChangeHandler.bind( this ) );
        this.developTest();
        E2ETest.initTest(this);
        this.properties['event'].emit('preload');
    }

    @isDevelopFunction(true)
    private developTest() {
        if ( Utils.isDevelopment() === false ) return;
        // if ( Utils.isDevelopment() === false ) return;
        cc.machine = this;
        cc.DataManager = DataManager.instance;
        cc.slotData = slotData;
        cc.gameInformation = gameInformation;
    }

    protected start() {
        this.properties['controller'] = Controller.Instance;
        const mask = find('Canvas')?.getComponent(Mask);
        if ( mask ) {
            mask.enabled = true;
            mask.node.getComponent(Graphics).enabled = true;
        }
    }

    public async fullscreenChangeHandler ( width: number, height: number ) {
        await this.paytable?.fullscreenChangeHandler(this.isFullScreen, width, height);
        await this.controller?.fullscreenChangeHandler(this.isFullScreen, width, height);
    }

    public static EnterGame() { Machine.Instance.enterGame(); }
    public enterGame() {
        if (DataManager.instance.userData.credit === 0) {
            this.controller.setBalance(0);
        } else {
            this.controller.refreshBalance();
        }
        this.controller.setTotalWin(0);
        this.controller.betIdx = gameInformation._coinValueDefaultIndex;
        this.controller.refreshTotalBet();
        this.paytable.changeTotalBet(this.totalBet);
        this.paytable.enterGame();
        if ( screen.supportsFullScreen && sys.isMobile ) {
            this.fullscreen(true);
        }
        this.Event.emit('enter_game');
    }

    public get userCredit() { return DataManager.instance.userData.credit; }

    public get totalBet() { return this.controller.totalBet; }

    public async asyncSuperSpin() {
        let spine : sp.Skeleton = this.controller.superSpineSpine;
        // 如果不是在播放 spin 動畫，則播放 spin 動畫
        spine.addAnimation(0, 'spin', true);

        this.state = Machine.SPIN_STATE.SPINNING;
        this.paytable.breakPerformSingleLineLoop();
        await this.paytable.superSpinStart();
        await this.controller.superSpin.startSuperSpin();
        await Utils.delay(100);

        if ( this.spinEvent['result'] == null ) {
            await Utils.delayEvent(this.spinEvent); // 等待 Server 回應
        }
        
        await this.paytable?.superSpinEnd(this.spinData);
        this.controller.refreshBalance();
        
        spine.addAnimation(0, 'idle', true);
        await Utils.delay(100);
        this.state = Machine.SPIN_STATE.IDLE;
        
    }

    /**
     * Machine SPIN
     * 玩家點擊 Spin 通知 Paytable SPIN
     * 負責判斷 AutoSpin 是否繼續或停止
     */
    public async spin() {
        try {
            // 關閉所有按鈕
            this.controller.clickOptionBack();
            this.controller.activeBusyButtons(false);
            this.Event.emit('spin');
            if ( this.SpeedMode === SPIN_MODE.SUPER ) {
                // super spin 模式
                await this.asyncSuperSpin();
                if ( AutoSpin.isActive() === false ) {
                    await Utils.delay(500);
                }
            } else {
                if ( this.SpeedMode === SPIN_MODE.TURBO ) this.fastStopping = true;
                this.controller.superSpin.reset();
                this.controller.buttonSpinning();
                // 通知 reel 執行 SPIN
                await this.paytable.spin(); // 等待 SPIN 結束, 包含獎項顯示, BigWin 處理等...
                this.controller.buttonSpinning(false);
            }
            if ( AutoSpin.isActive() !== true ) this.controller.activeBusyButtons(true);
            if (this.featureGame !== true ) this.controller.refreshBalance(); // 更新餘額
            await Utils.delay(100);
            this.fastStopping = false;
            this.Event.emit('spin_end');
            return; // 回到 Controller clickSpin function
        }
        catch(error) {
            console.log('spin error', error);
            return;
        }
        
    }

    public async checkCredit(wait:boolean=false) : Promise<boolean> {
        let betCredit = this.totalBet;
        let userCredit = this.userCredit;
        const superMode = this.SpeedMode === SPIN_MODE.SUPER;

        if (userCredit < betCredit ) {
            if ( (this.spinning || wait) && !superMode ) await Utils.delay(500);
            DialogUI.OpenErrorMessage('220');
            AutoSpin.StopAutoSpin();
            this.controller.activeBusyButtons(true);
            return false;
        }
        return true;
    }

    // 從Controller呼叫
    public async clickSpin() : Promise<boolean> {

        if ( await this.checkCredit() === false ) {
            return false;
        }
        let betCredit = this.totalBet;
        let userCredit = this.userCredit;
        Utils.delay(100).then(()=> {
            // 扣除金額
            userCredit -= betCredit;
            this.controller.changeBalance(userCredit);
        });
        SoundManager.PlaySoundByID('spin');
        this.spinCommand(); // 向 Server 發送 SPIN 指令
        // SPIN
        await this.spin();
        return true;
    }

    public async buyFeatureGame(idx:number) : Promise<boolean> {
        let event = this.spinEvent;
        let buyEvent : EventTarget = this.properties['buyEvent'];

        if ( this.isBusy ) return false;
        if ( event?.['spinning'] ) return false;
        if ( buyEvent?.['spinning'] ) return false;

        let multiplier = gameInformation.buyInformation.multiplier;
        let baseTotalBet = this.controller.calculateTotalBet(idx);
        let totalBet = baseTotalBet * multiplier;
        let userCredit = this.userCredit;
        
        if ( userCredit < totalBet ) {
            // DialogUI.OpenUI('Insufficient balance', true, 'Insufficient balance', null, 'OK');
            DialogUI.OpenErrorMessage('220');
            return false;
        }

        if ( buyEvent == null ) {
            this.properties['buyEvent'] = new EventTarget();
            buyEvent = this.properties['buyEvent'];
        } else {
            buyEvent.removeAll('done');
        }

        userCredit -= totalBet;
        this.controller.changeBalance(userCredit);
        this.spin();
        await this.spinCommand(baseTotalBet);
        buyEvent.emit('done');
        event['buy'] = {
            'totalBet' : totalBet,
            'idx' : idx,
        };

        return true;
    }

    // 向 Server 發送SPIN指令
    public async spinCommand (buyTotalBet:number=0): Promise<any> { 
        let event = this.clearSpinEvent();

        if ( await this.paytable.spinCommandBeforeEvent() === false ) {
            DialogUI.OpenErrorMessage("220");
            return;
        }
        if ( buyTotalBet === 0 ) {
            StateManager.instance.sendSpinCommand();
        } else {
            StateManager.instance.sendBuySpinCommand(buyTotalBet);
        }

        await Utils.delayEvent(event); // 等待 Server 回應
        event['spinning'] = false;

        // 通知 paytable 本局結果
        this.paytable.spinResult(event['result']);
    }

    // Server 回應 SPIN
    public spinResponse ( spinData: any ) {
        let event = this.spinEvent;
        event['result'] = spinData;
        this.properties['spinData'] = spinData;
        DataManager.instance.userData.credit = spinData.user_credit;
        event.emit('done');
    }

    @isDevelopFunction(true)
    public spinTest(spinData:any) {

        if ( this.paytable.spinTest(spinData) == null ) return;

        let event = this.spinEvent;
        event['result'] = null;

        this.spin();
        this.spinResponse(spinData);
        this.paytable.spinResult(spinData);
    }
}