import {ServerRoute} from "@hapi/hapi";
import {adminRegisterHandler} from "./handler";

const adminRegisterRoutes:ServerRoute[]=[
    {
        method:"POST",
        path:"/admin/register",
        handler: adminRegisterHandler
    }
];
export default adminRegisterRoutes;