import { AuthService } from "./authService"
import { PostService } from "./postService"
import { UserService } from "./userService"

export const authService = new AuthService()
export const userService = new UserService()
export const postService = new PostService()
