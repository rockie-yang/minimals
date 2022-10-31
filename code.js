import crypto from "crypto";

export const sha256 = async (plain) => {
    const encoder = new TextEncoder();
    const data = await encoder.encode(plain);
    const result = crypto.subtle.digest("SHA-256", data);
    
};


console.log(await sha256("9d2be0bbc7b7d5c1747b5cfb7252d663af23a6ef4fbbcee96d4f2d9bdea711e5b400acc9a108e2b5d1c502caec14d70d5c7323ccbd22a21addb35d8675194410b4bb024c723b154d5019d4806582cd0ec8963681393332a7534b82ae43082548f6a9d35ea54ec772f0d9bd2ac22549d0"));