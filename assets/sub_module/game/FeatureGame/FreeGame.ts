import { _decorator, Component, EventTarget, Node, Label, tween, input, Input } from 'cc';
import { Utils } from '../../utils/Utils';
import { Machine } from '../machine/Machine';
import { Controller } from '../machine/controller_folder/Controller';
import { AutoSpin } from '../AutoSpin';
import { Paytable } from '../machine/pay/PayTable';
import { PageManager } from '../PageManager';
import { SoundManager } from '../machine/SoundManager';
const { ccclass, property } = _decorator;

@ccclass('FreeGame')
export class FreeGame extends Component {

    @property({ type: Node, displayName: '開始FreeGame介面', group:{id:'0', name:'開始介面'} })
    public startUI:Node = null;

    @property({ type: Node, displayName: '開始介面，點擊任意處提示', group:{id:'0', name:'開始介面'} })
    public clickToContinueUI:Node = null;

    @property({ type: Label, displayName: '開始介面，次數顯示', group:{id:'0', name:'開始介面'} })
    public startTimesLabel:Label = null;


    @property({ type: Node, displayName: '結束FreeGame介面', group:{id:'1', name:'結束介面'} })
    public endUI:Node = null;

    @property({ type: Label, displayName: 'FreeGame次數', group:{id:'1', name:'結束介面'} })
    public freeGameCount:Label = null;

    @property({ type: Label, displayName: 'FreeGame贏分', group:{id:'1', name:'結束介面'} })
    public freeGameWinScore:Label = null;

    public machine: Machine = null;
    public paytable:Paytable = null;


    public static Instance: FreeGame = null;
    protected onLoad(): void { FreeGame.Instance = this; }
    protected start() { 
        this.machine = Machine.Instance; 
        this.paytable = this.machine.paytable;

        if( this.clickToContinueUI ) this.clickToContinueUI.active = false;
    }

    public static async OpenFreeGameUI(option:any|{ onFinish?:Function, isRetrigger?:boolean, defaultFadin?:boolean, defaultFadout?:boolean, onOpenUI:any|Function, onCloseUI:any|Function }=null) {  return await FreeGame.Instance.openFreeGameUI(option); }

    private startFreeGameEvent : EventTarget = null;

    public clickStartFreeGame() {
        console.log('clickStartFreeGame');
        if ( this.machine.featureGame === false ) return;
        if ( this.startFreeGameEvent == null ) return;

        this.startFreeGameEvent.emit('done');
    }

    private endFreeGameEvent : EventTarget = null;
    public clickEndFreeGame() {
        console.log('clickEndFreeGame');
        if ( this.machine.featureGame === true ) return;
        if ( this.endFreeGameEvent == null ) return;

        this.endFreeGameEvent.emit('done');
    }


    /**
     * 
     * @param isRetrigger 是否在FreeGame中再次觸發FreeGame
     */
    protected async openFreeGameUI(option:any|{ onFinisn?:Function, isRetrigger?:boolean, defaultFadin?:boolean, defaultFadout?:boolean, onOpenUI:any|Function, onCloseUI:any|Function }=null) {
        if ( this.startUI == null ) return;
        this.machine.featureGame        = true;
        if ( option?.defaultFadin !== false ) await Utils.commonActiveUITween(this.startUI, true);
        await option?.onOpenUI();
        
        this.startFreeGameEvent = new EventTarget();
        this.startUI.on(Node.EventType.TOUCH_END, this.clickStartFreeGame, this);
        this.machine.controller.addTouchStartEvent(this.clickStartFreeGame,this);

        if ( AutoSpin.IsUtilFeature() === true ) {
            AutoSpin.StopAutoSpin(true);
            await Utils.delayEvent(this.startFreeGameEvent);
        } else {
            Utils.delay(5000).then(()=>{ this.clickStartFreeGame(); }); // 5秒後自動觸發
            await Utils.delayEvent(this.startFreeGameEvent);
        }

        this.startFreeGameEvent = null;

        if ( option?.defaultFadout !== false ) await Utils.commonActiveUITween(this.startUI, false);
        await option?.onCloseUI();
        PageManager.closePage(this.startUI, true);
        if ( option?.onFinish != null ) await option.onFinish();
    }

    public static async CloseFreeGameUI(totalWin:number, option:{ onFinish?:Function, times?:number, totalWin?:number, onStart?:Function, scoreAudio?:string, breakScoreAudio?:string }=null) { return await FreeGame.Instance.closeFreeGameUI(totalWin, option); }

    private _breakCloseFreeGameUI:EventTarget = null;
    public static clickBreakCloseFreeGameUI(t) {
        if ( FreeGame.Instance._breakCloseFreeGameUI == null ) return;
        FreeGame.Instance._breakCloseFreeGameUI.emit('done');
    }

    protected async closeFreeGameUI(totalWin:number, option:any=null) {

        if ( this.endUI == null ) return;
        this.freeGameWinScore.string = '';

        if ( this.freeGameCount != null ) this.freeGameCount.string = '';
        if ( option?.onStart != null ) {
            await option.onStart();
        } else {
            await Utils.commonActiveUITween(this.endUI, true);
        }

        this._breakCloseFreeGameUI = new EventTarget();
        let toScore = {value:0};
        let onUpdate    = (t) =>{ this.freeGameWinScore.string = Utils.numberComma(t.value); };
        let onComplete  = (t) =>{ FreeGame.Instance._breakCloseFreeGameUI.emit('done'); };
        
        this.freeGameWinScore.string = '0';
        this.endUI.on(Node.EventType.TOUCH_END, FreeGame.clickBreakCloseFreeGameUI, this);
        
        if ( option?.times != null && this.freeGameCount != null ) this.freeGameCount.string = option.times.toString();
        let tn = tween(toScore).to(4, {value:totalWin}, {
            easing      : 'quartInOut', 
            onUpdate    : onUpdate.bind(this), 
            onComplete  : onComplete.bind(this),
        }).start();
        let scoreAudioSource = null;
        if ( option?.scoreAudio != null ) scoreAudioSource = SoundManager.PlaySoundByID(option.scoreAudio);
        await Utils.delayEvent(this._breakCloseFreeGameUI);
        this._breakCloseFreeGameUI = null;
        tn.stop();
        scoreAudioSource?.stop();
        if ( option?.breakScoreAudio != null ) SoundManager.PlaySoundByID(option.breakScoreAudio);

        input.off(Input.EventType.TOUCH_START,  onComplete);
        this.freeGameWinScore.string = Utils.numberComma(totalWin);
        await Utils.delay(500);
        await Utils.scaleFade(this.freeGameWinScore, 1);
        await Utils.delay(500);
        
        this.freeGameWinScore.string = '';
        if ( this.freeGameCount != null ) this.freeGameCount.string = '';
        if ( option?.onFinish != null ) {
            await option.onFinish();
        } else {
            await Utils.commonActiveUITween(this.endUI, false);
        }
        PageManager.closePage(this.endUI, true);
        this.endUI.active = false;
        this.machine.featureGame = false;
    }


    public static async StartFreeGame(freeGameData: any[], preSpinCallback:Function=null, roundCallback: Function = null) {
        const machine = Machine.Instance;
        let spinEvent = new EventTarget();

        machine.fastStopping = false;
        Controller.ActiveFreeGameButton(true); // 打開FreeGame按鈕
        
        for(let i = 0; i < freeGameData.length; i++) {
            console.log('StartFreeGame', (freeGameData.length-i));
            if ( preSpinCallback ) await preSpinCallback(freeGameData[i]);
            window.dispatchEvent(new Event('ELMO_FREE_GAME_SPIN'));
            machine.fastStopping = false;
            machine.paytable.spin(spinEvent);
            machine.paytable.setGameResult(freeGameData[i]);
            await Utils.delayEvent(spinEvent);
            machine.paytable.reelMaskActive(false);

            if ( roundCallback ) await roundCallback(freeGameData[i]);
            window.dispatchEvent(new Event('ELMO_FREE_GAME_SPINNED'));
        }
        
        Controller.ActiveFreeGameButton(false); // 關閉FreeGame按鈕
        await Utils.delay(1000);

        console.log('EndFreeGame');
    }


}

