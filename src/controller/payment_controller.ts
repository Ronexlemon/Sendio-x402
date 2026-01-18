import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

const x40PaymentRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const { phoneNumber,Amount } = req.body ||  {};

    if (!phoneNumber || !Amount) {
      res.status(402).json({
        status: false,
        message: "phoneNumber and Amount is required",
      });
      return;
    }
    const x402Data = {
        phoneNumber:phoneNumber,
        Amount:Amount
    }

    res.status(402).json({
      status: true,
      message: "PaymentRequest Successful",
      data: x402Data,
    });
  }
);


export {x40PaymentRequest}