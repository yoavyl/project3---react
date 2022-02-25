import fs from "fs";

function safeDelete(absolutePath: string): void {
    try {

        // if undefined / null - do nothing
        if (!absolutePath) return;

        // only if file exists - try to delete it
        if (fs.existsSync(absolutePath)) {
            fs.unlinkSync(absolutePath); // delete file
        }

    } catch(err: any) {  // do nothing on fail.
        console.error(err); // or log file  // console.error -> like console log but styled as error
    }

}

export default safeDelete;