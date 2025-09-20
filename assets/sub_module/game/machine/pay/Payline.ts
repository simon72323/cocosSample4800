import { _decorator, Component, Node, tween, Vec3 } from 'cc';
import { Paytable } from './PayTable';
import { Utils } from '../../../utils/Utils';
import { Symbol } from '../Symbol';
import { Machine } from '../Machine';
const { ccclass, property } = _decorator;

@ccclass('Payline')
export class Payline extends Paytable {

    /** 得獎線位置資料 */
    protected payLineData = [
        
    ];

    protected onload() { return; }

    // 給予專案 start 使用
    protected onstart() { return; }

    /**
     * 進入報獎流程
     * @override 可覆寫
     * @todo 如果有中獎的話, 進入報獎流程
     * @todo 報獎完畢後，如果分數高於 BigWin 分數，進入 BigWin 流程
     * @todo 如果玩家沒有中斷報獎流程，則進入輪播報獎流程
     */
    public async processWinningScore(totalWinScore: number=null) {
        const gameResult = this.gameResult;
        const { pay_line } = gameResult;

        let pay_credit_total = gameResult.pay_credit_total;
        if ( totalWinScore != null ) pay_credit_total = totalWinScore;

        this.reel.closeNearMissMask();  // 關閉 NearMiss 遮罩
        if ( pay_credit_total === 0 ) return;
        if ( pay_line == null || pay_line.length === 0 ) return;
        
        await super.processWinningScore(pay_credit_total);
        await super.processBigWin(pay_credit_total);
    }

    /**
     * 播放全部獎項
     */
    public async performAllPayline(totalWinScore: number=null, isLooping: boolean=false) {
        const { pay_line } = this.gameResult;
        const totalWinLabel = this.totalWinLabel;
        // console.log('performAllPayline', this.gameResult);
        this.reel.moveBackToWheel();            // 將所有 Symbol 移回輪中

        let pay_credit_total = this.gameResult.pay_credit_total;
        if ( totalWinScore != null ) pay_credit_total = totalWinScore;

        // 播放全部獎項
        let max_wait_sec = 0;
        for(let i = 0; i < pay_line.length; i++) {
            let way = pay_line[i];
            let sec = await this.performSingleLine(way);
            if ( sec > max_wait_sec ) max_wait_sec = sec;
        }
        
        if ( max_wait_sec > 0 && pay_credit_total > 0 ) {
            await this.reelMaskActive(true);        // 打開遮罩
            Utils.commonTweenNumber(totalWinLabel, 0, pay_credit_total, (max_wait_sec/2) ); // 播放總得分
            const waitSec = max_wait_sec * 1000;
            await Utils.delay(waitSec); 
        }
        await this.reel.waitGameOnHide();

        this.reel.moveBackToWheel();            // 將所有 Symbol 移回輪中
        totalWinLabel.string = '';              // 關閉總得分

        if ( this.machine.featureGame === true ) {
            this.controller.addTotalWin(pay_credit_total);    // 增加總得分
        } else {
            if ( isLooping === true ) return;
            this.controller.changeTotalWin(pay_credit_total); // 更新總得分
            this.controller.refreshBalance();                 // 更新餘額
        }
    }

    public getWinLineSymbol(lineData:any) : Node[] {
        const { pay_line, amount } = lineData;
        const wheels = this.reel.getWheels();
        const payLineIdxData = this.payLineData[pay_line];
        let symbols : Node[] = [];

        if ( payLineIdxData == null ) return symbols;
        for(let i=0; i<amount; i++) {
            const idx = payLineIdxData[i];
            const symbol = wheels[i].getSymbol(idx);
            if ( symbol == null ) continue;
            const sym = this.reel.moveToShowDropSymbol(i, symbol);
            symbols.push(sym);
        }

        return symbols;
    }

    /** {"pay_line": 3,"symbol_id": 3, "amount": 3, "pay_credit": 1000 } */
    public async performSingleLine(lineData: any, isWaiting: boolean=false) : Promise<number> {
        if ( lineData == null || !lineData.symbol_id || !lineData.pay_credit ) return 0;
        this.totalWinLabel.string = '';

        const { pay_credit } = lineData;
        let winSec = 1;
        let firstWorldPosition = null;

        const win_symbols = this.getWinLineSymbol(lineData);
        winSec            = this.getSymbolsAnimationDuration(win_symbols, winSec);                   // 取得最大的動畫時間
        if (firstWorldPosition == null) firstWorldPosition = this.getFirstSymbolPosition(win_symbols); // 取得第一個 Symbol 的位置

        win_symbols.forEach( symbol=> {
            let sym : Symbol = symbol.getComponent(Symbol);
            sym.win();
            if ( sym.isPriority === true ) {
                const idx = symbol.parent.children.length - 1;
                symbol.setSiblingIndex(idx);
            }
        });

        await this.performSingleLineEvent(lineData);
        
        if ( isWaiting ) {
            this.displaySingleWinNumber(pay_credit, firstWorldPosition);
            await Utils.delay(winSec * 1000);
            this.displaySingleWinNumber(0);
        }
        return winSec;
    }

    /**
     * 單獎輪播
     */
    public async performSingleLineLoop() {
        const { pay_line, pay_credit_total } = this.gameResult;

        if ( this.machine.featureGame === true )   return this.normalState();
        if ( this.gameResult.noLoop === true )     return this.normalState();
        if ( pay_credit_total === 0 )              return this.normalState();
        if ( pay_line == null || pay_line.length === 0 ) return this.normalState();
        this.loopTime = Date.now();
        const loopTime = this.loopTime;

        await this.reelMaskActive(true);      // 打開遮罩
        let idx = 0;
        this.machine.state = Machine.SPIN_STATE.PERFORM_SCORE;
        while(true) {
            if ( loopTime !== this.loopTime ) return;
            await this.performSingleLine(pay_line[idx], true);
            if ( this.machine.state !== Machine.SPIN_STATE.PERFORM_SCORE ) return;
            this.reel.moveBackToWheel();        // 將所有 Symbol 移回輪中
            idx++;
            if ( idx >= pay_line.length ) {
                await this.performAllPayline(null, true);
                idx = 0;
            }
        }
    }
}

