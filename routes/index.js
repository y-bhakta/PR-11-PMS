import { Router } from "express";
import webrouter from "./routers.js";

const router = Router();

router.use('/',webrouter);

export default router;