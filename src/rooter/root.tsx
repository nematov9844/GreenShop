import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Users from "../pages/Users";
import Blog from "../pages/Blog"
export const root = createBrowserRouter([
    {
        path: "/",
        element:<Home/>
    },{
        path:"/user",
        element:<Users/>
    },
    {
        path:"/blog",
        element:<Blog/>
    }
])