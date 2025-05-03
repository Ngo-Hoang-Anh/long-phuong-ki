
import Room from "@/pages/Room/Room"
import Login from "../pages/Auth/Login"
import Register from "../pages/Auth/Register"
import LobbyGame from '../pages/Lobby/LobbyGame'
import PlayerInfo from "@/pages/PlayerInformation/PlayerInfor"
const userRoutes = [
    { path: "/lobby", component: LobbyGame },
    { path: "/:id", component: Room },
    { path: "/player/:id", component: PlayerInfo }
]

const authRoutes = [
    { path: "/login", component: Login },
    { path: "/register", component: Register },

]

export { userRoutes, authRoutes }