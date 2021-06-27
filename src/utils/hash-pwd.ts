import * as crypto from 'crypto';

export const hashPwd = (p: string): string => {
    const hmac = crypto.createHmac('sha512', 'cuviybuonipmo[npuivtc8r67980y9-ukom[n-b0v9c8tfvgbnm,k=j8h7g9f8r7cui gohpjm[ko=j-h09vti ojpimi-0h9vtc6yvgoubpin[omj-9h08g9');
    hmac.update(p);

    return hmac.digest('hex')
}