import crypto from "crypto";

const encryptWithKey = (word: string, secret: string) => {
  let key = Buffer.alloc(16);
  Buffer.from(secret, "utf-8").copy(key);
  let secret_msg = Buffer.from(word, "utf-8");
  let cipher = crypto.createCipheriv("aes-128-ecb", key, null);
  let encryptedData = Buffer.concat([cipher.update(secret_msg), cipher.final()])
    .toString("hex")
    .toUpperCase();

  return encryptedData;
};

const decryptWithKey = (word: any, secret: string) => {
  let key = Buffer.alloc(16);
  Buffer.from(secret, "utf-8").copy(key);
  let secret_msg = Buffer.from(word, "hex");

  let cipher = crypto.createDecipheriv("aes-128-ecb", key, null);
  let decryptData = Buffer.concat([
    cipher.update(secret_msg),
    cipher.final(),
  ]).toString("utf-8");
  return decryptData;
};

export { encryptWithKey, decryptWithKey};
