import { contextBridge, ipcRenderer } from "electron"
import dotenv from 'dotenv'
import knex from "knex";

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
/* Sqlite Database ORM declaration  */
/** */
const db = knex({
  client: 'sqlite3',
  connection: {
    filename: 'cq.db'
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
// contextBridge.exposeInMainWorld('server', {
//   getPort: async () => await ipcRenderer.invoke('potd', 'sdgdas')
// })

contextBridge.exposeInMainWorld('db', {
  select: (entity: string, table: string) => db.select(entity).from(table).then(rows => rows),
  selectWhere: (entity: string, table: string, where: string) => db(table).whereRaw(where).select(entity).then(rows => rows),
  insert: (table: string, options: Record<string | number, string | number>) => db(table).insert(options).then(),
  join: (tables: { table1: string, table2: string }, options: { table1_id: number, table2_id: number }) => db(tables.table1).join(`${tables.table2}`, `${options.table1_id}`, '=', `${options.table2_id}`)
})
