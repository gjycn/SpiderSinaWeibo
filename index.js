import axios from 'axios';
import fs from 'fs';

const uid = '6100492453' //用户Id
const containerid = "1078036100492453_-_photoall" //相册Id
const cookie = 'WEIBOCN_FROM=1110005030; ' +
    'loginScene=102003; ' +
    'SUB=_2A25PSTzpDeRhGeNM6FYW-SbLwjuIHXVsskShrDV6PUJbkdCOLRb6kW1NTj10wTp0wsIuURJF373AZPMXxUUn4pSZ; ' +
    '_T_WM=26931189083; ' +
    'XSRF-TOKEN=d11ab4; ' +
    'MLOGIN=1; ' +
    'M_WEIBOCN_PARAMS=luicode=10000011&lfid=1078036100492453&fid=1078036100492453_-_photoall&uicode=10000012'

let count = 0; //图片计数

/**
 * 获取相册中的图片
 *
 * @param pic_id 图片id
 */
function get_pic(pic_id) {
    if (pic_id === undefined) {
        return;
    }
    axios({
        url: 'https://wx4.sinaimg.cn/woriginal/' + pic_id + '.jpg',
        method: 'get',
        responseType: "stream",
    }).then(response => {
        response.data.pipe(fs.createWriteStream("./pic/" + pic_id + ".jpg"));
        console.log(++count);
    }).catch(error => {
        console.log(error);
    });
}

/**
 * 睡眠
 *
 * @param time 毫秒值
 */
function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

let page = 0;//页数

while (page < 50) {
    page++;
    let pic_list_url = 'https://m.weibo.cn/api/container/getSecond?containerid='
        + containerid
        + '&page='
        + page
        + '&count=24&title=图片墙&luicode=10000011&lfid=1078036100492453&type=uid&value='
        + uid
    axios({
        method: 'GET',
        url: encodeURI(pic_list_url),
        headers: {
            'Cookie': cookie
        },
        contentType: 'application/json; charset=utf-8',
        userAgent: 'Mozilla/5.0 (Linux; Android 10; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Mobile Safari/537.36 Edg/100.0.4896.60',
        scheme: 'https',
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'same-origin',
        'upgrade-insecure-requests': 1

    }).then(response => {
        let cards = response.data.data['cards']

        for (let i = 0; i < cards.length; i++) {
            get_pic(cards[i]['pics'][0]['pic_id'])
            console.log(cards[i]['pics'][0]['pic_id'])

            get_pic(cards[i]['pics'][1]['pic_id'])
            console.log(cards[i]['pics'][1]['pic_id'])

            get_pic(cards[i]['pics'][2]['pic_id'])
            console.log(cards[i]['pics'][2]['pic_id'])

        }
    }).catch(error => {
        console.log(error);
    });

    sleep(2 * 1000).then(() => {
        console.log('sleep 2s');
    });
}

