/**
 * Author: frank
 * CreateTime: 2019/07/31
 * Desc: 验证手机号码
 */

export const validatePhone = (phone) => {
        let phoneStr = String(phone).trim();
        if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(phoneStr))) {
            return false;
        }
        return true
    }
    /**
     * Author: frank
     * CreateTime: 2019/07/31
     * Desc: 验证身份证号码
     */

export const validateIdCard = (card) => {
    let cardStr = String(card).trim();
    if (/(^\d{15}$)|(^\d{17}([0-9]|X|x)$)/.test(cardStr)) {
        return true
    }
    return false
}