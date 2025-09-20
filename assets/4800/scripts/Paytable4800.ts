import { _decorator, Label, Node, EventTarget, Vec3, tween, instantiate, Color, sp, Button, Animation, Sprite, ParticleSystem2D, AudioSource } from 'cc';
import { Payline }          from '../../sub_module/game/machine/pay/Payline';
import { Utils, DATA_TYPE } from '../../sub_module/utils/Utils';
import { gameInformation }  from '../../sub_module/game/GameInformation';
import { Symbol }           from '../../sub_module/game/machine/Symbol';
import { ObjectPool }       from '../../sub_module/game/ObjectPool';
import { Wheel }            from '../../sub_module/game/machine/Wheel';
import { Machine }          from '../../sub_module/game/machine/Machine';
import { FreeGame }         from '../../sub_module/game/FeatureGame/FreeGame';
import { AutoSpin }         from '../../sub_module/game/AutoSpin';
import { Orientation, Viewport } from '../../sub_module/utils/Viewport';
import { EDITOR }           from 'cc/env';
import { PageManager }      from '../../sub_module/game/PageManager';
import { SoundManager }     from '../../sub_module/game/machine/SoundManager';
const { ccclass, property } = _decorator;

@ccclass('Paytable4800')
export class Paytable4800 extends Payline {
    protected payLineData = [
        [1,1,1,1,1], [0,0,0,0,0], [2,2,2,2,2], [0,1,2,1,0], [2,1,0,1,2], [0,0,1,2,2], [2,2,1,0,0], [1,0,1,2,1], [1,2,1,0,1], [0,1,1,1,2], 
        [2,1,1,1,0], [1,0,0,1,2], [1,2,2,1,0], [1,1,0,1,2], [1,1,2,1,0], [0,0,1,2,1], [2,2,1,0,1], [1,0,1,2,2], [1,2,1,0,0], [0,0,0,1,2],
        [2,2,2,1,0], [0,1,2,2,2], [2,1,0,0,0], [0,1,0,1,0], [2,1,2,1,2], [0,1,1,1,0], [2,1,1,1,2], [1,0,0,0,1], [1,2,2,2,1], [0,1,0,1,2],
    ];

    public readonly IS_TYPE_BLUE = 1;
    public readonly IS_TYPE_GREEN = 2;

    public readonly IS_READY_FULL_STATE = {
        NONE    : 0,
        BLUE    : this.IS_TYPE_BLUE,
        GREEN   : this.IS_TYPE_GREEN,
        BOTH    : 3,
        length  : 4,
    };

    protected readonly onloadData = {
        'freeGame' : {
            'background'       : { [DATA_TYPE.TYPE] : Node,        [DATA_TYPE.SCENE_PATH] : 'Canvas/Machine/Background/FG Background' },
            'endUISpine'       : { [DATA_TYPE.TYPE] : sp.Skeleton, [DATA_TYPE.SCENE_PATH] : 'Canvas/Other UI/FG End Game/content' },
            'buyFeatureButton' : { [DATA_TYPE.TYPE] : Button,  [DATA_TYPE.SCENE_PATH]     : 'Canvas/Machine/Buy Feature Game' },
            'addSpin'          : { [DATA_TYPE.TYPE] : sp.Skeleton, [DATA_TYPE.SCENE_PATH] : 'Canvas/Machine/Paytable/addSpin' },
            'scatterPlay'      : { [DATA_TYPE.TYPE] : Node, [DATA_TYPE.SCENE_PATH]        : 'Canvas/Machine/ScattrerPlay' }
        },

        'background' : {
            'spine'      : { [DATA_TYPE.TYPE] : sp.Skeleton, [DATA_TYPE.SCENE_PATH] : 'Canvas/Machine/Background/BG_Spine' },
            'buyFeature' : { [DATA_TYPE.TYPE] : sp.Skeleton, [DATA_TYPE.SCENE_PATH] : 'Canvas/Other UI/Buy Feature Game UI/Sprite' },
            'dust'       : { [DATA_TYPE.TYPE] : sp.Skeleton, [DATA_TYPE.SCENE_PATH] : 'Canvas/Dust Change FreeGame/Spine' },
            'dust-mask'  : { [DATA_TYPE.TYPE] : Sprite,      [DATA_TYPE.SCENE_PATH] : 'Canvas/Dust Change FreeGame/Mask' },
            'transfer'   : { [DATA_TYPE.TYPE] : sp.Skeleton, [DATA_TYPE.SCENE_PATH] : 'Canvas/Dust Change FreeGame/transfer' },
        },

        'energy' : {
            'nearmiss': { [DATA_TYPE.TYPE] : Node,  [DATA_TYPE.SCENE_PATH] : 'Canvas/Machine/Reel/energy nearmiss' },
            'blue'    : { [DATA_TYPE.TYPE] : Label, [DATA_TYPE.SCENE_PATH] : 'Canvas/Machine/Energy/Blue'  },
            'green'   : { [DATA_TYPE.TYPE] : Label, [DATA_TYPE.SCENE_PATH] : 'Canvas/Machine/Energy/Green' },
            'wheels'  : [1,3],                  // 手杖會出現的輪軸
            'symbols' : [11,10],                // 手杖SymbolID 藍,綠
            'wheelSymbolsID': [null,null],      // 輪軸上的能量Symbol

            'blueParticle'      : { [DATA_TYPE.TYPE] : Node,         [DATA_TYPE.SCENE_PATH] : 'Canvas/Machine/Energy/Blue/Particle2DGreen1' },
            'greenParticle'     : { [DATA_TYPE.TYPE] : Node,         [DATA_TYPE.SCENE_PATH] : 'Canvas/Machine/Energy/Green/Particle2Dred1'  },
            'spinTimesPopup'    : { [DATA_TYPE.TYPE] : Label,        [DATA_TYPE.SCENE_PATH] : 'Canvas/Machine/Energy/FreeSpin/Label'        },
            'pillar_blue_mg'    : { [DATA_TYPE.TYPE] : sp.Skeleton,  [DATA_TYPE.SCENE_PATH] : 'Canvas/Machine/Energy/Blue/pillar_mg_2'      },
            'pillar_green_mg'   : { [DATA_TYPE.TYPE] : sp.Skeleton,  [DATA_TYPE.SCENE_PATH] : 'Canvas/Machine/Energy/Green/pillar_mg_1'     },
            'pillar_blue_fg'    : { [DATA_TYPE.TYPE] : sp.Skeleton,  [DATA_TYPE.SCENE_PATH] : 'Canvas/Machine/Energy/Blue/pillar_fg_2'      },
            'pillar_green_fg'   : { [DATA_TYPE.TYPE] : sp.Skeleton,  [DATA_TYPE.SCENE_PATH] : 'Canvas/Machine/Energy/Green/pillar_fg_1'     },
            'pillar_blue_gem'   : { [DATA_TYPE.TYPE] : sp.Skeleton,  [DATA_TYPE.SCENE_PATH] : 'Canvas/Machine/Energy/Blue/Gem'              },
            'pillar_green_gem'  : { [DATA_TYPE.TYPE] : sp.Skeleton,  [DATA_TYPE.SCENE_PATH] : 'Canvas/Machine/Energy/Green/Gem'             },
            'greenBoard'        : { [DATA_TYPE.TYPE] : Node,         [DATA_TYPE.SCENE_PATH] : 'Canvas/Other UI/Energy Board/Green'          },
            'blueBoard'         : { [DATA_TYPE.TYPE] : Node,         [DATA_TYPE.SCENE_PATH] : 'Canvas/Other UI/Energy Board/Red'            },
            'bothBoard'         : { [DATA_TYPE.TYPE] : Node,         [DATA_TYPE.SCENE_PATH] : 'Canvas/Other UI/Energy Board/Both'           },
            'spinButton'        : { [DATA_TYPE.TYPE] : Node,         [DATA_TYPE.SCENE_PATH] : 'Canvas/Controller/Bottom Buttons/Spin'       },
        },

        'paytable' : {
            'reel' : {[DATA_TYPE.TYPE] : sp.Skeleton, [DATA_TYPE.SCENE_PATH]   : 'Canvas/Machine/Reel/[Spine]frame' },
            '0' : {[DATA_TYPE.TYPE] : sp.Skeleton, [DATA_TYPE.SCENE_PATH] : 'Canvas/Machine/Reel/payline/0' },
            '1' : {[DATA_TYPE.TYPE] : sp.Skeleton, [DATA_TYPE.SCENE_PATH] : 'Canvas/Machine/Reel/payline/1' },
            '2' : {[DATA_TYPE.TYPE] : sp.Skeleton, [DATA_TYPE.SCENE_PATH] : 'Canvas/Machine/Reel/payline/2' },
            '3' : {[DATA_TYPE.TYPE] : sp.Skeleton, [DATA_TYPE.SCENE_PATH] : 'Canvas/Machine/Reel/payline/3' },
            '4' : {[DATA_TYPE.TYPE] : sp.Skeleton, [DATA_TYPE.SCENE_PATH] : 'Canvas/Machine/Reel/payline/4' },
            '5' : {[DATA_TYPE.TYPE] : sp.Skeleton, [DATA_TYPE.SCENE_PATH] : 'Canvas/Machine/Reel/payline/5' },
            '6' : {[DATA_TYPE.TYPE] : sp.Skeleton, [DATA_TYPE.SCENE_PATH] : 'Canvas/Machine/Reel/payline/6' },
            '7' : {[DATA_TYPE.TYPE] : sp.Skeleton, [DATA_TYPE.SCENE_PATH] : 'Canvas/Machine/Reel/payline/7' },
            '8' : {[DATA_TYPE.TYPE] : sp.Skeleton, [DATA_TYPE.SCENE_PATH] : 'Canvas/Machine/Reel/payline/8' },
            '9' : {[DATA_TYPE.TYPE] : sp.Skeleton, [DATA_TYPE.SCENE_PATH] : 'Canvas/Machine/Reel/payline/9' },
            '10': {[DATA_TYPE.TYPE] : sp.Skeleton, [DATA_TYPE.SCENE_PATH] : 'Canvas/Machine/Reel/payline/10' },
            '11': {[DATA_TYPE.TYPE] : sp.Skeleton, [DATA_TYPE.SCENE_PATH] : 'Canvas/Machine/Reel/payline/11' },
            '12': {[DATA_TYPE.TYPE] : sp.Skeleton, [DATA_TYPE.SCENE_PATH] : 'Canvas/Machine/Reel/payline/12' },
            '13': {[DATA_TYPE.TYPE] : sp.Skeleton, [DATA_TYPE.SCENE_PATH] : 'Canvas/Machine/Reel/payline/13' },
            '14': {[DATA_TYPE.TYPE] : sp.Skeleton, [DATA_TYPE.SCENE_PATH] : 'Canvas/Machine/Reel/payline/14' },
            '15': {[DATA_TYPE.TYPE] : sp.Skeleton, [DATA_TYPE.SCENE_PATH] : 'Canvas/Machine/Reel/payline/15' },
            '16': {[DATA_TYPE.TYPE] : sp.Skeleton, [DATA_TYPE.SCENE_PATH] : 'Canvas/Machine/Reel/payline/16' },
            '17': {[DATA_TYPE.TYPE] : sp.Skeleton, [DATA_TYPE.SCENE_PATH] : 'Canvas/Machine/Reel/payline/17' },
            '18': {[DATA_TYPE.TYPE] : sp.Skeleton, [DATA_TYPE.SCENE_PATH] : 'Canvas/Machine/Reel/payline/18' },
            '19': {[DATA_TYPE.TYPE] : sp.Skeleton, [DATA_TYPE.SCENE_PATH] : 'Canvas/Machine/Reel/payline/19' },
            '20': {[DATA_TYPE.TYPE] : sp.Skeleton, [DATA_TYPE.SCENE_PATH] : 'Canvas/Machine/Reel/payline/20' },
            '21': {[DATA_TYPE.TYPE] : sp.Skeleton, [DATA_TYPE.SCENE_PATH] : 'Canvas/Machine/Reel/payline/21' },
            '22': {[DATA_TYPE.TYPE] : sp.Skeleton, [DATA_TYPE.SCENE_PATH] : 'Canvas/Machine/Reel/payline/22' },
            '23': {[DATA_TYPE.TYPE] : sp.Skeleton, [DATA_TYPE.SCENE_PATH] : 'Canvas/Machine/Reel/payline/23' },
            '24': {[DATA_TYPE.TYPE] : sp.Skeleton, [DATA_TYPE.SCENE_PATH] : 'Canvas/Machine/Reel/payline/24' },
            '25': {[DATA_TYPE.TYPE] : sp.Skeleton, [DATA_TYPE.SCENE_PATH] : 'Canvas/Machine/Reel/payline/25' },
            '26': {[DATA_TYPE.TYPE] : sp.Skeleton, [DATA_TYPE.SCENE_PATH] : 'Canvas/Machine/Reel/payline/26' },
            '27': {[DATA_TYPE.TYPE] : sp.Skeleton, [DATA_TYPE.SCENE_PATH] : 'Canvas/Machine/Reel/payline/27' },
            '28': {[DATA_TYPE.TYPE] : sp.Skeleton, [DATA_TYPE.SCENE_PATH] : 'Canvas/Machine/Reel/payline/28' },
            '29': {[DATA_TYPE.TYPE] : sp.Skeleton, [DATA_TYPE.SCENE_PATH] : 'Canvas/Machine/Reel/payline/29' },
            // 'eventSpine' : {[DATA_TYPE.TYPE] : sp.Skeleton, [DATA_TYPE.SCENE_PATH] : 'Canvas/Machine/Paytable/Spine' },
        },
        'ui' : {
            // 顯示得獎分數
            'labelWinScore'       : { [DATA_TYPE.TYPE] : Label,  [DATA_TYPE.NODE_PATH]  : 'Paytable/labelWinScore/score' },
            'totalwinbg'          : { [DATA_TYPE.TYPE] : Sprite, [DATA_TYPE.SCENE_PATH] : 'Canvas/Machine/Paytable/labelWinScore/bg' },
            // 單項得獎分數
            'labelSingleWinScore' : { [DATA_TYPE.TYPE] : Label,  [DATA_TYPE.NODE_PATH]  : 'Paytable/labelSingleWinScore/score' },
        },
    };

    public get pillar_blue() : sp.Skeleton { 
        if ( this.machine.featureGame === true ) return this.properties['energy']['pillar_blue_fg'][DATA_TYPE.COMPONENT];
        return this.properties['energy']['pillar_blue_mg'][DATA_TYPE.COMPONENT]; 
    }
    public get pillar_green() : sp.Skeleton { 
        if ( this.machine.featureGame === true ) return this.properties['energy']['pillar_green_fg'][DATA_TYPE.COMPONENT];
        return this.properties['energy']['pillar_green_mg'][DATA_TYPE.COMPONENT]; 
    }

    public get spinTimesLabel() : Label { return this.properties['energy']['spinTimesPopup'][DATA_TYPE.COMPONENT]; }

    public get energyWheelIndex() : number[] { return this.onloadData['energy']['wheels']; }

    // 藍色能量Symbol ID
    public get BLUE_SYMBOL() : number { return this.properties['energy']['symbols'][0]; }

    // 綠色能量Symbol ID
    public get GREEN_SYMBOL() : number { return this.properties['energy']['symbols'][1]; }

    // 能量聽牌Node
    public get energyNearmiss() : Node { return this.properties['energy']['nearmiss'].node; }

    public get isPlayingEnergy() : boolean { return this.properties['energy']['isPlaying']; }

    public set isPlayingEnergy(isPlaying:boolean) { this.properties['energy']['isPlaying'] = isPlaying; }

    private get blueParticle() : Node { return this.properties['energy']['blueParticle'].node; }
    private get greenParticle() : Node { return this.properties['energy']['greenParticle'].node; }

    private get addSpinSpine() : sp.Skeleton { return this.properties['freeGame']['addSpin'][DATA_TYPE.COMPONENT]; }

    private get bluePos() : Vec3 { return this.blueParticle.worldPosition.clone(); }
    private get greenPos() : Vec3 { return this.greenParticle.worldPosition.clone(); }

    private get reelSpine() : sp.Skeleton { return this.properties['paytable']['reel'][DATA_TYPE.COMPONENT]; }

    private get bgSpine() : sp.Skeleton { return this.properties['background']['spine'][DATA_TYPE.COMPONENT]; }

    private get dust() : sp.Skeleton { return this.properties['background']['dust'][DATA_TYPE.COMPONENT]; }

    private get spinButton() : Node { return this.properties['energy']['spinButton'][DATA_TYPE.COMPONENT]; }

    public sfx_readyhead : AudioSource = null;
    // 顯示能量 Nearmiss
    public async activeEnergyNearmiss(active:boolean) { 
        if ( this.isPlayingEnergy === true && active === true ) return;
        if ( active === true ) this.reelSpine.setAnimation(0, 'near_miss', true);
        else this.reelSpine.setAnimation(0, 'idle', true);

        if ( active === true && ( this.sfx_readyhead == null || this.sfx_readyhead.playing === false) ) {
            this.sfx_readyhead = SoundManager.PlaySoundByID('sfx_readyhead');
        }
        this.energyNearmiss.active = active; 
    }

    public static Instance : Paytable4800 = null;

    protected onload() { 
        Paytable4800.Instance = this;
        Utils.initData(this.onloadData, this);
        this.typeBoard[ this.IS_READY_FULL_STATE.BLUE ]  = this.properties['energy']['blueBoard'][DATA_TYPE.COMPONENT];
        this.typeBoard[ this.IS_READY_FULL_STATE.GREEN ] = this.properties['energy']['greenBoard'][DATA_TYPE.COMPONENT];
        this.typeBoard[ this.IS_READY_FULL_STATE.BOTH ]  = this.properties['energy']['bothBoard'][DATA_TYPE.COMPONENT];

        this.activeEnergyNearmiss(false);
        this.spinTimesLabel.string = '';
        this.properties['background']['dust-mask'].node.active = true;
        this.properties['ui']['totalwinbg'].node.active = false;
        return; 
    }

    /** 
     * wild pos 位置對應表, pos: [wheelID, index, worldPosition:Vec3]  
     */
    private WHEEL_POS : any = { 
         0: [ 0,0,null ],  1: [ 0,1,null ],  2: [ 0,2,null ],
         3: [ 1,0,null ],  4: [ 1,1,null ],  5: [ 1,2,null ],
         6: [ 2,0,null ],  7: [ 2,1,null ],  8: [ 2,2,null ],
         9: [ 3,0,null ], 10: [ 3,1,null ], 11: [ 3,2,null ],
        12: [ 4,0,null ], 13: [ 4,1,null ], 14: [ 4,2,null ],
    };

// region 位置資料
    private LandscapePosData = {
        "0": [
            0,
            0,
            {
                "x": 365.023,
                "y": 507.13,
                "z": 0
            }
        ],
        "1": [
            0,
            1,
            {
                "x": 365.023,
                "y": 367.13,
                "z": 0
            }
        ],
        "2": [
            0,
            2,
            {
                "x": 365.023,
                "y": 227.13,
                "z": 0
            }
        ],
        "3": [
            1,
            0,
            {
                "x": 505.023,
                "y": 507.13,
                "z": 0
            }
        ],
        "4": [
            1,
            1,
            {
                "x": 505.023,
                "y": 367.13,
                "z": 0
            }
        ],
        "5": [
            1,
            2,
            {
                "x": 505.023,
                "y": 227.13,
                "z": 0
            }
        ],
        "6": [
            2,
            0,
            {
                "x": 645.023,
                "y": 507.13,
                "z": 0
            }
        ],
        "7": [
            2,
            1,
            {
                "x": 645.023,
                "y": 367.13,
                "z": 0
            }
        ],
        "8": [
            2,
            2,
            {
                "x": 645.023,
                "y": 227.13,
                "z": 0
            }
        ],
        "9": [
            3,
            0,
            {
                "x": 785.023,
                "y": 507.13,
                "z": 0
            }
        ],
        "10": [
            3,
            1,
            {
                "x": 785.023,
                "y": 367.13,
                "z": 0
            }
        ],
        "11": [
            3,
            2,
            {
                "x": 785.023,
                "y": 227.13,
                "z": 0
            }
        ],
        "12": [
            4,
            0,
            {
                "x": 925.023,
                "y": 507.13,
                "z": 0
            }
        ],
        "13": [
            4,
            1,
            {
                "x": 925.023,
                "y": 367.13,
                "z": 0
            }
        ],
        "14": [
            4,
            2,
            {
                "x": 925.023,
                "y": 227.13,
                "z": 0
            }
        ]
    };
    private PortraitPosData = {
        "0": [
            0,
            0,
            {
                "x": 80.02300000000002,
                "y": 647.13,
                "z": 0
            }
        ],
        "1": [
            0,
            1,
            {
                "x": 80.02300000000002,
                "y": 507.13,
                "z": 0
            }
        ],
        "2": [
            0,
            2,
            {
                "x": 80.02300000000002,
                "y": 367.13,
                "z": 0
            }
        ],
        "3": [
            1,
            0,
            {
                "x": 220.02300000000002,
                "y": 647.13,
                "z": 0
            }
        ],
        "4": [
            1,
            1,
            {
                "x": 220.02300000000002,
                "y": 507.13,
                "z": 0
            }
        ],
        "5": [
            1,
            2,
            {
                "x": 220.02300000000002,
                "y": 367.13,
                "z": 0
            }
        ],
        "6": [
            2,
            0,
            {
                "x": 360.023,
                "y": 647.13,
                "z": 0
            }
        ],
        "7": [
            2,
            1,
            {
                "x": 360.023,
                "y": 507.13,
                "z": 0
            }
        ],
        "8": [
            2,
            2,
            {
                "x": 360.023,
                "y": 367.13,
                "z": 0
            }
        ],
        "9": [
            3,
            0,
            {
                "x": 500.023,
                "y": 647.13,
                "z": 0
            }
        ],
        "10": [
            3,
            1,
            {
                "x": 500.023,
                "y": 507.13,
                "z": 0
            }
        ],
        "11": [
            3,
            2,
            {
                "x": 500.023,
                "y": 367.13,
                "z": 0
            }
        ],
        "12": [
            4,
            0,
            {
                "x": 640.023,
                "y": 647.13,
                "z": 0
            }
        ],
        "13": [
            4,
            1,
            {
                "x": 640.023,
                "y": 507.13,
                "z": 0
            }
        ],
        "14": [
            4,
            2,
            {
                "x": 640.023,
                "y": 367.13,
                "z": 0
            }
        ]
    };
// endregion
    private initWheelPos() {
        const wheels : Wheel[] = this.reel.getWheels();
        const keys = Object.keys(this.WHEEL_POS);
        for(let i=0;i<keys.length;i++) {
            let pos = this.WHEEL_POS[i];
            pos[2] = wheels[pos[0]].getSymbol(pos[1]).worldPosition.clone();
        }
    }

    private mergeEnergyData() {
        const energyData = gameInformation?.userData?.['simulator_data'];
        if ( energyData == null ) return;

        const keys = Object.keys(energyData);
        let data = this.properties['energyBetData'];

        for(let i=0;i<keys.length;i++) {
            let key = keys[i];
            let bet = Number.parseInt(key);
            data[bet] = energyData[key];
        }

        console.log('mergeEnergyData', data);
        this.displayEnergy(true);
    }

    public enterGame() { 
        this.initEnergyData();
        this.initWheelPos();
        
        this.mergeEnergyData();
        this.keeperSymbolIdle(0);
        this.screenRotation(Viewport.Orientation);
        this.reel.putReelSymbol([[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1]]);
        this.openGame();
    }

    public async openGame() {
        const duskMask = this.properties['background']['dust-mask'];
        const bg = this.bgSpine.node.parent;
        const energy = this.properties['energy']['blue'].node.parent;

        SoundManager.PlaySoundByID('2');
        this.reel.node.getComponent(Sprite).color = new Color(255,255,255,0);
        this.controller.node.getComponent(Sprite).color = new Color(255,255,255,0);
        energy.getComponent(Sprite).color = new Color(255,255,255,0);
        bg.scale = new Vec3(1.2,1.2,1.2);
        duskMask.node.active = true;
        Utils.playSpine(this.dust, 'in', false); 
        await Utils.delay(800);
        Utils.commonFadeIn(duskMask.node, false, [Color.BLACK, new Color(0,0,0,0) ], duskMask.component, 0.3);
        await Utils.delay(300);
        Utils.tweenScale(bg, 1);
        Utils.tweenAlpha(this.reel.node, false, 1);
        Utils.tweenAlpha(this.controller.node, false, 1);
        Utils.tweenAlpha(energy, false, 1);
        SoundManager.Instance.defaultMusicId = 'bgm_mg';
        await Utils.delay(300).then(() => { SoundManager.PlayMusic('bgm_mg'); });
    }

    private scatterAudioID = [ null, 'sfx_sym_sc_1', 'sfx_sym_sc_2', 'sfx_sym_sc_3', 'sfx_sym_sc_4', 'sfx_sym_sc_5', ];
    private scatters = [];
    public showDropSymbol(wheelID: number, symbol: Symbol): boolean {
        if ( symbol == null ) return false;
        if ( symbol.symID === 9 ) {
            this.scatterShowDrop(wheelID, symbol);
            return false;
        }

        if ( symbol.symID !== 10 && symbol.symID !== 11 ) return false;
        SoundManager.PlaySoundByID('sfx_sym_fu');
        symbol.spine.setAnimation(0, 'play', false);
    }

    public async scatterShowDrop(wheelID: number, symbol:Symbol) {
        if ( symbol.symID !== 9 ) return;
        
        this.scatters.push(symbol);
        switch(wheelID) {
            case 3:
                if ( this.scatters.length <= 1 ) return false;
                break;
            case 4:
                if ( this.scatters.length <= 2 ) return false;
                break;
        }

        SoundManager.PlaySoundByID(this.scatterAudioID[this.scatters.length]);
        symbol.spine.setAnimation(0, 'near miss', false);
        symbol.spine.addAnimation(0, 'idle', false);
        await Utils.tweenScale(symbol.node, 1.5, 0.4);
        await Utils.tweenScale(symbol.node, 1, 0.2);
    }

    /**
     * 送出 Spin 指令前，更新能量資料
     * @returns 
     */
    public spinCommandBeforeEvent(): Promise<boolean> {
        this.properties['freeGame']['buyFeatureButton'].node.getComponent(Sprite).color = new Color(255,255,255,128);
        this.scatters = [];
        this.closePayline();
        return super.spinCommandBeforeEvent();
    }

    /**
     **  取得 Spin 封包後，處理能量相關資料
     */
    public spinResult ( result ) {
        this.reckonEnergyReel(result['main_game']['game_result']); // 計算能量輪軸
        this.setBetEnergy();
        return super.spinResult(result);
    }

    public reckonGemInfo(game_result:any) {
        if ( game_result['energy'] != null ) return game_result['energy'];

        const extra = game_result?.['extra'];
        const gem_game_result = extra?.['gem_game_result'];
        const data = gem_game_result?.[0];
        if ( data == null ) return null;

        const gem_info = this.getGameInfo(data['gem_info']);
        game_result['energy'] = gem_info;
        return gem_info;
    }

    /**
     * 檢查是否有能量輪軸
     * @param reel 
     */
    public reckonEnergyReel(reel:any) {
        // console.log('reckonEnergyReel', reel);
        const energyWheels  = this.properties['energy']['wheels'];  // 手杖會出現的輪軸
        const energySymbol  = this.properties['energy']['symbols']; // 手杖SymbolID 藍,綠
        const wheel1        = reel[energyWheels[0]];
        const wheel2        = reel[energyWheels[1]];
        let result          = [null, null];

        if ( wheel1.includes(energySymbol[0]) )      result[0] = energySymbol[0];
        else if ( wheel1.includes(energySymbol[1]) ) result[0] = energySymbol[1];

        if ( wheel2.includes(energySymbol[0]) )      result[1] = energySymbol[0];
        else if ( wheel2.includes(energySymbol[1]) ) result[1] = energySymbol[1];
        
        if ( result[0] == null && result[1] == null ) result = null;
        this.properties['energy']['wheelSymbolsID'] = result;
        return result;
    }

    public changeTotalBet( totalBet: number ) { this.displayEnergy(true); }

    /**
     * 取得輪軸上的能量SymbolID
     */
    public getEnergySymbolID() : number[] { return this.properties['energy']['wheelSymbolsID']; }

    /**
     * 取得輪軸上的能量Symbol
     * @returns Node [ 左邊輪軸上的手杖Node, 右邊輪軸上的手杖Node ]
     */
    public reckonWheelEnergySymbol_old() : Node[] | null {
        // this.properties['energy']['wheelSymbols'] = null;                       // 先清空資料
        let eSymbols = [null,null];
        const energySymbolID = this.getEnergySymbolID();
        if ( energySymbolID == null ) return null;

        const wheels = this.reel.getWheels();
        const energyWheels  = this.onloadData['energy']['wheels'];  // 手杖會出現的輪軸
        if ( energySymbolID[0] != null ) eSymbols[0] = wheels[energyWheels[0]].getSymbolByID(energySymbolID[0])?.[0];
        if ( energySymbolID[1] != null ) eSymbols[1] = wheels[energyWheels[1]].getSymbolByID(energySymbolID[1])?.[0];
        if ( eSymbols[0] == null && eSymbols[1] == null ) eSymbols = null;
        return eSymbols; 
    }
    /**
     * 取得輪軸上的能量Symbol
     * @returns Symbol [ 藍色[], 綠色[] ]
     */
    public reckonWheelEnergySymbol() : any[] | null {
        let blueSymbols : Symbol[]  = this.reel.getSymbolById(this.BLUE_SYMBOL);
        let greenSymbols : Symbol[] = this.reel.getSymbolById(this.GREEN_SYMBOL);
        let resultSymbols  = blueSymbols.concat(greenSymbols);
        if ( resultSymbols.length == 0 ) return null;

        return resultSymbols;
    }

    // 取得能量值
    public getBetEnergy(betIdx:number=null) :number[] | null {
        if (betIdx == null) betIdx = this.machine.controller.betIdx;

        let energy = this.properties['energyBetData'][betIdx];
        if ( energy[0] == null ) energy[0] = 0;
        if ( energy[1] == null ) energy[1] = 0;
        return energy;
    }

    public getEnergy(isTTB:boolean=false) :number[] | null {

        let energyData;
        if ( isTTB !== true ) {
            if ( !this.machine.spinData || !this.machine.spinData['extra'] ) return null;
            energyData = this.machine.spinData['extra']?.['user_data'];
        } else {
            let totalBet = this.machine.controller.totalBet;
            energyData = this.properties['energyBetData'][totalBet];
        }

        if ( energyData == null ) return [0, 0];
        
        const blue          = energyData['wildX2_gem'];
        const green         = energyData['random_wild_gem'];
        const energyBetData = [blue, green];
        if ( energyBetData == null ) return [0, 0];
        return energyBetData;
    }

    /**
     * 將目前 result 的 extra 資料記錄起來
     */
    public setBetEnergy() {
        const energyData    = this.machine.spinData['extra']?.user_data;
        if ( energyData == null ) return;

        const totalBet      = this.machine.controller.totalBet;
        this.properties['energyBetData'][totalBet] = energyData;
    }

    /** 是否準備好能量, 差一個就 return true
     * @param energySymbol 能量Symbol
     * @returns IS_READY_FULL_STATE 
    */
    public isReadyFullEnergy() :number {

        const gemInfo = this.reckonGemInfo(this.gameResult);
        if ( gemInfo == null ) return this.IS_READY_FULL_STATE.NONE;

        const blue  = gemInfo[this.BLUE_SYMBOL];
        const green = gemInfo[this.GREEN_SYMBOL];
        if ( blue == null && green == null ) return this.IS_READY_FULL_STATE.NONE;
        if ( blue != null && green != null ) return this.IS_READY_FULL_STATE.BOTH;
        if ( blue != null )                  return this.IS_READY_FULL_STATE.BLUE;
        if ( green != null )                 return this.IS_READY_FULL_STATE.GREEN;
        return this.IS_READY_FULL_STATE.NONE;
    }

    public async addSpinFly(life:Node) {
        if ( life == null ) return;

        const pos = life.worldPosition.clone();
        const toPos = this.spinButton.worldPosition.clone().add(new Vec3(Utils.Random(-50,50), Utils.Random(-50,50), 0));
        const addSpin = ObjectPool.Get('addSpin');
        const spine = addSpin.getComponent(sp.Skeleton);
        
        addSpin.setParent(this.spinButton);
        addSpin.worldPosition = pos;
        addSpin.active = true;
        addSpin.scale = Vec3.ONE;

        spine.setAnimation(0, 'in', false);
        spine.addAnimation(0, 'loop', false);
        await Utils.delay(100);
        SoundManager.PlaySoundByID('sfx_sym_ankh_coin_fly');
        Utils.tweenBezierCurve(addSpin, toPos, { duration:0.7 });
        await Utils.tweenScale(addSpin, 0.2, 1, { easing: 'quartOutIn' });
        SoundManager.PlaySoundByID('sfx_sym_ankh_coin_increase');
        await Utils.tweenScale(addSpin, 0.5, 0.5).then(async ()=>{ 
            await Utils.tweenScale(addSpin, 0, 0.5); 
            ObjectPool.Put('addSpin', addSpin);
        });
        this.popupFreeSpinTimes(1);
    }

    public async displayAddSpinTimes() : Promise<number> {

        if ( this.machine.featureGame === false ) return 0;
        let life = this.reel.getSymbolById(10).concat(this.reel.getSymbolById(11));
        if ( life == null || life.length == 0 ) return 0;
        
        for(let i=0;i<life.length;i++) {
            this.addSpinFly(life[i].node);
            await Utils.delay(300);
        }
        return life.length;
    }

    // 收集能量動畫流程
    public async collectEnergyController(energySymbols:any[]) {
        const isReadyFullEnergy = this.isReadyFullEnergy();
        // console.log('collectEnergyController', isReadyFullEnergy);
        if ( isReadyFullEnergy === this.IS_READY_FULL_STATE.BOTH ) await this.prePlayBothEnergy();
        energySymbols.forEach((symbol) => { this.collectEnergy(symbol); });
        
        await Utils.delay(2000);
        await this.displayAddSpinTimes();

        await this.seenBoard(isReadyFullEnergy);
        switch ( isReadyFullEnergy ) {
            default:
                return;
            case this.IS_READY_FULL_STATE.BOTH:
                await this.playBothEnergy();
                break;
            case this.IS_READY_FULL_STATE.BLUE:
                await this.playBlueEnergy();
                break;
            case this.IS_READY_FULL_STATE.GREEN:
                await this.playGreenEnergy();
                break;
        }
    }

    public async prePlayBothEnergy() {
        const aniName = (  this.machine.featureGame === true ) ? 'idle' : 'level2loop';

        this.pillar_blue.setAnimation(0, aniName, false);
        this.pillar_green.setAnimation(0, aniName, false);
        await Utils.playSpine(this.reelSpine, 'play', true);
        this.properties['energy']['pillar_blue_gem'].node.active = true;
        this.properties['energy']['pillar_green_gem'].node.active = true;
        this.properties['energy']['pillar_blue_gem'].component.setAnimation(0, 'out', false);
        this.properties['energy']['pillar_green_gem'].component.setAnimation(0, 'out', false);
        SoundManager.PlaySoundByID('sfx_wins_hit_super');
        this.reel.getSymbolById(10).concat(this.reel.getSymbolById(11)).forEach((symbol) => { symbol.win(); });
        await Utils.delay(1000);
    }

    protected async energyFly(type:number, target:Node, onFinish:Function=null) {
        const toPos    = target.worldPosition.clone();
        const energy   = type == this.IS_TYPE_BLUE ? 'blue' : 'green';
        const particle = ObjectPool.Get(energy);
        const fromPos  = type == this.IS_TYPE_BLUE ? this.bluePos : this.greenPos;
        const gem      = particle.getChildByName('gem');

        gem.active = false;
        particle.setParent(this.reel.showWinContainer);
        particle.worldPosition = fromPos;
        particle.active = true;
        SoundManager.PlaySoundByID('sfx_gem_fly_to_sym');
        await Utils.tweenBezierCurve(particle, toPos, { duration:0.7 });
        
        if ( onFinish != null ) onFinish();
        await Utils.delay(1000);
        particle.active = false;
        particle.destroy();
    }

    public async showGem(type:string='pillar_blue_gem') {
        SoundManager.PlaySoundByID('sfx_sym_ankh_gem_increase_full');
        this.properties['energy'][type].node.active = true;
        this.properties['energy'][type].component.setAnimation(0, 'in', false);
        await Utils.delay(700);
        this.properties['energy'][type].component.setAnimation(0, 'idle', true);
    }

    private changeDoubleWild() {
        const wilds = this.reel.getSymbolById(0);
        const doubleWilds = [];
        if ( wilds == null || wilds.length == 0 ) return [];

        for(let i=0;i<wilds.length;i++) {
            const wild = wilds[i];
            const wheel = wild.wheel;
            const wheelIdx = wheel.getIndexOfSymbol(wild.node);
            
            wheel.removeSymbol(wheelIdx);
            let newWild = ObjectPool.Get(20);
            wheel.putSymbol(newWild, wheelIdx);

            newWild.active = true;
            newWild.getComponent(sp.Skeleton).setAnimation(0, 'idle1', false);
            doubleWilds.push(newWild);

            wild.node.active = false;
            ObjectPool.Put(0, wild.node);
        }

        return doubleWilds;
    }

    /**
     * 執行 wild x 2 的整體流程
     */
    public async playBlueEnergy() { // wild x 2
        this.isPlayingEnergy = true;
        this.recoverReelSymbol();
        const energySpinData = this.gameResult['extra'];
        if ( energySpinData == null ||  energySpinData['gem_game_result'] == null ) return;

        const gemGameResult = JSON.parse(JSON.stringify(energySpinData['gem_game_result'][0]['game_result']));
        const event         = new EventTarget();

        this.showGem('pillar_blue_gem');
        this.reelSpine.setAnimation(0, 'function', true);

        await Utils.delay(1000);
        this.reel.spin().then(async () => { event.emit('done'); });             // 啟動 Spin

        await Utils.delay(500);                                                 // 轉個半秒
        this.reel.setResult(gemGameResult['game_result']);                      // 設定結果
        this.properties['gameResult'] = gemGameResult;                          // 設定結果
        await Utils.delayEvent(event, 'done');                                  // 等待 Spin 結束

        const wilds = this.changeDoubleWild();
        const length = wilds.length;
        for(let i=0;i<length;i++) {
            const idx = Utils.Random(0,wilds.length-1);
            const wild = wilds[idx];
            wilds.splice(idx,1);
            this.energyFly(this.IS_TYPE_BLUE, wild, () => { 
                wild.getComponent(sp.Skeleton).setAnimation(0, 'up', false);
                SoundManager.PlaySoundByID('sfx_gem_fly_to_sym_spawn_wild');
            });
            await Utils.delay(300);
        }
        this.properties['energy']['pillar_blue_gem'].component.addAnimation(0, 'out', false);
        this.clearEnergy(this.IS_TYPE_BLUE);
        await Utils.delay(500);
        
        this.isPlayingEnergy = false;
        this.properties['energy']['pillar_blue_gem'].node.active = false;
        this.reelSpine.setAnimation(0, 'idle', false);
        return await Utils.delay(1000);
    }

    /**
     * 整理 gem_info 資料
     * @param infoData 原始封包資料
     * @returns [symbol_id:pos];
     */
    public getGameInfo(infoData) {

        if ( infoData == null ) return null;
        let gameInfo = {};

        if ( infoData[0] != null ) gameInfo[ infoData[0]['symbol_id'] ] = infoData[0]['pos'];
        if ( infoData[1] != null ) gameInfo[ infoData[1]['symbol_id'] ] = infoData[1]['pos'];
        return gameInfo;
    }

    public async playGreenEnergy() { // random wild
        this.isPlayingEnergy = true;
        this.recoverReelSymbol();
        const energySpinData = this.gameResult['extra'];
        if ( energySpinData == null ||  energySpinData['gem_game_result'] == null ) return;

        const gemGameResult = JSON.parse(JSON.stringify(energySpinData['gem_game_result'][0]['game_result']));
        const gemInfoData   = this.reckonGemInfo(this.gameResult);
        const wildPos : number[] = gemInfoData[this.GREEN_SYMBOL];
        const event         = new EventTarget();

        this.showGem('pillar_green_gem');
        this.reelSpine.setAnimation(0, 'function', true);
        
        await Utils.delay(1000);
        this.reel.spin().then(async () => { event.emit('done'); });             // 啟動 Spin
        this.reelMaskActive(true);
        await Utils.delay(500);                                                 // 轉個半秒
        
        // 噴出 Wild
        for(let i=0;i<wildPos.length;i++) {
            this.energyFlyToPos(wildPos[i]).then( async() => {
                await Utils.delay(700);
                SoundManager.PlaySoundByID('sfx_gem_fly_to_sym_x2_wild');
            });
            await Utils.delay(300);
        }
        this.reelMaskActive(false);
        await Utils.delay(1000);                                                // 等待表演完畢

        this.reel.setResult(gemGameResult['game_result']);                      // 設定結果
        this.properties['gameResult'] = gemGameResult;                          // 設定結果
        await Utils.delayEvent(event, 'done');                                  // 等待 Spin 結束

        for(let i=0;i<wildPos.length;i++) { 
            this.changeWildSymbol(wildPos[i]);                                  // 更換 wild
        }
        
        await Utils.delay(100);
        this.properties['energy']['pillar_green_gem'].component.setAnimation(0, 'out', false);
        this.clearEnergy(this.IS_TYPE_GREEN);
        this.reel.clearShowWinContainer();                                      // 清空被放置的Symbol
        this.isPlayingEnergy = false;
        this.reelSpine.setAnimation(0, 'idle', false);

        await Utils.delay(1000);
        this.properties['energy']['pillar_green_gem'].node.active = false;
    }

    // Random Wild 飛行表演
    private async energyFlyToPos(index:number, type:number=this.IS_TYPE_GREEN) {
        // const pos = this.WHEEL_POS[index];
        const pos = Viewport.Orientation == Orientation.PORTRAIT ? this.PortraitPosData[index] : this.LandscapePosData[index];
        const position = pos[2];
        const container = this.reel.showWinContainer;
        const wild = (type===this.IS_TYPE_GREEN ) ? ObjectPool.Get(0) : ObjectPool.Get(20);

        wild.setParent(container);
        wild.worldPosition = position;
        wild.active = false;
        wild.scale = new Vec3(0,0,1);
        SoundManager.PlaySoundByID('sfx_gem_fly_to_sym');
        this.energyFly(type, wild, () => { 
            wild.active = true; 
            tween(wild).to(0.5, { scale: new Vec3(1, 1, 1) }, { easing: 'backInOut' }).start();
        });
    }

    /**
     * 將停輪後該被蓋掉的 symbol 換成 wild
     * @param index 
     */
    private changeWildSymbol(index:number, sym=0) {
        const pos = this.WHEEL_POS[index];
        const wheel:Wheel = this.reel.getWheels()[pos[0]];
        const idx = pos[1];

        wheel.removeSymbol(idx);
        return wheel.putSymbolID(sym, idx);
    }


    public typeBoard = { 'seen' : {  [this.IS_READY_FULL_STATE.BOTH] : false, [this.IS_READY_FULL_STATE.BLUE] : false, [this.IS_READY_FULL_STATE.GREEN] : false} };
    public async seenBoard(type:number) {
        let board : Node = this.typeBoard[type];
        if ( board == null ) return;
        if ( this.typeBoard['seen'][type] === true ) return;
        if ( this.machine.SpeedMode === Machine.SPEED_MODE.TURBO ) return;
        
        let clickEvent = new EventTarget();
        let click = () => { clickEvent?.emit('done'); };

        SoundManager.PlaySoundByID('sfx_wins_hit_big');
        board.on(Node.EventType.TOUCH_START, click.bind(this));
        this.typeBoard['seen'][type] = true;

        await Utils.tweenAlpha(board, false, 0.3);
        Utils.delay(4000).then(click);
        await Utils.delayEvent(clickEvent);
        clickEvent = null;
        await Utils.tweenAlpha(board, true, 0.3);
        board.active = false;
    }

    /**
     * Server 做不到的事情，把 game_info 裡的 pos 資料位置，替換成 Wild 交給 Client 處理
     * @returns 
     */
    public recoverReelSymbol() {
        const energySpinData = this.gameResult['extra'];
        if ( energySpinData == null || energySpinData['gem_game_result'] == null ) return;

        const reelResult = energySpinData['gem_game_result'][0]['game_result']['game_result'];
        const gameInfo = energySpinData['gem_game_result'][0]['gem_info'];

        for(let i=0;i<gameInfo.length;i++) {
            let info = gameInfo[i];
            let pos = info['pos'];
            if ( pos == null || pos.length == 0 ) continue;
            for(let j=0;j<pos.length;j++) {
                let wheel = Math.floor(pos[j]/3);
                let index = pos[j] % 3;
                reelResult[wheel][index] = 0;
            }
        }

        energySpinData['gem_game_result'][0]['game_result']['game_result'] = reelResult;
    }

    public async playBothEnergy() {
        this.isPlayingEnergy = true;
        this.recoverReelSymbol();
        const energySpinData = this.gameResult['extra'];
        if ( energySpinData == null || energySpinData['gem_game_result'] == null ) return;

        const gemGameResult = JSON.parse(JSON.stringify(energySpinData['gem_game_result'][0]['game_result']));
        const gemInfoData   = this.reckonGemInfo(this.gameResult);
        const wildPos : number[] = gemInfoData[this.GREEN_SYMBOL];
        const event         = new EventTarget();

        this.showGem('pillar_green_gem');
        this.showGem('pillar_blue_gem');
        this.reelSpine.setAnimation(0, 'function', true);

        await Utils.delay(1000);
        this.reel.spin().then(async () => { event.emit('done'); });             // 啟動 Spin
        await Utils.delay(500);                                                 // 轉個半秒
        this.reelMaskActive(true);
        for(let i=0;i<wildPos.length;i++) {                                     // 噴出 Random Wild
            this.energyFlyToPos(wildPos[i], this.IS_TYPE_GREEN).then(async()=>{
                await Utils.delay(700);
                SoundManager.PlaySoundByID('sfx_gem_fly_to_sym_x2_wild');
            });
            await Utils.delay(300);
        }
        
        this.properties['energy']['pillar_green_gem'].component.setAnimation(0, 'out', false);
        this.clearEnergy(this.IS_TYPE_GREEN);
        await Utils.delay(500);                                                // 等待表演完畢
        this.reelMaskActive(false);

        const wilds2:number[] = gemInfoData[this.BLUE_SYMBOL];                  // 噴出 Wildx2
        let result = gemGameResult['game_result'];
        const wheelPos = Viewport.Orientation == Orientation.PORTRAIT ? this.PortraitPosData : this.LandscapePosData;
        for(let i=0;i<wilds2.length;i++) {
            const idx = wilds2[i];
            const pos = wheelPos[idx];
            const wheel = pos[0];
            const index = pos[1];
            result[wheel][index] = 0;
        }

        this.reel.setResult(gemGameResult['game_result']);                      // 設定結果
        this.properties['gameResult'] = gemGameResult;                          // 設定結果
        await Utils.delayEvent(event, 'done');                                  // 等待 Spin 結束

        await Utils.delay(500);

        for(let i=0;i<wilds2.length;i++) {
            const idx = wilds2[i];
            const pos = wheelPos[idx];
            const wheel = this.reel.getWheels()[pos[0]];
            const index = pos[1];
            // const wild = this.reel.getWheels()[wheel].getSymbol(index);

            this.energyFlyToPos(wilds2[i], this.IS_TYPE_BLUE).then(async()=>{
                wheel.removeSymbol(index);
                let wild = ObjectPool.Get(20);
                wheel.putSymbol(wild, index);
                wild.getComponent(sp.Skeleton).setAnimation(0, 'up', false);
                await Utils.delay(500);
                SoundManager.PlaySoundByID('sfx_gem_fly_to_sym_spawn_wild');
            });
            await Utils.delay(300);
        }
        this.properties['energy']['pillar_blue_gem'].component.setAnimation(0, 'out', false);
        this.clearEnergy(this.IS_TYPE_BLUE);
        await Utils.delay(1000);                                                 // 等待表演完畢

        this.reel.clearShowWinContainer();                                      // 清空被放置的Symbol
        this.isPlayingEnergy = false;
        this.reelSpine.setAnimation(0, 'idle', false);
        await Utils.delay(1000);
        this.properties['energy']['pillar_green_gem'].node.active = false;
        this.properties['energy']['pillar_blue_gem'].node.active = false;
    }

    private resetParticle(particle:Node) { return; }

    // 播放收集能量動畫
    public async collectEnergy(energySymbol:Symbol) {
        if ( energySymbol == null ) return;

        let toPos, particle : Node, type = null;
        let wheelID = energySymbol.wheelID;                                                 // 輪軸ID
        let symbolID = energySymbol.symID;                                                  // 能量SymbolID

        if ( symbolID === this.BLUE_SYMBOL) {
            particle = ObjectPool.Get('blue');                                              // 取得粒子
            type     = this.IS_TYPE_BLUE;
            toPos    = this.bluePos;  // 能量飛到的位置
        } else {
            particle = ObjectPool.Get('green');                                             // 取得粒子
            toPos    = this.greenPos;  // 能量飛到的位置
            type     = this.IS_TYPE_GREEN;
        }

        let ani = particle.getComponent(Animation);
        let gem = particle.getChildByName('gem').getComponent(sp.Skeleton);
        let symbol = this.reel.moveToShowDropSymbol(wheelID, energySymbol.node);            // 把 Symbol 搬到表演區
        let isQuick = this.machine.SpeedMode === Machine.SPEED_MODE.TURBO || this.machine.fastStopping === true;
                                                 
        particle.setParent(symbol.parent);
        particle.worldPosition = symbol.worldPosition.clone();
        particle.active = true;

        if ( !isQuick ) {
            ani.stop();
            SoundManager.PlaySoundByID('sfx_sym_ankh');
            symbol.getComponent(Symbol).win();         
            await Utils.delay(500);
        }
        SoundManager.PlaySoundByID('sfx_sym_ankh_to_gem');
        gem.node.active = true;
        gem.setAnimation(0, 'in', false);
        gem.addAnimation(0, 'idle', true);

        if ( !isQuick ) {
            await Utils.delay(1000);
        } else {
            await Utils.delay(300);
        }

        ani.play();
        particle.getComponentInChildren(ParticleSystem2D).resetSystem();
        
        SoundManager.PlaySoundByID('sfx_sym_ankh_gem_fly');
        await Utils.tweenBezierCurve(particle, toPos, { duration: 0.6 });
        await Utils.delay(500);
        await this.displayLevelupEnergy(type);
        particle.destroy();
    }

    /**
     ** 停輪前事件
     ** @todo 如果有手杖Symbol, 顯示能量Nearmiss
     */
     public async displayEnergyNearmiss() {
        if ( this.isPlayingEnergy === true ) return;
        const energySymbol = this.reckonEnergyReel(this.gameResult['game_result']);
        if ( energySymbol == null ) return ;     // 沒有能量Symbol

        this.activeEnergyNearmiss(true);         // 顯示能量聽牌
        await Utils.delay(1000);                 // 等待一秒
    }

    public reelSpinningEvent() { 
        this.displayEnergyNearmiss();
        return super.reelSpinningEvent(); 
    }

    // 總加 payline 分數
    protected calculateTotalPayline() : number {
        if ( this.gameResult == null ) return 0;
        let pay_line = this.gameResult['pay_line'];
        if ( pay_line == null || pay_line.length == 0 ) return 0;

        let total = 0;
        for(let i=0;i<pay_line.length;i++) {
            total += pay_line[i]['pay_credit'];
        }

        return total;
    }

    /**
     * *處理收集能量流程
     */
    public async processWinningScore(total:number=null) {
        this.activeEnergyNearmiss(false);                               // 關閉能量 Nearmiss
        this.reel.closeNearMissMask();                                  // 關閉 Nearmiss Mask
        await this.processFreeGame();

        const energySymbol = this.reckonWheelEnergySymbol();            // 取得輪軸上的能量Symbol
        const isReadyFullEnergy = this.isReadyFullEnergy();             // 檢查是否準備好能量
        let totalScore = this.calculateTotalPayline();                  // 總贏分
        if ( energySymbol == null ) {
            return super.processWinningScore();                         // 沒有能量Symbol, 回到原本的流程
        }

        if ( this.gameResult['pay_credit_total'] > 0 && isReadyFullEnergy !== this.IS_READY_FULL_STATE.NONE ) { // 要收集能量，但是有贏分
            await this.performAllPayline(this.calculateTotalPayline()); // 顯示所有贏分
            await this.reelMaskActive(false);                           // 關閉贏分遮罩
        }

        await this.collectEnergyController(energySymbol);               // 收集能量流程
        totalScore += this.calculateTotalPayline();                     // 總贏分
        return super.processWinningScore(totalScore);
    }

    private popupIng : boolean = false;

    /**
     * 跳出 Free Spin 額外次數效果
     * @param times 額外增加的次數
     */
    public async popupFreeSpinTimes(times:number) { return await this.updateFreeSpinTimes(null, times); }

    public get freeSpinTimes() { 
        if ( this.machine.featureGame === false ) return -1;
        return this.properties['freeSpinTimes']; 
    }
    public set freeSpinTimes(times:number) { this.properties['freeSpinTimes'] = times; }

    public async startFreeGameOnOpen() {
        console.log('startFreeGameOnOpen',this.freeSpinTimes, this);
        FreeGame.Instance.startUI.active = true;
        FreeGame.Instance.startUI.getChildByPath('content').getComponent(sp.Skeleton).setAnimation(0, 'in', false); // 開啟 FreeGame UI 動畫
        await Utils.delay(500);
        FreeGame.Instance.startTimesLabel.string = this.freeSpinTimes.toString();
        FreeGame.Instance.startUI.getChildByPath('content').getComponent(sp.Skeleton).setAnimation(0, 'loop', true); 
    }

    public async startFreeGameOnClose() {
        const startUI = FreeGame.Instance.startUI;
        startUI.getChildByPath('content').getComponent(sp.Skeleton).setAnimation(0, 'out', false);
        await Utils.delay(500);
        FreeGame.Instance.startTimesLabel.string = '';
        startUI.active = false;
        await this.duskChange(async()=> {
            this.reel.clearShowWinContainer();
            this.properties['freeGame']['buyFeatureButton'].node.active = false;
            this.properties['freeGame']['background'].node.active       = true;
            this.properties['energy']['pillar_blue_fg'].node.active     = true;
            this.properties['energy']['pillar_green_fg'].node.active    = true;
            this.properties['energy']['pillar_blue_mg'].node.active     = false;
            this.properties['energy']['pillar_green_mg'].node.active    = false;
            this.reel.putReelSymbol([[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1]]);
        });
        SoundManager.PlayMusic('bgm_fg');
    }

    public async playScatter() {
        const sourceScatter = this.properties['freeGame']['scatterPlay'].node;
        const scatter = this.scatters;
        const cloneScatter = [];
        
        if ( scatter == null || scatter.length == 0 ) return;
        SoundManager.PlaySoundByID('sfx_fg_cutscene');
        for(let i=0;i<scatter.length;i++) {
            let clone = instantiate(sourceScatter);
            let spine = clone.getComponent(sp.Skeleton);
            clone.parent = this.reel.showWinContainer;
            clone.worldPosition = scatter[i].node.worldPosition.clone();
            clone.active = true;
            spine.setAnimation(0, spine.animation, false);
            cloneScatter.push(clone);
        }

        await Utils.delay(2000);
        for(let i=0;i<cloneScatter.length;i++) {
            cloneScatter[i].active = false;
            cloneScatter[i].destroy();
        }
    }

    /**
     * *處理FreeGame流程
     * 處理完畢回到 processWinningScore
     */
    public async processFreeGame() {
        
        if ( this.machine.featureGame === true ) return;

        const spinData = this.machine.spinData;            // 取得 Spin 封包資料
        if ( spinData['sub_game'] == null || spinData['sub_game']['game_result'] == null ) return;
        SoundManager.PauseMusic(1);
        await this.playScatter();
        this.controller.activeBusyButtons(false);
        const total_win = spinData?.['sub_game']?.['pay_credit_total'];// 總贏分
        const times = spinData['extra']['free_spin_times'];
        const overTimes = spinData['sub_game']['game_result'].length;
        const firstGameResult = this.gameResult;            // 記住目前的結果
        this.freeSpinTimes       = times;
        this.machine.featureGame = true;                   // 設定為 Feature Game 狀態
        FreeGame.Instance.startTimesLabel.string = '';     // 清空 FreeGame UI 的次數

        await FreeGame.OpenFreeGameUI({
            defaultFadin    : false, 
            defaultFadout   : false, 
            onOpenUI        : this.startFreeGameOnOpen.bind(this), 
            onCloseUI       : this.startFreeGameOnClose.bind(this)
        });                    // 開啟 FreeGame UI 

        await AutoSpin.AutoSpinTimes(this.freeSpinTimes);
        await Utils.delay(1000);  

        await FreeGame.StartFreeGame(                       // 等待 Free Game 結束
            spinData['sub_game']['game_result'],            // 每一局的內容
            this.updateFreeSpinTimes.bind(this),            // 更新 Spin 次數
            async (roundData: any) => {                     // 每一輪結束callback, 可await
                await Utils.delay(500);                     // 等待一下
            }
        );
        await SoundManager.PauseMusic(1);
        SoundManager.PlayMusic('bgm_total_win_loop');
        await FreeGame.CloseFreeGameUI(total_win, {         // 關閉 FreeGame UI
            times       : overTimes, 
            onStart     : this.endFreeGameOnOpen.bind(this), 
            onFinish    : this.endFreeGameOnClose.bind(this),
            scoreAudio  : 'sfx_wins_payout_loop',
            breakScoreAudio : 'sfx_wins_payout_loop_end'
        });
        await SoundManager.PauseMusic(0);
        await SoundManager.PlaySoundByID('bgm_total_win_loop_end');
        this.properties['gameResult'] = firstGameResult;     // 還原開始盤面
        await this.duskChange(async()=> {
            this.properties['freeGame']['buyFeatureButton'].node.active = true;
            this.properties['freeGame']['background'].node.active       = false;
            this.properties['energy']['pillar_blue_fg'].node.active     = false;
            this.properties['energy']['pillar_green_fg'].node.active    = false;
            this.properties['energy']['pillar_blue_mg'].node.active     = true;
            this.properties['energy']['pillar_green_mg'].node.active    = true;
            this.reel.putReelSymbol(firstGameResult['game_result']);    // 換回原本的 Symbol
        });

        SoundManager.PlayMusic('bgm_mg');
        this.reckonEnergyReel(firstGameResult['game_result']); // 重新計算能量輪軸
        await Utils.delay(100);                             // 等待一下
        this.machine.featureGame = false;                   // 設定為非 Feature Game
        return;                                             // 回到 processWinningScore
    }

    // 更新 Spin 次數
    public async updateFreeSpinTimes(roundData: any, times: number=-1) {
        let amount = this.freeSpinTimes;
        amount += times;
        this.freeSpinTimes = amount;
        if ( this.freeSpinTimes >= 0) await AutoSpin.AutoSpinTimes(amount);
    }

    private scoreSound = null;
    public async endFreeGameOnOpen() {
        const endUI = this.properties['freeGame']['endUISpine'];
        endUI.node.parent.active = true;
        endUI.node.active = true;
        endUI.component.setAnimation(0, 'in', false);
        endUI.component.addAnimation(0, 'loop', true);
        await Utils.delay(800);
    }

    public async endFreeGameOnClose() {
        this.scoreSound?.stop();
        PageManager.activeCommonMask(false);
        const endUI = this.properties['freeGame']['endUISpine'];
        await Utils.playSpine(endUI.component, 'out');
        endUI.node.active = false;
    }

    /**
     * 轉場動畫
     * @param onChange 轉場後要做的事情 
     */
    public async duskChange(onChange:Function=null) {
        SoundManager.PlaySoundByID('sfx_fg_outro');
        const transfer : sp.Skeleton = this.properties['background']['transfer'].component;
        transfer.node.active = true;
        transfer.setAnimation(0, 'play', false); 
        await Utils.delay(3800);
        if ( onChange != null ) onChange();
        await Utils.delay(1000);
        transfer.node.active = false;
    }

    /**
     * 預設能量值資料
     */
    protected initEnergyData() {
        console.log(gameInformation);
        const length = gameInformation.coinValueArray.length;
        let energyBetData = {};
        for(let i = 0; i < length; i++) {
            const totalBet = this.machine.controller.calculateTotalBet(i);
            energyBetData[totalBet] = {'random_wild_gem':0, 'wildX2_gem':0};
            // engryBetData.push([Utils.Random(0, 3),Utils.Random(0, 3)]); // 模擬資料
        }
        this.properties['energyBetData'] = energyBetData;
        this.properties['energy']['bluePos'] = this.blueParticle.worldPosition.clone();
        this.properties['energy']['greenPos'] = this.greenParticle.worldPosition.clone();

        ObjectPool.registerNode('blue', instantiate(this.blueParticle));
        ObjectPool.registerNode('green', instantiate(this.greenParticle));
        ObjectPool.registerNode('addSpin', instantiate(this.addSpinSpine.node));
        console.log(this.properties['energyBetData']);
    }

    protected refreshBetEnergyData() {
        
    }

    protected pillarAnimation = {
        0 : {'idle' : 'idle',       'up' : 'level3up', 'loopAni': 'level3loop', 'loop': true  },
        1 : {'idle' : 'level1loop', 'up' : 'level1up', 'loopAni': 'level1loop', 'loop': true },
        2 : {'idle' : 'level2loop', 'up' : 'level2up', 'loopAni': 'level2loop', 'loop': true },
        3 : {'idle' : 'level3loop', 'up' : 'idle',     'loopAni': 'idle',       'loop': true },
    };

    protected displayLevelupEnergy(type:number) { 
        console.warn('displayLevelupEnergy', type);
        if ( this.machine.featureGame === true ) {
            const pillar        = type == this.IS_TYPE_BLUE ? 'pillar_blue_fg' : 'pillar_green_fg';
            this.properties['energy'][pillar].component.setAnimation(0, 'play', true);
            SoundManager.PlaySoundByID('sfx_sym_ankh_gem_increase_full'); 
            return;

        } 
        const pillarAnimation = this.pillarAnimation;
        const energy        = this.getEnergy();
        const level         = type == this.IS_TYPE_BLUE ? energy[0] : energy[1];
        const animation     = pillarAnimation[level];

        if ( type == null ) {
            const blueLevel = energy[0];
            const greenLevel = energy[1];
            const blueIdleAni = pillarAnimation[blueLevel]?.['idle'];
            const greenIdleAni = pillarAnimation[greenLevel]?.['idle'];

            if ( blueIdleAni && this.pillar_blue.animation != blueIdleAni ) this.pillar_blue.setAnimation(0, blueIdleAni, true);
            if ( greenIdleAni && this.pillar_green.animation != greenIdleAni ) this.pillar_green.setAnimation(0, greenIdleAni, true);
            return;
        } else {
            if ( animation == null ) return;
            const pillar        = type == this.IS_TYPE_BLUE ? 'pillar_blue_mg' : 'pillar_green_mg';
            SoundManager.PlaySoundByID('sfx_sym_ankh_gem_increase');
            this.properties['energy'][pillar].component.setAnimation(0, animation['up'], false);
            this.properties['energy'][pillar].component.addAnimation(0, animation['loopAni'], true);
            if ( animation['loop'] === true ) Utils.delay(1000).then(()=>{ SoundManager.PlaySoundByID('sfx_sym_ankh_gem_increase_full'); });
            return;
        }
        
    }

    /**
     * 顯示能量值
     * @param isTTB 
     * @returns 
     */
    protected displayEnergy(isTTB:boolean=false) {
        if (this.machine.featureGame === true) return;
        if (this.properties['energyBetData'] == null ) return;

        const energyBetData = this.getEnergy(isTTB);
        if ( energyBetData == null || energyBetData.length === 0) return;

        this.properties['energy']['blue'].component.string  = energyBetData[0];
        this.properties['energy']['green'].component.string = energyBetData[1];
        let blueIdleAni  = this.pillarAnimation[energyBetData[0]]?.['idle'];
        let greenIdleAni = this.pillarAnimation[energyBetData[1]]?.['idle'];

        if ( blueIdleAni && this.pillar_blue.animation != blueIdleAni )    this.pillar_blue.setAnimation(0, blueIdleAni, true);
        if ( greenIdleAni && this.pillar_green.animation != greenIdleAni ) this.pillar_green.setAnimation(0, greenIdleAni, true);
    }

    protected clearEnergy(type:number) {
        const pillar = type == this.IS_TYPE_BLUE ? this.pillar_blue : this.pillar_green;
        pillar.setAnimation(0, 'idle', false);
    }

    /**
     * 切換 Bet 需要處理顯示能量值
     * @param idx 
     * @returns 
     */
    public calculateTotalBet(idx:number) : number { 
        // this.displayEnergy(idx);

        // 這邊要 return null 不然會被拿出去顯示
        return null; 
    }

    /** 4800 取得盤面的風包資料 */
    public reckonReelResult(gameResult) { return gameResult['game_result']; }

    /**
     * 顯示賠付線
     * @param lineData 
     */
    public async performSingleLineEvent(lineData:any) : Promise<any> {
        let paylineNumber       = lineData['pay_line'];
        let spine : sp.Skeleton = this.properties['paytable'][paylineNumber].component;
        let animation           = `payline${paylineNumber+1}`;

        spine.node.parent.active = true;
        spine.node.active        = true;
        spine.setAnimation(0, animation, false);
    }

    public closePayline() {
        this.reelSpine.setAnimation(0, 'idle', false);
        let paylineContainer = this.properties['paytable']['0'].node.parent;
        if ( paylineContainer.active === false ) return;

        let children = paylineContainer.children;
        paylineContainer.active = false;
        children.forEach((child:Node) => {
            child.active = false;
            child.getComponent(sp.Skeleton).clearTracks();
        });
    }

    public async spinDone() {
        this.properties['freeGame']['buyFeatureButton'].node.getComponent(Sprite).color = Color.WHITE;
        this.closePayline();
        this.displayEnergy();
    }

    protected keeperCode = 0;
    /**
     * 不定時播放 Symbol idle 動畫
     * @param code 
     * @returns 
     */
    public async keeperSymbolIdle(code:number=0) {
        if ( code !== this.keeperCode ) return;

        let sec = Utils.Random(5000, 6000);
        let newCode = Utils.Random(0, 1000);
        this.keeperCode = newCode;
        Utils.delay(sec).then(() => { 
            this.keeperSymbolIdle(newCode); 
        });

        if ( this.machine.state !== Machine.SPIN_STATE.IDLE ) return;
        let randomWheel = this.reel.getWheels()[Utils.Random(0,4)];
        let randomSymbol = randomWheel.getSymbol(Utils.Random(0,2));
        randomSymbol.getComponent(sp.Skeleton).setAnimation(0, 'idle', false);
    }

    public bgAnimationType = {
        [Orientation.LANDSCAPE] : {
            // 是不是feature game
            true : {
                // isPlay = true
                true: {'play' : 'FG_W_play', 'loop' : 'FG_W_loop'},
                false: {'loop' : 'FG_W_loop' },
            }, 
            false : {
                true: {'play' : 'MG_W_play', 'loop' : 'MG_W_loop'},
                false: {'loop' : 'MG_W_loop' },
            },
        },
        [Orientation.PORTRAIT] : {
            true : {
               // isPlay = true
               true: {'play' : 'FG_L_play', 'loop' : 'FG_L_loop'},
               false: { 'loop' : 'FG_L_loop' },
            },
            false : {
                true: {'play' : 'MG_L_play', 'loop' : 'MG_L_loop'},
                false: { 'loop' : 'MG_L_loop' },
            },
        }
    };

    public bgAnimation(isPlay:boolean, type:Orientation) {
        if (EDITOR) return;
        let bg = this.bgSpine;
        let isFeature = this.machine.featureGame.toString();
        let play = this.bgAnimationType[type][isFeature][isPlay]?.['play'];
        let loop = this.bgAnimationType[type][isFeature][isPlay]?.['loop'];
        if ( play != null ) bg.setAnimation(0, play, false);
        if ( loop != null ) bg.addAnimation(0, loop, true);
    }

    public screenRotation(type:Orientation) {
        this.bgAnimation(false, type);
        this.properties['freeGame']['buyFeatureButton'].node.active = !this.machine.featureGame;
    }

    public onClickCloseBuyFGUI() { this.properties['background']['buyFeature'].component.addAnimation(0, 'out', false); }

    public async onClickOpenBuyFGUI() : Promise<boolean> { 
        this.properties['background']['buyFeature'].component.setAnimation(0, 'in', false);
        this.properties['background']['buyFeature'].component.addAnimation(0, 'loop', true);
        SoundManager.PlaySoundByID('sfx_gem_fly_to_sym_spawn_wild');
        return true; 
    }

    public async preStopWheel(wheel: Wheel, result: any): Promise<void> {
        return;
        /* 效果很怪，先不用
        if ( this.reel.fastStoping === true ) return;
        if ( this.energyNearmiss.active === false ) return;
        if ( wheel._ID !== 3 ) return;
        if ( Math.random() > 0.5 ) return;
        if ( result.includes(10) === false && result.includes(11) === false ) return;
        await Utils.delay(500); */ // 第四輪有手帳，故意噸一下
    }

    public startSuperSpinFeatureGameTimes(result:any) : number { return result['extra']['free_spin_times']; }

    public async superSpinFeatureGame(result:any) : Promise<{times:number,score:number}[] | null> { 
        if ( result == null || result['sub_game'] == null || result['sub_game']['game_result'] == null ) return null;

        let subGame = result['sub_game']['game_result'];
        let times = result['extra']['free_spin_times'];
        let featureGameResult = [];

        for(let i=0;i<subGame.length;i++) {
            times--;
            let addTimes = 0;
            let reel = subGame[i]['game_result'];
            let nowTimes = times;
            addTimes += reel[1].filter((v)=>{ return v === 10; }).length;
            addTimes += reel[3].filter((v)=>{ return v === 10; }).length;
            addTimes += reel[1].filter((v)=>{ return v === 11; }).length;
            addTimes += reel[3].filter((v)=>{ return v === 11; }).length;
            times += addTimes;

            let data = {times: nowTimes, score: subGame[i]['pay_credit_total'], addTimes: addTimes, data: subGame[i]};
            featureGameResult.push(data);
        }
        console.log(featureGameResult);
        return featureGameResult; 
    }

    public async startRolling() { 
        if ( this.machine.SpeedMode === Machine.SPEED_MODE.TURBO ) return;
        Utils.delay(500).then(()=>{ SoundManager.PlaySoundByID('sfx_reel_roll_loop'); }); 
    }

    public async performAllPayline(totalWinScore: number=null, isLooping: boolean=false) {
        if (isLooping === false && totalWinScore > 0 ) SoundManager.PlaySoundByID('sfx_win_line');
        let bg = this.properties['ui']['totalwinbg'].node;
        // Utils.tweenAlpha(bg, false, 0.3);
        return super.performAllPayline(totalWinScore, isLooping);
        // Utils.tweenAlpha(bg, true, 0.3);
    }

    public async clickBuyFeatureGameConfirm() : Promise<boolean> { 
        SoundManager.PlaySoundByID('sfx_gem_fly_to_sym'); 
        return super.clickBuyFeatureGameConfirm();
    }

    public nearMissWheel(wheelID:number) : boolean { 
        SoundManager.PlaySoundByID('sfx_reel_roll_shine');
        return true; 
    }

    public async performSingleLine(lineData: any, isWaiting: boolean=false) : Promise<number> {
        if ( isWaiting === true ) SoundManager.PlaySoundByID('aud_burn_number');
        return super.performSingleLine(lineData, isWaiting);
    }

    public async superSpinEndMainGame(result:any) {
        console.log('superSpinEndMainGame', result);
        if ( result == null || result['extra'] == null || result['extra']['user_data'] == null ) return super.superSpinEndMainGame(result);
        const energyData    = result['extra']['user_data'];
        const blue          = energyData['wildX2_gem'];
        const green         = energyData['random_wild_gem'];
        const energyBetData = [blue, green];
       
        await this.superSpinUseEnergy(result);

        let blueIdleAni  = this.pillarAnimation[energyBetData[0]]?.['idle'];
        let greenIdleAni = this.pillarAnimation[energyBetData[1]]?.['idle'];

        if ( blueIdleAni && this.pillar_blue.animation != blueIdleAni )    this.pillar_blue.setAnimation(0, blueIdleAni, true);
        if ( greenIdleAni && this.pillar_green.animation != greenIdleAni ) this.pillar_green.setAnimation(0, greenIdleAni, true);
        return super.superSpinEndMainGame(result);
    }

    public checkMainGameUseEnergy(result:any, isFeature:boolean=false) {
        let gem_info;
        if (isFeature === false) gem_info = result?.['main_game']?.['extra']?.['gem_game_result']?.[0]?.['gem_info'];
        else gem_info = result?.['extra']?.['gem_game_result']?.[0]?.['gem_info'];

        console.log('gem_info', gem_info);
        if ( gem_info == null ) return [false, false];

        if ( gem_info.length === 0 ) return [false, false];
        
        let response = [false, false];
        let firstID = gem_info[0]['symbol_id'];
        response[0] = firstID === this.BLUE_SYMBOL;
        response[1] = firstID === this.GREEN_SYMBOL;

        if ( gem_info[1] ) {
            let secondID = gem_info[1]['symbol_id'];
            if (!response[0]) response[0] = response[0] && secondID === this.BLUE_SYMBOL;
            if (!response[1]) response[1] = response[1] && secondID === this.GREEN_SYMBOL;
        }

        return response;
    }

    public async superSpinUseEnergy(result:any) {
        const isUseEnergy = this.checkMainGameUseEnergy(result);
        console.log('isUseEnergy', isUseEnergy);
        if ( !isUseEnergy[0] && !isUseEnergy[1] ) return;

        if ( isUseEnergy[0] ) {
            this.displayLevelupEnergy(this.IS_TYPE_BLUE);
            // this.pillar_blue.setAnimation(0, 'level3up', false);
        }

        if ( isUseEnergy[1] ) {
            this.displayLevelupEnergy(this.IS_TYPE_GREEN);
            // this.pillar_green.setAnimation(0, 'level3up', false);
        }

        await Utils.delay(1000);
    }

    public async preSuperSpinFeatureGame(data:any) {
        const isUseEnergy = this.checkMainGameUseEnergy(data.data, true);
        if ( !isUseEnergy[0] && !isUseEnergy[1] ) return;

        if ( isUseEnergy[0] ) {
            this.displayLevelupEnergy(this.IS_TYPE_BLUE);
            await this.showGem('pillar_blue_fg');
        }

        if ( isUseEnergy[1] ) {
            this.displayLevelupEnergy(this.IS_TYPE_GREEN);
            await this.showGem('pillar_green_fg');
        }

        await Utils.delay(700);
    }

    public async preStartSuperSpinFeatureGame() {
        this.properties['energy']['pillar_blue_fg'].node.active = true;
        this.properties['energy']['pillar_green_fg'].node.active = true;
        this.properties['energy']['pillar_blue_fg'].component.setAnimation(0, 'idle', true);
        this.properties['energy']['pillar_green_fg'].component.setAnimation(0, 'idle', true);
        await Utils.delay(1000);
    }

    public async superSpinEndFeatureGame(result:any) {
        this.properties['energy']['pillar_blue_fg'].node.active = false;
        this.properties['energy']['pillar_green_fg'].node.active = false;
    }
} 