import { _decorator, Node, Label, Sprite, UITransform, Widget, Layout, Button, EventHandler } from 'cc';
import { VIEW_CONFIG } from './config';
import { InGameInformation } from '../ingamemenu/InGameInformation';

const { ccclass, property } = _decorator;

export class InGameMenuContent {
    ratio = 16 / 9;
    urlLanguage = 'en';
    gameInstance;

    // 屬性聲明 - 改為 Cocos Node
    IS_NEED_CONFIRM: boolean;
    POPUP_WIDTH: number;
    POPUP_HEIGHT: number;
    inGameMenuPopupWindow: Node;
    inGameMenu: Node;
    closeButton: Node;
    confirmContainer: Node;
    confirmWindow: Node;
    hasInit: boolean;
    isPortrait: boolean;
    isFavIndex: boolean;
    selectedGameId: number;
    isNeedToUpdate: boolean;
    displayLanguage: string;
    confirmMessage: string;
    inGameMenuContent: Node;
    background: Node;
    gameListButton: Node;
    favListButton: Node;
    containerFluid: Node;
    confirmText: Node;
    confirmYesButton: Node;
    confirmNoButton: Node;

    constructor(parent) {
        this.gameInstance = parent;
        this.IS_NEED_CONFIRM = true;
        this.POPUP_WIDTH = 890;
        this.POPUP_HEIGHT = 1660;
        
        this.inGameMenuPopupWindow = null;
        this.inGameMenu = null;
        this.closeButton = null;
        this.confirmContainer = null;
        this.confirmWindow = null;
        this.hasInit = false;
        this.isPortrait = true;
        this.isFavIndex = false;
        this.selectedGameId = 0;
        this.isNeedToUpdate = false;
        this.setDisplayLanguage();
    }

    setDisplayLanguage() {
        let confirmMsg = {
            'en': 'Leave this game and switch to ',
            'zh-cn': '离开当前游戏并前往',
            'ko': '플레이',
            'id': 'Tinggalkan game ini dan beralih ke ',
            'vi': 'rời khỏi trò chơi này và chuyển sang ',
            'th': 'ออกจากเกมนี้และเปลี่ยนเป็น ',
            'ms': 'Tinggalkan permainan ini dan beralih kepada ',
            'ph': 'Iwanan ang larong ito at lumipat sa ',
        };

        let language = this.urlLanguage;
        this.displayLanguage = (confirmMsg[language]) ? language : 'en';
        this.confirmMessage = confirmMsg[this.displayLanguage];
    }

    init() {
        let url = './inGameMenu.html';
        fetch(url).then(response => response.text()).then((result) => {
            // 創建彈窗容器
            this.inGameMenuPopupWindow = new Node('popup-window');
            this.inGameMenu = new Node('ingamemenu');

            // 設置尺寸
            let popupTransform = this.inGameMenuPopupWindow.addComponent(UITransform);
            popupTransform.setContentSize(this.POPUP_WIDTH, this.POPUP_HEIGHT);

            // 創建內容容器
            this.inGameMenuContent = new Node('ingamemenu-content');
            let contentTransform = this.inGameMenuContent.addComponent(UITransform);
            contentTransform.setContentSize(672, 1138);

            // 創建背景
            this.background = new Node('background');
            let bgSprite = this.background.addComponent(Sprite);
            // 設置背景圖片
            this.inGameMenuContent.addChild(this.background);

            // 創建按鈕
            this.gameListButton = this.createButton('allButton', `igm_popular_${this.displayLanguage}_0`);
            this.favListButton = this.createButton('favButton', `igm_favorite_${this.displayLanguage}_0`);
            
            this.inGameMenuContent.addChild(this.gameListButton);
            this.inGameMenuContent.addChild(this.favListButton);

            // 創建遊戲列表容器
            this.containerFluid = new Node('container-fluid-gamelist');
            let containerTransform = this.containerFluid.addComponent(UITransform);
            containerTransform.setContentSize(650, 950);
            this.inGameMenuContent.addChild(this.containerFluid);

            // 添加遊戲列表
            let gameList = InGameInformation.instance.inGameMenuConfig.gameList;
            for (let i = 0; i < gameList.length; i++) {
                this.containerFluid.addChild(this.getImageElement(gameList[i]));
            }

            // 創建關閉按鈕
            this.closeButton = this.createButton('closeButton', 'igm_close');
            this.inGameMenuContent.addChild(this.closeButton);

            this.isNeedToUpdate = false;
            this.addListener();
            this.refreshTab();
            this.setCss();
        });
    }

    createButton(id: string, className: string): Node {
        let button = new Node(id);
        let buttonComp = button.addComponent(Button);
        let transform = button.addComponent(UITransform);
        transform.setContentSize(100, 50);

        // 設置按鈕樣式
        let sprite = button.addComponent(Sprite);
        // 根據 className 設置對應的圖片

        return button;
    }

    refreshTab() {
        if (this.isFavIndex) {
            this.updateButtonClass(this.gameListButton, `igm_popular_${this.displayLanguage}_1`);
            this.updateButtonClass(this.favListButton, `igm_favorite_${this.displayLanguage}_0`);
            this.setButtonPosition(this.gameListButton, 95, 14);
            this.setButtonPosition(this.favListButton, 90, 224);

            this.containerFluid.removeAllChildren();
            let gameList = InGameInformation.instance.inGameMenuConfig.favList;
            for (let i = 0; i < gameList.length; i++) {
                this.containerFluid.addChild(this.getImageElement(gameList[i]));
            }
        } else {
            this.updateButtonClass(this.gameListButton, `igm_popular_${this.displayLanguage}_0`);
            this.updateButtonClass(this.favListButton, `igm_favorite_${this.displayLanguage}_1`);
            this.setButtonPosition(this.gameListButton, 90, 14);
            this.setButtonPosition(this.favListButton, 95, 208);

            this.containerFluid.removeAllChildren();
            let gameList = InGameInformation.instance.inGameMenuConfig.gameList;
            for (let i = 0; i < gameList.length; i++) {
                this.containerFluid.addChild(this.getImageElement(gameList[i]));
            }
        }
    }

    updateButtonClass(button: Node, className: string) {
        // 更新按鈕的樣式類別
        let sprite = button.getComponent(Sprite);
        // 根據 className 更新圖片
    }

    setButtonPosition(button: Node, top: number, left: number) {
        let widget = button.getComponent(Widget) || button.addComponent(Widget);
        widget.isAlignTop = true;
        widget.isAlignLeft = true;
        widget.top = top;
        widget.left = left;
    }

    refreshItem(gameId: number) {
        let item = this.containerFluid.getChildByName(`add-${gameId}`);
        if (item) {
            let isFav = InGameInformation.instance.inGameMenuConfig.favList.includes(gameId);
            this.updateButtonClass(item, isFav ? 'igm_favorite_but_0' : 'igm_favorite_but_1');
        }
    }

    getImageElement(gameId: number): Node {
        let isFav = InGameInformation.instance.inGameMenuConfig.favList.includes(gameId);
        let isNew = InGameInformation.instance.inGameMenuConfig.new.includes(gameId);
        let isHot = InGameInformation.instance.inGameMenuConfig.hot.includes(gameId);

        // 創建遊戲圖標容器
        let gameIconContainer = new Node('game-icon-container');
        let containerTransform = gameIconContainer.addComponent(UITransform);
        containerTransform.setContentSize(100, 100);

        // 創建底板
        let boardDiv = new Node('board');
        let boardSprite = boardDiv.addComponent(Sprite);
        gameIconContainer.addChild(boardDiv);

        // 創建遊戲圖標
        let imageElement = new Node(`open-${gameId}`);
        let imageSprite = imageElement.addComponent(Sprite);
        let imageTransform = imageElement.addComponent(UITransform);
        imageTransform.setContentSize(80, 80);

        // 設置圖片
        let language = (this.displayLanguage === 'zh-cn') ? 'zh_cn' : this.displayLanguage;
        let imageURL = `${InGameInformation.instance.inGameMenuConfig.imageURL}${language}/${gameId}.png`;
        // 載入圖片資源
        // resources.load(imageURL, SpriteFrame, (err, spriteFrame) => {
        //     if (!err) {
        //         imageSprite.spriteFrame = spriteFrame;
        //     }
        // });

        gameIconContainer.addChild(imageElement);

        // 創建標籤
        let label = new Node(`gameLabel-${gameId}`);
        let labelSprite = label.addComponent(Sprite);
        let labelName = isNew ? 'igm_new' : 'igm_hot';
        label.active = isNew || isHot;
        gameIconContainer.addChild(label);

        // 創建收藏按鈕
        let favIcon = new Node(`add-${gameId}`);
        let favSprite = favIcon.addComponent(Sprite);
        let favButton = favIcon.addComponent(Button);
        let favName = isFav ? 'igm_favorite_but_0' : 'igm_favorite_but_1';
        gameIconContainer.addChild(favIcon);

        // 添加事件監聽
        favButton.node.on(Button.EventType.CLICK, this.touchEventHandler, this);
        imageElement.on(Button.EventType.CLICK, this.touchEventHandler, this);

        return gameIconContainer;
    }

    createInGameMenu() {
        this.init();
    }

    addListener() {
        if (this.closeButton) {
            let closeBtn = this.closeButton.getComponent(Button);
            closeBtn.node.on(Button.EventType.CLICK, this.touchEventHandler, this);
        }
        if (this.gameListButton) {
            let gameBtn = this.gameListButton.getComponent(Button);
            gameBtn.node.on(Button.EventType.CLICK, this.touchEventHandler, this);
        }
        if (this.favListButton) {
            let favBtn = this.favListButton.getComponent(Button);
            favBtn.node.on(Button.EventType.CLICK, this.touchEventHandler, this);
        }
    }

    touchEventHandler(event: Event) {
        // 從事件目標獲取按鈕組件，再獲取節點
        let button = event.currentTarget as any;
        let target = button.node || button;
        let targetId = target.name;
        
        if (targetId.startsWith('add')) {
            let gameId = parseInt(targetId.split('-')[1]);
            this.addToFavorite(gameId);
        } else if (targetId.startsWith('open')) {
            let gameId = parseInt(targetId.split('-')[1]);
            this.showConfirmDialog(gameId);
        } else if (targetId === 'closeButton') {
            this.requestToCloseWindow();
        } else if (targetId.startsWith('confirm')) {
            let command = targetId.split('-')[1];
            if (command === 'yes') {
                this.requestToOpenNewGame(this.selectedGameId);
            } else if (command === 'no') {
                this.confirmWindow.destroy();
            }
        } else {
            if (targetId === 'favButton') {
                if (this.isFavIndex !== true) {
                    this.isFavIndex = true;
                }
            } else if (targetId === 'allButton') {
                if (this.isFavIndex !== false) {
                    this.isFavIndex = false;
                }
            }
            this.refreshTab();
        }
    }

    addToFavorite(gameId: number) {
        if (InGameInformation.instance.inGameMenuConfig.favList.includes(gameId)) {
            this.removeItem(InGameInformation.instance.inGameMenuConfig.favList, gameId);
        } else {
            InGameInformation.instance.inGameMenuConfig.favList.push(gameId);
            InGameInformation.instance.inGameMenuConfig.favList.sort((a, b) => b - a);
        }
        this.isNeedToUpdate = true;
        this.refreshItem(gameId);
    }

    createConfirmWindow() {
        this.confirmContainer = new Node('confirmContainer');
        this.confirmWindow = new Node('confirmWindow');
        this.confirmWindow.addChild(this.confirmContainer);

        // 創建背景
        let background = new Node('background');
        let bgSprite = background.addComponent(Sprite);
        this.confirmContainer.addChild(background);

        // 創建確認文字
        this.confirmText = new Node('confirmText');
        let textLabel = this.confirmText.addComponent(Label);
        let displayText = `${this.confirmMessage} "${this.getGameName()}"?`;
        textLabel.string = displayText;
        this.confirmContainer.addChild(this.confirmText);

        // 創建確認按鈕
        this.confirmYesButton = this.createButton('confirm-yes', `igm_confirm_${this.displayLanguage}`);
        this.confirmNoButton = this.createButton('confirm-no', `igm_cancel_${this.displayLanguage}`);
        
        this.confirmContainer.addChild(this.confirmYesButton);
        this.confirmContainer.addChild(this.confirmNoButton);

        this.setCss();
    }

    getGameName(): string {
        const gameData = InGameInformation.instance.inGameListStore[this.selectedGameId];
        return gameData[this.urlLanguage] ?? gameData['en'];
    }

    showConfirmDialog(gameId: number) {
        this.selectedGameId = gameId;
        if (this.IS_NEED_CONFIRM) {
            this.createConfirmWindow();
        } else {
            this.requestToOpenNewGame(this.selectedGameId);
        }
    }

    requestToOpenNewGame(gameId: number) {
        this.gameInstance.getGameUrl(gameId);
    }

    requestToCloseWindow() {
        if (this.isNeedToUpdate) {
            this.gameInstance.updateFavoriteList();
        } else {
            this.closeWindowAndSave();
        }
    }

    closeWindowAndSave() {
        if (this.inGameMenuPopupWindow) {
            this.inGameMenuPopupWindow.destroy();
        }
    }

    onResize(isPortrait: boolean) {
        this.isPortrait = isPortrait;
        this.setCss();
    }

    setCss() {
        let scale: number;
        let rate: number;
        
        if (this.isPortrait) {
            scale = VIEW_CONFIG.WIDTH * this.ratio / this.POPUP_WIDTH;
            rate = 0.86;
        } else {
            scale = 320 * this.ratio / this.POPUP_WIDTH;
            rate = 0.9;
        }

        if (this.inGameMenuPopupWindow) {
            let transform = this.inGameMenuPopupWindow.getComponent(UITransform);
            transform.setContentSize(this.POPUP_WIDTH, this.POPUP_HEIGHT * rate);
            
            // 設置縮放
            this.inGameMenuPopupWindow.setScale(scale, scale, 1);

            if (this.isPortrait) {
                let contentTransform = this.inGameMenuContent.getComponent(UITransform);
                contentTransform.setContentSize(672, 1138);
                
                let containerTransform = this.containerFluid.getComponent(UITransform);
                containerTransform.setContentSize(650, 950);
            } else {
                let contentTransform = this.inGameMenuContent.getComponent(UITransform);
                contentTransform.setContentSize(1111, 633);
                
                let containerTransform = this.containerFluid.getComponent(UITransform);
                containerTransform.setContentSize(1084, 502);
            }

            this.refreshTab();
        }
    }

    removeItem(array: number[], item: number): number[] {
        let index = array.indexOf(item);
        if (index > -1) {
            array.splice(index, 1);
        }
        return array;
    }

    public setLanguage(set: string) {
        this.urlLanguage = set;
        this.setDisplayLanguage();
    }

    public setRatio(set: number) {
        this.ratio = set;
    }
}