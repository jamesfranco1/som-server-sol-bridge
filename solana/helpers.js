import { PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress, NATIVE_MINT } from "@solana/spl-token";

export const WSOL_MINT = NATIVE_MINT;
export const WSOL_DECIMALS = 9;

export async function getAtas(mint, userPubkey, creatorPubkey, agentPubkey) {
  const mintKey = new PublicKey(mint);
  const userAta = await getAssociatedTokenAddress(mintKey, new PublicKey(userPubkey));
  const creatorAta = await getAssociatedTokenAddress(mintKey, new PublicKey(creatorPubkey));
  const agentAta = await getAssociatedTokenAddress(mintKey, new PublicKey(agentPubkey));
  return { userAta, creatorAta, agentAta };
}
