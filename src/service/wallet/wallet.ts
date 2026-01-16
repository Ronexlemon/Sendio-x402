
import crypto from "crypto";
import { prisma } from "../../config/prisma";
import { generateWallet } from "../../hooks/wallet";

const createWallet = async (phoneNumber: string) => {
  const existing = await prisma.wallet.findUnique({
    where: { phoneNumber },
  });
  if (existing) {
    throw new Error(`Wallet already exists for ${phoneNumber}`);
  }

  const { address, private_Key } = generateWallet();

  const wallet = await prisma.wallet.create({
    data: {
      phoneNumber,
      address,
      privateKey:private_Key,
    },
  });

  return wallet;
};


const getWalletByPhoneNumber = async (phoneNumber: string) => {
  const wallet = await prisma.wallet.findUnique({
    where: { phoneNumber },
  });

  if (!wallet) {
    throw new Error(`Wallet not found for ${phoneNumber}`);
  }

  return wallet;
};


 const deleteWalletByPhoneNumber = async (phoneNumber: string) => {
  const wallet = await prisma.wallet.delete({
    where: { phoneNumber },
  });

  return wallet;
};

export {createWallet,getWalletByPhoneNumber,deleteWalletByPhoneNumber}