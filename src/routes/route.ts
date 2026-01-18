import { Router } from "express";
import accountWallets from "./wallet";
import x402Prot from "./payment"

const router = Router();

router.use("/account", accountWallets);
router.use("/x402", x402Prot);

export default router;
