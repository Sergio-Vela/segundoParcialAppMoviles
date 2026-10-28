import { app } from './app';
import { initDatabase } from './src/infrastructure/database/initDatabase';

const PORT = 3000;

process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error);
    if (error instanceof Error) {
        console.error(error.stack);
    } else {
        console.error('Unknown uncaught exception object:', JSON.stringify(error, null, 2));
    }
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    console.error('Unhandled rejection:', reason);
    if (reason instanceof Error) {
        console.error(reason.stack);
    } else {
        console.error('Unknown unhandled rejection value:', JSON.stringify(reason, null, 2));
    }
    process.exit(1);
});

async function start() {
    try {
        await initDatabase();
        app.listen(PORT, () =>{
            console.log(`Server is runing on port ${PORT}`)
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        if (error instanceof Error) {
            console.error(error.stack);
        }
        process.exit(1);
    }
}

start();
