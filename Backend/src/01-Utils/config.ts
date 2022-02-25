abstract class Config {
    public port: number;
    public mySql = { host: "", user: "", password: "", database: "" };
    public loginExpiresIn: string;
    public imageFolder: string;
}

class DevelopmentConfig extends Config {
    public constructor() {
        super();
        this.port = 3001;
        this.mySql = {host: "localhost", user: "root", password: "", database: "Observacation"};
        this.loginExpiresIn="7d" // 7 days
        this.imageFolder = "./src/Assets/Images/Vacations/";
    }
}

class ProductionConfig extends Config {
    public constructor() {
        super();
        this.port = +process.env.PORT;
        // connection parameters for heroku app are in a seperate file, which needs to be hidden
        this.mySql = {host: process.env.HEROKU_HOST, user: process.env.HEROKU_USER, password: process.env.HEROKU_PASSWORD, database: process.env.HEROKU_DATABASE};
        this.loginExpiresIn="7d" // 7 days
        this.imageFolder = "./Assets/Images/Vacations/";
    }

}

const config = process.env.ENVIRONMENT === "development" ? new DevelopmentConfig() : new ProductionConfig();

export default config;
