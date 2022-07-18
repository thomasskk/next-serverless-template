import nodeCrypto from "crypto";
import { argon2id, argon2Verify } from "hash-wasm";
import ms from "ms";
import { CryptographyKey, SodiumPlus } from "sodium-plus";
import { promisify } from "util";

export type Expiration = `${number}${"d" | "h" | "m" | "s" | "y"}`;

type MssgObj = {
  mssg: any;
  ex: number;
};

const ENCODING = "base64";
const CRYPTO_SPLIT_CHAR = ".";

export const cryptoUtils = {
  hashPass: async (password: string) => {
    const salt = await promisify(nodeCrypto.randomBytes)(16);
    return argon2id({
      password,
      salt,
      parallelism: 1,
      iterations: 256,
      memorySize: 512,
      hashLength: 32,
      outputType: "encoded",
    });
  },

  verifyHashPass: async (password: string, hash: string) => {
    return argon2Verify({
      password,
      hash,
    });
  },

  sign: async (mssg: string, secret: string, expiration?: Expiration) => {
    const sodium = await SodiumPlus.auto();

    let ex;

    if (expiration) {
      ex = Math.floor(Date.now() / 1000) + ms(expiration);
    }

    const input = Buffer.from(JSON.stringify({ mssg, ex }));

    const key = Buffer.from(secret, ENCODING);

    const output = await sodium.crypto_auth(input, new CryptographyKey(key));

    return (
      input.toString(ENCODING) + CRYPTO_SPLIT_CHAR + output.toString(ENCODING)
    );
  },

  verify: async (value: string, secret: string) => {
    const split = value.lastIndexOf(CRYPTO_SPLIT_CHAR);

    if (split === -1) {
      throw new Error("token malformed");
    }

    const input = Buffer.from(value.slice(0, split), ENCODING);

    const mssgObj: MssgObj = JSON.parse(input.toString());
    const { mssg, ex } = mssgObj;

    if (ex && ex < Math.floor(Date.now() / 1000)) {
      throw new Error("token expired");
    }

    const output = Buffer.from(value.slice(split + 1), ENCODING);

    const sodium = await SodiumPlus.auto();

    if (output.length !== sodium.CRYPTO_AUTH_BYTES) {
      throw new Error("invalid output");
    }

    const key = Buffer.from(secret, ENCODING);

    const verified = await sodium.crypto_auth_verify(
      input,
      new CryptographyKey(key),
      output
    );

    if (!verified) {
      throw new Error("invalid token");
    }

    return mssg;
  },
};
