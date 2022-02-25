import "./About.css";

function About(): JSX.Element {
    return (
        <div className="About">
            <p>
                This projects implements:
                <ul>
                    <li>Client side: React - redux</li>
                    <li>Server side: Node JS (typescript) - express, , middleware, rest api, socket io</li>
                    <li>DB: MySQL</li>
                </ul>
            </p>
            <p>
                You can test it using:
                <ul>
                    <li>username: testing123 (user) or username: admin123 (admin)</li>
                    <li>password: Aa1!Aa1! (for both)</li>
                    <li>or registering a new user yourself</li>
                </ul>

                If admin adds / deletes / updates a vacation, users see the change in real time.
                <br />
                See project's <a href="https://github.com/yoavyl/project4---react/" target="_blank" rel="noopener noreferrer">GitHub page</a>.
            </p>
        </div>
    );
}

export default About;
