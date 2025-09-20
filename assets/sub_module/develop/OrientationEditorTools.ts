import { _decorator, CCBoolean, Component, Enum, EventHandler, find, instantiate, log, Node, Size, UITransform, Vec2, Vec3 } from 'cc';
import {Orientation, Viewport} from '../utils/Viewport';
import { OrientationNode, OrientationItem } from './OrientationNode';
const { ccclass, property, menu, help, disallowMultiple, executeInEditMode } = _decorator;
import { Utils, _utilsDecorator } from '../utils/Utils';
import { EDITOR } from 'cc/env';
const { isDevelopFunction } = _utilsDecorator;

@ccclass('OrientationEditorTools')
@executeInEditMode
export class OrientationEditorTools extends Component {
    @property({displayName: '主控制器, 全場 Scene 只能有一個是主控制器', tooltip: 'isMainController'})
    public isMainController: boolean = false;

    @property({type:[Node], displayName: '紀錄節點', tooltip: 'saveNodes' })
    public saveNodes: Node[] = [];

    private _orientation: Orientation = Orientation.PORTRAIT;
    @property({type:Enum(Orientation), displayName: '轉向設定', tooltip: '紀錄目前的轉向設定', visible:function(this:OrientationEditorTools) { return this.isMainController; }})
    public set orientation(value: Orientation) {
        this._orientation = value;
        this.onOrientationChange(value);
        if ( this.isMainController === true ) {
            OrientationEditorTools.subOrientationController.forEach( (controller:OrientationEditorTools) => controller.subOrientation(value) );
        }
    }

    @property({type:CCBoolean, displayName: '鎖定轉向', tooltip: '是否鎖定轉向'})
    public isLockOrientation : boolean = false;
    
    @property({type:Enum(Orientation), displayName: '鎖定轉向設定', tooltip: '鎖定轉向設定', visible:function(this:OrientationEditorTools) { return this.isLockOrientation; }})
    public lockedOrientation : Orientation = Orientation.PORTRAIT;

    public get orientation() { 
        if ( this.isMainController === true ) return this._orientation;
        return OrientationEditorTools.instance.orientation;
    }

    @property({type:Enum(Orientation), displayName: '不轉向切換設定', tooltip: '不會執行轉向功能'})
    public set changeOrientation(value: Orientation) { this._orientation = value; }
    public get changeOrientation() { return this._orientation; }
    

    public subOrientation(orientation:Orientation) {
        // this.backupOrientationData();
        this.onOrientationChange(orientation);
    }

    @property({type:CCBoolean, displayName: '儲存轉向資料', tooltip: '是否儲存轉向資料'})
    public set SaveOrientationData(value: boolean) {
        if ( EDITOR === false ) return;
        if ( value === false ) return;
        let orientation = this.orientation;
        if ( this.saveNodes.length === 0 ) return;
        for(let i=0; i<this.saveNodes.length; i++) {
            this.onCheckOrientationNode(orientation, this.saveNodes[i], this.saveOrientationData.bind(this), this.saveNodes[i].getPathInHierarchy());
        }

        if ( this.isMainController === true ) {
            OrientationEditorTools.subOrientationController.forEach( (controller:OrientationEditorTools) => controller.SaveOrientationData = value );
        }
    }
    public get SaveOrientationData() { return false; }

    public viewport : Viewport;
    public static instance: OrientationEditorTools = null;
    private static subOrientationController: OrientationEditorTools[] = [];
    public static addSubOrientationController( controller: OrientationEditorTools ): void { OrientationEditorTools.subOrientationController.push(controller); }

    public onLoad(): void { 
        if ( this.isMainController === true ) {
            console.log('OrientationEditorTools', this.isLockOrientation);
            if ( this.isLockOrientation ) {
                Viewport.DevelopLockOrientation = this.lockedOrientation;
                console.log('Viewport.DevelopLockOrientation', Viewport.DevelopLockOrientation);
            }
            OrientationEditorTools.instance = this;
            Utils.delay(300).then( () => { Viewport.lockResizeHandler(); } );
        } else {
            OrientationEditorTools.addSubOrientationController(this);
        }
        this.viewport = Viewport.instance;

        if ( EDITOR === true ) return;
        let event             = new EventHandler();
        event.target          = this.node;
        event.component       = 'OrientationEditorTools';
        event.handler         = 'onOrientationChange';
        event.customEventData = '';
        this.viewport.addOrientationChangeEventHandler(event);
    }

    start() {
        if ( EDITOR === true ) return;
        this.onOrientationChange(this.viewport.getCurrentOrientation());
    }

    // 變更轉向設定
    onOrientationChange( orientation: Orientation ): void {
        
        let saveNodes = this.saveNodes;
        if ( saveNodes.length === 0 ) return;
        
        for(let i=0; i<saveNodes.length; i++) {
            const node = saveNodes[i];
            const orientationNode = node?.getComponent(OrientationNode);
            if ( orientationNode == null ) continue;
            orientationNode.changeOrientation(orientation);

        }

        return;
    }

    onCheckOrientationNode( orientation: Orientation, node:Node, callEvent:Function, parentPath:string ): void {
        if ( node == null ) return;
        callEvent(orientation, node, parentPath);

        let children = node.children;
        if ( children.length === 0 ) return;
        children.forEach( (child:Node) => { this.onCheckOrientationNode(orientation, child, callEvent, parentPath); } );
    }
    
    saveOrientationData( orientation: Orientation, node:Node, parentPath:string ): void {
        if ( node == null ) return;
        return this.saveOrientationItem(orientation, node, parentPath);
    }

    saveOrientationItem( orientation: Orientation, node:Node, parentPath:string ): void {
        if ( EDITOR === false ) return;
        let orientationNode = node.getComponent(OrientationNode);
        if ( orientationNode == null ) orientationNode = node.addComponent(OrientationNode);

        orientationNode.saveOrientationItem(orientation);
    }
}

