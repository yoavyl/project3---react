abstract class Config {
    public urls = {
        register: "",
        login: "",
        vacations: "",
        vacationImages: "",
        checkUsername: "",
        addFollower: "",
        removeFollower: "",
        getStats: "",
        socketServer: ""
    }

    public constructor(baseUrl: string) {
        this.urls = {
            register: baseUrl + "auth/register/",
            login: baseUrl + "auth/login/",
            vacations: baseUrl + "vacations/",
            vacationImages: baseUrl + "vacations/images/",
            checkUsername: baseUrl + "auth/checkUsername/",
            addFollower: baseUrl + "followers/add/",
            removeFollower: baseUrl + "followers/remove/",
            getStats: baseUrl + "followers/stats/",
            socketServer: "http://localhost:3001"
        }
    }
}

class DevelopmentConfig extends Config {
    public constructor() {
        super("http://localhost:3001/api/");
    }
}

class ProductionConfig extends Config {
    public constructor() {
        super("https://observacation-website-by-yoav.herokuapp.com/api/");
        this.urls.socketServer = "https://observacation-website-by-yoav.herokuapp.com" // for heroku purposes
    }
}

const config = process.env.NODE_ENV === "development" ? new DevelopmentConfig() : new ProductionConfig();

export default config;

