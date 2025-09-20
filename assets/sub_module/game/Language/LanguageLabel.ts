import { _decorator, Component, Label } from 'cc';
import { i18n } from '../../utils/i18n';
import { EDITOR } from 'cc/env';
const { ccclass, property, menu, help, disallowMultiple, executeInEditMode } = _decorator;

@ccclass('LanguageLabel')
@menu('SlotMachine/i18n/LanguageLabel')
@help('https://docs.google.com/document/d/1dphr3ShXfiQeFBN_UhPWQ2qZvvQtS38hXS8EIeAwM-Q/edit#heading=h.xpevc16ykigp')
@executeInEditMode(true)
export class LanguageLabel extends Label {
    @property({ displayName: 'LanguageKey' })
    public key = 'game';

    @property({ displayName: 'LanguageID' })
    public languageID = 0;

    @property({ displayName: '取得文字' })
    public set getMessage(value: boolean) { this.displayContent(); }

    public get getMessage(): boolean { return false; }

    @property({ displayName: '如果有設定字體大小群組，則會使用該群組的字體大小(fontSizeGroupName)', tooltip: '如果有設定字體大小群組，則會使用該群組的字體大小' })
    public fontSizeGroupName = '';

    start() {
        this.node['setID'] = this.setID;
        this.displayContent();
    }

    public set setID(id: string) {
        this.key = id;
        this.displayContent();
    }

    public displayContent() {
        if (this.key == null || this.key.length == 0) return;

        let content = i18n.getContent(this.key, this.languageID, this);
        if (EDITOR) console.log('displayContent', this.key, content);
        if (content == null || content.length == 0) return;

        this.string = content;
    }

}

