import { contextBridge } from "electron"
import dotenv from 'dotenv'

/** */
 /* Import singletone models */
/** */
import test from "../../models/test"
import estimation from "../../models/estimation"
import userEstimation from "../../models/userEstimation"

/** */
/* Authorization server  */
/** */
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import controller from "../../server/controllers/auth.controller";

dotenv.config()

const app = express();

const corsOptions = {
  origin: "*"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to server." });
});

// Auth routes 
app.use(function(req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

app.post("/api/auth/signin", controller.signin);
app.post("/api/auth/signup", controller.signup);
app.post("/api/auth/changePassword", controller.changePassword);
app.post("/api/auth/auth", controller.auth);

/** */
/* Preload app  */
/** */
// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (
    selector: string,
    text: string | string[] | undefined
  ) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = String(text);
  };

  for (const dependency of ["chrome", "node", "electron"]) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }
})

/** */
/* Start authorization server after electron window has rendered  */
/** */
app.listen(4000, () => {
  console.log(`Server is running on port ${process.env.PORT}.`);
});

/** */
/* Context API for use system actions from application  */
/** */
contextBridge.exposeInMainWorld('models', {
  test: {
    create: (options: {
      testname: string,
      dataset: string, // Stringified JSON
      type: string, // ENUM types string value = app mode
      sheets_total: number
    }) => {
      return test.create(options)
    },
    loadByAppMode: (appMode: string) => {
      return test.loadByAppMode(appMode)
    },
    loadWithOptions: (
      // Pagination
      so: {
          page: number,
          rowsPerPage: number
      },
      // Filter
      like?: {
          field: string,
          value: string
      }
    ) => {
      return test.loadWithOptions(so, like)
    },
    delete: (id: number) => {
      return test.delete(id)
    } 
  },
  estimation: {
    getIdByEstimation: (resultEstimation: number) => {
      return estimation.getIdByEstimation(resultEstimation)
    }
  },
  userEstimation: {
    create: (options: {
      user_id: number,
      test_id: number,
      estimation_id: any
    }) => {
      return userEstimation.create(options)
    },
    load: (
      userId: number,
      // Pagination
      so: {
          page: number,
          rowsPerPage: number
      },
      // Filter
      like?: {
          field: string,
          value: string
      }
    ) => {
      return userEstimation.load(userId, so, like)
    }
  }
})
