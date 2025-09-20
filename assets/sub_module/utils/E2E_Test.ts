import { _decorator, Component, Node, EventHandler } from 'cc';
import { Orientation } from './Viewport';
import { Machine } from '../game/machine/Machine';
import { PREVIEW } from 'cc/env';
import { Utils } from './Utils';
const { ccclass, property } = _decorator;

@ccclass('e2eTest')
/**
 * 
 */
export class E2ETest {
    /// 由 E2E 測試程式設定
    public static get IsE2eTesting() : boolean { 
        if ( PREVIEW ) return true;
        return globalThis?.__IS_E2E_TEST__; 
    } 
    // public static get IsE2eTesting() : boolean { return true; }
    get isE2eTesting() : boolean { return E2ETest.IsE2eTesting; }

    public _machine : Machine;
    public get machine() : Machine { return this._machine; }

    public static async initTest(machine:Machine) {
        new E2ETest();
        this.Instance._machine = machine;
        await Utils.delay(1000);
        this.Instance.setEvent();
        this.E2ELoading();
    }

    public static E2ELoading() {
        if (!E2ETest.IsE2eTesting) return;
        window.dispatchEvent(new Event('ELMO_INTIIALIZED'));
    }

    public static E2EStartLoading() {
        if (!E2ETest.IsE2eTesting) return;
        window.dispatchEvent(new Event('ELMO_INTIIALIZE'));
    }

    public setEvent() {
        if (!E2ETest.IsE2eTesting) return;

        this.machine.Event.on('preload', () => {
            window.dispatchEvent(new Event('ELMO_GAME_PRELOAD'));
        });

        this.machine.Event.on('enter_game', () => {
            window.dispatchEvent(new Event('GAME_READY_TO_SPIN'));
        });

        this.machine.Event.on('spin', this.startSpinEvent.bind(this));
        this.machine.Event.on('spin_end', this.stopSpinEvent.bind(this));
        this.machine.Event.on('free_game_spin', this.freeGameStartSpinEvent.bind(this));
        this.machine.Event.on('free_game_spin_end', this.freeGameStopSpinEvent.bind(this));


        var elmoTags = globalThis.__ELMO_TAGS__;
        if ( elmoTags == null ) {
            elmoTags = new Map<string, string>();
            globalThis.__ELMO_TAGS__ = elmoTags;
        }

        elmoTags.set("ELMO_SPIN_BUTTON", this.machine.controller.spinButton.node.getPathInHierarchy());
        elmoTags.set("ELMO_BALANCE_TEXT", this.machine.controller.balanceLabel.node.getPathInHierarchy());
        elmoTags.set("ELMO_TOTAL_WIN_TEXT", this.machine.controller.totalWinLabel.node.getPathInHierarchy());
        
        // console.log('E2E Test: Event Set', this.machine.Event, elmoTags);
    }

    public static Instance: E2ETest;

    constructor() {
        E2ETest.Instance = this;
    }

    /**
     * 執行 Spin Event
     */
    public startSpinEvent() {
        // console.log('E2E Test: Spin Event');
        window.dispatchEvent(new Event('ELMO_GAME_SPIN'));
        // window.dispatchEvent(new Event('ELMO_MAIN_GAME_SPIN'));
    }

    /**
     * 停止 Spin Event
     */
    public stopSpinEvent() {
        // console.log('E2E Test: Spin End Event');
        window.dispatchEvent(new Event('ELMO_GAME_SPINNED'));
    }

    public freeGameStartSpinEvent() {
        window.dispatchEvent(new Event('ELMO_FREE_GAME_SPIN'));
    }

    public freeGameStopSpinEvent() {
        window.dispatchEvent(new Event('ELMO_FREE_GAME_SPINNED'));
    }
}

export default E2ETest;