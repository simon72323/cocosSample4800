import { _decorator, Component, Node, Size, Enum, sp, Vec3, CCInteger, Sprite, Color } from 'cc';
import { Reel } from '../Reel';
import { SimpleAudioClipData, SoundManager } from '../SoundManager';
import { Symbol } from '../Symbol';
import { ObjectPool } from '../../ObjectPool';
import { Wheel } from '../Wheel';
import { ROLLING_TYPE, START_ROLLING_TYPE, _RollingType, _StartRollingType } from './module/_wheelInterface';
import { StartRolling1 } from './module/_rolling_type/StartRolling1';
import { StartRolling2 } from './module/_rolling_type/StartRolling2';
import { RollingType } from './module/_rolling_type/RollingType';
import { RollingType1 } from './module/_rolling_type/RollingType1';
import { RollingType2 } from './module/_rolling_type/RollingType2';
import { Utils } from '../../../utils/Utils';
import { Machine } from '../Machine';

const { ccclass, property, menu, help, disallowMultiple } = _decorator;


/**
 * 轉輪基本設定
 */
@ccclass('BaseInspect')
export class BaseInspect {
    @property({displayName: 'Symbol大小設定', tooltip: 'Symbol pixel大小'})
    public symbolSize: Size = new Size(100, 100);

    @property({ displayName:'滾輪長度', min: 1, max: 99, step: 1, type: CCInteger, tooltip: '裝幾個Symbol'})
    public length = 4;

    @property({displayName: '隱藏數量(上,下)', tooltip: '上下軸隱藏幾個Symbol'})
    public hideSize: Size = new Size(1, 1);

    @property({type:Node, displayName: 'Symbol容器', tooltip: 'Symbol容器'})
    public container: Node = null;

    @property({displayName: '啟動時是否放置Symbol', tooltip: '啟動時是否放置Symbol'})
    public startPutSymbol :boolean = true;

    @property({type: [CCInteger], displayName: '隨機Symbol設定', tooltip: '滾動中會出現哪些Symbol, 陣列ID'})
    public rollingSymbols: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

}

/**
 * 轉輪音效設定
 */
@ccclass('AudioInscept')
export class AudioInspect {

    @property({ type: SimpleAudioClipData, displayName: '啟動音效', tooltip: '啟動音效' })
    public startAudio: SimpleAudioClipData = new SimpleAudioClipData();
    
    @property({ type: SimpleAudioClipData, displayName: '停輪音效', tooltip: '停輪音效' })
    public stopAudio: SimpleAudioClipData = new SimpleAudioClipData();

    @property({ type: SimpleAudioClipData, displayName: '聽牌音效', tooltip: '聽牌音效' })
    public nearAudio: SimpleAudioClipData = new SimpleAudioClipData();
}

/**
 * 啟動滾輪設定
 */
@ccclass('StartRollingInscept')
export class StartRollingInspect {
    @property({type: Enum(START_ROLLING_TYPE), displayName: '啟動滾輪方式', tooltip: '啟動滾輪方式'})
    public startRollingType: START_ROLLING_TYPE = START_ROLLING_TYPE.數值設定;
    
    @property({type: StartRolling1, displayName: '使用事件呼叫Function，由程式自行處理', tooltip: '事件設定', visible: function(this:StartRollingInspect) { return this.startRollingType === START_ROLLING_TYPE.事件設定; }})
    public startRolling1: StartRolling1 = new StartRolling1();
    
    @property({type: StartRolling2, displayName: '數值設定', tooltip: '數值設定', visible: function(this:StartRollingInspect) { return this.startRollingType === START_ROLLING_TYPE.數值設定; }})
    public startRolling2: StartRolling2 = new StartRolling2();

    public Events = {
        [START_ROLLING_TYPE.事件設定] : this.startRolling1,
        [START_ROLLING_TYPE.數值設定] : this.startRolling2,
    }

    public initProperty(wheel: Wheel) {
        this.Events[START_ROLLING_TYPE.事件設定] = this.startRolling1;
        this.Events[START_ROLLING_TYPE.數值設定] = this.startRolling2;

        return callLibaryFunction(this.Events[this.startRollingType], 'initProperty', wheel);
    }

    async startRolling(wheel: Wheel): Promise<void> {
        if ( this.startRollingType === START_ROLLING_TYPE.無設定 ) return;
        return awaitCallLibaryFunction(this.Events[this.startRollingType], 'startRolling', wheel);
    }
}

/**
 * 聽牌設定
 */
@ccclass('NearMissInscept')
export class NearMissInspect {

    @property({ displayName: '速度遞減', tooltip: '1以上加快, 1以下變慢', step: 0.01, min: 0.01, max: 3 })
    public nearResistSpeed: number = 0.85;

    @property({ displayName: '多滾幾個圖標', tooltip: '圖標數量', step: 1, min: 0, max: 30 })
    public nearMoveCount = 10;

    @property({ type: sp.Skeleton, displayName: 'NearSpine', tooltip: '聽牌時展示動畫' })
    public nearSpine: sp.Skeleton;

    @property({ type:Sprite, displayName: 'NearMask', tooltip: '聽牌時遮罩' })
    public nearMask:Sprite;
}

@ccclass('RollingInscept')
export class RollingInspect {
    @property({type: Enum(ROLLING_TYPE), displayName: '滾動方式', tooltip: '滾動方式'})
    public rollingType: ROLLING_TYPE = ROLLING_TYPE.常態捲動;

    @property({type: RollingType, displayName: '事件設定', tooltip: '事件設定', visible: function(this:RollingInspect) { return this.rollingType === ROLLING_TYPE.事件設定; }})
    public rolling:  RollingType = new RollingType();

    @property({type: RollingType1, displayName: '常態設定', tooltip: '常態設定', visible: function(this:RollingInspect) { return this.rollingType === ROLLING_TYPE.常態捲動; }})
    public rolling1: RollingType1 = new RollingType1();

    @property({type: RollingType2, displayName: '整排捲動', tooltip: '整排捲動', visible: function(this:RollingInspect) { return this.rollingType === ROLLING_TYPE.整排捲動; }})
    public rolling2: RollingType2 = new RollingType2();

    protected Events = {
        [ROLLING_TYPE.事件設定] : this.rolling,
        [ROLLING_TYPE.常態捲動] : this.rolling1,
        [ROLLING_TYPE.整排捲動] : this.rolling2,
    };

    public initProperty(wheel: Wheel) { 
        this.Events[ROLLING_TYPE.常態捲動] = this.rolling1;
        this.Events[ROLLING_TYPE.事件設定] = this.rolling;
        this.Events[ROLLING_TYPE.整排捲動] = this.rolling2;

        callLibaryFunction(this.Events[this.rollingType], 'initProperty', wheel); 
    }

    public async keepRolling(wheel: Wheel): Promise<void> { 
        await awaitCallLibaryFunction(this.Events[this.rollingType], 'keepRolling'); 
        wheel.reel.setStopWheel(wheel._ID);
    }

    public async stopRolling(result: number[]) { return callLibaryFunction(this.Events[this.rollingType], 'stopRolling', result); }

    public async nearMissStopRolling(result: number[]) { return callLibaryFunction(this.Events[this.rollingType], 'nearMissStopRolling', result); }
}

//#endregion 各項 Inscpect 設定


export function callLibaryFunction(obj:any, func:string, ...args:any[]) {
    if ( obj == null )       return null;
    if ( obj[func] == null ) return null;
    return obj[func](...args);
}

export async function awaitCallLibaryFunction(obj:any, func:string, ...args:any[]) {
    if ( obj == null )       return null;
    if ( obj[func] == null ) return null;
    return await obj[func](...args);
}

@ccclass('WheelLibrary')
export class WheelLibrary extends Component {
    // #region[[rgba(0,0,0,0)]] 設定
    @property({ type:BaseInspect, displayName: '基礎設定', group: { name: '基礎設定', id: '0' } })
    public readonly baseInspect: BaseInspect = new BaseInspect();

    @property({ type: AudioInspect, displayName: '音效設定', tooltip: '音效設定', group: { name: '音效設定', id: '0' } })
    public readonly audioInspect: AudioInspect = new AudioInspect();

    @property({ type: StartRollingInspect, displayName: '啟動動態', tooltip: '啟動動態', group: { name: '啟動動態', id: '0' }})
    public readonly startRolling: StartRollingInspect = new StartRollingInspect();

    @property({ type: RollingInspect, displayName: '滾動設定', tooltip: '滾動設定', group: { name: '滾動設定', id: '0' } })
    public readonly rollingInspect: RollingInspect = new RollingInspect();

    @property({ type: NearMissInspect, displayName: '聽牌設定', tooltip: '聽牌設定', group: { name: '聽牌設定', id: '0' } })
    public readonly nearMissInspect: NearMissInspect = new NearMissInspect();
    // #endregion 設定

    /**
     * 定義各種數值資料
     */
    protected _propertys = {
        /**
         * 轉輪ID
         */
        ID: -1,

        /** Symbol資料 */
        symbolData: {
            /**
             * idx : {
             *  'id'     : symbolID,
             *  'symbol' : symbol component,
             *  'size'   : symbol size,
             * },
             */
        },

        /** Symbol 所在位置資料 
        * getSymbolPutPos() 會計算位置資料
        */
        symbolPosData : { /** {idx:Vec3} */ }, 

        nearMiss : {
            /** 聽牌音效 */
            audioSource : null,
        },

        /** 高度 Index, [最小idx,最大idx] */
        heightIdxType: [0,0],

        wheel       : null, // Wheel
        container   : null, // Node
        reel        : null, // Reel
        machine     : null, // Machine
        updateEvent : null, // EventHandler
        nearMissSymbols : [], // Node[] 聽牌時的Symbol
    };

    /** 滾輪編號 */
    public get _ID () { return this.propertys.ID; }

    public get propertys() { return this._propertys; }

    /**
     * 檢查 Inscpect 資料
     * @returns { boolean } 是否通過檢查
     */
    protected checkInscept(): boolean {

        if (this.baseInspect.container == null) {
            console.error(`Wheel ${this.node[' INFO ']} 沒有設定 基礎設定/Symbol容器`, this.node);
            return false;
        }

        if (this.baseInspect.symbolSize.width === 0) {
            console.error(`Wheel ${this.node[' INFO ']} 沒有設定 基礎設定/Symbol大小設定 width`, this.node);
            return false;
        }

        if (this.baseInspect.symbolSize.height === 0) {
            console.error(`Wheel ${this.node[' INFO ']} 沒有設定 基礎設定/Symbol大小設定 height`, this.node);
            return false;
        }

        if (this.baseInspect.length < 1) {
            console.error(`Wheel ${this.node[' INFO ']} 沒有設定 基礎設定/滾輪長度`, this.node);
            return false;
        }

        return true;
    }

    /**
     * 初始化 Inscpect
     * @from Wheel.onLoad()
     */
    protected initInscept(): void {
        this._propertys.wheel = this.node.getComponent(Wheel);

        this.setContainer(this.baseInspect.container);
        this.initHeightIdx();
        this.initStartRolling();
        this.initRolling();
        this.initRollingStop();
        this.initNearMiss();
        
        this.playNearMiss(false);
        this.nearMissMask(false);
    }

    /**
     * 啟動時放置Symbol
     */
    protected startPutSymbol() {
        if ( this.baseInspect.startPutSymbol === false ) return;

        let minH = this.heightIdxType[0];
        let maxH = this.heightIdxType[1]-1;
        for ( let i=minH; i<=maxH; i++ ) {
            let symbol = this.randomSymbol();
            this.putSymbol(symbol, i);
        }
    }

    /**
     * 取得滾輪速度
     * @returns {number} 毫秒
     * @from this.initInscept()
     */
    protected get rollingSpeed() { return this.rollingSpeed[this.reel.getSpinMode()]; }

    /**
     * 設定轉輪ID, reel, machine
     * @param id 滾輪編號
     * @param reel 捲軸
     */
    public setReel(id, reel: Reel) {
        this._propertys.ID = id;
        this._propertys.reel = reel;
        this._propertys.machine = Machine.Instance;
    }

    public get reel() : Reel { return this._propertys.reel; }
    public get machine() : Machine { return Machine.Instance; }
    public get wheel() { return this._propertys.wheel; }

    /**
     * 設定Symbol容器
     * @param container 
     * @returns 
     */
    protected setContainer(container:Node) { 
        if ( container == null ) return null;
        this._propertys.container = container;

        return this.container;
    }

    /**
     * 取得Symbol容器
     */
    public get container() : Node { return this._propertys.container; }
    
    /**
     * 初始化高度 Index 資料
     * this._propertys.heightIdxType = [最小idx,最大idx]
     */
    protected initHeightIdx() {
        let minIdx = - Math.floor(this.baseInspect.hideSize.width);
        let maxIdx =   Math.floor(this.wheelLength + this.baseInspect.hideSize.height);

        if ( minIdx == -0 ) minIdx = 0;
        this._propertys.heightIdxType = [minIdx, maxIdx];

        return this.heightIdxType;
    }

    /**
     * 取得高度 Index 資料
     * @returns {number[]} [最小idx,最大idx]
     */
    public get heightIdxType() : number[] { return this._propertys.heightIdxType; }

    /**
     * 初始化停止滾輪設定
     */
    protected initRollingStop() {}

    /**
     * 初始化滾輪設定
     */
    protected initRolling() { this.rollingInspect.initProperty(this.node.getComponent(Wheel)); }

    protected initStartRolling() { this.startRolling.initProperty(this.node.getComponent(Wheel)); }

    /**
     * 初始化聽牌設定
     */
    protected initNearMiss() {
    }

    /**
     * 播放聽牌效果
     * @param active 
     */
    public playNearMiss(active: boolean) {
        if ( this.nearMissInspect.nearSpine == null ) return;

        let nearSpine = this.nearMissInspect.nearSpine;
        let nearAudio = this.audioInspect.nearAudio;

        if (active === true) {
            nearSpine.node.active = true;
            // this.propertys.nearMiss.audioSource = SoundManager.playSoundData(nearAudio, false);
        } else {
            nearSpine.node.active = false;
            this.propertys.nearMiss.audioSource?.stop();
        }
    }

    public async nearMissMask(active: boolean) {
        if ( this.nearMissInspect.nearMask == null ) return;
        let mask = this.nearMissInspect.nearMask;
        await Utils.commonFadeIn(mask.node, !active, [new Color(0,0,0,0), new Color(0,0,0,200)], mask);
    }

    /**
     * 放置 Symbol
     * @param symbol {Node}   Symbol
     * @param idx    {number} 放置位置
     * @returns      {boolean} 是否成功放置
     */
    public putSymbol(symbol: Node, idx: number): boolean {
        if (symbol == null) return false;

        let container   = this.container;
        let size        = symbol['size'];
        let pos         = this.getSymbolPutPos(idx, size);

        this.setSymbolMachine(symbol);
        container.addChild(symbol);
        symbol.setPosition(pos);
        symbol.active = true;
        
        // 大型 symbol 設置
        if (size?.height > 1) {
            for (let i = 0; i < size.y; i++) {
                this.setSymbolData(symbol, (idx - i));
            }
        } else {
            this.setSymbolData(symbol, idx);
        }

        return true;
    }

    /**
     * 取得當 symbol 要放置到輪帶時，該放置的位置 
     * @param posX 
     * @param posY 
     * @returns Vec3
     */
    public getSymbolPutPos(idx:number, size: Size = new Size(1, 1)): Vec3 {

        let posData = this._propertys.symbolPosData;
        let pos     = posData[idx];
        if ( pos != null) return this.getBigSymbolSize(pos, size);

        let len        = this.wheelLength;
        let symbolSize = this.getSymbolSize();
        let y          = ((len-1) / 2) * symbolSize.y;
        let zeroIdxPos = new Vec3(0, y);
        
        pos    = zeroIdxPos.clone();
        pos.y -= idx * symbolSize.y;
        
        return this.getBigSymbolSize(pos, size);
    }

    /**
     * 取得大型 Symbol 的位置
     * @param originPos 
     * @param size 
     * @returns Vec3
     */
    protected getBigSymbolSize(originPos: Vec3, size: Size = new Size(1, 1)): Vec3 {
        if (size === Size.ONE) return originPos;

        let symbolSize = this.getSymbolSize();
        let y          = originPos.y;
        let x          = originPos.x;

        if (size.y != 1) y += (size.y - 1) * (symbolSize.y / 2);
        if (size.x != 1) x += (size.x - 1) * (symbolSize.x / 2);
        let pos = new Vec3(x, y);

        return pos;
    }

    /**
     * 設定 Symbol 的 Machine
     * @param symbol 
     */
    public setSymbolMachine(symbol: Node) {
        if (symbol == null) return;
        if (this.reel == null) return;
        if (this.machine == null) return;

        let sym = symbol.getComponent(Symbol);
        sym.machine = this.machine;
        sym.wheel = this.node.getComponent(Wheel);
        sym.wheelID = this.wheel._ID;
        symbol['wheelID'] = this.wheel._ID;
    }


    /**
     * 設定 Symbol 資料位置
     * @param symbol 
     * @param idx
     */
    public setSymbolData(symbol: Node, idx: number) {
        let symbolData = this._propertys.symbolData;
        if (symbolData[idx] == null) symbolData[idx] = {};

        let sym = symbol.getComponent<Symbol>(Symbol);
        symbolData[idx]['symbol'] = symbol;
        symbolData[idx]['id'] = sym.symID;
        symbolData[idx]['size'] = symbol?.size;
        symbolData[idx]['uuid'] = symbol.uuid;
        symbolData[idx]['wheelID'] = this.wheel._ID;
        sym.wheelIdx = idx;
    }

    /**
     * 開始 Spin
     */
    public async keepSpin() {
        // 往上抬
        await this.startRollingMove();
        // 持續捲動
        await this.keepRolling();
    }

    /**
     * 往上抬
     */
    protected async startRollingMove() { await this.startRolling.startRolling(this.wheel); }

    /**
     * 保持滾動
     */
    protected async keepRolling() { return await this.rollingInspect.keepRolling(this.node.getComponent(Wheel)); }

    /**
     * 取得最後一個 Symbol 資料
     */
    public get lastSymbolData() {
        let idx = this.heightIdxType[1];
        return this._propertys.symbolData[idx];
    }

    /**
     * 取得滾輪長度
     */
    public get wheelLength() { return this.baseInspect.length; }


    /**
     * 通知停止滾動
     * @param result {array} 盤面結果
     */
    public async stopRolling(result) { return await this.rollingInspect.stopRolling(result); }

    public async nearMissStopRolling(result) { return this.rollingInspect.nearMissStopRolling(result); }


    /**
     * 開始執行 update 事件
     * @param callback 每次 update 時執行的事件 
     */
    public startUpdate(callback: Function) { this._propertys.updateEvent = callback; }

    /**
     * 每幀執行
     * @from startUpdate()
     * @param dt 
     * @returns 
     */
    public update(dt: number) {
        if ( this._propertys.updateEvent == null ) return;
        this._propertys?.updateEvent(this, dt);
    }

    /**
     * 取得 symbol 大小
     */
    public getSymbolSize(): Size { return this.baseInspect.symbolSize; }

    /**
     * 取得所有 symbol 物件
     */
    public allSymbols() { return this.container.children; }

    /**
     * 取得輪帶上有效 Symbol
     */
    public get symbols() {
        const symbols = Object.values(this.getIndexSymbol);
        return symbols.slice(0, this.wheelLength);
    }

    /**
     * 將所有圖標設定為模糊狀態
     */
    public allBlurSymbol() { this.allSymbols().forEach(symbol => symbol.getComponent(Symbol).moving()); }
    /**
     * 將所有圖標設定為正常狀態
     */
    public allNormalSymbol() { this.allSymbols().forEach(symbol=> symbol.getComponent(Symbol).normal()); }

    public allDropSymbol() {
        /*
        let scatterSymbol = this.reel.nearMissSymbols;
        if ( scatterSymbol == null ) scatterSymbol = [];

        this.allSymbols().forEach(symbol => {
            const sym = symbol.getComponent(Symbol);
            const id = sym.inspect.id;

            if ( scatterSymbol.indexOf(id) === -1 ) return;
            let wheelID = this.wheel._ID;
            let clone = this.machine.reel.moveToShowDropSymbol(wheelID, symbol);
            clone.parent = symbol;
            clone.getComponent(Symbol).drop();
        });*/ 
    }

    /**
     * 取得亂數 symbol 編號
     * @returns [string] symbol ID
     */
    protected getRandomSymbolID() {
        let ranSymbols : number[] = this.machine.paytable.rollingRandomSymbols();
        if (ranSymbols == null) ranSymbols = this.baseInspect.rollingSymbols;
        
        return ranSymbols.length ? ranSymbols[Math.floor(Math.random() * ranSymbols.length)] : null;
    }

    /**
     * 滾輪時，取得亂數Symbol
     * @returns symbol : node
     */
    public randomSymbol(): Node { return ObjectPool.Get(this.getRandomSymbolID()); }


    /** 移除指定位置的圖標 */
    public removeSymbol(idx: number) {
        let symbolData = this._propertys.symbolData;
        if (symbolData[idx] == null) return;

        let symbol = symbolData[idx]['symbol'];
        if (symbol == null) return;

        let sym : Symbol = symbol.getComponent(Symbol);
        symbolData[idx] = {
            'symbol': null,
            'id': null,
            'size': null,
            'uuid': null,
        };

        this._propertys.symbolData = symbolData;
        ObjectPool.Put(sym.symID, sym.node);
        sym.wheelIdx = -1;
    }

    /**
     * 移除指定 Symbol
     * @param { Node } symbol 
     */
    public removeSymbolData(symbol: Node) : boolean {
        let symbolData = this._propertys.symbolData;
        let keys = Object.keys(symbolData);
        
        for(let i=0; i<keys.length; i++) {
            let idx = parseInt(keys[i]);
            let data = symbolData[idx];
            if ( data['symbol'] === symbol ) {
                this.removeSymbol(idx);
                return true;
            }
        }

        return false;
    }

    /**
     * 移除所有 Symbol
     */
    public removeAllSymbol() {
        let symbolData = this._propertys.symbolData;
        let keys = Object.keys(symbolData);
        
        for(let i=0; i<keys.length; i++) {
            let idx = parseInt(keys[i]);
            this.removeSymbol(idx);
        }
    }

    /**
     * 取得指定位置的Symbol
     * @param idx 
     * @returns {Node} Symbol
     */
    public getSymbol(idx: number):Node { return this.getSymbolData(idx)?.symbol; }

    /**
     * 放置指定位置的Symbol
     * @param idx 
     * @returns {Node} Symbol
     */
    public putSymbolID(id: number, idx: number): Node {
        let symbol = ObjectPool.Get(id + '');
        this.setSymbolMachine(symbol);
        if (this.putSymbol(symbol, idx)) return symbol;

        return null;
    }
    
    public getSymbolByID(id: number): Node[] {
        const symbolData = this._propertys.symbolData;
        return Object.entries(symbolData).filter(([_, data]) => data['id'] === id).map(([_, data]) => data['symbol']);
    }

    /**
     * 取得滾輪的 symbol 資料
     * @param idx
     * @returns json {'symbol': Node, 'id':number, 'size':Vec2}
     */
    public getSymbolData(idx:number) {
        let symbolData = this._propertys.symbolData;
        if (symbolData[idx] == null) return;

        return symbolData[idx];
    }

    /**
     * 取得滾輪的 symbol ID
     * @param idx
     * @returns number
     */
    public get getSymbolIdxIDs() {
        let data = this.propertys.symbolData;
        return Object.entries(data).reduce((result, [key, value]) => { result[key] = value['id']; return result;}, {});
    }

    /**
     * 取得滾輪的 symbol Node
     * @param idx
     * @returns number
     */
    public get getIndexSymbol() {
        let data = this.propertys.symbolData;
        return Object.entries(data).reduce((result, [key, value]) => {
            let symbol = value['symbol'];
            if (symbol == null) return result;
            symbol.wheelID = this.wheel._ID;
            result[key] = symbol;
            return result;
        }, {});
    }

    public getIndexOfSymbol(symbol:Node) : number {
        let symbols = this.getIndexSymbol;
        let keys = Object.keys(symbols);
        for (let i=0; i<keys.length; i++) {
            let key = keys[i];
            if ( symbols[key] === symbol ) return Number.parseInt(key);
        }

        return -1;
    }

    /**
     * 取得滾輪的 symbol ID
     * @param idx
     * @returns number
     */
    public get getWheelSymbol() {
        let size = this.baseInspect.length;
        return this.getIndexSymbol;
    }

    /**
     * 即將廢棄
     * @deprecated
     * @param id 
     * @returns 
     */
    public getPutWheelSymbol(id: number) {
        let symbol = ObjectPool.Get(id);
        this.setSymbolMachine(symbol);

        return symbol;
    }
}
