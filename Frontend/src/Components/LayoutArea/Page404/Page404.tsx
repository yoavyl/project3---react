function Page404(): JSX.Element {
    return (
        <div className="Page404">
			<h2>This page does'nt exist</h2>
            <iframe width="560" height="315" src="https://www.youtube.com/embed/t3otBjVZzT0?autoplay=1" allow="autoplay" title="Page not Found"></iframe>
            {/* <ReactPlayer></ReactPlayer> */}
            {/* https://stackoverflow.com/questions/58027168/make-youtube-video-autoplay-using-react */}
        </div>
    );
}

export default Page404;
