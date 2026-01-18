import { Router } from "express";
import accountWallets from "./wallet";

const router = Router();

router.use("/account", accountWallets);

export default router;
