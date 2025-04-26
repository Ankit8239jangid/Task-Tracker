import express from "express";
export const router = express.Router();
import userRoute from "./User.router.js";
import accountRoute from "./account.router.js";

router.use('/user', userRoute);
/* 
{
get: api/v1/user/balance;
post: api/v1/user/signin;

}
*/

router.use('/account', accountRoute);

/*
{
  get: api/v1/account/balance;
  put: api/v1/account/deposit;
}
*/