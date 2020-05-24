/**
 * 占い配信BOT
 * 
 * powerd by JugemKey: http://jugemkey.jp/api/
 * 【PR】原宿占い館 塔里木: http://www.tarim.co.jp/
 */
const LINE_NOTIFY_TOKEN = '*****'; // LINE NOTIFY用のアクセストークン 
const zodiacSign = {
    ARIES: 0, // 牡羊座
    TAURUS: 1, // 牡牛座
    GEMINI: 2, // 双子座
    CRAB: 3, // 蟹座
    LEO: 4, // 獅子座
    VIRGO: 5, // 乙女座
    LIBRA: 6, // 天秤座
    SCORPIO: 7, // 蠍座
    SAGITTARIUS: 8, // 射手座
    GOAT: 9, // 山羊座
    AQUARIUS: 10, // 水瓶座
    FISH: 11, // 魚座
};
const USER_LIST = [{
        name: 'A男',
        sign: zodiacSign.ARIES
    },
    {
        name: 'B子',
        sign: zodiacSign.SAGITTARIUS
    }
];
const WEEKDAY = ["日", "月", "火", "水", "木", "金", "土"];

/**
 * メイン処理
 */
function main() {
    try {
        let nowDt = new Date();
        let targetDt = Utilities.formatDate(nowDt, 'Asia/Tokyo', 'yyyy/MM/dd');
        let res = getHoroscope(targetDt);
        console.log(res);

        let horoList = res['horoscope'][targetDt];
        let dt = Utilities.formatDate(nowDt, 'Asia/Tokyo', `MM/dd(${WEEKDAY[nowDt.getDay()]})`);
        let message = `\n今日の占いだよ!!\n\n--- ${dt} ----\n\n`;
        for (let i in USER_LIST) {
            let user = USER_LIST[i];
            let horoObj = horoList[user.sign];
            message += `< ${user.name}(${horoObj.sign}) >\n`;
            message += `ランキング: ${horoObj.rank}位\n`;
            message += `総合運: ${getStar(horoObj.total)}\n`;
            message += `恋愛運: ${getStar(horoObj.love)}\n`;
            message += `仕事運: ${getStar(horoObj.job)}\n`;
            message += `金運  : ${getStar(horoObj.money)}\n`;
            message += `ラッキーアイテム: ${horoObj.item}\n`;
            message += `ラッキーカラー: ${horoObj.color}\n`;
            message += `${horoObj.content}\n`;
            message += `\n`;
        }
        sendLineNotify(message);

    } catch (e) {
        console.error(e.stack);
    }
}

/**
 * 星を取得する
 * @param {Number} num 
 */
function getStar(num) {
    let message = '';
    for (let i = 0; i < 5; i++) {
        if (i < num) {
            message += '★';
        } else {
            message += '☆';
        }
    }
    return message;
}

/**
 * 占い情報を取得する
 * @param {String} date 日付 
 */
function getHoroscope(date) {
    let url = `http://api.jugemkey.jp/api/horoscope/free/${date}`;
    let options = {
        'method': 'get',
        'validateHttpsCertificates': false
    };
    let response = UrlFetchApp.fetch(url, options);
    return JSON.parse(response.getContentText('UTF-8'));
}

/**
 * LINEにメッセージを送信する
 * @param {String} message メッセージ 
 */
function sendLineNotify(message) {
    let url = 'https://notify-api.line.me/api/notify';
    let options = {
        'method': 'post',
        'headers': {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Authorization': `Bearer ${LINE_NOTIFY_TOKEN}`
        },
        'payload': `message=${message}`
    };
    let response = UrlFetchApp.fetch(url, options);
    return JSON.parse(response.getContentText('UTF-8'));
}