import {connectDB} from "./services/db.js";
import {mainProcessMostViewToken} from "./services/ViewTokenService.js";

async function testApi() {
    await connectDB();
    await mainProcessMostViewToken();
}

testApi()