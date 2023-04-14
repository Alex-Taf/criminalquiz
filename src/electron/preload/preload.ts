import { contextBridge } from "electron"
import dotenv from 'dotenv'
import knex from "knex";
import { attachPaginate } from "knex-paginate"
attachPaginate()

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
/* Sqlite Database QueryBuilder declaration  */
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
contextBridge.exposeInMainWorld('db', {
  select: (
    entity: string,
    table: string,
    so?: { page: number, rowsPerPage: number },
    like?: {
      field: string,
      value: string
    } 
    ) => {
      if (so && !like) {
        return db.select(entity).from(table).paginate({ perPage: so.rowsPerPage, currentPage: so.page }).then(rows => rows)
      } 
      
      if (so && like) {
        return db.select(entity).from(table).whereLike(like.field, `%${like.value}%`).paginate({ perPage: so.rowsPerPage, currentPage: so.page }).then(rows => rows)
      } 
      
      if (!so && like) {
        return db.select(entity).from(table).whereLike(like.field, `%${like.value}%`).then(rows => rows)
      }

      if (!so && !like) {
        return db.select(entity).from(table).then(rows => rows)
      }
    },
  selectWhere: (entity: string, table: string, where: string) => db(table).whereRaw(where).select(entity).then(rows => rows),
  insert: (table: string, options: Record<string | number, string | number>) => db(table).insert(options).then(),
  join: (
    table: string,
    options: {
      joinedTable: string,
      entities: Array<string>,
      operator: string
    },
    selection: Array<string>,
  ) => {
    return db(table)
            .join(options.joinedTable, options.entities[0], options.operator, options.entities[1])
            .select(...selection).then(rows => rows)
  },
  intermediateJoin: (
    selectValues: [],
    table1: string,
    interTable: {
      name: string,
      values: string[],
      operator: string
    },
    table3: {
      name: string,
      values: string[],
      operator: string
    },
    so?: { page: number, rowsPerPage: number },
    like?: {
      field: string,
      value: string
    }
  ) => {
    if (so && !like) {
      return db
            .select(...selectValues)
            .from(table1)
            .join(interTable.name, interTable.values[0], interTable.operator, interTable.values[1])
            .join(table3.name, table3.values[0], table3.operator, table3.values[1])
            .paginate({ perPage: so.rowsPerPage, currentPage: so.page })
            .then(rows => rows)
    }

    if (so && like) {
      return db
            .select(...selectValues)
            .from(table1)
            .whereLike(like.field, `%${like.value}%`)
            .join(interTable.name, interTable.values[0], interTable.operator, interTable.values[1])
            .join(table3.name, table3.values[0], table3.operator, table3.values[1])
            .paginate({ perPage: so.rowsPerPage, currentPage: so.page })
            .then(rows => rows)
    }

    if (!so && like) {
      return db
            .select(...selectValues)
            .from(table1)
            .whereLike(like.field, `%${like.value}%`)
            .join(interTable.name, interTable.values[0], interTable.operator, interTable.values[1])
            .join(table3.name, table3.values[0], table3.operator, table3.values[1])
            .then(rows => rows)
    }

    if (!so && !like) {
      return db
            .select(...selectValues)
            .from(table1)
            .join(interTable.name, interTable.values[0], interTable.operator, interTable.values[1])
            .join(table3.name, table3.values[0], table3.operator, table3.values[1])
            .then(rows => rows)
    }
  },
  delete: (table: string, id: number) => {
    return db(table).where('id', id).del().then(rows => rows)
  }
}
)
