import { Router } from "express";
import accountWallets from "./wallet";
import x402Prot from "./payment"
import webhook from "./webhook"

const router = Router();

router.use("/account", accountWallets);
router.use("/x402", x402Prot);
router.use("/endpoint",webhook)

export default router;
