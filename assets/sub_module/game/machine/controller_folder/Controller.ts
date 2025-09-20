import { _decorator, Component, Node, sys, sp, Button, ParticleSystem2D, EventTarget, Vec3, tween, Color, Sprite, Label, input, Input, EventKeyboard, KeyCode, easing, instantiate, Skeleton } from 'cc';
import { Utils, DATA_TYPE }         from '../../../utils/Utils';
import { Orientation, Viewport }    from '../../../utils/Viewport';
import { AutoSpin }                 from '../../AutoSpin';
import { Machine }                  from '../Machine';
import { gameInformation }          from '../../GameInformation';
import { DataManager }              from '../../../data/DataManager';
import { GameInformationUI }        from '../GameInformationUI';
import { BuyFeatureGameUI }         from '../BuyFeatureGameUI';
import { SoundManager, PLAY_MODE }  from '../SoundManager';
import { SPIN_MODE } from '../Reel';
import { UIInGameMenuPanel4100 } from '../../../client-promotion/ingamemenu/UIInGameMenuPanel4100';
import { ObjectPool } from '../../ObjectPool';
import { BigWin, BigWinType } from '../BigWin';
const { ccclass, property } = _decorator;

@ccclass('Controller')
export class Controller extends Component {

    private initData = {
        "buttons" : {
            'TotalBetIncrease'  : { [DATA_TYPE.TYPE] : Button,        [DATA_TYPE.NODE_PATH] : 'Total Bet/Increase',         [DATA_TYPE.CLICK_EVENT]: this.clickTotalBetIncrease, 'busyDisable':true, 'buttonSound':true },
            'TotalBetDecrease'  : { [DATA_TYPE.TYPE] : Button,        [DATA_TYPE.NODE_PATH] : 'Total Bet/Decrease',         [DATA_TYPE.CLICK_EVENT]: this.clickTotalBetDecrease, 'busyDisable':true, 'buttonSound':true  },
            'Information'       : { [DATA_TYPE.TYPE] : Button,        [DATA_TYPE.NODE_PATH] : 'Option Buttons/Information', [DATA_TYPE.CLICK_EVENT]: this.clickInformation,      'busyDisable':true, 'buttonSound':true  },
            'Option'            : { [DATA_TYPE.TYPE] : Button,        [DATA_TYPE.NODE_PATH] : 'Bottom Buttons/Option',      [DATA_TYPE.CLICK_EVENT]: this.clickOption,           'busyDisable':true, 'buttonSound':true  },
            'SpeedMode'         : { [DATA_TYPE.TYPE] : Button,        [DATA_TYPE.NODE_PATH] : 'Bottom Buttons/Speed',       [DATA_TYPE.CLICK_EVENT]: this.clickSpeedMode,        'busyDisable':true, 'buttonSound':true  },
            'AutoSpin'          : { [DATA_TYPE.TYPE] : Button,        [DATA_TYPE.NODE_PATH] : 'Bottom Buttons/Auto',        [DATA_TYPE.CLICK_EVENT]: this.clickAutoSpin,         'busyDisable':true, 'buttonSound':true  },
            'InGameMenu'        : { [DATA_TYPE.TYPE] : Button,        [DATA_TYPE.NODE_PATH] : 'Option Buttons/InGameMenu',  [DATA_TYPE.CLICK_EVENT]: this.clickInGameMenu,       'busyDisable':true, 'buttonSound':true  },
            'Record'            : { [DATA_TYPE.TYPE] : Button,        [DATA_TYPE.NODE_PATH] : 'Option Buttons/Record',      [DATA_TYPE.CLICK_EVENT]: this.clickRecord,           'busyDisable':true, 'buttonSound':true  },
            'Fullscreen'        : { [DATA_TYPE.TYPE] : Button,        [DATA_TYPE.NODE_PATH] : 'Option Buttons/Screen',      [DATA_TYPE.CLICK_EVENT]: this.clickFullscreen,       'busyDisable':true, 'buttonSound':true  },
            'OptionBack'        : { [DATA_TYPE.TYPE] : Button,        [DATA_TYPE.NODE_PATH] : 'Option Buttons/Back',        [DATA_TYPE.CLICK_EVENT]: this.clickOptionBack,       'busyDisable':true, 'buttonSound':true  },
            'Spin'              : { [DATA_TYPE.TYPE] : Button,        [DATA_TYPE.NODE_PATH] : 'Bottom Buttons/Spin',        [DATA_TYPE.CLICK_EVENT]: this.clickSpin,             'busyDisable':true, 'buttonSound':false  },
            'Sound'             : { [DATA_TYPE.TYPE] : Button,        [DATA_TYPE.NODE_PATH] : 'Option Buttons/Sound',       [DATA_TYPE.CLICK_EVENT]: this.clickSound,            'busyDisable':true, 'buttonSound':false  },
            'RepeatAuto'        : { [DATA_TYPE.TYPE] : Button,        [DATA_TYPE.NODE_PATH] : 'Bottom Buttons/RepeatAuto',  [DATA_TYPE.CLICK_EVENT]: this.clickRepeatAuto,       'busyDisable':true, 'buttonSound':true  },

            // ====== 橫版按鈕 ======
            'OptionLandscape'   : { [DATA_TYPE.TYPE] : Button,        [DATA_TYPE.NODE_PATH] : 'Option Landscape/Option',             [DATA_TYPE.CLICK_EVENT]: this.clickOption,     'busyDisable':true, 'buttonSound':true  },
            'RecordLandscape'   : { [DATA_TYPE.TYPE] : Button,        [DATA_TYPE.NODE_PATH] : 'Option Landscape/Content/Record',     [DATA_TYPE.CLICK_EVENT]: this.clickRecord,     'busyDisable':true, 'buttonSound':true  },
            'SoundLandscape'    : { [DATA_TYPE.TYPE] : Button,        [DATA_TYPE.NODE_PATH] : 'Option Landscape/Content/Sound',      [DATA_TYPE.CLICK_EVENT]: this.clickSound,      'busyDisable':true, 'buttonSound':false  },
            'InGameMenuLandscape':{ [DATA_TYPE.TYPE] : Button,        [DATA_TYPE.NODE_PATH] : 'Option Landscape/Content/InGameMenu', [DATA_TYPE.CLICK_EVENT]: this.clickInGameMenu, 'busyDisable':true, 'buttonSound':true  },
            'ScreenLandscape'   : { [DATA_TYPE.TYPE] : Button,        [DATA_TYPE.NODE_PATH] : 'Option Landscape/Content/Screen',     [DATA_TYPE.CLICK_EVENT]: this.clickFullscreen, 'busyDisable':true, 'buttonSound':true  },
            'InfoLandScape'     : { [DATA_TYPE.TYPE] : Button,        [DATA_TYPE.NODE_PATH] : 'Option Landscape/Content/Information', [DATA_TYPE.CLICK_EVENT]: this.clickInformation, 'busyDisable':true, 'buttonSound':true  },
            'INIT_EVENT'        : this.initButton
        },

        'fullScreen' : {
            'fullscreen_p'      : { [DATA_TYPE.TYPE] : Node,          [DATA_TYPE.NODE_PATH] : 'Option Buttons/Screen/FullScreen', },
            'fullscreen_exit_p' : { [DATA_TYPE.TYPE] : Node,          [DATA_TYPE.NODE_PATH] : 'Option Buttons/Screen/FullScreen Off', },
            'fullscreen_l'      : { [DATA_TYPE.TYPE] : Node,          [DATA_TYPE.NODE_PATH] : 'Option Landscape/Content/Screen/FullScreen', },
            'fullscreen_exit_l' : { [DATA_TYPE.TYPE] : Node,          [DATA_TYPE.NODE_PATH] : 'Option Landscape/Content/Screen/FullScreen Off', },
        },

        'soundMode_p' : {
            'content'           : { [DATA_TYPE.TYPE] : Node,          [DATA_TYPE.NODE_PATH] : 'Option Buttons/Sound', },   
            'all_on'            : { [DATA_TYPE.TYPE] : Node,          [DATA_TYPE.NODE_PATH] : 'Option Buttons/Sound/Sound',     'next':'music_off' },
            'music_off'         : { [DATA_TYPE.TYPE] : Node,          [DATA_TYPE.NODE_PATH] : 'Option Buttons/Sound/Music Off', 'next':'sound_off' },
            'sound_off'         : { [DATA_TYPE.TYPE] : Node,          [DATA_TYPE.NODE_PATH] : 'Option Buttons/Sound/Sound Off', 'next':'all_on' },
        },

        'soundMode_l' : {
            'content'           : { [DATA_TYPE.TYPE] : Node,          [DATA_TYPE.NODE_PATH] : 'Option Landscape/Content/Sound', },
            'all_on'            : { [DATA_TYPE.TYPE] : Node,          [DATA_TYPE.NODE_PATH] : 'Option Landscape/Content/Sound/Sound',     'next':'music_off' },
            'music_off'         : { [DATA_TYPE.TYPE] : Node,          [DATA_TYPE.NODE_PATH] : 'Option Landscape/Content/Sound/Music Off', 'next':'sound_off' },
            'sound_off'         : { [DATA_TYPE.TYPE] : Node,          [DATA_TYPE.NODE_PATH] : 'Option Landscape/Content/Sound/Sound Off', 'next':'all_on' },
        },

        'speedMode' : {
            [Machine.SPIN_MODE.NORMAL] : { [DATA_TYPE.TYPE] : Sprite, [DATA_TYPE.NODE_PATH] : 'Bottom Buttons/Speed/Normal', 'next':Machine.SPIN_MODE.QUICK },
            [Machine.SPIN_MODE.QUICK]  : { [DATA_TYPE.TYPE] : Sprite, [DATA_TYPE.NODE_PATH] : 'Bottom Buttons/Speed/Quick',  'next':Machine.SPIN_MODE.TURBO },
            [Machine.SPIN_MODE.TURBO]  : { [DATA_TYPE.TYPE] : Sprite, [DATA_TYPE.NODE_PATH] : 'Bottom Buttons/Speed/Turbo',  'next':Machine.SPIN_MODE.SUPER},
            [Machine.SPIN_MODE.SUPER]  : { [DATA_TYPE.TYPE] : Sprite, [DATA_TYPE.NODE_PATH] : 'Bottom Buttons/Speed/Super',  'next':Machine.SPIN_MODE.NORMAL},
        
        },

        'ui' : {
            'balance' : { [DATA_TYPE.TYPE] : Label, [DATA_TYPE.NODE_PATH] : 'Balance/Value',   'lastValue' : 0, },     // 顯示餘額
            'totalBet': { [DATA_TYPE.TYPE] : Label, [DATA_TYPE.NODE_PATH] : 'Total Bet/Value', 'lastValue' : 0,  },    // 顯示總押注
            'totalWin': { [DATA_TYPE.TYPE] : Label, [DATA_TYPE.NODE_PATH] : 'Total Win/Value', 'lastValue' : 0, },     // 顯示總贏分
            'mask'    : { // 共用遮罩
                [DATA_TYPE.TYPE] : Sprite,
                [DATA_TYPE.NODE_PATH] : '---- Common Mask ----',
                'alpha' : 200,          // 遮罩透明度
                'event' : null,         // 遮罩事件
                'tweenSec' : 0.3,       // 遮罩動畫時間
            },
            'INIT_EVENT' : this.initUIValue,
        },

        'optionButtons' : { // Option 按鈕
            'portraitBottom' : { [DATA_TYPE.TYPE]: Node, [DATA_TYPE.NODE_PATH]: 'Bottom Buttons' },
            'portraitOption' : { [DATA_TYPE.TYPE]: Node, [DATA_TYPE.NODE_PATH]: 'Option Buttons' },
            'landscapeOption': { [DATA_TYPE.TYPE]: Node, [DATA_TYPE.NODE_PATH]: 'Option Landscape/Content' },
        },

        'autoSpin' : {
            'button'        : { [DATA_TYPE.TYPE]: Button, [DATA_TYPE.NODE_PATH]: 'Bottom Buttons/Spin/AutoSpin', [DATA_TYPE.CLICK_EVENT]: AutoSpin.StopAutoSpin },
            'label'         : { [DATA_TYPE.TYPE]: Label,  [DATA_TYPE.NODE_PATH]: 'Bottom Buttons/Spin/AutoSpin/Label' },
        },

        'spin' : {
            'image'         : { [DATA_TYPE.TYPE]: Sprite, [DATA_TYPE.NODE_PATH]: 'Bottom Buttons/Spin/Image' },
            'stop'          : { [DATA_TYPE.TYPE]: Sprite, [DATA_TYPE.NODE_PATH]: 'Bottom Buttons/Spin/Stop' },
            'free'          : { [DATA_TYPE.TYPE]: Sprite, [DATA_TYPE.NODE_PATH]: 'Bottom Buttons/Spin/Free' },
        },

        'superSpin' : {
            'spine'         : { [DATA_TYPE.TYPE]: sp.Skeleton, [DATA_TYPE.NODE_PATH]: 'Super Spin UI/content/superSpin Spine' },
            'particle'      : { [DATA_TYPE.TYPE]: ParticleSystem2D, [DATA_TYPE.NODE_PATH]: 'Super Spin UI/content/superSpin Spine/Particle2D' },
            'winParticle1'   : { [DATA_TYPE.TYPE]: ParticleSystem2D, [DATA_TYPE.NODE_PATH]: 'Super Spin UI/content/superSpin Spine/Win1' },
            'winParticle2'   : { [DATA_TYPE.TYPE]: ParticleSystem2D, [DATA_TYPE.NODE_PATH]: 'Super Spin UI/content/superSpin Spine/Win2' },
            'winParticle3'   : { [DATA_TYPE.TYPE]: ParticleSystem2D, [DATA_TYPE.NODE_PATH]: 'Super Spin UI/content/superSpin Spine/Win3' },
            'winParticle4'   : { [DATA_TYPE.TYPE]: ParticleSystem2D, [DATA_TYPE.NODE_PATH]: 'Super Spin UI/content/superSpin Spine/Win4' },
            'winParticle5'   : { [DATA_TYPE.TYPE]: ParticleSystem2D, [DATA_TYPE.NODE_PATH]: 'Super Spin UI/content/superSpin Spine/Win5' },
            'featureBG'     : { [DATA_TYPE.TYPE]: Sprite, [DATA_TYPE.NODE_PATH]: 'Super Spin UI/feature background' },
            'mainUI'        : { [DATA_TYPE.TYPE]: Sprite, [DATA_TYPE.NODE_PATH]: 'Super Spin UI' },
            'win'           : { [DATA_TYPE.TYPE]: Label,  [DATA_TYPE.NODE_PATH]: 'Super Spin UI/content/Score' },
            'totalWin'      : { [DATA_TYPE.TYPE]: Label,  [DATA_TYPE.NODE_PATH]: 'Super Spin UI/content/Total Win/Value' },
            'biggestWin'    : { [DATA_TYPE.TYPE]: Label,  [DATA_TYPE.NODE_PATH]: 'Super Spin UI/content/sub/Biggest Win/Value' },
            'bonusRounds'   : { [DATA_TYPE.TYPE]: Label,  [DATA_TYPE.NODE_PATH]: 'Super Spin UI/content/sub/Bonus Rounds/Value' },
            'bonusWin'     : { [DATA_TYPE.TYPE]: Label,  [DATA_TYPE.NODE_PATH]: 'Super Spin UI/content/sub/Bonus Wins/Value' },
            'roundsPlayed'  : { [DATA_TYPE.TYPE]: Label,  [DATA_TYPE.NODE_PATH]: 'Super Spin UI/content/sub/Rounds Played/Value' },
            'content'       : { [DATA_TYPE.TYPE]: Sprite, [DATA_TYPE.NODE_PATH]: 'Super Spin UI/content' },
            'preMessage'    : { [DATA_TYPE.TYPE]: Sprite, [DATA_TYPE.NODE_PATH]: 'Super Spin UI/preMessage' },
        }
    };

    /**
     * 
     */
    protected properties = {
        'machine' : null,
        'buttons' : {},
        'ui':{ mask:{ } },
        'speedMode' : {},

        // 忙碌時禁用按鈕
        'BusyDisableButtons' : [],

        // Option 按鈕資料
        'OptionData' : { // 點擊 Option 按鈕後的選項設定
            [Orientation.PORTRAIT] : { // 直版
                'fromPos'    : new Vec3(0, 240, 0),
                'toPos'      : new Vec3(0, -60, 0),
                'active'     : false,
                'running'    : false,
            },

           [Orientation.LANDSCAPE] : {
                'fromPos'    : new Vec3(0, -500, 0),
                'toPos'      : new Vec3(0, 90,  0),
                'active'     : false,
                'running'    : false,
            },
        },
        
        'clickSpin' : [0,0], // Spin 次數, SpinStop 次數
    };

    public get superSpineSpine() : sp.Skeleton { return this.properties['superSpin']['spine'][DATA_TYPE.COMPONENT]; }
    
    public get spinButton()     { return this.properties['buttons']['Spin'][DATA_TYPE.COMPONENT]; }

    get autoSpinButton() { return this.properties['autoSpin']['button'][DATA_TYPE.COMPONENT]; }
    get autoSpinLabel()  { return this.properties['autoSpin']['label'][DATA_TYPE.COMPONENT]; }
    get superSpinUI()     { return this.properties['superSpin']['mainUI'][DATA_TYPE.COMPONENT]; }

    get autoSpin() { return AutoSpin.Instance; }

    get props() { return this.properties; }

    public static Instance: Controller = null;

    /**
     * 初始化按鈕
     * todo: 加入忙碌時禁用按鈕
     */
    private initButton() {
        const buttonsData = this.initData.buttons;
        const busyDisableButtons = [];

        const keys = Object.keys(buttonsData);
        for(let i=0;i<keys.length;i++) {
            const key = keys[i];
            const data = buttonsData[key];
            const button = data[DATA_TYPE.COMPONENT];
            if ( button == null ) continue;
            busyDisableButtons.push(button);
        }
        this.props['BusyDisableButtons'] = busyDisableButtons;
    }

    private iphoneDisableFullScreen() : boolean {
        if ( sys.isMobile === false ) return false;
        if ( sys.os !== 'iOS' )       return false;

        const fullScreen = this.props['fullScreen'];
        fullScreen['fullscreen_p'][DATA_TYPE.NODE].active        = false;
        fullScreen['fullscreen_exit_p'][DATA_TYPE.NODE].active   = false;
        fullScreen['fullscreen_l'][DATA_TYPE.NODE].active        = false;
        fullScreen['fullscreen_exit_l'][DATA_TYPE.NODE].active   = false;
        fullScreen['fullscreen_p'][DATA_TYPE.NODE].parent.active = false;
        fullScreen['fullscreen_l'][DATA_TYPE.NODE].parent.active = false;

        this.props['soundMode_p']['content'][DATA_TYPE.NODE].setPosition(150, 10, 0);
        this.props['buttons']['Record'][DATA_TYPE.NODE].setPosition(0, 10, 0);
        this.props['buttons']['InGameMenu'][DATA_TYPE.NODE].setPosition(-150, 10, 0);
        this.props['buttons']['InGameMenuLandscape'][DATA_TYPE.NODE].setPosition(0, 90, 0);

        return true;
    }

    public addDisableButtons(button:Button) { this.props['BusyDisableButtons'].push(button); }

    private initUIValue() {
        this.props['ui']['balance']['event']  = new EventTarget();
        this.props['ui']['totalWin']['event'] = new EventTarget();
        this.props['ui']['totalBet']['event'] = new EventTarget();
    }

    /**
     * 初始化 Option 按鈕
     */
    private initOptionButton() {
        const optionData = this.props['OptionData'];
        const optionButtons = this.props['optionButtons'];
        optionData[Orientation.PORTRAIT]['fromPos'] = new Vec3(optionButtons['portraitOption'][DATA_TYPE.NODE].position);
        optionData[Orientation.PORTRAIT]['toPos']   = new Vec3(optionButtons['portraitBottom'][DATA_TYPE.NODE].position);
    }

    // #region [[rgba(0, 0, 0, 0)]] 遮罩相關功能
    /**
     * 初始化遮罩
     */
    private initMask() {
        this.props.ui.mask['event']  = new EventTarget();
        this.props.ui.mask[DATA_TYPE.NODE].active = false;
    }

    /**
     * 遮罩開啟/關閉
     * @param active     {boolean} 開啟/關閉
     * @param awaitEvent {boolean} 是否等待事件完成, 預設為不等待
     */
    public async maskActive(active:boolean) {
        const maskData = this.props.ui.mask;
        const [sprite, fadeIn, event, tweenSec ] = [
            maskData[DATA_TYPE.COMPONENT], 
            maskData['alpha'], 
            maskData['event'], 
            maskData['tweenSec']
        ];

        if ( event && event['running'] ) return;
        
        event.removeAll('done');
        event['running'] = true;
        const fromAlpha = active ? 0 : fadeIn;
        const toAlpha   = active ? fadeIn : 0;
        const data      = { 'value': fromAlpha };

        sprite.node.active = true;
        sprite.color = new Color(0, 0, 0, fromAlpha);
        tween(data).to(tweenSec, { value: toAlpha }, {
            onUpdate:   () => { sprite.color = new Color(0, 0, 0, data['value']); },
            onComplete:(n) => { event.emit('done'); }
        }).start();

        await Utils.delayEvent(event);
        event['running'] = false;
        sprite.node.active = active;
    }

    public static MaskActive(active:boolean) { return Controller.Instance?.maskActive(active); }

    // #endregion 遮罩

    /**
     * 啟用/禁用所有按鈕
     * @param active 啟用/禁用
     */
    public activeBusyButtons(active:boolean) { 
        this.props['BusyDisableButtons'].forEach((button: Button) => { button.interactable = active; }); 
        this.machine.activeBuyFGButton(active);
        BuyFeatureGameUI.CloseUI();
        if (active === true) AutoSpin.Instance.refreshRepeatAutoButton();
    }

    private touchStartEvent = new EventTarget();

    public superSpin : SuperSpin = null;

    public activeSuperSpinMode(active) {
        if ( active === true ) {
            this.properties['speedMode'][Machine.SPIN_MODE.NORMAL]['next'] = Machine.SPIN_MODE.QUICK;
            this.properties['speedMode'][Machine.SPIN_MODE.QUICK]['next']  = Machine.SPIN_MODE.TURBO;
            this.properties['speedMode'][Machine.SPIN_MODE.TURBO]['next'] = Machine.SPIN_MODE.SUPER;
            this.properties['speedMode'][Machine.SPIN_MODE.SUPER]['next'] = Machine.SPIN_MODE.NORMAL;
        } else {
            this.properties['speedMode'][Machine.SPIN_MODE.NORMAL]['next'] = Machine.SPIN_MODE.QUICK;
            this.properties['speedMode'][Machine.SPIN_MODE.QUICK]['next']  = Machine.SPIN_MODE.TURBO;
            this.properties['speedMode'][Machine.SPIN_MODE.TURBO]['next'] = Machine.SPIN_MODE.NORMAL;
        }

        this.props['superSpin']['winParticle'] = {
            'idx' : 0,
            'particles': [
                this.props['superSpin']['winParticle1'][DATA_TYPE.COMPONENT],
                this.props['superSpin']['winParticle2'][DATA_TYPE.COMPONENT],
                this.props['superSpin']['winParticle3'][DATA_TYPE.COMPONENT],
                this.props['superSpin']['winParticle4'][DATA_TYPE.COMPONENT],
                this.props['superSpin']['winParticle5'][DATA_TYPE.COMPONENT],
            ]
        };
        const copy = instantiate(this.props['superSpin']['win'].node);
        ObjectPool.registerNode('winLabelClone', copy);
    }

    protected onLoad(): void {
        Controller.Instance = this;
        this.props['machine'] = Machine.Instance;

        Utils.initData(this.initData, this);
        this.initMask();
        this.initOptionButton();
        this.initSoundMode();
        this.touchStartEvent = new EventTarget();
        
        input.on(Input.EventType.KEY_DOWN, this.onKeySpaceDown, this);
        input.on(Input.EventType.TOUCH_START,  this.onTouchStart, this);
        this.addTouchStartEvent(this.fastStop, this);

        this.superSpin = new SuperSpin(this);
        this.activeSuperSpinMode(true);
    }

    /**
     * 按鍵設定
     * @todo 空白鍵進行 Spin
     */
    protected onKeySpaceDown(event: EventKeyboard) { 
        switch ( event.keyCode ) {
            case KeyCode.SPACE:
                AutoSpin.StopAutoSpin();
                this.clickSpin();
                return;
            case KeyCode.ENTER:
            case KeyCode.NUM_ENTER:
                this.clickRepeatAuto();
                return;
        }
    }

    protected start() {
        this.initRepeatAuto();
        this.changeSpeedMode(this.machine.SpeedMode);
        this.iphoneDisableFullScreen();
        this.superSpin.reset(true);
        this.superSpin.activeUI(false);
        AutoSpin.Instance.defaultRepeatAutoData();
    }

    public get machine() :Machine { return this.props['machine']; }

    public spinButtonEvent : EventTarget = new EventTarget();
    public async buttonSpinning(active:boolean=true, force:boolean=false) {
        if ( this.machine.featureGame ) return;

        const spinImage = this.props['spin']['image'].node;
        const stopImage = this.props['spin']['stop'].node;

        if ( active === false ) {
            if ( this.spinButtonEvent != null && this.spinButtonEvent['running'] == true && force === false ) {
                return this.spinButtonEvent.emit('done');
            }
            
            return await this.stopButtonSpinning();
        }
        if ( this.spinButtonEvent['running'] ) return;
    
        Utils.commonFadeIn(spinImage, true);
        this.spinButtonEvent['tween'] = tween(spinImage).repeatForever(tween().by(0.5, { angle: -360 }, { easing:'linear' })).start();
        this.spinButtonEvent['running'] = true;
        await Utils.commonFadeIn(stopImage, false);
        await this.stopButtonSpinning();
    }

    public async stopButtonSpinning() {
        const spinImage = this.props['spin']['image'].node;
        const stopImage = this.props['spin']['stop'].node;
        spinImage.active = false;
        stopImage.active = true;
        this.props['spin']['stop'].component.color = Color.WHITE;
    
        await Utils.delayEvent(this.spinButtonEvent);
        Utils.commonFadeIn(spinImage, false);
        Utils.commonFadeIn(stopImage, true);
        this.spinButtonEvent['tween'].stop();
        this.spinButtonEvent['running'] = false;
        this.spinButtonEvent.emit('done');
    }

    public static ActiveFreeGameButton(active:boolean) { Controller.Instance.activeFreeGameButton(active); }

    public activeFreeGameButton(active:boolean) {
        this.props['spin']['free'].node.active  = active; 
        this.props['spin']['image'].node.active = false;
        this.props['spin']['stop'].node.active  = !active;

        const label = AutoSpin.Instance.autoSpinTimeLabel;
        if ( active === true ) {
            label.node.setPosition(0, 5, 0);
        } else {
            label.node.setPosition(0, 0, 0);
            label.string = '';
        }
    }

    public static RestSpinButton() { Controller.Instance.resetSpinButton(); }
    public resetSpinButton() {
        this.props['spin']['free'].node.active  = false; 
        this.props['spin']['image'].node.active = true;
        this.props['spin']['stop'].node.active  = false;
        AutoSpin.Instance.autoSpinTimeLabel.string = '';
    }

    public static async ButtonSpinning(active:boolean) { 
        if ( active ) return Controller.Instance.buttonSpinning();
        return Controller.Instance.spinButtonEvent.emit('done'); 
    }

    private async clickSpinButtonAnimation() {
        const spinImage = this.props['spin']['image'].node.parent;
        tween(spinImage).to(0.1, { scale: new Vec3(0.6,0.6,1) }).to(0.15, { scale: Vec3.ONE }, {easing:'backOut'}).start();
    }

    /**
     * 快速停止
     * @from clickSpin(), onLoad() -> input.on(Input.EventType.TOUCH_START,  this.fastStop, this);
     * @returns {boolean} 是否快速停止
     */
    public fastStop() {
        if ( this.clickOptionBack() === true ) return false;
        if ( this.machine.spinning === false ) return false;
        if ( this.machine.fastStopping === true ) return false;
        this.machine.fastStopping = true;
        return true;
    }

    public onTouchStart() { 
        this.touchStartEvent.emit(Input.EventType.TOUCH_START); 
    }

    public addTouchStartEvent<T>(callback: (...args: any[]) => void, target: T) { this.touchStartEvent.on(Input.EventType.TOUCH_START, callback, target); }
    
    public removeTouchStartEvent<T>(callback: (...args: any[]) => void, target: T) { this.touchStartEvent.off(Input.EventType.TOUCH_START, callback, target); }

    /**
     * Spin 按鈕事件
     */
    public async clickSpin(autoSpin:boolean=false) {
        if ( this.machine.featureGame ) return false;   // 如果在特色遊戲中, 則不可SPIN
        this.clickSpinButtonAnimation() ;               // SPIN 按鈕點擊動畫
        
        GameInformationUI?.Instance?.closeUI();         // 關閉遊戲資訊
        AutoSpin?.CloseUI();                            // 關閉自動 SPIN 設定
        
        if ( this.machine.spinning ) {                  // 正在 SPIN 中
            if ( this.machine.SpeedMode === SPIN_MODE.SUPER ) return false; // 如果是 SUPER SPIN 模式, 則不可再次 SPIN
            if ( this.fastStop() === false ) return false; // 已經是快速停止狀態，不做任何事

            let times = this.props['clickSpin'][1]++;   // 紀錄快停次數
            Utils.GoogleTag('ClickSpinStop', {'event_category':'Spin', 'event_label':'ClickSpinStop'});
            this.machine.fastStopping = true;           // 設定快速停止狀態
            return false;
        }

        if ( await this.machine.checkCredit() === false ) return false; // 檢查餘額是否足夠
        Utils.GoogleTag('ClickSpin', {'event_category':'Spin', 'event_label':'ClickSpin', 'betIndex':this.betIdx, 'speed':this.machine.SpeedMode});
        this.clickOption(null, false);                  // 關閉 Option 功能
        await this.machine.clickSpin();                 // 等待 Spin 結束
        this.autoSpin.refreshRepeatAutoButton();        // 更新重複自動按鈕
        
        return await this.autoSpin.decrementCount(); 
    }

    protected clickInformation() {
        if ( this.machine.isBusy === true ) return; 
        this.clickOptionBack();
        Utils.GoogleTag('ClickInformation', {'event_category':'Information', 'event_label':'ClickInformation'});
        GameInformationUI.OpenUI();
    }

    /**
     * 切換顯示 Option 按鈕列表功能
     * @param active 切換按鈕狀態, 預設為反向
     */
    protected clickOption(event, active:boolean=null) : boolean {
        if ( this.machine.isBusy === true && active !== false ) return false; 

        const orientation   = Viewport.instance.getCurrentOrientation();
        const optionData    = this.props['OptionData'][orientation];
        const optionButtons = this.props['optionButtons'];
        let [ oFromPos, oToPos, isActive, running ] = [ optionData['fromPos'], optionData['toPos'], optionData['active'], optionData['running'], optionData['bottomNode'] ];
        
        const node          = (orientation === Orientation.PORTRAIT) ? optionButtons['portraitOption'][DATA_TYPE.NODE] : optionButtons['landscapeOption'][DATA_TYPE.NODE];
        const bottomNode    = (orientation === Orientation.PORTRAIT) ? optionButtons['portraitBottom'][DATA_TYPE.NODE] : null;

        if ( node    == null )      return false;
        if ( running === true )     return false;
        if ( active  === isActive ) return false;

        active = !isActive;
        const fromPos = active ? oFromPos : oToPos;
        const toPos   = active ? oToPos : oFromPos;
        const self    = this;
        running       = true;

        this.activeBusyButtons(false);
        node.setPosition(new Vec3(fromPos));

        if ( bottomNode != null ) {
            bottomNode.setPosition(new Vec3(toPos));
            tween(bottomNode).to(0.3, { position: fromPos }, { easing:'backOut' }).start();
        }
        const completeEvent = ()=> { optionData['running'] = false; optionData['active'] = active; self.activeBusyButtons(true); };
        completeEvent.bind(this);
        tween(node).to(0.3, { position: toPos }, { easing:'backOut', onComplete:completeEvent }).start();
        return true;
    }

    /**
     * 關閉 Option 按鈕列表 功能
     */
    public clickOptionBack() : boolean{ return this.clickOption(null, false); }

    /**
     * 點擊切換速度模式
     */
    protected clickSpeedMode() {
        if ( this.clickOptionBack() === true ) return;
        if ( this.machine.isBusy === true ) return; 
        
        const speedMode = this.props.speedMode;
        const lastMode = this.machine.SpeedMode;
        const nextMode = speedMode[lastMode]['next'];

        Utils.GoogleTag('ClickSpeedMode', {'event_category':'SpeedMode', 'event_label':'ClickSpeedMode', 'value':nextMode});
        return this.changeSpeedMode(nextMode);
    }

    /**
     * 切換速度模式
     * @param mode { Machine.SPIN_MODE } 速度模式代號
     */
    private async changeSpeedMode(mode:number) {
        const speedMode = this.props.speedMode;
        const lastMode = this.machine.SpeedMode;
        if ( lastMode === mode ) return;

        speedMode[mode][DATA_TYPE.NODE].active = true;
        speedMode[lastMode][DATA_TYPE.NODE].active = false;

        this.superSpin.activeUI( mode === Machine.SPIN_MODE.SUPER );
        return this.machine.setSpeedMode(mode);
    }

    public static ChangeSpeedMode(mode:number) { return Controller.Instance.changeSpeedMode(mode); }

    protected clickAutoSpin() { 
        if ( this.clickOptionBack() === true ) return;
        if ( this.machine.isBusy === true ) return; 
        AutoSpin.OpenUI(); 
    }

    protected clickInGameMenu() {
        if ( this.machine.isBusy === true ) return; 
        Utils.GoogleTag('ClickInGameMenu', {'event_category':'InGameMenu', 'event_label':'ClickInGameMenu'});
        console.log('clickInGameMenu');
        UIInGameMenuPanel4100.Instance.onButtonInGameMenuClick();
        // document.getElementsByClassName('igm_close')
    }

    protected clickRecord() {
        this.clickOptionBack();
        if ( this.machine.isBusy === true ) return; 
        Utils.GoogleTag('ClickBetRecord', {'event_category':'BetRecord', 'event_label':'ClickBetRecord'});
        const betrecordurl = gameInformation.fullBetrecordurl;
        window.open(betrecordurl, '_blank');
        
    }

    protected initSoundMode() {
        this.props['soundMode'] = {};
        this.props['soundMode'][Orientation.LANDSCAPE] = {};
        this.props['soundMode'][Orientation.PORTRAIT]  = {};

        this.props['soundMode'][Orientation.LANDSCAPE][PLAY_MODE.NORMAL]     = this.props['soundMode_l']['all_on'].node;
        this.props['soundMode'][Orientation.LANDSCAPE][PLAY_MODE.ONLY_SOUND] = this.props['soundMode_l']['music_off'].node;
        this.props['soundMode'][Orientation.LANDSCAPE][PLAY_MODE.NO_SOUND]   = this.props['soundMode_l']['sound_off'].node;

        this.props['soundMode'][Orientation.PORTRAIT][PLAY_MODE.NORMAL]      = this.props['soundMode_p']['all_on'].node;
        this.props['soundMode'][Orientation.PORTRAIT][PLAY_MODE.ONLY_SOUND]  = this.props['soundMode_p']['music_off'].node;
        this.props['soundMode'][Orientation.PORTRAIT][PLAY_MODE.NO_SOUND]    = this.props['soundMode_p']['sound_off'].node;
    }

    protected initRepeatAuto() {
        AutoSpin.InitRepeatAutoButton(this.props['buttons']['RepeatAuto'][DATA_TYPE.NODE]);
    }

    protected changeSoundMode(mode:PLAY_MODE) {
        for(let i=0;i<PLAY_MODE.length;i++) {
            const active = (mode === i);
            this.props['soundMode'][Orientation.LANDSCAPE][i].active = active;
            this.props['soundMode'][Orientation.PORTRAIT][i].active = active;
        }

        SoundManager.setMode(mode);
        Utils.GoogleTag('ChangeSoundMode', {'event_category':'soundMode', 'event_label':'ChangeSoundMode', 'value':mode});
    }

    protected clickSound() {
        if ( this.machine.isBusy === true ) return; 
        let mode = SoundManager.Mode + 1;
        if ( mode >= PLAY_MODE.length ) mode = 0;

        this.changeSoundMode(mode);
    }

    protected clickRepeatAuto() { 
        if ( this.clickOptionBack() === true ) return;
        if ( this.machine.isBusy === true ) return;
        this.autoSpin.clickRepeatAuto(); 
    }

    protected clickFullscreen() {
        if ( this.machine.isBusy === true ) return; 
        const isFullScreen = this.machine.isFullScreen;
        this.machine.fullscreen(!isFullScreen);
    }

    public async fullscreenChangeHandler(isFullScreen:boolean, width:number, height:number) {
        this.props['fullScreen']['fullscreen_p'][DATA_TYPE.NODE].active      = !isFullScreen;
        this.props['fullScreen']['fullscreen_exit_p'][DATA_TYPE.NODE].active = isFullScreen;
        this.props['fullScreen']['fullscreen_l'][DATA_TYPE.NODE].active      = !isFullScreen;
        this.props['fullScreen']['fullscreen_exit_l'][DATA_TYPE.NODE].active = isFullScreen;

        Utils.GoogleTag('ClickFullScreen', {'event_category':'FullScreen', 'event_label':'ClickFullScreen', 'value':+isFullScreen});
    }

    /** 更新餘額顯示 */
    public refreshBalance() {
        const balance = DataManager.instance.userData.credit;
        this.changeBalance(balance);
    }

    /**
     * 變更餘額顯示 (非同步)
     * @param to          {number}         目標數字
     * @param from        {number | null}  起始數字, null = 預設為上次數字
     * @param tweenSec    {float}           滾動秒數, 0 = 不滾動顯示
     * @returns {Promise<any>}
     */
    public async changeBalance(to:number, from:number=null, tweenSec=0.2) {
        if ( to == null ) return;
        if ( to === from ) return;
        if ( tweenSec === 0 ) return this.setBalance(to);
        from = from ?? this.props['ui']['balance']['lastValue'];
        return await this.tweenValue(to, from, tweenSec, (data)=> this.setBalance(data['value']), this.props['ui']['balance']['event']);
    }

    /**
     * 顯示餘額
     * @param balance {number} 餘額
     * @returns {void}
     */
    public setBalance(balance:number) {
        const balanceLabel:Label = this.balanceLabel;
        const currencySymbol = gameInformation._currencySymbol;
        this.props['ui']['balance']['lastValue'] = balance;
        balanceLabel.string = `${currencySymbol} ${Utils.numberComma(balance)}`;
    }

    public get balanceLabel() { return this.props['ui']['balance'][DATA_TYPE.COMPONENT]; }

    /**
     * 變更總贏分顯示 (非同步)
     * @param to          {number}         目標數字
     * @param from        {number | null}  起始數字, null = 預設為上次數字
     * @param tweenSec    {float}           滾動秒數, 0 = 不滾動顯示
     * @returns {Promise<any>}
     */
    public async changeTotalWin(to:number, from:number=null, tweenSec=1) {
        if ( to == null ) return;
        if ( to === from ) return;
        if ( tweenSec === 0 ) return this.setTotalWin(to);
        from = from ?? this.props['ui']['totalWin']['lastValue'];
        return await this.tweenValue(to, from, tweenSec, (data)=> this.setTotalWin(data['value']), this.props['ui']['totalWin']['event']);
    }

    /**
     * 累加總贏分 (非同步)
     * @param value 
     * @returns 
     */
    public async addTotalWin(value:number) {
        const totalWin = this.props['ui']['totalWin']['lastValue'];
        return await this.changeTotalWin(totalWin + value);
    }

    /**
     * 顯示總贏分
     * @param totalWin 顯示總贏分
     * @returns { void }
     */

    public setTotalWin(totalWin:number) {
        
        const totalWinLabel:Label = this.totalWinLabel;
        const currencySymbol      = gameInformation._currencySymbol;

        this.props['ui']['totalWin']['lastValue'] = totalWin;
        
        if ( totalWin === 0 ) return totalWinLabel.string = '';
        return totalWinLabel.string = `${currencySymbol} ${Utils.numberComma(totalWin)}`;
    }

    public get totalWinLabel() { return this.props['ui']['totalWin'][DATA_TYPE.COMPONENT]; }

    /**
     * 滾動數字工具
     * @todo 提供給 TotalWin, TotalBet, Balance 滾動數字使用
     * @param to            {number}      目標數字
     * @param from          {number}      起始數字
     * @param tweenSec      {float}        滾動秒數
     * @param onUpdate      {function}    更新數字事件
     * @param eventTarget   {EventTarget} 結束觸發事件
     */
    private async tweenValue(to:number, from:number, tweenSec:number, onUpdate:any, eventTarget:EventTarget) {
        if ( to == null ) return;
        if ( to === from ) return;
        if ( !onUpdate || !eventTarget ) return;

        let data = { 'value': from };
        eventTarget.removeAll('done');
        tween(data).to(tweenSec, { value: to }, { onUpdate: onUpdate, onComplete: ()=> eventTarget.emit('done') }).start();

        return await Utils.delayEvent(eventTarget);
    }


    //#region TotalBet 相關功能 [[rgba(0, 0, 0, 0)]]

    /**
     * 改變總押注顯示數字 (非同步)
     * @param to          {number}         目標數字
     * @param from        {number | null}  起始數字, null = 預設為上次數字
     * @param tweenSec    {float}           滾動秒數
     * @returns {Promise<any>}
     */
    public async changeTotalBet(to:number, from:number=null, tweenSec=0.2) {
        if ( to == null ) return;
        if ( to === from ) return;
        if ( tweenSec === 0 ) return this.setTotalBet(to);
        from = from ?? this.props['ui']['totalBet']['lastValue'];
        
        return await this.tweenValue(to, from, tweenSec, (data)=> this.setTotalBet(data['value']), this.props['ui']['totalBet']['event']);
    }

    /**
     * 顯示總押注
     * @param totalBet {number} 總押注
     * @returns {void}
     */
    private setTotalBet(totalBet:number) {
        const totalBetLabel:Label = this.props['ui']['totalBet'][DATA_TYPE.COMPONENT];
        const currencySymbol = gameInformation._currencySymbol;

        this.props['ui']['totalBet']['lastValue'] = totalBet;
        totalBetLabel.string = `${currencySymbol} ${Utils.numberComma(totalBet)}`;
    }

    /**  設定押注Index (private) */
    private set betIdx(value:number) { this.props['ui']['totalBet']['betIdx'] = value; }

    /**  取得押注Index */
    public get betIdx() { return this.props['ui']['totalBet']['betIdx']; }

    /**  取得押注額度 */
    private get betValue() { return this.calculateTotalBet(this.betIdx);}

    public calculateTotalBet(idx:number) {
        const paytableTotalBet = this.machine.paytable?.calculateTotalBet(idx);
        if ( paytableTotalBet != null ) return paytableTotalBet;

        const [ coinValue, lineBet, lineTotal ] = [
            gameInformation.coinValueArray[idx],
            gameInformation.lineBet,
            gameInformation.lineTotal
        ];
        gameInformation.coinValue = coinValue;
        return coinValue * 1000 * lineBet * lineTotal / 1000;
    }

    /**  取得總押注 */
    public get totalBet() { return this.betValue; }

    /**  取得押注額度數量 */
    private get betIdxLength() { return gameInformation.coinValueArray.length; }
    private get betIdxMin() { return gameInformation.bet_available_idx; }

    /**  更新押注額 */
    public refreshTotalBet() { this.changeTotalBet(this.betValue); }

    /**  減少押注 */
    protected clickTotalBetDecrease() { 
        if ( this.machine.isBusy === true ) return; 
        if ( this.clickOptionBack() === true ) return;
        this.changeTotalBetIdx(this.betIdx - 1); 
    }

    /**  增加押注 */
    protected clickTotalBetIncrease() { 
        if ( this.machine.isBusy === true ) return; 
        if ( this.clickOptionBack() === true ) return;
        this.changeTotalBetIdx(this.betIdx + 1);
     }

    /** 
     * 改變押注 
     * @param idx {number} 指定押注Index
     */
    public changeTotalBetIdx(idx:number) {
        
        const length = this.betIdxLength;

        if ( idx >= length ) idx = this.betIdxMin;
        if ( idx < this.betIdxMin ) idx = length - 1;
        this.betIdx = idx;
        this.refreshTotalBet();
        // this.machine.eventChangeTotalBet();
        this.machine.paytable.changeTotalBet(this.totalBet);
    }

    public displayTotalBetIdx(idx:number) {
        const length = this.betIdxLength;
        if ( idx >= length ) idx = length-1;
        if ( idx < this.betIdxMin ) idx = this.betIdxMin;

        const totalBet = this.calculateTotalBet(idx);
        this.changeTotalBet(totalBet);
        return totalBet;
    }

    //#endregion TotalBet 相關功能
}

export class SuperSpin {
    public controller:Controller = null;
    public machine:Machine = null;

    private _spinRounds = 0;
    public get spinRounds() { return this._spinRounds; }
    public set spinRounds(value:number) { this._spinRounds = value; } 
    public get winLabel() { return this.controller.props['superSpin']['win'][DATA_TYPE.COMPONENT]; }

    public bigSound = {
        [BigWinType.NONE]       : 'sfx_win_line',
        [BigWinType.BIG_WIN]    : 'sfx_win_line',
        [BigWinType.SUPER_WIN]  : 'sfx_win_line',
        [BigWinType.MEGA_WIN]   : 'sfx_win_line',
    };
    
    public async countSpinRounds()  { 
        this.spinRounds++; 
        const label = this.controller.props['superSpin']['roundsPlayed'][DATA_TYPE.COMPONENT];
        await Utils.tweenScale(label.node, 0.2, 0.2);
        label.string = this.spinRounds.toString();
        await Utils.tweenScale(label.node, 1, 0.2, { easing: 'backInOut' });
    }


    private _biggestWin = 0;
    public get biggestWin() { return this._biggestWin; }
    public set biggestWin(value:number) { this._biggestWin = value; }
    public async updateBiggestWin(score:number) {
        if ( score <= this.biggestWin ) return;
        this.biggestWin = score;
        const label = this.controller.props['superSpin']['biggestWin'][DATA_TYPE.COMPONENT];
        const from = this.biggestWin;

        this.biggestWin = score;
        await Utils.tweenScale(label.node, 0.5, 0.2);
        Utils.commonTweenNumber(label, from, score, 0.5);
        await Utils.tweenScale(label.node, 1, 0.2, { easing: 'backInOut' });

    }

    private _bonusRounds = 0;
    public get bonusRounds() { return this._bonusRounds; }
    public set bonusRounds(value:number) { this._bonusRounds = value; }
    public async countBonusRounds()  {
        this.bonusRounds++;
        const label = this.controller.props['superSpin']['bonusRounds'][DATA_TYPE.COMPONENT];
        await Utils.tweenScale(label.node, 0.2, 0.2);
        label.string = this.bonusRounds.toString();
        await Utils.tweenScale(label.node, 1, 0.2, { easing: 'backInOut' });
    }

    private _bonusWins = 0;
    public get bonusWins() { return this._bonusWins; }
    public set bonusWins(value:number) { this._bonusWins = value; }
    public async updateBonusWins(score:number) {
        if ( score === 0 ) return;
        this.bonusWins += score;
        const label = this.controller.props['superSpin']['bonusWin'][DATA_TYPE.COMPONENT];
        const from = this.bonusWins;

        this.bonusWins += score;
        await Utils.tweenScale(label.node, 0.5, 0.2);
        Utils.commonTweenNumber(label, from, this.bonusWins, 0.5);
        await Utils.tweenScale(label.node, 1, 0.2, { easing: 'backInOut' });
    }

    private _totalWins = 0;
    public get totalWins() { return this._totalWins; }
    public set totalWins(value:number) { this._totalWins = value; }
    public async updateTotalWins(score:number) {
        this.totalWins += score;
        const label = this.controller.props['superSpin']['totalWin'][DATA_TYPE.COMPONENT];
        const from = this.totalWins;

        this.totalWins += score;
        await Utils.tweenScale(label.node, 0.5, 0.2);
        Utils.commonTweenNumber(label, from, this.totalWins, 0.5);
        await Utils.tweenScale(label.node, 1, 0.2, { easing: 'backInOut' });
    }

    public async updateWin(score:number) {
        if ( score <= 0 ) return;
        const winLabel = this.winLabel
        const copy = ObjectPool.Get('winLabelClone');
        const toPos = winLabel.node.position.clone().add(new Vec3(0, 100, 0));

        if ( winLabel.string !== '' ) {
            copy.parent = winLabel.node.parent;
            copy.position = winLabel.node.position;
            copy.scale = Vec3.ONE.clone();
            copy.getComponent(Label).string = winLabel.string;
            copy.getComponent(Label).color = Color.WHITE;
            copy.active = true;
            
            Utils.tweenMove(copy, toPos, 1);
            Utils.tweenAlpha(copy, true, 1.1).then(async()=> { 
                copy.active = false;
                ObjectPool.Put('winLabelClone', copy);
            });
        }
        winLabel.string = '0';
        winLabel.node.active = true;
        console.log('updateWin', winLabel);
        await Utils.tweenScale(winLabel.node, 0.5, 0.2);
        Utils.commonTweenNumber(winLabel, 0, score, 0.5);
        await Utils.tweenScale(winLabel.node, 1, 0.2, { easing: 'backInOut' });
        
    }

    public winSound(score:number) {
        const bigWin = BigWin.Instance.isBigWin(score);
        const sound = this.bigSound[bigWin];
        if ( sound ) SoundManager.PlaySoundByID(sound);
    }

    public async reckonTotalWins(score:number, isFeature:boolean=false) {
        if ( score > 0 ) {
            
            this.controller.superSpineSpine.setAnimation(0, 'win', false);
            this.controller.superSpineSpine.addAnimation(0, 'idle', true);
            await Utils.delay(200);
            
            let idx = this.controller.props['superSpin']['winParticle']['idx'];
            let particles = this.controller.props['superSpin']['winParticle']['particles'];
            let winParticle = particles[idx];

            winParticle.node.active = true;
            winParticle.resetSystem();
            idx++;
            if ( idx >= particles.length ) idx = 0;
            this.controller.props['superSpin']['winParticle']['idx'] = idx;
            await Utils.delay(300);
            this.winSound(score);
        }
        
        this.updateTotalWins(score);
        this.updateBiggestWin(score);
        this.updateWin(score);
        if ( isFeature ) this.updateBonusWins(score);
    }

    public async reckonFeatureGame(startTimes: number, featureGameData : any | {times?:number, score?:number, addTimes?:number}[]) {
        if ( featureGameData == null || featureGameData.length === 0 ) return;
        this.machine.featureGame = true;
        await this.machine.paytable.preStartSuperSpinFeatureGame();
        this.controller.props['superSpin']['featureBG'].node.active = true;
        
        this.countBonusRounds();
        Controller.ActiveFreeGameButton(true);
        await AutoSpin.AutoSpinTimes(startTimes);
        await Utils.delay(500);

        for(let i=0;i<featureGameData.length;i++) {
            const data = featureGameData[i];
            SoundManager.PlaySoundByID('spin');
            await this.machine.paytable.preSuperSpinFeatureGame(data);
            await AutoSpin.AutoSpinTimes(data.times);
            await this.reckonTotalWins(data.score, true);
            await Utils.delay(500);
        }
        await Utils.delay(500);
        this.machine.featureGame = false;
        await this.machine.paytable.superSpinEndFeatureGame(featureGameData);
        this.controller.props['superSpin']['featureBG'].node.active = false;
        Controller.RestSpinButton();
        AutoSpin.Instance.refreshRepeatAutoButton();
        // this.controller.stopButtonSpinning();
    }

    public get content() { return this.controller.props['superSpin']['content'][DATA_TYPE.COMPONENT]; }
    public get preMessage() { return this.controller.props['superSpin']['preMessage'][DATA_TYPE.COMPONENT]; }
    public get mainUI() { return this.controller.props['superSpin']['mainUI'][DATA_TYPE.COMPONENT]; }

    constructor(controller:Controller) { 
        this.controller = controller;
        this.machine = controller.machine;
    }

    public reset(force:boolean=false) {
        if ( this.spinRounds === 0 && force === false ) return;
        this.content.node.active = false;
        this.preMessage.node.active = true;
        this.biggestWin = 0;
        this.spinRounds = 0;
        this.bonusRounds = 0;
        this.bonusWins = 0;
        this.totalWins = 0;
        this.controller.props['superSpin']['biggestWin'][DATA_TYPE.COMPONENT].string = '';
        this.controller.props['superSpin']['roundsPlayed'][DATA_TYPE.COMPONENT].string = '';
        this.controller.props['superSpin']['bonusRounds'][DATA_TYPE.COMPONENT].string = '';
        this.controller.props['superSpin']['bonusWin'][DATA_TYPE.COMPONENT].string = '';
        this.controller.props['superSpin']['totalWin'][DATA_TYPE.COMPONENT].string = '';
        this.controller.props['superSpin']['win'][DATA_TYPE.COMPONENT].string = '';
    }

    public activeUI(active:boolean) {
        this.mainUI.node.active = active;
    }

    public async startSuperSpin() {
        if ( this.spinRounds === 0 ) {
            this.controller.props['superSpin']['particle'].component.resetSystem();
            this.content.node.active = true;
            await Utils.tweenAlpha(this.preMessage.node, true, 0.1);
            this.preMessage.node.active = false;
        }

        await this.countSpinRounds();
    }
}