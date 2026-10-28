import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { RegisterController } from "../controllers/RegisterController";
import { UserProfileController } from "../controllers/UserProfileController";
import { authMiddleware } from "../middleware/authMiddleware";
import { uploadProfilePhoto } from "../middleware/imageUploadMiddleware";

const userController = new UserController();
const registerController = new RegisterController();
const userProfileController = new UserProfileController();

export const userRoutes = Router();

userRoutes.post("/register", uploadProfilePhoto, (req, res) => registerController.register(req, res));
userRoutes.post("/users", (req, res) => userController.createUser(req, res));
userRoutes.post("/login", (req, res) => userController.login(req, res));
userRoutes.get("/users/:id", (req,res) => userController.getUserById(req, res));
userRoutes.get("/users/username/:usuario", (req, res) => userController.getUserByUsername(req, res));
userRoutes.get("/users/:id/profile", (req,res) => userProfileController.getUserProfile(req, res));
userRoutes.get("/users/:id/profile/foto", (req,res) => userProfileController.getUserProfilePhoto(req, res));
userRoutes.post("/users/:id/profile", authMiddleware, uploadProfilePhoto, (req,res) => userProfileController.createUserProfile(req, res));
userRoutes.put("/users/:id", (req,res) => userController.updateUser(req, res));
userRoutes.put("/users/:id/profile", authMiddleware, uploadProfilePhoto, (req,res) => userProfileController.updateUserProfile(req, res));
userRoutes.patch("/users/:id/password", authMiddleware, (req, res) => userController.changePassword(req, res));
userRoutes.delete("/users/:id", (req, res) => userController.deleteUser(req, res));

export default userRoutes;
