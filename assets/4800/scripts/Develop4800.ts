import { _decorator, Component, EventTarget } from 'cc';
import { _utilsDecorator, Utils } from '../../sub_module/utils/Utils';
import { gameInformation } from '../../sub_module/game/GameInformation';
import { Machine } from '../../sub_module/game/machine/Machine';
import { Paytable4800 } from './Paytable4800';
const { ccclass, property } = _decorator;
const { isDevelopFunction } = _utilsDecorator;

@ccclass('Develop4800')
export class Develop4800 extends Component {
    @property({ displayName: '是否改寫封包資訊' })
    public isRewritePackage: boolean = false;

    public machine: Machine = null;

    start() {
        if (Utils.isDevelopment() === false) return;
        (window as any).develop = this;
        this['gameInformation'] = gameInformation;
        this.init();
    }

    @isDevelopFunction()
    private init() {
        this.machine = Machine.Instance;

        if (this.isRewritePackage === false) return;
        const event: EventTarget = this.machine.clearSpinEvent();
        event.on('done', this.rewritePackage, this);
    }

    private async rewritePackage() {
        return;
    }

    public test3() {

        return {
            '3900': {
                'en': {
                    wildTitle: 'Wild',
                    wildDescription: 'Replace all symbols, except <div><div class="symbol_9 sprite"></div></div>.',
                    symbolTitle: 'Symbol',
                    symbolDescription: 'All winning symbols will explode and new symbols will start to cascade down and ready for the next hit.',
                    scatterTitle: 'Scatter',
                    scatterDescription: '1. Any 3 or more Scatter will trigger 10 Free Game.<br/>\n' +
                        '2. During the Free Game, any 3 or more Scatter hit will retrigger 8 Free Game.',
                    frozenWild: 'Frozen Wild',
                    frozenWildDescription: 'In Free Games, the Frozen Wild feature may be triggered. The Wilds will be frozen when triggered, allowing them to awards paid out twice.',
                    freeGameTitle: 'Winning Multiplier',
                    freeGameContent: '<div class="free-information">\n' +
                        '    <div class="free-image">\n' +
                        '        <div class="multiplier sprite"></div>\n' +
                        '    </div>\n' +
                        '</div>\n' +
                        '<div class="description">\n' +
                        '    1. Each score will be multiplied by the Shining Winning Multiplier down below.<br/>\n' +
                        '    2. During the Free Game, the Winning Multiplier will be increased to x2, x4, x6, x10, x16.' +
                        '</div>',
                    paylineTitle: 'Paylines',
                    paylineDescription: 'All 50 lines pay from the left to the right.',
                    wayGameTitle: '243 Ways',
                    wayGameDescription: '1. Ways win is from the leftmost reel to the right.<br/>\n' +
                        '2. Winning Calculation: Symbol Odds X Total Winning Ways.<br/>\n' +
                        '3. Refer to the example, the number of Total Winning Ways is 1x2x2x1=4.',
                    aboutGameTitle: 'About Games',
                    aboutGameContent: '《Legend of Dragon》 is a 3x5 cascading reel and has 243 ways to win the game. The payout from each win is multiplied by the previous multiplier, which levels up as the number of wins increases. In Free Games, the Ice Dragon may freeze the Wilds, allowing the Wilds to award the payout twice.',
                    notice: 'During the game, if there is any malfunction or disconnection, the final betting records will base on system\'s database. Our company reserves the right of final interpretation.',
                },
                'id': {
                    wildTitle: 'Wild',
                    wildDescription: 'Mengganti semua simbol, kecuali <div><div class="symbol_9 sprite"></div></div>.',
                    symbolTitle: 'Symbol',
                    symbolDescription: 'Semua simbol kemenangan akan meledak dan simbol-simbol baru akan mulai turun dan siap untuk benturan berikutnya',
                    scatterTitle: 'Scatter',
                    scatterDescription: '1. 3 atau lebih scatter apapun akan memicu 10 permainan gratis<br>\n' +
                        '2. Selama permainan gratis, 3 atau lebih scatter apapun muncul akan memicu kembali 8 permainan gratis',
                    frozenWild: 'WILD Beku',
                    frozenWildDescription: 'Dalam Free Game, berpeluang memicu fitur WILD Beku, ketika terpicu, WILD akan membeku dan dapat dihitung 2 kali.',
                    freeGameTitle: 'Pengganda kemenangan',
                    freeGameContent: '<div class="free-information">\n' +
                        '    <div class="free-image">\n' +
                        '        <div class="multiplier sprite"></div>\n' +
                        '    </div>\n' +
                        '</div>\n' +
                        '<div class="description">\n' +
                        '    1. Setiap skor akan di kalikan dengan pengganda kemenangan yang berkilau di bawah <br/>\n' +
                        '    2. Selama permainan gratis, pengganda kemenangan akan meningkat ke x2, x4, x6, x10, x16.' +
                        '</div>',
                    paylineTitle: 'Paylines',
                    paylineDescription: 'Semua 50 line bayaran dari kiri ke kanan',
                    wayGameTitle: '243 cara',
                    wayGameDescription: '1. Cara untuk menang adalah dari reel paling kiri ke kanan<br/>\n' +
                        '2. Perhitungan kemenangan : Simbol Odds X total cara menang<br/>\n' +
                        '3. Mengacu pada contoh, Angka dari total cara menang adalah 1x2x2x1 = 4',
                    aboutGameTitle: 'Tentang Permainan',
                    aboutGameContent: '《Legend of Dragon》adalah game penghilangan drop 3x5 dengan 243 jalur, setiap kali menang, poin akan dikalikan dengan 1 kelipatan, kelipatan akan meningkat sesuai jumlah kemenangan. Dalam Free Game, naga es berpeluang membekukan WILD, sehingga WILD dapat dihitung 2 kali.',
                    notice: 'Selama dalam permainan, jika ada kerusakan atau pemutusan, catatan taruhan terakhir akan berdasarkan pada basis data sistem. Perusahaan kami berhak atas penafsiran akhir.',
                },
                'ko': {
                    wildTitle: 'Wild 심볼',
                    wildDescription: '심볼 <div><div class="symbol_9 sprite"></div></div>빼고 다른 심볼을 다 대신할 수 있습니다.',
                    symbolTitle: '일반 심볼',
                    symbolDescription: '모든 당첨 심볼이 없어질 것이고 새로운 심볼이 당첨조합 없을 때까지 떨어질 것입니다.',
                    scatterTitle: '분산 형 기호',
                    scatterDescription: '1. 3개나타나면 8번의 무료 게임을 얻습니다.<br>\n' +
                        '2. 3분산 형 기호 히트는 8개의 무료 게임을 다시 실행하며 한 번만 다시 실행할 수 있습니다.',
                    frozenWild: '프로즌 와일드',
                    frozenWildDescription: '무료 게임 시 프로즌 와일드 특성을 발동할 수 있으며, 발동 시 와일드가 빙결되어 2회 제거 포인트가 카운트됩니다.',
                    freeGameTitle: '이기는 점수 배수',
                    freeGameContent: '<div class="free-information">\n' +
                        '    <div class="free-image">\n' +
                        '        <div class="multiplier sprite"></div>\n' +
                        '    </div>\n' +
                        '</div>\n' +
                        '<div class="description">\n' +
                        '    1. 각 점수는 아래의 빛나는 우승 배수로 곱해집니다.<br/>\n' +
                        '    2. 무료 게임 중에는 승수가 x2, x4, x6, x10, x16으로 증가합니다.' +
                        '</div>',
                    paylineTitle: '라인 경로',
                    paylineDescription: '라인 경로는 50 개이고 모든 페이 라인 경로는 왼쪽부터 봅니다.',
                    wayGameTitle: '243 방법',
                    wayGameDescription: '1. 승리 방법은 가장 왼쪽 릴에서 오른쪽으로 갑니다.<br/>\n' +
                        '2. 당첨 계산: 기호 승률 X 총 당첨 방법.<br/>\n' +
                        '3. 예를 참조하십시오. 총 당첨 방법의 수는 1x2x2x1=4입니다.',
                    aboutGameTitle: '게임 소개',
                    aboutGameContent: '《드래곤 레전드》 는 243가지 루트로 이루어진 3x5 타일 매칭 게임으로, 당첨 시마다 포인트가 1배수씩 증가하여 당첨 횟수에 따라 배수가 점차 증가합니다. 무료 게임 시 아이스 드래곤은 와일드를 빙결시켜 와일드로 포인트를 2회 획득할 수 있습니다.',
                    notice: '게임 과정에 불가항력이 있으면 데이터 베이스에 있는 결과가 최종 결과로 간주합니다. 저희 회사는 이에 대한 해석권을 가지고 있습니다.',
                },
                'zh-cn': {
                    wildTitle: '百搭图腾',
                    wildDescription: '可替代任意图腾，除了 <div><div class="symbol_9 sprite"></div></div>。',
                    symbolTitle: '一般图腾',
                    symbolDescription: '每次赢分中奖图腾将被消除，并落下新的图腾，直到没有中奖组合为止。',
                    scatterTitle: '分散符号',
                    scatterDescription: '1. 任意位置转出3个(含以上)，将触发10场免费游戏。<br>\n' +
                        '2. 免费游戏中，转出3个(含以上)，可再加8场免费游戏。',
                    frozenWild: '冰冻百搭',
                    frozenWildDescription: '免费游戏中，有机会触发冰冻百搭特色，触发时百搭会结冰可被算分消除2次。',
                    freeGameTitle: '赢分乘倍',
                    freeGameContent: '<div class="free-information">\n' +
                        '    <div class="free-image">\n' +
                        '        <div class="multiplier sprite"></div>\n' +
                        '    </div>\n' +
                        '</div>\n' +
                        '<div class="description">\n' +
                        '    1. 所有赢分都将乘上轮面下方亮起的倍数。<br/>\n' +
                        '    2. 进入免费游戏后，倍数将升级为x2, x4, x6, x10, x16。' +
                        '</div>',
                    paylineTitle: '连线路径',
                    paylineDescription: '50条连线路径，连线方法为由左至右依序出现。',
                    wayGameTitle: '243路',
                    wayGameDescription: '1. 中奖方法为由左至右依序出现。<br/>\n' +
                        '2. 奖金计算：中奖图腾赔分 x 中奖路数。<br/>\n' +
                        '3. 参考以上例子，中奖路数为 1x2x2x1=4。',
                    aboutGameTitle: '关于游戏',
                    aboutGameContent: '《魔龙传奇》是款243路的3x5掉落消除游戏，每次中奖分数皆会乘上一个倍数，倍数将随着中奖次数升级。免费游戏中冰龙有机会将百搭冻住，让百搭能被算两次分数。',
                    notice: '游戏过程中若遇不可抗力之因素，将以资料库最终结果为依据，并保留对已下注注单的裁决权。',
                },
                'vi': {
                    wildTitle: 'Wild',
                    wildDescription: 'Có thể thay thế bất kỳ biểu tượng, ngoại trừ <div><div class="symbol_9 sprite"></div></div>.',
                    symbolTitle: 'Symbol',
                    symbolDescription: 'Mỗi lần có điểm thắng trúng thưởng, biểu tượng sẽ bị xóa bỏ, và rơi xuống biểu tượng mới, cho đến khi không có tổ hợp trúng thưởng.',
                    scatterTitle: 'Scatter',
                    scatterDescription: '1. Xoay ra 3 cái (Trở lên) tại bất kỳ vị trí, sẽ khởi động 10 lượt chơi Free Game.<br/>\n' +
                        '2. Trong Free Game, xoay ra 3 cái (Trở lên), có thể cộng thêm 8 lượt chơi Free Game.',
                    frozenWild: 'Wild Băng Giá',
                    frozenWildDescription: 'Trong Free Game, có cơ hội kích hoạt Wild Băng Giá, khi kích hoạt Wild sẽ đóng băng có thể được tính điểm xóa 2 lần.',
                    freeGameTitle: 'Điểm thắng nhân bội số',
                    freeGameContent: '<div class="free-information">\n' +
                        '    <div class="free-image">\n' +
                        '        <div class="multiplier sprite"></div>\n' +
                        '    </div>\n' +
                        '</div>\n' +
                        '<div class="description">\n' +
                        '    1. Tất cả điểm thắng sẽ nhân với bội số được thắp sáng tại phía dưới của cuộn xoay.<br/>\n' +
                        '    2. Sau khi vào Free Game, bội số sẽ nâng cấp thành X2, X4, X6, X10, X16.' +
                        '</div>',
                    wayGameTitle: '243 đường',
                    wayGameDescription: '1. Cách thức trúng thưởng là xuất hiện theo thứ tự từ trái sang phải.<br/>\n' +
                        '2. Cách tính tiền thưởng: Tỷ lệ biểu tượng trúng thưởng x Số đường trúng thưởng.<br/>\n' +
                        '3. Tham khảo ví dụ trên, số đường trúng thưởng là 1x2x2x1=4.',
                    aboutGameTitle: 'Về trò chơi',
                    aboutGameContent: '《Truyền Thuyết Rồng》  là trò chơi 243 dòng 3x5 cuộn rơi xóa biểu tượng, điểm của mỗi lần trúng thưởng đều được nhân với một hệ số, hệ số này sẽ tăng lên theo số lần trúng thưởng. Trong Free Game có cơ hội đóng băng biểu tượng Wild, khiến Wild được tính điểm 2 lần.',
                    notice: 'Trong quá trình trò chơi nếu gặp phải yếu tố bất khả kháng, sẽ dựa vào kết quả cuối cùng của kho dữ liệu làm căn cứ, và bảo lưu quyền quyết định đối với những đơn cược đã đặt cược.',
                },
                'th': {
                    wildTitle: 'Wild',
                    wildDescription: 'จะเปลี่ยนสัญลักษณ์ทั้งหมด ยกเว้นสัญลักษณ์ <div><div class="symbol_9 sprite"></div></div>.',
                    symbolTitle: 'สัญลักษณ์',
                    symbolDescription: 'สัญลักษณ์ที่ชนะทั้งหมดจะระเบิดออก และสัญลักษณ์ใหม่จะตกลงทมาแทนที่',
                    scatterTitle: 'Scatter',
                    scatterDescription: '1. Scatter 3 ตัวหรือมากกว่า จะได้รับฟรีเกม 10 รอบ<br/>\n' +
                        '2. ในขณะที่อยู่ในฟรีเกม หากสัญลักษณ์ Scatter ปรากฏจะได้รับฟรีเกม 8 รอบ',
                    frozenWild: 'ไวด์น้ำแข็ง',
                    frozenWildDescription: 'ในฟรีเกม จะมีโอกาสกระตุ้นฟีเจอร์ไวด์น้ำเข็ง เมื่อกระตุ้นแล้วไวด์จะกลายเป็นผนึกน้ำแข็งและสามารถคำนวณแต้ม 2 ครั้ง',
                    freeGameTitle: 'ชนะตัวคูณคะแนน',
                    freeGameContent: '<div class="free-information">\n' +
                        '    <div class="free-image">\n' +
                        '        <div class="multiplier sprite"></div>\n' +
                        '    </div>\n' +
                        '</div>\n' +
                        '<div class="description">\n' +
                        '    1. คะแนนในแต่ละรอบจะคูณเพิ่มขึ้นโดย Shining Winning ตามรายละเอียดด้านล่างนี้<br/>\n' +
                        '    2. ในรอบฟรีเกม ตัวคูณจะเพิ่มขึ้น x2, x4, x6, x10, x16.' +
                        '</div>',
                    wayGameTitle: '243 Ways',
                    wayGameDescription: '1. วิธีชนะมานับจากรีลซ้ายสุดไปขวา<br/>\n' +
                        '2. รางวัลชนะคำนวนจาก: อัตราจ่ายของแต่ละสัญลักษณ์ X วิธีที่ชนะทั้งหมด<br/>\n' +
                        '3. ตัวอย่าง 1x2x2x1=4.',
                    aboutGameTitle: 'เกี่ยวกับเกม',
                    aboutGameContent: '《Legend of Dragon》เป็นเกมสล็อตจับคู่ 3x5 243ไลน์ แต้มรางวัลที่ได้ในแต่ละครั้งจะคูณด้วยตัวคูณ 1 ตัว และตัวคูณจะอัพเกรดตามจำนวนครั้งที่ถูกรางวัล ในฟรีเกมมังกรน้ำแข็งจะมีโอกาสแช่แข็งไวด์ ทำให้ไวด์สามารถคำนวณแต้ม 2 ครั้ง',
                    notice: 'ในระหว่างเกม หากมีการทำงานผิดพลาดหรือขาดการเชื่อมต่อ การเดิมพันสุดท้ายอยู่ที่เกิดขึ้นจะบันทึกอยู่ในระบบของเรา และขอสงวนสิทธิ์ในการพิจารณาในขั้นตอนสุดท้ายนี้',
                },
                'ms': {
                    wildTitle: 'Wild',
                    wildDescription: 'Boleh menggantikan mana-mana imej, kecuali <div><div class="symbol_9 sprite"></div></div>.',
                    symbolTitle: 'Imej umum',
                    symbolDescription: 'Semua imej yang menang akan dihapuskan, dan imej baharu akan dijatuhkan berterusan sehingga tiada gabungan menang',
                    scatterTitle: 'Scatter',
                    scatterDescription: '1. Akan mencetuskan 8 kali permainan percuma jika munculnya 10 atau lebih scatter di mana-mana kedudukan.<br>\n' +
                        '2. Perolehi 8 kali permainan percuma tambahan jika berjaya memperolehi 3 atau lebih scatter dalam permainan percuma.',
                    frozenWild: 'Wild Beku',
                    frozenWildDescription: 'Dalam permainan percuma, berpeluang mencetuskan ciri Wild Beku. Apabila dicetuskan, Wild akan membeku dan boleh dikira mata dan dihapuskan dua kali.',
                    freeGameTitle: 'Pendarab skor menang',
                    freeGameContent: '<div class="free-information">\n' +
                        '    <div class="free-image">\n' +
                        '        <div class="multiplier sprite"></div>\n' +
                        '    </div>\n' +
                        '</div>\n' +
                        '<div class="description">\n' +
                        '    1. Semua skor yang dimenangi akan didarabkan dengan pendarab yang diterangi pada bahagian bawah reel.<br/>\n' +
                        '    2. Selepas memasuki permainan percuma, pendarab akan dinaik taraf kepada x2, x4, x6, x10, x16.' +
                        '</div>',
                    wayGameTitle: '243 laluan',
                    wayGameDescription: '1. Kemenangan diambil kira mengikut turutan dari kiri ke kanan.<br/>\n' +
                        '2. Pengiraan payout: Odds bagi imej yang menang x bilangan laluan yang menang.<br/>\n' +
                        '3. Merujuk kepada contoh di atas, laluan yang menang adalah 1x2x2x1=4.',
                    aboutGameTitle: 'Tentang permainan',
                    aboutGameContent: '《Legend of Dragon》adalah sejenis permainan penghapusan kejatuhan 3x5 dengan 243 baris. Setiap kali menang mata akan didarab dengan gandaan dan gandaan akan ditingkatkan dengan bilangan kemenangan. Dalam permainan percuma, naga ais berpeluang untuk membekukan Wild, supaya Wild boleh dikira mata dua kali.',
                    notice: 'Jika berlakunya force majeure dalam proses permainan, keputusan akhir pada pangkalan data akan dirujuk sebagai asas dan syarikat mempunyai hak mutlak untuk membuat keputusan terhadap pertaruhan yang telah dilakukan. ',
                },
                'ph': {
                    wildTitle: 'Wild',
                    wildDescription: 'Palitan ang lahat ng simbolo, maliban sa <div><div class="symbol_9 sprite"></div></div>。',
                    symbolTitle: 'Simbolo',
                    symbolDescription: 'Ang lahat ng panalong simbolo ay sasabog at mga bagong simbolo ay magsisimulang mahulog at maghahanda para sa susunod na tama.',
                    scatterTitle: 'Scatter',
                    scatterDescription: '1. Ang kahit na anong 3 o higit pang Scatter ay magti-trigger sa 10 Libreng Game.<br>\n' +
                        '2. Sa Libreng Game, ang kahit na anong 3 o higit pang Scatter na tatamaan ay magre-retrigger sa 8 Libreng Game.',
                    frozenWild: 'Frozen Wild',
                    frozenWildDescription: 'Sa Free Games, maaaring ma-trigger ang feature na Frozen Wild. Kapag na-trigger, maaaring magyelo ang Wilds, na nagbibigay-daan sa kanilang i-award ang payout nang dalawang beses.',
                    freeGameTitle: 'Increasing Winning Multiplier',
                    freeGameContent: '<div class="free-information">\n' +
                        '    <div class="free-image">\n' +
                        '        <div class="multiplier sprite"></div>\n' +
                        '    </div>\n' +
                        '</div>\n' +
                        '<div class="description">\n' +
                        '    1. Ang bawat score ay mamu-multiply sa Shining Winning Multiplier sa ibaba.<br/>\n' +
                        '    2. Sa Free Game, ang Winning Multiplier ay tataas sa x2, x4, x6, x10, at x16.' +
                        '</div>',
                    wayGameTitle: '243 Way',
                    wayGameDescription: '1. Ang Ways win ay mula sa pinakadulong kaliwang reel papunta sa kanan.<br/>\n' +
                        '2. Kalkulasyon ng Panalo: Odds ng Simbolo x Kabuuaang Winning Ways.<br/>\n' +
                        '3. Sumangguni sa halimbawa, ang bilang ng Kabuuang Winning Ways ay 1x2x2x1=4.',
                    aboutGameTitle: 'About Games',
                    aboutGameContent: 'Ang 《Legend of Dragon》 ay isang 3x5 na cascading na reel at may 243 paraan para maipanalo ang laro. Ang bayad sa bawat panalo ay minu-multiply sa nakaraang multiplier, na tumataas ang antas habang tumataas ang panalo. Sa Free Games, maaaring i-freeze ng Ice Dragon freeze ang Wilds, na nagbibigay-daan sa Wilds i-award ang payout nang dalawang beses.',
                    notice: 'Habang tumatakbo ang game, kung may malfunction o pag-disconnect, magbabatay ang panghuling mga record ng taya sa database ng system. Inilalaan ng kumpanya ang karapatan sa panghuling interpretasyon.',
                },
                'tr': {
                    wildTitle: 'Wild',
                    wildDescription: 'Tüm sembollerin yerine geçer, <div><div class="symbol_9 sprite"></div></div> hariç.',
                    symbolTitle: 'Sembol',
                    symbolDescription: 'Kazanan tüm semboller patlar ve yeni semboller yukarıdan düşerek bir sonraki kazanç için hazırlanır.',
                    scatterTitle: 'Scatter',
                    scatterDescription: '1. Herhangi 3 veya daha fazla Scatter, 10 Ücretsiz Oyun tetikler.<br/>\n' +
                        '2. Ücretsiz Oyun sırasında, herhangi 3 veya daha fazla Scatter isabeti 8 Ücretsiz Oyun daha tetikler.',
                    frozenWild: 'Donmuş Wild',
                    frozenWildDescription: 'Ücretsiz Oyunlarda, Donmuş Wild özelliği tetiklenebilir. Wild sembolleri tetiklendiğinde donarak kalır ve bu da ödemelerin iki kez yapılmasına olanak tanır.',
                    freeGameTitle: 'Kazanç Çarpanı',
                    freeGameContent: '<div class="free-information">\n' +
                        '    <div class="free-image">\n' +
                        '        <div class="multiplier sprite"></div>\n' +
                        '    </div>\n' +
                        '</div>\n' +
                        '<div class="description">\n' +
                        '    1. Her bir kazanç, aşağıdaki Parlayan Kazanç Çarpanı ile çarpılır.<br/>\n' +
                        '    2. Ücretsiz Oyun sırasında Kazanç Çarpanı x2, x4, x6, x10, x16 değerlerine yükselir.' +
                        '</div>',
                    paylineTitle: 'Ödeme Çizgileri',
                    paylineDescription: 'Tüm 50 ödeme çizgisi soldan sağa ödeme yapar.',
                    wayGameTitle: '243 Yöntem',
                    wayGameDescription: '1. Kazanç, en soldaki makaradan sağa doğru gerçekleşir.<br/>\n' +
                        '2. Kazanç Hesaplaması: Sembol Katsayısı X Toplam Kazançlı Yöntem Sayısı.<br/>\n' +
                        '3. Örneğe bakınız: Toplam Kazançlı Yöntem Sayısı 1x2x2x1=4.',
                    aboutGameTitle: 'Oyun Hakkında',
                    aboutGameContent: '《Ejderhanın Efsanesi》 3x5 silindirli ve 243 kazanç yolu olan bir düşmeli oyundur. Her kazançtan elde edilen ödeme, önceki çarpanla çarpılır ve kazanç sayısı arttıkça çarpan seviyesi artar. Ücretsiz Oyunlarda, Buz Ejderhası Wild sembolleri dondurabilir ve bu Wild sembollerinin iki kez ödeme yapmasını sağlar.',
                    notice: 'Oyun sırasında herhangi bir arıza veya bağlantı kesintisi yaşanırsa, nihai bahis kayıtları sistem veritabanına göre belirlenir. Şirketimiz nihai yorumu yapma hakkını saklı tutar.',
                },

            },
            '3901': {
                'en': {
                    wildTitle: 'Wild',
                    wildDescription: 'Replace all symbols, except <div><div class="symbol_9 sprite"></div></div>.',
                    symbolTitle: 'Symbol',
                    symbolDescription: 'All winning symbols will explode and new symbols will start to cascade down and ready for the next hit.',
                    scatterTitle: 'Scatter',
                    scatterDescription: '1. Any 3 or more Scatter will trigger 10 Free Game.<br/>\n' +
                        '2. During the Free Game, any 3 or more Scatter hit will retrigger 8 Free Game.',
                    frozenWild: 'Devil Wild',
                    frozenWildDescription: 'In Free Games, the devil Wild feature may be triggered. The Wilds will be frozen when triggered, allowing them to awards paid out twice.',
                    freeGameTitle: 'Winning Multiplier',
                    freeGameContent: '<div class="free-information">\n' +
                        '    <div class="free-image">\n' +
                        '        <div class="multiplier sprite"></div>\n' +
                        '    </div>\n' +
                        '</div>\n' +
                        '<div class="description">\n' +
                        '    1. Each score will be multiplied by the Shining Winning Multiplier down below.<br/>\n' +
                        '    2. During the Free Game, the Winning Multiplier will be increased to x2, x4, x6, x10, x16.' +
                        '</div>',
                    paylineTitle: 'Paylines',
                    paylineDescription: 'All 50 lines pay from the left to the right.',
                    wayGameTitle: '243 Ways',
                    wayGameDescription: '1. Ways win is from the leftmost reel to the right.<br/>\n' +
                        '2. Winning Calculation: Symbol Odds X Total Winning Ways.<br/>\n' +
                        '3. Refer to the example, the number of Total Winning Ways is 1x2x2x1=4.',
                    aboutGameTitle: 'About Games',
                    aboutGameContent: '《Eternal War》 is a 3x5 cascading reel and has 243 ways to win the game. The payout from each win is multiplied by the previous multiplier, which levels up as the number of wins increases. In Free Games, the devil may freeze the Wilds, allowing the Wilds to award the payout twice.',
                    notice: 'During the game, if there is any malfunction or disconnection, the final betting records will base on system\'s database. Our company reserves the right of final interpretation.',
                },
                'id': {
                    wildTitle: 'Wild',
                    wildDescription: 'Mengganti semua simbol, kecuali <div><div class="symbol_9 sprite"></div></div>.',
                    symbolTitle: 'Symbol',
                    symbolDescription: 'Semua simbol kemenangan akan meledak dan simbol-simbol baru akan mulai turun dan siap untuk benturan berikutnya',
                    scatterTitle: 'Scatter',
                    scatterDescription: '1. 3 atau lebih scatter apapun akan memicu 10 permainan gratis<br>\n' +
                        '2. Selama permainan gratis, 3 atau lebih scatter apapun muncul akan memicu kembali 8 permainan gratis',
                    frozenWild: 'WILD Iblis',
                    frozenWildDescription: 'Dalam Free Game, berpeluang memicu fitur WILD Iblis, ketika terpicu, WILD akan membeku dan dapat dihitung 2 kali.',
                    freeGameTitle: 'Pengganda kemenangan',
                    freeGameContent: '<div class="free-information">\n' +
                        '    <div class="free-image">\n' +
                        '        <div class="multiplier sprite"></div>\n' +
                        '    </div>\n' +
                        '</div>\n' +
                        '<div class="description">\n' +
                        '    1. Setiap skor akan di kalikan dengan pengganda kemenangan yang berkilau di bawah <br/>\n' +
                        '    2. Selama permainan gratis, pengganda kemenangan akan meningkat ke x2, x4, x6, x10, x16.' +
                        '</div>',
                    paylineTitle: 'Paylines',
                    paylineDescription: 'Semua 50 line bayaran dari kiri ke kanan',
                    wayGameTitle: '243 cara',
                    wayGameDescription: '1. Cara untuk menang adalah dari reel paling kiri ke kanan<br/>\n' +
                        '2. Perhitungan kemenangan : Simbol Odds X total cara menang<br/>\n' +
                        '3. Mengacu pada contoh, Angka dari total cara menang adalah 1x2x2x1 = 4',
                    aboutGameTitle: 'Tentang Permainan',
                    aboutGameContent: '《Eternal War》adalah game penghilangan drop 3x5 dengan 243 jalur, setiap kali menang, poin akan dikalikan dengan 1 kelipatan, kelipatan akan meningkat sesuai jumlah kemenangan. Dalam Free Game, Iblis berpeluang membekukan WILD, sehingga WILD dapat dihitung 2 kali.',
                    notice: 'Selama dalam permainan, jika ada kerusakan atau pemutusan, catatan taruhan terakhir akan berdasarkan pada basis data sistem. Perusahaan kami berhak atas penafsiran akhir.',
                },
                'ko': {
                    wildTitle: 'Wild 심볼',
                    wildDescription: '심볼 <div><div class="symbol_9 sprite"></div></div>빼고 다른 심볼을 다 대신할 수 있습니다.',
                    symbolTitle: '일반 심볼',
                    symbolDescription: '모든 당첨 심볼이 없어질 것이고 새로운 심볼이 당첨조합 없을 때까지 떨어질 것입니다.',
                    scatterTitle: '분산 형 기호',
                    scatterDescription: '1. 3개나타나면 8번의 무료 게임을 얻습니다.<br>\n' +
                        '2. 3분산 형 기호 히트는 8개의 무료 게임을 다시 실행하며 한 번만 다시 실행할 수 있습니다.',
                    frozenWild: '악마 야생',
                    frozenWildDescription: '무료 게임에서는 데빌 와일드 기능이 실행될 수 있습니다. Wilds는 트리거되면 동결되어 보상이 두 번 지급될 수 있습니다.',
                    freeGameTitle: '이기는 점수 배수',
                    freeGameContent: '<div class="free-information">\n' +
                        '    <div class="free-image">\n' +
                        '        <div class="multiplier sprite"></div>\n' +
                        '    </div>\n' +
                        '</div>\n' +
                        '<div class="description">\n' +
                        '    1. 각 점수는 아래의 빛나는 우승 배수로 곱해집니다.<br/>\n' +
                        '    2. 무료 게임 중에는 승수가 x2, x4, x6, x10, x16으로 증가합니다.' +
                        '</div>',
                    paylineTitle: '라인 경로',
                    paylineDescription: '라인 경로는 50 개이고 모든 페이 라인 경로는 왼쪽부터 봅니다.',
                    wayGameTitle: '243 방법',
                    wayGameDescription: '1. 승리 방법은 가장 왼쪽 릴에서 오른쪽으로 갑니다.<br/>\n' +
                        '2. 당첨 계산: 기호 승률 X 총 당첨 방법.<br/>\n' +
                        '3. 예를 참조하십시오. 총 당첨 방법의 수는 1x2x2x1=4입니다.',
                    aboutGameTitle: '게임 소개',
                    aboutGameContent: '《영원한 전쟁》 는 243가지 루트로 이루어진 3x5 타일 매칭 게임으로, 당첨 시마다 포인트가 1배수씩 증가하여 당첨 횟수에 따라 배수가 점차 증가합니다. 무료 게임 시 아이스 드래곤은 와일드를 빙결시켜 와일드로 포인트를 2회 획득할 수 있습니다.',
                    notice: '게임 과정에 불가항력이 있으면 데이터 베이스에 있는 결과가 최종 결과로 간주합니다. 저희 회사는 이에 대한 해석권을 가지고 있습니다.',
                },
                'zh-cn': {
                    wildTitle: '百搭图腾',
                    wildDescription: '可替代任意图腾，除了 <div><div class="symbol_9 sprite"></div></div>。',
                    symbolTitle: '一般图腾',
                    symbolDescription: '每次赢分中奖图腾将被消除，并落下新的图腾，直到没有中奖组合为止。',
                    scatterTitle: '分散符号',
                    scatterDescription: '1. 任意位置转出3个(含以上)，将触发10场免费游戏。<br>\n' +
                        '2. 免费游戏中，转出3个(含以上)，可再加8场免费游戏。',
                    frozenWild: '恶魔百搭',
                    frozenWildDescription: '免费游戏中，有机会触发恶魔百搭特色，触发时百搭会结冰可被算分消除2次。',
                    freeGameTitle: '赢分乘倍',
                    freeGameContent: '<div class="free-information">\n' +
                        '    <div class="free-image">\n' +
                        '        <div class="multiplier sprite"></div>\n' +
                        '    </div>\n' +
                        '</div>\n' +
                        '<div class="description">\n' +
                        '    1. 所有赢分都将乘上轮面下方亮起的倍数。<br/>\n' +
                        '    2. 进入免费游戏后，倍数将升级为x2, x4, x6, x10, x16。' +
                        '</div>',
                    paylineTitle: '连线路径',
                    paylineDescription: '50条连线路径，连线方法为由左至右依序出现。',
                    wayGameTitle: '243路',
                    wayGameDescription: '1. 中奖方法为由左至右依序出现。<br/>\n' +
                        '2. 奖金计算：中奖图腾赔分 x 中奖路数。<br/>\n' +
                        '3. 参考以上例子，中奖路数为 1x2x2x1=4。',
                    aboutGameTitle: '关于游戏',
                    aboutGameContent: '《永恒的战争》是款243路的3x5掉落消除游戏，每次中奖分数皆会乘上一个倍数，倍数将随着中奖次数升级。免费游戏中魔王有机会将百搭冻住，让百搭能被算两次分数。',
                    notice: '游戏过程中若遇不可抗力之因素，将以资料库最终结果为依据，并保留对已下注注单的裁决权。',
                },
                'vi': {
                    wildTitle: 'Wild',
                    wildDescription: 'Có thể thay thế bất kỳ biểu tượng, ngoại trừ <div><div class="symbol_9 sprite"></div></div>.',
                    symbolTitle: 'Symbol',
                    symbolDescription: 'Mỗi lần có điểm thắng trúng thưởng, biểu tượng sẽ bị xóa bỏ, và rơi xuống biểu tượng mới, cho đến khi không có tổ hợp trúng thưởng.',
                    scatterTitle: 'Scatter',
                    scatterDescription: '1. Xoay ra 3 cái (Trở lên) tại bất kỳ vị trí, sẽ khởi động 10 lượt chơi Free Game.<br/>\n' +
                        '2. Trong Free Game, xoay ra 3 cái (Trở lên), có thể cộng thêm 8 lượt chơi Free Game.',
                    frozenWild: 'ác quỷ hoang dã',
                    frozenWildDescription: 'Trong Free Game, có cơ hội kích hoạt ác quỷ hoang dã, khi kích hoạt Wild sẽ đóng băng có thể được tính điểm xóa 2 lần.',
                    freeGameTitle: 'Điểm thắng nhân bội số',
                    freeGameContent: '<div class="free-information">\n' +
                        '    <div class="free-image">\n' +
                        '        <div class="multiplier sprite"></div>\n' +
                        '    </div>\n' +
                        '</div>\n' +
                        '<div class="description">\n' +
                        '    1. Tất cả điểm thắng sẽ nhân với bội số được thắp sáng tại phía dưới của cuộn xoay.<br/>\n' +
                        '    2. Sau khi vào Free Game, bội số sẽ nâng cấp thành X2, X4, X6, X10, X16.' +
                        '</div>',
                    wayGameTitle: '243 đường',
                    wayGameDescription: '1. Cách thức trúng thưởng là xuất hiện theo thứ tự từ trái sang phải.<br/>\n' +
                        '2. Cách tính tiền thưởng: Tỷ lệ biểu tượng trúng thưởng x Số đường trúng thưởng.<br/>\n' +
                        '3. Tham khảo ví dụ trên, số đường trúng thưởng là 1x2x2x1=4.',
                    aboutGameTitle: 'Về trò chơi',
                    aboutGameContent: '《Chiến tranh vĩnh cửu》 là trò chơi 243 dòng 3x5 cuộn rơi xóa biểu tượng, điểm của mỗi lần trúng thưởng đều được nhân với một hệ số, hệ số này sẽ tăng lên theo số lần trúng thưởng. Trong Free Game có cơ hội đóng băng biểu tượng Wild, khiến Wild được tính điểm 2 lần.',
                    notice: 'Trong quá trình trò chơi nếu gặp phải yếu tố bất khả kháng, sẽ dựa vào kết quả cuối cùng của kho dữ liệu làm căn cứ, và bảo lưu quyền quyết định đối với những đơn cược đã đặt cược.',
                },
                'th': {
                    wildTitle: 'Wild',
                    wildDescription: 'จะเปลี่ยนสัญลักษณ์ทั้งหมด ยกเว้นสัญลักษณ์ <div><div class="symbol_9 sprite"></div></div>.',
                    symbolTitle: 'สัญลักษณ์',
                    symbolDescription: 'สัญลักษณ์ที่ชนะทั้งหมดจะระเบิดออก และสัญลักษณ์ใหม่จะตกลงทมาแทนที่',
                    scatterTitle: 'Scatter',
                    scatterDescription: '1. Scatter 3 ตัวหรือมากกว่า จะได้รับฟรีเกม 10 รอบ<br/>\n' +
                        '2. ในขณะที่อยู่ในฟรีเกม หากสัญลักษณ์ Scatter ปรากฏจะได้รับฟรีเกม 8 รอบ',
                    frozenWild: 'ปีศาจป่า',
                    frozenWildDescription: 'ในเกมฟรี ฟีเจอร์ Devil Wild อาจถูกกระตุ้น Wilds จะถูกแช่แข็งเมื่อถูกกระตุ้น ทำให้พวกเขาได้รับรางวัลที่จ่ายเป็นสองเท่า',
                    freeGameTitle: 'ชนะตัวคูณคะแนน',
                    freeGameContent: '<div class="free-information">\n' +
                        '    <div class="free-image">\n' +
                        '        <div class="multiplier sprite"></div>\n' +
                        '    </div>\n' +
                        '</div>\n' +
                        '<div class="description">\n' +
                        '    1. คะแนนในแต่ละรอบจะคูณเพิ่มขึ้นโดย Shining Winning ตามรายละเอียดด้านล่างนี้<br/>\n' +
                        '    2. ในรอบฟรีเกม ตัวคูณจะเพิ่มขึ้น x2, x4, x6, x10, x16.' +
                        '</div>',
                    wayGameTitle: '243 Ways',
                    wayGameDescription: '1. วิธีชนะมานับจากรีลซ้ายสุดไปขวา<br/>\n' +
                        '2. รางวัลชนะคำนวนจาก: อัตราจ่ายของแต่ละสัญลักษณ์ X วิธีที่ชนะทั้งหมด<br/>\n' +
                        '3. ตัวอย่าง 1x2x2x1=4.',
                    aboutGameTitle: 'เกี่ยวกับเกม',
                    aboutGameContent: '《Eternal War》เป็นเกมสล็อตจับคู่ 3x5 243ไลน์ แต้มรางวัลที่ได้ในแต่ละครั้งจะคูณด้วยตัวคูณ 1 ตัว และตัวคูณจะอัพเกรดตามจำนวนครั้งที่ถูกรางวัล ในฟรีเกมมังกรน้ำแข็งจะมีโอกาสแช่แข็งไวด์ ทำให้ไวด์สามารถคำนวณแต้ม 2 ครั้ง',
                    notice: 'ในระหว่างเกม หากมีการทำงานผิดพลาดหรือขาดการเชื่อมต่อ การเดิมพันสุดท้ายอยู่ที่เกิดขึ้นจะบันทึกอยู่ในระบบของเรา และขอสงวนสิทธิ์ในการพิจารณาในขั้นตอนสุดท้ายนี้',
                },
                'ms': {
                    wildTitle: 'Wild',
                    wildDescription: 'Boleh menggantikan mana-mana imej, kecuali <div><div class="symbol_9 sprite"></div></div>.',
                    symbolTitle: 'Imej umum',
                    symbolDescription: 'Semua imej yang menang akan dihapuskan, dan imej baharu akan dijatuhkan berterusan sehingga tiada gabungan menang',
                    scatterTitle: 'Scatter',
                    scatterDescription: '1. Akan mencetuskan 8 kali permainan percuma jika munculnya 10 atau lebih scatter di mana-mana kedudukan.<br>\n' +
                        '2. Perolehi 8 kali permainan percuma tambahan jika berjaya memperolehi 3 atau lebih scatter dalam permainan percuma.',
                    frozenWild: 'Wild Syaitan',
                    frozenWildDescription: 'Dalam permainan percuma, berpeluang mencetuskan ciri Wild Syaitan. Apabila dicetuskan, Wild akan membeku dan boleh dikira mata dan dihapuskan dua kali.',
                    freeGameTitle: 'Pendarab skor menang',
                    freeGameContent: '<div class="free-information">\n' +
                        '    <div class="free-image">\n' +
                        '        <div class="multiplier sprite"></div>\n' +
                        '    </div>\n' +
                        '</div>\n' +
                        '<div class="description">\n' +
                        '    1. Semua skor yang dimenangi akan didarabkan dengan pendarab yang diterangi pada bahagian bawah reel.<br/>\n' +
                        '    2. Selepas memasuki permainan percuma, pendarab akan dinaik taraf kepada x2, x4, x6, x10, x16.' +
                        '</div>',
                    wayGameTitle: '243 laluan',
                    wayGameDescription: '1. Kemenangan diambil kira mengikut turutan dari kiri ke kanan.<br/>\n' +
                        '2. Pengiraan payout: Odds bagi imej yang menang x bilangan laluan yang menang.<br/>\n' +
                        '3. Merujuk kepada contoh di atas, laluan yang menang adalah 1x2x2x1=4.',
                    aboutGameTitle: 'Tentang permainan',
                    aboutGameContent: '《Eternal War》adalah sejenis permainan penghapusan kejatuhan 3x5 dengan 243 baris. Setiap kali menang mata akan didarab dengan gandaan dan gandaan akan ditingkatkan dengan bilangan kemenangan. Dalam permainan percuma, Syaitan berpeluang untuk membekukan Wild, supaya Wild boleh dikira mata dua kali.',
                    notice: 'Jika berlakunya force majeure dalam proses permainan, keputusan akhir pada pangkalan data akan dirujuk sebagai asas dan syarikat mempunyai hak mutlak untuk membuat keputusan terhadap pertaruhan yang telah dilakukan. ',
                },
                'ph': {
                    wildTitle: 'Wild',
                    wildDescription: 'Palitan ang lahat ng simbolo, maliban sa <div><div class="symbol_9 sprite"></div></div>。',
                    symbolTitle: 'Simbolo',
                    symbolDescription: 'Ang lahat ng panalong simbolo ay sasabog at mga bagong simbolo ay magsisimulang mahulog at maghahanda para sa susunod na tama.',
                    scatterTitle: 'Scatter',
                    scatterDescription: '1. Ang kahit na anong 3 o higit pang Scatter ay magti-trigger sa 10 Libreng Game.<br>\n' +
                        '2. Sa Libreng Game, ang kahit na anong 3 o higit pang Scatter na tatamaan ay magre-retrigger sa 8 Libreng Game.',
                    frozenWild: 'devil Wild',
                    frozenWildDescription: 'Sa Free Games, maaaring ma-trigger ang feature na devil Wild. Kapag na-trigger, maaaring magyelo ang Wilds, na nagbibigay-daan sa kanilang i-award ang payout nang dalawang beses.',
                    freeGameTitle: 'Increasing Winning Multiplier',
                    freeGameContent: '<div class="free-information">\n' +
                        '    <div class="free-image">\n' +
                        '        <div class="multiplier sprite"></div>\n' +
                        '    </div>\n' +
                        '</div>\n' +
                        '<div class="description">\n' +
                        '    1. Ang bawat score ay mamu-multiply sa Shining Winning Multiplier sa ibaba.<br/>\n' +
                        '    2. Sa Free Game, ang Winning Multiplier ay tataas sa x2, x4, x6, x10, at x16.' +
                        '</div>',
                    wayGameTitle: '243 Way',
                    wayGameDescription: '1. Ang Ways win ay mula sa pinakadulong kaliwang reel papunta sa kanan.<br/>\n' +
                        '2. Kalkulasyon ng Panalo: Odds ng Simbolo x Kabuuaang Winning Ways.<br/>\n' +
                        '3. Sumangguni sa halimbawa, ang bilang ng Kabuuang Winning Ways ay 1x2x2x1=4.',
                    aboutGameTitle: 'About Games',
                    aboutGameContent: 'Ang《Eternal War》ay isang 3x5 na cascading na reel at may 243 paraan para maipanalo ang laro. Ang bayad sa bawat panalo ay minu-multiply sa nakaraang multiplier, na tumataas ang antas habang tumataas ang panalo. Sa Free Games, maaaring i-freeze ng Devil freeze ang Wilds, na nagbibigay-daan sa Wilds i-award ang payout nang dalawang beses.',
                    notice: 'Habang tumatakbo ang game, kung may malfunction o pag-disconnect, magbabatay ang panghuling mga record ng taya sa database ng system. Inilalaan ng kumpanya ang karapatan sa panghuling interpretasyon.',
                },
                'tr': {
                    wildTitle: 'Wild',
                    wildDescription: 'Tüm sembollerin yerine geçer, <div><div class="symbol_9 sprite"></div></div> hariç.',
                    symbolTitle: 'Sembol',
                    symbolDescription: 'Kazanan tüm semboller patlar ve yeni semboller yukarıdan düşerek bir sonraki isabet için hazır hale gelir.',
                    scatterTitle: 'Scatter',
                    scatterDescription: '1. Herhangi 3 veya daha fazla Scatter, 10 Ücretsiz Oyun tetikler.<br/>\n' +
                        '2. Ücretsiz Oyun sırasında herhangi 3 veya daha fazla Scatter isabeti 8 Ücretsiz Oyun daha tetikler.',
                    frozenWild: 'Şeytan Wild',
                    frozenWildDescription: 'Ücretsiz Oyunlarda, Şeytan Wild özelliği tetiklenebilir. Wild sembolleri tetiklendiğinde donarak kalır ve bu sayede ödemeler iki kez verilir.',
                    freeGameTitle: 'Kazanç Çarpanı',
                    freeGameContent: '<div class="free-information">\n' +
                        '    <div class="free-image">\n' +
                        '        <div class="multiplier sprite"></div>\n' +
                        '    </div>\n' +
                        '</div>\n' +
                        '<div class="description">\n' +
                        '    1. Her bir skor, aşağıda parlayan Kazanç Çarpanı ile çarpılır.<br/>\n' +
                        '    2. Ücretsiz Oyun sırasında Kazanç Çarpanı x2, x4, x6, x10, x16’ya kadar çıkar.' +
                        '</div>',
                    paylineTitle: 'Ödeme Çizgileri',
                    paylineDescription: 'Tüm 50 çizgi soldan sağa ödeme yapar.',
                    wayGameTitle: '243 Yöntem',
                    wayGameDescription: '1. Yöntem kazancı, en soldaki makaradan sağa doğrudur.<br/>\n' +
                        '2. Kazanç Hesabı: Sembol Oranı X Toplam Kazançlı Yol Sayısı.<br/>\n' +
                        '3. Örneğe göre: Toplam Kazançlı Yol Sayısı = 1x2x2x1=4.',
                    aboutGameTitle: 'Oyun Hakkında',
                    aboutGameContent: '《Eternal War》 3x5 silindirli bir düşmeli oyundur ve kazanç elde etmek için 243 farklı yol sunar. Her kazanç, önceki çarpanla çarpılır ve kazanç sayısı arttıkça çarpan seviyesi yükselir. Ücretsiz Oyunlarda, şeytan Wild sembollerini dondurabilir ve bu semboller iki kez ödeme sağlar.',
                    notice: 'Oyun sırasında herhangi bir arıza veya bağlantı kesintisi olursa, nihai bahis kayıtları sistem veritabanına göre belirlenir. Şirketimiz nihai yorumu yapma hakkını saklı tutar.',
                },

            }
        };

    }

    public test1() {
        this.machine.spinTest({
            "game_id": 4800,
            "main_game": {
                "pay_credit_total": 4920,
                "game_result": [
                    [
                        5,
                        5,
                        9
                    ],
                    [
                        8,
                        4,
                        1
                    ],
                    [
                        4,
                        7,
                        5
                    ],
                    [
                        6,
                        3,
                        10
                    ],
                    [
                        7,
                        6,
                        7
                    ]
                ],
                "pay_line": [],
                "scatter_info": null,
                "wild_info": null,
                "scatter_extra": null,
                "extra": {
                    "gem_game_result": [
                        {
                            "game_result": {
                                "pay_credit_total": 4920,
                                "game_result": [
                                    [
                                        3,
                                        5,
                                        3
                                    ],
                                    [
                                        7,
                                        0,
                                        3
                                    ],
                                    [
                                        1,
                                        0,
                                        8
                                    ],
                                    [
                                        0,
                                        4,
                                        7
                                    ],
                                    [
                                        2,
                                        0,
                                        0
                                    ]
                                ],
                                "pay_line": [
                                    {
                                        "pay_line": 0,
                                        "symbol_id": 5,
                                        "amount": 3,
                                        "pay_credit": 120,
                                        "multiplier": 1
                                    },
                                    {
                                        "pay_line": 6,
                                        "symbol_id": 3,
                                        "amount": 4,
                                        "pay_credit": 1440,
                                        "multiplier": 1
                                    },
                                    {
                                        "pay_line": 9,
                                        "symbol_id": 3,
                                        "amount": 3,
                                        "pay_credit": 240,
                                        "multiplier": 1
                                    },
                                    {
                                        "pay_line": 10,
                                        "symbol_id": 3,
                                        "amount": 3,
                                        "pay_credit": 240,
                                        "multiplier": 1
                                    },
                                    {
                                        "pay_line": 16,
                                        "symbol_id": 3,
                                        "amount": 5,
                                        "pay_credit": 2400,
                                        "multiplier": 1
                                    },
                                    {
                                        "pay_line": 25,
                                        "symbol_id": 3,
                                        "amount": 3,
                                        "pay_credit": 240,
                                        "multiplier": 1
                                    },
                                    {
                                        "pay_line": 26,
                                        "symbol_id": 3,
                                        "amount": 3,
                                        "pay_credit": 240,
                                        "multiplier": 1
                                    }
                                ],
                                "scatter_info": null,
                                "wild_info": null,
                                "scatter_extra": null,
                                "extra": null
                            },
                            "gem_info": [
                                {
                                    "symbol_id": 10,
                                    "pos": [
                                        13,
                                        4,
                                        9,
                                        7,
                                        14
                                    ]
                                }
                            ]
                        }
                    ]
                },
                "energy": {
                    "10": [
                        13,
                        4,
                        9,
                        7,
                        14
                    ]
                }
            },
            "get_sub_game": false,
            "sub_game": null,
            "get_jackpot": false,
            "jackpot": {
                "jackpot_id": "",
                "jackpot_credit": 0,
                "symbol_id": null
            },
            "get_jackpot_increment": false,
            "jackpot_increment": null,
            "grand": 0,
            "major": 0,
            "minor": 0,
            "mini": 0,
            "user_credit": 500003120,
            "bet_credit": 1800,
            "payout_credit": 4920,
            "change_credit": 3120,
            "effect_credit": 1800,
            "buy_spin": 0,
            "buy_spin_multiplier": 1,
            "extra": {
                "user_data": {
                    "random_wild_gem": 0,
                    "wildX2_gem": 0
                },
                "free_spin_times": 0
            }
        });
    }

    public fgGame2() {
        this.machine.spinTest(
            {
                "game_id": 4800,
                "main_game": {
                    "pay_credit_total": 1680 + 112680,
                    "game_result": [
                        [
                            8,
                            9,
                            3
                        ],
                        [
                            9,
                            3,
                            2
                        ],
                        [
                            3,
                            4,
                            9
                        ],
                        [
                            6,
                            3,
                            11
                        ],
                        [
                            1,
                            1,
                            8
                        ]
                    ],
                    "pay_line": [
                        {
                            "pay_line": 4,
                            "symbol_id": 3,
                            "amount": 4,
                            "pay_credit": 1440,
                            "multiplier": 1
                        },
                        {
                            "pay_line": 22,
                            "symbol_id": 3,
                            "amount": 3,
                            "pay_credit": 240,
                            "multiplier": 1
                        }
                    ],
                    "scatter_info": {
                        "id": [
                            9
                        ],
                        "position": [
                            [
                                0,
                                0
                            ],
                            [
                                1,
                                1
                            ],
                            [
                                2,
                                2
                            ]
                        ],
                        "amount": 8,
                        "multiplier": 0,
                        "pay_credit": 0,
                        "pay_rate": 0
                    },
                    "wild_info": null,
                    "scatter_extra": null,
                    "extra": {
                        "gem_game_result": [
                            {
                                "game_result": {
                                    "pay_credit_total": 0,
                                    "game_result": [
                                        [
                                            5,
                                            7,
                                            8
                                        ],
                                        [
                                            4,
                                            4,
                                            7
                                        ],
                                        [
                                            8,
                                            3,
                                            2
                                        ],
                                        [
                                            7,
                                            0,
                                            4
                                        ],
                                        [
                                            3,
                                            5,
                                            4
                                        ]
                                    ],
                                    "pay_line": [],
                                    "scatter_info": null,
                                    "wild_info": null,
                                    "scatter_extra": null,
                                    "extra": null
                                },
                                "gem_info": [
                                    {
                                        "symbol_id": 11,
                                        "pos": [
                                            10
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    "energy": {
                        "11": [
                            10
                        ]
                    }
                },
                "get_sub_game": true,
                "sub_game": {
                    "game_result": [
                        {
                            "pay_credit_total": 0,
                            "game_result": [
                                [
                                    5,
                                    4,
                                    4
                                ],
                                [
                                    1,
                                    8,
                                    2
                                ],
                                [
                                    1,
                                    0,
                                    7
                                ],
                                [
                                    8,
                                    6,
                                    5
                                ],
                                [
                                    5,
                                    2,
                                    1
                                ]
                            ],
                            "pay_line": [],
                            "scatter_info": null,
                            "wild_info": null,
                            "scatter_extra": null,
                            "extra": null
                        },
                        {
                            "pay_credit_total": 0,
                            "game_result": [
                                [
                                    3,
                                    6,
                                    3
                                ],
                                [
                                    7,
                                    7,
                                    8
                                ],
                                [
                                    3,
                                    8,
                                    4
                                ],
                                [
                                    5,
                                    6,
                                    5
                                ],
                                [
                                    1,
                                    1,
                                    6
                                ]
                            ],
                            "pay_line": [],
                            "scatter_info": null,
                            "wild_info": null,
                            "scatter_extra": null,
                            "extra": null
                        },
                        {
                            "pay_credit_total": 240,
                            "game_result": [
                                [
                                    5,
                                    8,
                                    4
                                ],
                                [
                                    4,
                                    4,
                                    3
                                ],
                                [
                                    2,
                                    1,
                                    4
                                ],
                                [
                                    8,
                                    6,
                                    5
                                ],
                                [
                                    6,
                                    3,
                                    6
                                ]
                            ],
                            "pay_line": [
                                {
                                    "pay_line": 24,
                                    "symbol_id": 4,
                                    "amount": 3,
                                    "pay_credit": 240,
                                    "multiplier": 1
                                }
                            ],
                            "scatter_info": null,
                            "wild_info": null,
                            "scatter_extra": null,
                            "extra": null
                        },
                        {
                            "pay_credit_total": 2400,
                            "game_result": [
                                [
                                    5,
                                    6,
                                    2
                                ],
                                [
                                    2,
                                    2,
                                    3
                                ],
                                [
                                    2,
                                    6,
                                    3
                                ],
                                [
                                    0,
                                    4,
                                    3
                                ],
                                [
                                    6,
                                    6,
                                    6
                                ]
                            ],
                            "pay_line": [
                                {
                                    "pay_line": 4,
                                    "symbol_id": 2,
                                    "amount": 3,
                                    "pay_credit": 600,
                                    "multiplier": 1
                                },
                                {
                                    "pay_line": 22,
                                    "symbol_id": 2,
                                    "amount": 4,
                                    "pay_credit": 1800,
                                    "multiplier": 1
                                }
                            ],
                            "scatter_info": null,
                            "wild_info": null,
                            "scatter_extra": null,
                            "extra": null
                        },
                        {
                            "pay_credit_total": 0,
                            "game_result": [
                                [
                                    8,
                                    7,
                                    1
                                ],
                                [
                                    8,
                                    7,
                                    1
                                ],
                                [
                                    3,
                                    4,
                                    6
                                ],
                                [
                                    6,
                                    8,
                                    0
                                ],
                                [
                                    7,
                                    7,
                                    6
                                ]
                            ],
                            "pay_line": [],
                            "scatter_info": null,
                            "wild_info": null,
                            "scatter_extra": null,
                            "extra": null
                        },
                        {
                            "pay_credit_total": 6000,
                            "game_result": [
                                [
                                    8,
                                    6,
                                    6
                                ],
                                [
                                    7,
                                    4,
                                    11
                                ],
                                [
                                    8,
                                    8,
                                    7
                                ],
                                [
                                    11,
                                    5,
                                    7
                                ],
                                [
                                    8,
                                    5,
                                    2
                                ]
                            ],
                            "pay_line": [],
                            "scatter_info": null,
                            "wild_info": null,
                            "scatter_extra": null,
                            "extra": {
                                "gem_game_result": [
                                    {
                                        "game_result": {
                                            "pay_credit_total": 6000,
                                            "game_result": [
                                                [
                                                    1,
                                                    8,
                                                    6
                                                ],
                                                [
                                                    0,
                                                    0,
                                                    5
                                                ],
                                                [
                                                    7,
                                                    2,
                                                    4
                                                ],
                                                [
                                                    3,
                                                    5,
                                                    4
                                                ],
                                                [
                                                    1,
                                                    6,
                                                    0
                                                ]
                                            ],
                                            "pay_line": [
                                                {
                                                    "pay_line": 0,
                                                    "symbol_id": 8,
                                                    "amount": 3,
                                                    "pay_credit": 240,
                                                    "multiplier": 2
                                                },
                                                {
                                                    "pay_line": 5,
                                                    "symbol_id": 1,
                                                    "amount": 3,
                                                    "pay_credit": 1200,
                                                    "multiplier": 2
                                                },
                                                {
                                                    "pay_line": 7,
                                                    "symbol_id": 8,
                                                    "amount": 3,
                                                    "pay_credit": 240,
                                                    "multiplier": 2
                                                },
                                                {
                                                    "pay_line": 9,
                                                    "symbol_id": 1,
                                                    "amount": 3,
                                                    "pay_credit": 1200,
                                                    "multiplier": 2
                                                },
                                                {
                                                    "pay_line": 10,
                                                    "symbol_id": 6,
                                                    "amount": 3,
                                                    "pay_credit": 240,
                                                    "multiplier": 2
                                                },
                                                {
                                                    "pay_line": 15,
                                                    "symbol_id": 1,
                                                    "amount": 3,
                                                    "pay_credit": 1200,
                                                    "multiplier": 2
                                                },
                                                {
                                                    "pay_line": 17,
                                                    "symbol_id": 8,
                                                    "amount": 3,
                                                    "pay_credit": 240,
                                                    "multiplier": 2
                                                },
                                                {
                                                    "pay_line": 25,
                                                    "symbol_id": 1,
                                                    "amount": 3,
                                                    "pay_credit": 1200,
                                                    "multiplier": 2
                                                },
                                                {
                                                    "pay_line": 26,
                                                    "symbol_id": 6,
                                                    "amount": 3,
                                                    "pay_credit": 240,
                                                    "multiplier": 2
                                                }
                                            ],
                                            "scatter_info": null,
                                            "wild_info": null,
                                            "scatter_extra": null,
                                            "extra": null
                                        },
                                        "gem_info": [
                                            {
                                                "symbol_id": 11,
                                                "pos": [
                                                    3,
                                                    4,
                                                    7,
                                                    14
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        },
                        {
                            "pay_credit_total": 15000,
                            "game_result": [
                                [
                                    3,
                                    4,
                                    5
                                ],
                                [
                                    4,
                                    4,
                                    5
                                ],
                                [
                                    1,
                                    4,
                                    8
                                ],
                                [
                                    10,
                                    5,
                                    7
                                ],
                                [
                                    4,
                                    7,
                                    6
                                ]
                            ],
                            "pay_line": [
                                {
                                    "pay_line": 0,
                                    "symbol_id": 4,
                                    "amount": 3,
                                    "pay_credit": 240,
                                    "multiplier": 1
                                },
                                {
                                    "pay_line": 7,
                                    "symbol_id": 4,
                                    "amount": 3,
                                    "pay_credit": 240,
                                    "multiplier": 1
                                },
                                {
                                    "pay_line": 17,
                                    "symbol_id": 4,
                                    "amount": 3,
                                    "pay_credit": 240,
                                    "multiplier": 1
                                }
                            ],
                            "scatter_info": null,
                            "wild_info": null,
                            "scatter_extra": null,
                            "extra": {
                                "gem_game_result": [
                                    {
                                        "game_result": {
                                            "pay_credit_total": 14280,
                                            "game_result": [
                                                [
                                                    3,
                                                    2,
                                                    3
                                                ],
                                                [
                                                    0,
                                                    5,
                                                    2
                                                ],
                                                [
                                                    0,
                                                    3,
                                                    7
                                                ],
                                                [
                                                    2,
                                                    0,
                                                    6
                                                ],
                                                [
                                                    3,
                                                    5,
                                                    4
                                                ]
                                            ],
                                            "pay_line": [
                                                {
                                                    "pay_line": 1,
                                                    "symbol_id": 3,
                                                    "amount": 5,
                                                    "pay_credit": 2400,
                                                    "multiplier": 1
                                                },
                                                {
                                                    "pay_line": 5,
                                                    "symbol_id": 3,
                                                    "amount": 3,
                                                    "pay_credit": 240,
                                                    "multiplier": 1
                                                },
                                                {
                                                    "pay_line": 11,
                                                    "symbol_id": 2,
                                                    "amount": 5,
                                                    "pay_credit": 4800,
                                                    "multiplier": 1
                                                },
                                                {
                                                    "pay_line": 12,
                                                    "symbol_id": 2,
                                                    "amount": 4,
                                                    "pay_credit": 1800,
                                                    "multiplier": 1
                                                },
                                                {
                                                    "pay_line": 15,
                                                    "symbol_id": 3,
                                                    "amount": 3,
                                                    "pay_credit": 240,
                                                    "multiplier": 1
                                                },
                                                {
                                                    "pay_line": 19,
                                                    "symbol_id": 3,
                                                    "amount": 5,
                                                    "pay_credit": 2400,
                                                    "multiplier": 1
                                                },
                                                {
                                                    "pay_line": 27,
                                                    "symbol_id": 2,
                                                    "amount": 4,
                                                    "pay_credit": 1800,
                                                    "multiplier": 1
                                                },
                                                {
                                                    "pay_line": 28,
                                                    "symbol_id": 2,
                                                    "amount": 3,
                                                    "pay_credit": 600,
                                                    "multiplier": 1
                                                }
                                            ],
                                            "scatter_info": null,
                                            "wild_info": null,
                                            "scatter_extra": null,
                                            "extra": null
                                        },
                                        "gem_info": [
                                            {
                                                "symbol_id": 10,
                                                "pos": [
                                                    9,
                                                    14,
                                                    6,
                                                    8,
                                                    10
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        },
                        {
                            "pay_credit_total": 0,
                            "game_result": [
                                [
                                    5,
                                    8,
                                    8
                                ],
                                [
                                    7,
                                    6,
                                    4
                                ],
                                [
                                    1,
                                    8,
                                    5
                                ],
                                [
                                    8,
                                    6,
                                    8
                                ],
                                [
                                    0,
                                    1,
                                    0
                                ]
                            ],
                            "pay_line": [],
                            "scatter_info": null,
                            "wild_info": null,
                            "scatter_extra": null,
                            "extra": null
                        },
                        {
                            "pay_credit_total": 12960,
                            "game_result": [
                                [
                                    2,
                                    7,
                                    6
                                ],
                                [
                                    2,
                                    6,
                                    6
                                ],
                                [
                                    5,
                                    1,
                                    3
                                ],
                                [
                                    7,
                                    4,
                                    11
                                ],
                                [
                                    6,
                                    6,
                                    7
                                ]
                            ],
                            "pay_line": [],
                            "scatter_info": null,
                            "wild_info": null,
                            "scatter_extra": null,
                            "extra": {
                                "gem_game_result": [
                                    {
                                        "game_result": {
                                            "pay_credit_total": 12960,
                                            "game_result": [
                                                [
                                                    1,
                                                    8,
                                                    5
                                                ],
                                                [
                                                    6,
                                                    0,
                                                    3
                                                ],
                                                [
                                                    0,
                                                    3,
                                                    7
                                                ],
                                                [
                                                    0,
                                                    6,
                                                    1
                                                ],
                                                [
                                                    3,
                                                    8,
                                                    3
                                                ]
                                            ],
                                            "pay_line": [
                                                {
                                                    "pay_line": 4,
                                                    "symbol_id": 5,
                                                    "amount": 4,
                                                    "pay_credit": 1920,
                                                    "multiplier": 2
                                                },
                                                {
                                                    "pay_line": 13,
                                                    "symbol_id": 8,
                                                    "amount": 4,
                                                    "pay_credit": 1920,
                                                    "multiplier": 2
                                                },
                                                {
                                                    "pay_line": 22,
                                                    "symbol_id": 5,
                                                    "amount": 4,
                                                    "pay_credit": 1920,
                                                    "multiplier": 2
                                                },
                                                {
                                                    "pay_line": 23,
                                                    "symbol_id": 1,
                                                    "amount": 4,
                                                    "pay_credit": 3600,
                                                    "multiplier": 2
                                                },
                                                {
                                                    "pay_line": 29,
                                                    "symbol_id": 1,
                                                    "amount": 4,
                                                    "pay_credit": 3600,
                                                    "multiplier": 2
                                                }
                                            ],
                                            "scatter_info": null,
                                            "wild_info": null,
                                            "scatter_extra": null,
                                            "extra": null
                                        },
                                        "gem_info": [
                                            {
                                                "symbol_id": 11,
                                                "pos": [
                                                    4,
                                                    6,
                                                    9,
                                                    10
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        },
                        {
                            "pay_credit_total": 0,
                            "game_result": [
                                [
                                    7,
                                    1,
                                    3
                                ],
                                [
                                    4,
                                    5,
                                    6
                                ],
                                [
                                    5,
                                    4,
                                    7
                                ],
                                [
                                    2,
                                    2,
                                    3
                                ],
                                [
                                    0,
                                    5,
                                    7
                                ]
                            ],
                            "pay_line": [],
                            "scatter_info": null,
                            "wild_info": null,
                            "scatter_extra": null,
                            "extra": null
                        },
                        {
                            "pay_credit_total": 76080,
                            "game_result": [
                                [
                                    3,
                                    1,
                                    5
                                ],
                                [
                                    11,
                                    5,
                                    4
                                ],
                                [
                                    0,
                                    7,
                                    8
                                ],
                                [
                                    8,
                                    10,
                                    5
                                ],
                                [
                                    2,
                                    4,
                                    7
                                ]
                            ],
                            "pay_line": [
                                {
                                    "pay_line": 4,
                                    "symbol_id": 5,
                                    "amount": 3,
                                    "pay_credit": 120,
                                    "multiplier": 1
                                },
                                {
                                    "pay_line": 22,
                                    "symbol_id": 5,
                                    "amount": 3,
                                    "pay_credit": 120,
                                    "multiplier": 1
                                }
                            ],
                            "scatter_info": null,
                            "wild_info": null,
                            "scatter_extra": null,
                            "extra": {
                                "gem_game_result": [
                                    {
                                        "game_result": {
                                            "pay_credit_total": 75840,
                                            "game_result": [
                                                [
                                                    3,
                                                    5,
                                                    3
                                                ],
                                                [
                                                    1,
                                                    3,
                                                    8
                                                ],
                                                [
                                                    2,
                                                    4,
                                                    1
                                                ],
                                                [
                                                    4,
                                                    1,
                                                    6
                                                ],
                                                [
                                                    2,
                                                    4,
                                                    1
                                                ]
                                            ],
                                            "pay_line": [
                                                {
                                                    "pay_line": 0,
                                                    "symbol_id": 5,
                                                    "amount": 5,
                                                    "pay_credit": 3600,
                                                    "multiplier": 2
                                                },
                                                {
                                                    "pay_line": 1,
                                                    "symbol_id": 3,
                                                    "amount": 3,
                                                    "pay_credit": 480,
                                                    "multiplier": 2
                                                },
                                                {
                                                    "pay_line": 3,
                                                    "symbol_id": 3,
                                                    "amount": 4,
                                                    "pay_credit": 2880,
                                                    "multiplier": 2
                                                },
                                                {
                                                    "pay_line": 4,
                                                    "symbol_id": 3,
                                                    "amount": 5,
                                                    "pay_credit": 4800,
                                                    "multiplier": 2
                                                },
                                                {
                                                    "pay_line": 5,
                                                    "symbol_id": 3,
                                                    "amount": 5,
                                                    "pay_credit": 4800,
                                                    "multiplier": 2
                                                },
                                                {
                                                    "pay_line": 7,
                                                    "symbol_id": 5,
                                                    "amount": 5,
                                                    "pay_credit": 3600,
                                                    "multiplier": 2
                                                },
                                                {
                                                    "pay_line": 9,
                                                    "symbol_id": 3,
                                                    "amount": 5,
                                                    "pay_credit": 4800,
                                                    "multiplier": 2
                                                },
                                                {
                                                    "pay_line": 10,
                                                    "symbol_id": 3,
                                                    "amount": 4,
                                                    "pay_credit": 2880,
                                                    "multiplier": 2
                                                },
                                                {
                                                    "pay_line": 11,
                                                    "symbol_id": 5,
                                                    "amount": 5,
                                                    "pay_credit": 3600,
                                                    "multiplier": 2
                                                },
                                                {
                                                    "pay_line": 13,
                                                    "symbol_id": 5,
                                                    "amount": 5,
                                                    "pay_credit": 3600,
                                                    "multiplier": 2
                                                },
                                                {
                                                    "pay_line": 14,
                                                    "symbol_id": 5,
                                                    "amount": 4,
                                                    "pay_credit": 1920,
                                                    "multiplier": 2
                                                },
                                                {
                                                    "pay_line": 15,
                                                    "symbol_id": 3,
                                                    "amount": 5,
                                                    "pay_credit": 4800,
                                                    "multiplier": 2
                                                },
                                                {
                                                    "pay_line": 17,
                                                    "symbol_id": 5,
                                                    "amount": 5,
                                                    "pay_credit": 3600,
                                                    "multiplier": 2
                                                },
                                                {
                                                    "pay_line": 19,
                                                    "symbol_id": 3,
                                                    "amount": 5,
                                                    "pay_credit": 4800,
                                                    "multiplier": 2
                                                },
                                                {
                                                    "pay_line": 21,
                                                    "symbol_id": 3,
                                                    "amount": 5,
                                                    "pay_credit": 4800,
                                                    "multiplier": 2
                                                },
                                                {
                                                    "pay_line": 22,
                                                    "symbol_id": 3,
                                                    "amount": 3,
                                                    "pay_credit": 480,
                                                    "multiplier": 2
                                                },
                                                {
                                                    "pay_line": 23,
                                                    "symbol_id": 3,
                                                    "amount": 4,
                                                    "pay_credit": 2880,
                                                    "multiplier": 2
                                                },
                                                {
                                                    "pay_line": 24,
                                                    "symbol_id": 3,
                                                    "amount": 5,
                                                    "pay_credit": 4800,
                                                    "multiplier": 2
                                                },
                                                {
                                                    "pay_line": 25,
                                                    "symbol_id": 3,
                                                    "amount": 4,
                                                    "pay_credit": 2880,
                                                    "multiplier": 2
                                                },
                                                {
                                                    "pay_line": 26,
                                                    "symbol_id": 3,
                                                    "amount": 5,
                                                    "pay_credit": 4800,
                                                    "multiplier": 2
                                                },
                                                {
                                                    "pay_line": 27,
                                                    "symbol_id": 5,
                                                    "amount": 3,
                                                    "pay_credit": 240,
                                                    "multiplier": 2
                                                },
                                                {
                                                    "pay_line": 29,
                                                    "symbol_id": 3,
                                                    "amount": 5,
                                                    "pay_credit": 4800,
                                                    "multiplier": 2
                                                }
                                            ],
                                            "scatter_info": null,
                                            "wild_info": null,
                                            "scatter_extra": null,
                                            "extra": null
                                        },
                                        "gem_info": [
                                            {
                                                "symbol_id": 10,
                                                "pos": [
                                                    4,
                                                    10,
                                                    3,
                                                    13,
                                                    14,
                                                    11,
                                                    7,
                                                    8
                                                ]
                                            },
                                            {
                                                "symbol_id": 11,
                                                "pos": [
                                                    3,
                                                    4,
                                                    6,
                                                    7,
                                                    8,
                                                    10,
                                                    11,
                                                    13,
                                                    14
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        },
                        {
                            "pay_credit_total": 0,
                            "game_result": [
                                [
                                    7,
                                    2,
                                    5
                                ],
                                [
                                    1,
                                    2,
                                    7
                                ],
                                [
                                    4,
                                    3,
                                    4
                                ],
                                [
                                    8,
                                    4,
                                    1
                                ],
                                [
                                    7,
                                    7,
                                    6
                                ]
                            ],
                            "pay_line": [],
                            "scatter_info": null,
                            "wild_info": null,
                            "scatter_extra": null,
                            "extra": null
                        },
                        {
                            "pay_credit_total": 0,
                            "game_result": [
                                [
                                    1,
                                    5,
                                    4
                                ],
                                [
                                    7,
                                    3,
                                    5
                                ],
                                [
                                    3,
                                    8,
                                    4
                                ],
                                [
                                    1,
                                    2,
                                    1
                                ],
                                [
                                    8,
                                    5,
                                    2
                                ]
                            ],
                            "pay_line": [],
                            "scatter_info": null,
                            "wild_info": null,
                            "scatter_extra": null,
                            "extra": null
                        },
                        {
                            "pay_credit_total": 0,
                            "game_result": [
                                [
                                    2,
                                    7,
                                    3
                                ],
                                [
                                    7,
                                    4,
                                    11
                                ],
                                [
                                    8,
                                    5,
                                    2
                                ],
                                [
                                    8,
                                    6,
                                    8
                                ],
                                [
                                    8,
                                    5,
                                    2
                                ]
                            ],
                            "pay_line": [],
                            "scatter_info": null,
                            "wild_info": null,
                            "scatter_extra": null,
                            "extra": {
                                "gem_game_result": [
                                    {
                                        "game_result": {
                                            "pay_credit_total": 0,
                                            "game_result": [
                                                [
                                                    6,
                                                    8,
                                                    2
                                                ],
                                                [
                                                    4,
                                                    4,
                                                    7
                                                ],
                                                [
                                                    1,
                                                    3,
                                                    8
                                                ],
                                                [
                                                    4,
                                                    1,
                                                    3
                                                ],
                                                [
                                                    3,
                                                    5,
                                                    4
                                                ]
                                            ],
                                            "pay_line": [],
                                            "scatter_info": null,
                                            "wild_info": null,
                                            "scatter_extra": null,
                                            "extra": null
                                        },
                                        "gem_info": [
                                            {
                                                "symbol_id": 11,
                                                "pos": [
                                                    7,
                                                    13
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        },
                        {
                            "pay_credit_total": 0,
                            "game_result": [
                                [
                                    4,
                                    1,
                                    5
                                ],
                                [
                                    1,
                                    3,
                                    3
                                ],
                                [
                                    8,
                                    5,
                                    2
                                ],
                                [
                                    1,
                                    3,
                                    3
                                ],
                                [
                                    3,
                                    4,
                                    6
                                ]
                            ],
                            "pay_line": [],
                            "scatter_info": null,
                            "wild_info": null,
                            "scatter_extra": null,
                            "extra": null
                        }
                    ],
                    "pay_credit_total": 112680
                },
                "get_jackpot": false,
                "jackpot": {
                    "jackpot_id": "",
                    "jackpot_credit": 0,
                    "symbol_id": null
                },
                "get_jackpot_increment": false,
                "jackpot_increment": null,
                "grand": 0,
                "major": 0,
                "minor": 0,
                "mini": 0,
                "user_credit": 500020880,
                "bet_credit": 90000,
                "payout_credit": 112680 + 1680,
                "change_credit": 22680 + 1680,
                "effect_credit": 90000,
                "buy_spin": 1,
                "buy_spin_multiplier": 50,
                "extra": {
                    "user_data": {
                        "random_wild_gem": 2,
                        "wildX2_gem": 0
                    },
                    "free_spin_times": 8
                }
            }
        );
    }
}

