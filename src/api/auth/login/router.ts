import {ServerRoute} from "@hapi/hapi";
import {loginHandler} from "./handler"

const loginRoutes:ServerRoute[]=[
    {
        method:"POST",
        path:"/auth/login",
        handler: loginHandler
    }
];
export default loginRoutes;