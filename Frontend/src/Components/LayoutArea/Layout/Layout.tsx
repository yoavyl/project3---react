import AuthMenu from "../../AuthArea/AuthMenu/AuthMenu";
import Footer from "../Footer/Footer";
import Instructions from "../Instructions/Instructions";
import Menu from "../Menu/Menu";
import Router from "../Router/Router";
import "./Layout.css";

function Layout(): JSX.Element {
    return (
        <div className="Layout">
            <header>
                <AuthMenu />
                <h1 className="font-face-gm">&#9992; Observacation &#9992;</h1 >
            </header>
            <aside>
                <Menu />
            </aside>
            <main>
                <Router />
            </main>
            <aside>
                <Instructions />
            </aside>
            <footer>
                <Footer />
            </footer>   
        </div>
    );
}

export default Layout;
