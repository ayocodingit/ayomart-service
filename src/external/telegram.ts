import axios from 'axios'
import { Config } from '../config/config.interface'
import { format } from 'date-fns'
import { id as locale } from 'date-fns/locale'

class Telegram {
    constructor(private config: Config) {}

    public Template({
        code,
        action,
        email,
        expired_at,
        text,
        path,
        phone_number,
    }: any) {
        let message = `
Action: <b>${action}</b>
Text: 
<b>${text}</b>

Code: <b>${code}</b>
Email: <b>${email}</b>
Phone Number: ${phone_number}
Expired: <b>${format(expired_at, 'dd MMMM yyyy HH:mm:ss', {
            locale,
        })}</b>

`
        if (path) message += `Redirect: <b>${this.config.app.url + path}</b>`

        return message
    }

    public async SendMessage(message: string) {
        return axios.post(this.config.telegram.url + '/sendMessage', {
            chat_id: this.config.telegram.chat_id,
            text: message,
            parse_mode: 'HTML',
        })
    }
}

export default Telegram
