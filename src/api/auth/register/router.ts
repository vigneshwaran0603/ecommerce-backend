import {ServerRoute} from "@hapi/hapi";
import {registerHandler} from "./handler";

const authRoutes:ServerRoute[]=[
    {
        method:"POST",
        path:"/auth/register",
        handler: registerHandler
    }
];
export default authRoutes;