import {ServerRoute} from "@hapi/hapi";
import {adminLoginHandler} from "./handler"

const adminLoginRoutes:ServerRoute[]=[
    {
        method:"POST",
        path:"/admin/login",
        handler: adminLoginHandler
    }
];
export default adminLoginRoutes;