import { PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress, NATIVE_MINT } from "@solana/spl-token";

export const WSOL_MINT = NATIVE_MINT;
export const WSOL_DECIMALS = 9;

export function getTokenMint() {
  const env = process.env.TOKEN_MINT;
  if (env && env !== "" && env !== "WSOL") return new PublicKey(env);
  return NATIVE_MINT;
}

export function getTokenDecimals() {
  const env = process.env.TOKEN_DECIMALS;
  if (env && !isNaN(Number(env))) return Number(env);
  return WSOL_DECIMALS;
}

export function isNativeToken() {
  return getTokenMint().equals(NATIVE_MINT);
}

export async function getAtas(mint, userPubkey, creatorPubkey, agentPubkey) {
  const mintKey = mint instanceof PublicKey ? mint : new PublicKey(mint);
  const userAta = await getAssociatedTokenAddress(mintKey, new PublicKey(userPubkey));
  const creatorAta = await getAssociatedTokenAddress(mintKey, new PublicKey(creatorPubkey));
  const agentAta = await getAssociatedTokenAddress(mintKey, new PublicKey(agentPubkey));
  return { userAta, creatorAta, agentAta };
}
