import express from "express";
import {restrictedTo} from "../middleware/restrictAccess";
import {getAllUser, updateRole} from "../controller/adminAccess";
import {verify} from "../middleware/verifyUser";

const adminRouter = express.Router();

adminRouter.get("/", verify, restrictedTo("admin"), getAllUser);
adminRouter.post("/role", verify, restrictedTo("admin"), updateRole);

export {adminRouter};
