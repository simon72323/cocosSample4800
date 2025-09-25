import { _decorator } from 'cc';
import { DEBUG, PREVIEW } from 'cc/env';
// import { ConfigUtils } from '../utils/ConfigUtils';
import { GAConfig } from './GAConfig';
import { UrlParameters } from '../utils/UrlParameters';
import { gameInformation } from '../game/GameInformation';
const { ccclass, property } = _decorator;

/**
 * Google Analytics 分析系統
 * 負責管理 Google Analytics 的初始化、配置和事件追蹤
 */
@ccclass( 'GoogleAnalytics' )
export class GoogleAnalytics {
    //#region Singleton
    /** 單例實例 */
    protected static _instance: GoogleAnalytics;
    /** 獲取單例實例 */
    public static get instance () {
        if ( !GoogleAnalytics._instance ) {
            GoogleAnalytics._instance = new GoogleAnalytics();
        }
        return GoogleAnalytics._instance;
    }
    //#endregion

    /** Google Analytics 自定義事件名稱 */
    public static readonly GA_EVENT: string = 'GA_EVENT';

    /** 通用 GA 追蹤代碼列表 */
    protected commonCode: Array<string>;
    /** 允許使用 GA 的遊戲 ID 列表 */
    protected allowGameId: Array<number>;
    /** 最終使用的 GA 追蹤代碼列表 */
    protected gaCode: Array<string>;

    /** GA 配置物件 */
    protected gaConfig: GAConfig;

    /** 私有建構函數，防止外部實例化 */
    protected constructor () {
        //
    }

    /**
     * 初始化 Google Analytics
     * 根據環境和遊戲 ID 設定對應的追蹤代碼
     */
    public initialize (): void {
        // 獲取 GA 配置
        this.gaConfig = new GAConfig();
        // 根據 URL 參數 b 決定是否使用通用代碼
        this.commonCode = ( UrlParameters.b === 'iqazwsxi' ) ? this.gaConfig.commonCode : [];
        // 設定允許的遊戲 ID 列表
        this.allowGameId = this.gaConfig.allowGameId;
        // 初始化 GA 代碼陣列
        this.gaCode = [];
        this.gaCode = this.gaCode.concat( this.commonCode );

        // 根據遊戲 ID 添加對應的 GA 代碼
        const gameID = gameInformation.gameid;
        let codes: any = this.getGACode();
        if ( codes[ gameID ] ) {
            this.gaCode.push( codes[ gameID ] );
        }
        // 動態添加 Google Analytics 腳本
        this.addGoogleAnalytics();
    }

    /**
     * 根據環境獲取對應的 GA 追蹤代碼配置
     * @returns GA 代碼配置物件
     */
    protected getGACode (): any {
        if ( PREVIEW ) {
            // 預覽環境使用開發配置
            return this.gaConfig.DEVELOPMENT;
        } else if ( DEBUG ) {
            // 除錯環境使用實驗室配置
            return this.gaConfig.LAB;
        } else {
            // 正式環境使用生產配置
            /*
            switch ( UrlParameters.b ) {
                case 'iqazwsxi':
                    return this.gaConfig.ID_IDN;

                case 'pqazwsxm':
                    return this.gaConfig.PH_MW;

                case 'tqazwsxx':
                    return this.gaConfig.TH_X2;
                case 'iqazwsxd':
                    return this.gaConfig.PH_MW;
            }*/
            return this.gaConfig.ID_IDN;
            return [];
        }
    }

    /**
     * 動態添加 Google Analytics 腳本到頁面
     * 為每個 GA 代碼創建對應的腳本標籤和事件監聽器
     */
    protected addGoogleAnalytics (): void {
        for ( let i = 0; i < this.gaCode.length; i++ ) {
            // 獲取頁面 head 元素
            let head: HTMLHeadElement = document.getElementsByTagName( 'head' )[ 0 ];
            // 創建 GA 腳本標籤
            let gaCodeSrc: HTMLScriptElement = document.createElement( 'script' );
            // 創建 GA 初始化腳本
            let gaCodeContent: HTMLScriptElement = document.createElement( 'script' );
            head.appendChild( gaCodeSrc );
            head.appendChild( gaCodeContent );

            // 設定腳本為異步載入
            gaCodeSrc.async = true;
            // 設定 GA 腳本來源
            gaCodeSrc.src = 'https://www.googletagmanager.com/gtag/js?id=' + this.gaCode[ i ];
            // 設定 GA 初始化代碼和事件監聽器
            gaCodeContent.innerHTML = 'window.dataLayer = window.dataLayer || [];\n' +
                'function gtag() { dataLayer.push( arguments ); }\n' +
                'gtag( "js", new Date() );\n' +
                `gtag( "config", "${ this.gaCode[ i ] }" );\n` +
                `window.addEventListener( '${ GoogleAnalytics.GA_EVENT }', (event) => { gtag( event.detail.event, event.detail.message, event.detail.other ); });`;
        }
    }

    /**
     * 添加 Google Analytics 事件追蹤
     * 只有允許的遊戲 ID 才會發送事件
     * @param data 事件資料物件
     */
    public addGtag ( data: IGAEvent ): void {
        // 檢查遊戲 ID 是否在允許列表中
        if ( this.allowGameId.includes( UrlParameters.gameId ) ) {
            // 創建自定義事件資料
            let eventData: CustomEventInit<IGAEvent> = {
                detail: {
                    event: data.event,
                    message: data.message,
                    other: data.other ?? this.getDefaultGTagData()
                }
            };
            // 發送自定義事件，觸發 GA 追蹤
            window.dispatchEvent( new CustomEvent( GoogleAnalytics.GA_EVENT, eventData ) );
        }
    }

    /**
     * 獲取預設的 GTag 資料
     * @returns 預設的追蹤資料物件
     */
    protected getDefaultGTagData (): any {
        let codes: any = this.getGACode();
        return {
            'send_to': codes[ UrlParameters.gameId ],
            'event_category': 'click'
        }
    }
}

/**
 * Google Analytics 事件介面
 * 定義事件追蹤所需的資料結構
 */
export interface IGAEvent {
    /** 事件名稱 */
    event: string;
    /** 事件訊息 */
    message: string;
    /** 其他自定義參數（可選） */
    other?: any;
}