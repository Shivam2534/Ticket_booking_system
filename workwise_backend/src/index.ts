import express, { Express } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
// import { middleware } from "./middleware/middleware";
import cors from "cors";
import dotenv from "dotenv";

const app: Express = express();

app.use(cors());
app.use(express.json());
dotenv.config();

app.get("/", (req, res) => {
  res.send("server is alive");
});

app.post("/api/v1/signup", async (req, res) => {
  console.log("request reached at /v1/signup endpoint");
  //verify data is not empty
  const parsedData = createNewUserSchema.safeParse(req.body);
  if (!parsedData.success) {
    return res.status(402).json({
      message: "Invalid Inputs",
      success: false,
    });
  }
  const { name, email, password } = parsedData.data;
  console.log(name, email, password);
  //check in the db (should not present in the db)
  const user = await prismaClient.user.findUnique({
    where: {
      email: email,
    },
  });
  if (user) {
    return res.status(402).json({
      message: "Email already in use (NOTE: use any other email)",
      success: false,
    });
  }

  //hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  //create an entry for the new user
  const newUser = await prismaClient.user.create({
    data: {
      name: name,
      email: email,
      password: hashedPassword,
      avatar: null,
    },
  });
  if (!newUser) {
    return res.status(501).json({
      message:
        "Something wrong happed while creating new user. (NOTE: create account again or try again after sometime)",
      success: false,
    });
  }

  res.status(200).json({
    message: "done",
    success: true,
    data: newUser,
  });
});

app.post("/api/v1/signin", async (req, res) => {
  console.log("request reached at /v1/signin endpoint");
  const parsedData = signinSchema.safeParse(req.body);
  if (!parsedData.success) {
    return res.status(402).json({
      message: "Invalid Inputs",
      success: false,
    });
  }
  const { email, password } = parsedData.data;
  // check into the db , is user exist or not (only come down if user in the db)
  const user = await prismaClient.user.findUnique({
    where: {
      email: email,
    },
  });
  if (!user) {
    return res.status(404).json({
      message: "Account not found, please create account!!!s",
      success: false,
    });
  }

  // check the password
  const isPasswordCorrect = bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(401).json({
      message: "Wrong Password!!",
      success: false,
    });
  }
  // assing the JWT token
  const secrete = JWT_SECRETE;
  const userId = user.id;
  const jwtToken = jwt.sign({ userId }, secrete ?? "xyz");

  const data = {
    userId: user.id,
    email: user.email,
    name: user.name,
  };

  res.status(200).json({
    message: "done",
    success: true,
    data: data,
    token: jwtToken,
  });

  // update user table with the accesstoken
  const updatedUser = await prismaClient.user.update({
    where: {
      id: user.id,
    },
    data: {
      accesstoken: jwtToken,
    },
  });

  console.log("updated user-", updatedUser);
});

app.listen(3001);
