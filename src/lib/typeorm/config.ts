import { DataSource } from "typeorm";
import { Imagem } from "./entities/imagem";
import { Medida } from "./entities/medida";

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "db",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "pbl3-embarcados",
  password: process.env.DB_PASSWORD || "pbl3-embarcados",
  database: process.env.DB_NAME || "pbl3-embarcados",
  synchronize: true,
  logging: process.env.NODE_ENV === "development",
  entities: [Medida, Imagem],
});

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });

export default AppDataSource;
