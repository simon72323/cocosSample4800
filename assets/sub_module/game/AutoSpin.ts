import { _decorator, Button, Component, Node, Label, Color, utils, Sprite } from 'cc';
import { switchButton } from '../utils/SwitchButton/switchButton';
import { LanguageLabel } from './Language/LanguageLabel';
import { dropDown } from '../utils/DropDown/dropDown';
import { Utils, DATA_TYPE } from '../utils/Utils';
import { Controller } from './machine/controller_folder/Controller';
import { Machine } from './machine/Machine';
import { SoundManager } from './machine/SoundManager';
const { ccclass, property } = _decorator;

@ccclass('AutoSpin')
export class AutoSpin extends Component {

    @property({type:Color, displayName:'開啟中顯示顏色', group:{name:'Spin Times', id:"0"}})
    public activeSpinTimesColor = new Color(255, 255, 255, 255);

    @property({type:Color, displayName:'關閉中顯示顏色', group:{name:'Spin Times', id:"0"}})
    public nonActiveSpinTimesColor = new Color(255, 255, 255, 255);

    private readonly initData = {
        'autoSpin' : {
            'close'     : { [DATA_TYPE.TYPE] : Button,        [DATA_TYPE.NODE_PATH] : 'Background/Close', [DATA_TYPE.CLICK_EVENT]: this.closeUI  },
            'start'     : { [DATA_TYPE.TYPE] : Button,        [DATA_TYPE.NODE_PATH] : 'Background/Start', [DATA_TYPE.CLICK_EVENT]: this.clickStart  },
        },
        'spinTimes'     : {
            'switch'    : { [DATA_TYPE.TYPE] : switchButton,  [DATA_TYPE.NODE_PATH] : 'Background/Spin Times/SwitchButton' },
            'label'     : { [DATA_TYPE.TYPE] : LanguageLabel, [DATA_TYPE.NODE_PATH] : 'Background/Spin Times/Label' },
            'dropdown'  : { [DATA_TYPE.TYPE] : dropDown,      [DATA_TYPE.NODE_PATH] : 'Background/Spin Times/DropDown'},
            'display'   : { [DATA_TYPE.TYPE] : Label,         [DATA_TYPE.NODE_PATH] : 'Background/Spin Times/DropDown/Display Item/Label'},
        },

        'untilFeature'  : {
            'switch'    : { [DATA_TYPE.TYPE] : switchButton,  [DATA_TYPE.NODE_PATH] : 'Background/Settings/UNTIL FEATURE/SwitchButton'},
            'label'     : { [DATA_TYPE.TYPE] : LanguageLabel, [DATA_TYPE.NODE_PATH] : 'Background/Settings/UNTIL FEATURE' },
        },

        'quickSpin'     : {
            'switch'    : { [DATA_TYPE.TYPE] : switchButton,  [DATA_TYPE.NODE_PATH] : 'Background/Settings/QUICK SPIN/SwitchButton'},
            'label'     : { [DATA_TYPE.TYPE] : LanguageLabel, [DATA_TYPE.NODE_PATH] : 'Background/Settings/QUICK SPIN' },
        },
        
        'turboSpin'     : {
            'switch'    : { [DATA_TYPE.TYPE] : switchButton,  [DATA_TYPE.NODE_PATH] : 'Background/Settings/TURBO SPIN/SwitchButton'},
            'label'     : { [DATA_TYPE.TYPE] : LanguageLabel, [DATA_TYPE.NODE_PATH] : 'Background/Settings/TURBO SPIN' },
        },
    };

    private properties = {
        'machine' : null,
        'autoSpin' :{
            active          : false, // 目前是否開啟
            spinTimeActive  : true,  // 是否開啟spinTime
            spinTimes       : 10,    // 目前的剩餘次數
            untilFeature    : false,  // 是否開啟直到特定feature
        },

        'repeatAuto' : {},
    };

    public static isActive() : boolean { return AutoSpin.Instance.active === true; }
    public get active() : boolean { return this.properties.autoSpin.active; }
    private set active(value:boolean) { this.properties.autoSpin.active = value; }

    public get machine() : Machine { return Machine.Instance; }

    /** 開啟 AutoSpin 後的Spin按鈕 */
    public get autoSpinButton() : Button { return this.machine.controller.autoSpinButton; }

    /** 開啟 AutoSpin 後的次數顯示 Label */
    public get autoSpinTimeLabel() : Label { return this.machine.controller.autoSpinLabel; }

    public static Instance: AutoSpin = null;
    protected onLoad(): void {
        this.node.active = false;
        this.node.setPosition(0,0,0);
        AutoSpin.Instance = this;
        this.init();
    }

    protected start(): void {
        this.properties.machine = Machine.Instance;
        // this.properties['spinTimes']['display'][DATA_TYPE.COMPONENT].color = this.nonActiveSpinTimesColor
    }

    private init() {
        Utils.initData(this.initData, this);
    }

    public closeUI() { 
        if ( this.node.active === false ) return;
        this.updateRepeatAutoData();
        this.refreshRepeatAutoButton();
        this.activeUI(false); 
        SoundManager.PlayButtonSound();
    }
    public async openUI() { 
        console.log('openUI step 1');
        if ( this.machine.isBusy ) return;
        Utils.GoogleTag('OpenAutoSpin', {'event_category':'AutoSpin', 'event_label':'OpenAutoSpin' });
        console.log('openUI step 2');
        await this.activeUI(true);
        /*
        if ( this.properties['onloadDone'] !== true ) {
            this.properties['turboSpin']['switch'][DATA_TYPE.COMPONENT].switch(true);
            this.switchTurboSpin(true);
        } else {
            this.changeSpeedMode(this.machine.SpeedMode); 
        }*/
        this.changeSpeedMode(this.machine.SpeedMode); 
        // this.properties['spinTimes'].switch[DATA_TYPE.COMPONENT].switch(false);
        this.properties['onloadDone'] = true;
    }

    public static OpenUI() { AutoSpin.Instance.openUI(); }
    public static CloseUI() { AutoSpin.Instance.closeUI(); }

    public async activeUI(active:boolean) {
        console.log('openUI activeUI step 1');
        if ( this.node.active === active ) return;
        console.log('openUI activeUI step 2');
        return await Utils.commonActiveUITween(this.node, active);
    }

    public switchSpinTimes(active:boolean) {
        if ( this.properties['onloadDone'] !== true ) return;

        SoundManager.PlayButtonSound();
        if ( active === true ) this.properties['spinTimes']['display'][DATA_TYPE.COMPONENT].color = this.activeSpinTimesColor;
        else this.properties['spinTimes']['display'][DATA_TYPE.COMPONENT].color = this.nonActiveSpinTimesColor
    }

    public swichUntilFeature(active:boolean) {
        SoundManager.PlayButtonSound();
    }

    public switchQuickSpin(active:boolean) {
        SoundManager.PlayButtonSound();
        if ( active === true ) return Controller.ChangeSpeedMode(Machine.SPIN_MODE.QUICK);
        if ( this.machine.SpeedMode === Machine.SPIN_MODE.QUICK ) return Controller.ChangeSpeedMode(Machine.SPIN_MODE.NORMAL);
    }

    public switchTurboSpin(active:boolean) {
        SoundManager.PlayButtonSound();
        if ( active === true ) return Controller.ChangeSpeedMode(Machine.SPIN_MODE.TURBO);
        if ( this.machine.SpeedMode === Machine.SPIN_MODE.TURBO ) return Controller.ChangeSpeedMode(Machine.SPIN_MODE.NORMAL);
    }

    public changeSpeedMode(mode:number) {
        let type = Machine.SPIN_MODE;
        switch(mode) {
            case type.QUICK:  
                this.initData.turboSpin.switch[DATA_TYPE.COMPONENT].switch(false); 
                this.initData.quickSpin.switch[DATA_TYPE.COMPONENT].switch(true);
                break;
            case type.TURBO:  
                this.initData.quickSpin.switch[DATA_TYPE.COMPONENT].switch(false);
                this.initData.turboSpin.switch[DATA_TYPE.COMPONENT].switch(true); 
                break;
            default:
                this.initData.quickSpin.switch[DATA_TYPE.COMPONENT].switch(false);
                this.initData.turboSpin.switch[DATA_TYPE.COMPONENT].switch(false);
                break;
        }
    }

    public static ChangeSpeedMode(mode:number) { AutoSpin.Instance.changeSpeedMode(mode); }

    public dropDownSpinTimes(item, itemName, idx, customData, customEventData) {
        this.initData.spinTimes.switch[DATA_TYPE.COMPONENT].switch(true);
        this.switchSpinTimes(true);
    }

    public defaultRepeatAutoData() {
        const repeatAutoData = this.repeatAutoData;
        repeatAutoData.enable       = true;
        repeatAutoData.times        = 10;
        repeatAutoData.untilFeature = false;
        this.refreshRepeatAutoButton();
    }

    public updateRepeatAutoData() {
        const spinTimesData                = this.properties['spinTimes'].dropdown[DATA_TYPE.COMPONENT].getPickData();
        const spinTimeActive      :boolean = this.properties['spinTimes'].switch[DATA_TYPE.COMPONENT].Active;
        const spinTimes           :number  = parseInt(spinTimesData.customData);
        const untilFeatureActive  :boolean = this.properties['untilFeature'].switch[DATA_TYPE.COMPONENT].Active;
        const repeatAutoData = this.repeatAutoData;

        if (spinTimeActive)     repeatAutoData.times = spinTimes;
        else                   repeatAutoData.times  = 0;
        repeatAutoData.untilFeature                  = untilFeatureActive;
    }

    public async clickStart() {
        this.closeUI();
        if ( this.machine.isBusy ) return;

        const spinTimesData                = this.properties['spinTimes'].dropdown[DATA_TYPE.COMPONENT].getPickData();
        const spinTimeActive      :boolean = this.properties['spinTimes'].switch[DATA_TYPE.COMPONENT].Active;
        const untilFeatureActive  :boolean = this.properties['untilFeature'].switch[DATA_TYPE.COMPONENT].Active;
        const spinTimes           :number  = parseInt(spinTimesData.customData);
        const active              = (spinTimeActive || untilFeatureActive);
        
        if ( active === false ) return;
        if ( await this.machine.checkCredit(true) === false ) return;
        const autoSpin = this.properties.autoSpin;
        this.active             = active;
        autoSpin.spinTimeActive = spinTimeActive;
        autoSpin.spinTimes      = spinTimes;
        autoSpin.untilFeature   = untilFeatureActive;

        this.updateRepeatAutoData();

        Utils.GoogleTag('StartAutoSpin', {
            'event_category' :'AutoSpin', 
            'event_label'    :'StartAutoSpin', 
            'spinTimes'      : spinTimes,
            'untilFeature'   : +untilFeatureActive,
        });
        this.refreshRepeatAutoButton();
        this.decrementCount();
        SoundManager.PlayButtonSound();
    }

    public static IsUtilFeature() : boolean {
        if ( this.Instance.active === false ) return false;
        return this.Instance.properties.autoSpin.untilFeature;
    }

    /**
     * 是否要繼續AutoSpin
     * @returns 
     */
    public async decrementCount() : Promise<boolean> {
        if ( this.machine.featureGame ) return false;
        if ( this.machine.spinning ) return false;

        if ( this.active === false ) {
            this.closeAutoSpinTimes();
            return false;
        }
        
        const autoSpin = this.properties.autoSpin;

        if ( autoSpin.spinTimeActive === true ) {
            if ( autoSpin.spinTimes > 0 ) {
                autoSpin.spinTimes--;
                await this.autoSpinTimes(autoSpin.spinTimes);
                this.machine.controller.clickSpin(true);
                if ( autoSpin.spinTimes === 0 ) this.active = false;
                return true;
            } else if ( autoSpin.spinTimes === -1 ) {
                await this.autoSpinTimes(autoSpin.spinTimes);
                this.machine.controller.clickSpin(true);
                return true;
            }
        } 
        
        if ( autoSpin.untilFeature === true ) {
            await this.autoSpinTimes(autoSpin.spinTimes, true);
            this.machine.controller.clickSpin(true);
            return true;
        }

        this.stopAutoSpin();
        return false;
    }

    public async autoSpinTimes(times:number, isUntilFeature:boolean=false) {
        let spinTimeStr;
        const superMode = this.machine.SpeedMode === Machine.SPIN_MODE.SUPER;
        if ( times === -1 ) spinTimeStr = '∞';
        else if ( isUntilFeature ) spinTimeStr = '';
        else spinTimeStr = times.toString();

        if ( this.autoSpinButton.node.active === true && !superMode ) {
            await Utils.commonActiveUITween(this.autoSpinButton.node, false, true, 0.2);
        }

        this.autoSpinButton.node.active = true;
        this.autoSpinTimeLabel.string = spinTimeStr;
        if (!superMode) await Utils.commonActiveUITween(this.autoSpinButton.node, true, true, 0.2);
    }

    public static async AutoSpinTimes(times:number, isUntilFeature:boolean=false) { return AutoSpin.Instance.autoSpinTimes(times, isUntilFeature); }

    public closeAutoSpinTimes() { this.autoSpinButton.node.active = false; }

    public static CloseAutoSpinTimes() { AutoSpin.Instance.closeAutoSpinTimes(); }

    /**
     * 停止AutoSpin
     * @from Controller initData['autoSpin']['button']
     */
    public static StopAutoSpin(force=false) { AutoSpin.Instance.stopAutoSpin(force); }

    public stopAutoSpin(force:boolean=false) {
        if ( this.machine.featureGame && force === false ) return false;
        if ( this.enabled === false )   return false;

        Utils.GoogleTag('StopAutoSpin', {'event_category':'AutoSpin', 'event_label':'StopAutoSpin'});
        this.closeAutoSpinTimes();
        this.autoSpinTimeLabel.string = '';
        this.active = false;
        return true;
    }

    public static StopSpinByUtilFeature() { return AutoSpin.Instance.stopSpinByUtilFeature(); }

    public stopSpinByUtilFeature() :boolean {
        if ( this.active !== true ) return false;
        if ( this.properties.autoSpin.untilFeature !== true ) return false;
        this.active = false;
        return true;
    }

    //#region [rgba(0,0,0,0)] Repeat Auto Button

    public get repeatAutoLabel() : Label { return this.properties['repeatAuto']['label']['component']; }
    public get repeatAutoButton() : Button { return this.properties['repeatAuto']['button']['component']; }
    public get repeatAutoUntilFeature() : Node { return this.properties['repeatAuto']['untilFeature']['node']; }
    public get repeatAutoData() : any { return this.properties['repeatAuto']['data']; }


    public static InitRepeatAutoButton(repeatAutoButton:Node) { AutoSpin.Instance.initRepeatAutoButton(repeatAutoButton); }

    private initRepeatAutoButton(repeatAutoButton:Node) {
        const button       = repeatAutoButton.getComponent(Button);
        const label        = repeatAutoButton.getComponentInChildren(Label);
        const untilFeature = repeatAutoButton.getChildByPath('enable/until feature');
        const enableImg    = repeatAutoButton.getChildByName('enable');
        const disableImg   = repeatAutoButton.getChildByName('disable');
        console.log('untilFeature', untilFeature, repeatAutoButton);

        let repeatAuto = {
            'activeImg' : {
                'enable' : {
                    [DATA_TYPE.TYPE] : Node,
                    [DATA_TYPE.NODE] : enableImg,
                    'component' : enableImg,
                    'node' : enableImg,
                },

                'disable' : {
                    [DATA_TYPE.TYPE] : Sprite,
                    [DATA_TYPE.NODE] : disableImg,
                    [DATA_TYPE.COMPONENT] : disableImg.getComponent(Sprite),
                    'component' : disableImg.getComponent(Sprite),
                    'node' : disableImg
                }
            },
            'button' : {
                [DATA_TYPE.TYPE]        : Button,
                [DATA_TYPE.NODE_PATH]   : repeatAutoButton.getPathInHierarchy(),
                [DATA_TYPE.CLICK_EVENT] : this.clickRepeatAuto.bind(this),
                [DATA_TYPE.NODE]        : repeatAutoButton,
                'component'             : button,
                'node'                  : repeatAutoButton,
            },

            'label' : {
                [DATA_TYPE.TYPE] : Label,
                [DATA_TYPE.NODE_PATH] : 'Label',
                [DATA_TYPE.NODE] : label.node,
                'component' : label,
                'node' : label.node
            },

            'untilFeature' : {
                [DATA_TYPE.TYPE] : Node,
                [DATA_TYPE.NODE_PATH] : untilFeature.getPathInHierarchy(),
                [DATA_TYPE.NODE] : untilFeature,
                'node' : untilFeature,
            },

            'data' : {
                'enable' : false,
                'times'  : 0,
                'untilFeature' : false,
            },
        };
        this.properties['repeatAuto'] = repeatAuto;
        this.refreshRepeatAutoButton();
    }

    public refreshRepeatAutoButton() {
        let  enable         = !this.machine.isBusy;
        const times         = this.repeatAutoData.times;
        const untilFeature  = this.repeatAutoData.untilFeature;

        let active = false;
        if ( times !== 0 || untilFeature )      active = true;

        if ( enable === true ) {
            if ( times === 0 && !untilFeature ) enable = false;
            if ( active === false )             enable = false;
        }

        if ( times === 0 && untilFeature ) this.repeatAutoLabel.string = 'UF';
        else if ( times === 0 )  this.repeatAutoLabel.string = '';
        else if ( times === -1 ) this.repeatAutoLabel.string = '∞';
        else this.repeatAutoLabel.string    = times.toString();
        //else this.repeatAutoLabel.string    = Utils.changeUnit(times);

        this.repeatAutoUntilFeature.active  = untilFeature;
        this.repeatAutoButton.interactable  = enable;

        this.properties['repeatAuto']['activeImg']['enable']['node'].active  = active;
        this.properties['repeatAuto']['activeImg']['disable']['node'].active = !active;
        return enable;
    }

    public clickRepeatAuto() {
        if ( this.machine.isBusy ) return;
        if ( this.refreshRepeatAutoButton() === false ) return;

        const autoSpin           = this.properties.autoSpin;
        const spinTimes          = this.repeatAutoData.times;
        const untilFeatureActive = this.repeatAutoData.untilFeature;

        this.active              = true;
        autoSpin.spinTimes       = spinTimes;
        autoSpin.untilFeature    = untilFeatureActive;
        autoSpin.spinTimeActive  = (spinTimes > 0 || spinTimes === -1);

        Utils.GoogleTag('RepeatAuto', {
            'event_category' :'AutoSpin', 
            'event_label'    :'RepeatAuto', 
            'spinTimes'      : spinTimes,
            'untilFeature'   : +untilFeatureActive,
            'mode'           : this.machine.SpeedMode,
        });

        if ( this.machine.SpeedMode === Machine.SPIN_MODE.SUPER ) {
            Utils.GoogleTag('SuperSpin', {
                'event_category' :'AutoSpin', 
                'event_label'    :'RepeatAuto', 
                'spinTimes'      : spinTimes,
                'untilFeature'   : +untilFeatureActive,
            });
        }

        SoundManager.PlayButtonSound();
        this.decrementCount();
    }


    //#endregion Repeat Auto Button
}

