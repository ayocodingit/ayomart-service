/**
 * Generate a unique code based on context.
 * @param type - The type of request (e.g., 'verification', 'password_reset', 'invoice', 'order').
 * @param length - The desired length of the code (default is 6).
 * @returns A unique code string.
 */
function generateCode(
    type: 'verification' | 'password_reset' | 'invoice' | 'order' | 'store',
    length: number = 6
): string {
    const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const timestamp: string = Date.now().toString().slice(-6) // Last 6 digits of timestamp for uniqueness.
    let baseCode: string = ''

    // Generate random base code
    for (let i = 0; i < length; i++) {
        baseCode += characters.charAt(
            Math.floor(Math.random() * characters.length)
        )
    }

    // Prefix code based on type
    let prefix: string
    switch (type) {
        case 'verification':
            prefix = 'VER'
            break
        case 'password_reset':
            prefix = 'PWD'
            break
        case 'invoice':
            prefix = 'INV'
            break
        case 'order':
            prefix = 'ORD'
            break
        case 'store':
            prefix = 'STORE'
            break
        default:
            throw new Error(`Invalid type: ${type}`)
    }

    // Combine parts into a final code
    return `${prefix}-${baseCode}-${timestamp}`
}

export default generateCode
