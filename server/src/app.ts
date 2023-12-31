import express, {Express} from 'express';
import cors from 'cors';
import mainRouter from "./routes/main.router";
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port: string | number = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use('/rest', mainRouter);

app.listen(port, () => {
    console.log(`Server is running at port="${port}"`);
});
