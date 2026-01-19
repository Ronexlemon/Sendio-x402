import AsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { WasenderClient } from "../lib/whatsapp";
import { WASENDER_API_KEY } from "../constants/constant";
import { callPaymentAPI, createAccountViaApi, getAccountDetails } from "../lib/apiclients";

const wasender = new WasenderClient(WASENDER_API_KEY);

const webhook_receive = AsyncHandler(async (req: Request, res: Response) => {
  try {
    const messageData = req.body?.data?.messages;

    if (!messageData?.remoteJid || !messageData?.messageBody) {
      res.status(200).json({ ignored: true });
      return;
    }

    const lid = messageData.remoteJid;
    const incomingMessage = messageData.messageBody.trim().toLowerCase();


  const phoneNumber = lid.split("@")[0];
    console.log("Incoming LID:", lid);
    console.log("Incoming Message:", incomingMessage);

    // 🔹 HELP MENU
    if (incomingMessage === "/help") {
      await wasender.sendMessageFromLid({
        lid,
        message:
          `🤖 *Wallet Bot Menu*\n\n` +
          `0️⃣ Create / Get account\n` +
          `1️⃣ Send\n` +
          `2️⃣ Check balance\n` +
          `3️⃣ Delete account\n\n` +
          `Reply with 0, 1, 2, or 3`,
      });
    }

    else if (incomingMessage === "0") {
  const phoneNumber = lid.split("@")[0];

  // 1. Check if wallet exists
  const detailsResult = await getAccountDetails(phoneNumber);
  if (detailsResult.status) {
    await wasender.sendMessageFromLid({
      lid,
      message:
        `✅ Wallet found!\n\n` +
        `Address: ${detailsResult.data.address}`,
    });
    res.status(200).json({ status: "ok" });
    return;
  }

  // 3. If wallet does not exist, create it
  const result = await createAccountViaApi(phoneNumber);

  if (!result.status) {
    await wasender.sendMessageFromLid({
      lid,
      message: `❌ ${result.message}`,
    });
    res.status(200).json({ status: "ok" });
    return;
  }

  await wasender.sendMessageFromLid({
    lid,
    message:
      `✅ Wallet created successfully!\n\n` +
      `Address: ${result.data.address}\n` +
      `Private Key: ${result.data.privateKey}\n` +
      `Public Key: ${result.data.publicKey}`,
  });
}


    // 🔹 1: Send
    else if (incomingMessage === "1") {
      await wasender.sendMessageFromLid({
        lid,
        message:
          `📤 *Send Funds*\n\n` +
          `Use this format:\n` +
          `/send /address /amount\n\n` +
          `Example:\n` +
          `/send 0xabc123... 10`,
      });
    }

    // 🔹 2: Check Balance
    else if (incomingMessage === "2") {
      await wasender.sendMessageFromLid({
        lid,
        message: `💰 Your balance: _coming soon_`,
      });
    }

    // 🔹 3: Delete Account
    else if (incomingMessage === "3") {
      await wasender.sendMessageFromLid({
        lid,
        message:
          `⚠️ *Delete Account*\n\n` +
          `This action is irreversible.\n` +
          `Reply with:\n` +
          `/confirm delete`,
      });
    }else if (incomingMessage.includes("/")) {
    const [toAddress, amount] = incomingMessage.split(",");

    if (!toAddress || !amount) {
      await wasender.sendMessageFromLid({
        lid,
        message:
          "❌ Invalid format.\nPlease send like:\n/address,/amount\nExample:\n0xabc...,/50",
      });
      res.status(200).json({ status: "ok" });
      return;
    }

    // Call your payment API
    const result = await callPaymentAPI(phoneNumber, amount.replace("/", ""), toAddress);

    if (!result.status) {
      await wasender.sendMessageFromLid({
        lid,
        message: `❌ Payment Failed: ${result.message}`,
      });
      res.status(200).json({ status: "ok" });
      return;
    }

   await wasender.sendMessageFromLid({
  lid,
  message:
    "🎉 *Payment Successful!* 🎉\n\n" +
    `🔹 *Tx Hash:* ${result.data.txHash || "N/A"}\n` +
    `🔹 *From:* ${result.data.from || "N/A"}\n` +
    `🔹 *To:* ${result.data.to || "N/A"}\n` +
    `🔹 *Amount:* ${result.data.value || "N/A"}\n` +
    `🔹 *Block:* ${result.data.blockNumber || "N/A"}\n\n` +
    `🧭 *Track it here:* https://explorer.cronos.org/testnet/tx/${result.data.txHash || ""}\n\n` +
    `🕒 *Time:* ${result.data.timestamp || "N/A"}\n` +
    `🌐 *Network:* ${result.data.network || "N/A"}\n\n` +
    "✅ *Thank you for using Sendio!*"
});


    res.status(200).json({ status: "ok" });
    return;
  }

    // 🔹 Unknown command
    else {
      await wasender.sendMessageFromLid({
        lid,
        message:
          `❓ Unknown command\n\nType /help to see available options.`,
      });
    }

    res.status(200).json({ status: "ok" });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(200).json({ status: "error_logged" });
  }
});

export { webhook_receive };
