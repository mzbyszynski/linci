import * as fs from "node:fs/promises";
import jose from "node-jose";

const keyFile = "keys.json";
const publicKeyFile = "public/jwks.json";
let keystore;

const saveKeystore = async (ks) => {
  await Promise.all([
    fs.writeFile(keyFile, JSON.stringify(ks.toJSON(true))),
    fs.writeFile(publicKeyFile, JSON.stringify(ks.toJSON(false))),
  ]);
};

const generateKey = async (ks) => {
  await ks.generate("RSA", 2048, { alg: "RS256", use: "sig" });
};

export const initializeKeystore = async () => {
  if (!keystore) {
    try {
      const keys = await fs.readFile(keyFile);
      keystore = await jose.JWK.asKeyStore(keys.toString());
    } catch {
      keystore = jose.JWK.createKeyStore();
      await generateKey(keystore);
      await saveKeystore(keystore);
    }
  }
};

export const rotateKeys = async (keysToRetain = 2) => {
  if (keysToRetain < 1) {
    throw new Error("Must retain at least 1 key");
  }

  await initializeKeystore();
  await generateKey(keystore);
  const keys = keystore.all({ use: "sig" });
  keys.slice(0, -keysToRetain).forEach((key) => {
    keystore.remove(key);
  });
  await saveKeystore(keystore);
};

export const getKey = () => {
  if (!keystore) {
    throw new Error("Keystore has not been initialized");
  }

  const [key] = keystore.all({ use: "sig" }).slice(-1);
  return key;
};

export const resetKeystore = () => {
  keystore = null;
};
