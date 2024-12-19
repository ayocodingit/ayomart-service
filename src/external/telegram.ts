import axios from 'axios'
import { Config } from '../config/config.interface'
import { format } from 'date-fns'
import { id as locale } from 'date-fns/locale'

class Telegram {
    constructor(private config: Config) {}

    public Template({ code, action, expired_at, path, phone_number }: any) {
        let message = `
<b>🔒 ${action.action}</b>

🔹 <b>Kode Referensi:</b> <b>${code}</b>
🔹 <b>Nomor Telepon:</b> ${phone_number}
🔹 <b>Berlaku Hingga:</b> ${format(expired_at, 'dd MMMM yyyy HH:mm:ss', {
            locale,
        })}

🔹 <b>Link Tautan:</b> ${
            path
                ? `<a href="${this.config.app.url + path}">${
                      this.config.app.url + path
                  }</a>`
                : 'Tidak tersedia'
        }

${action.message}

Terima kasih,
<b>Tim ${this.config.app.name}</b>
`

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
