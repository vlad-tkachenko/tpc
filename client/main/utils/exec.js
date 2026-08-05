import { exec } from 'child_process';

export const execAsync = async (cmd) => {
    await new Promise((res, rej) => {
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                rej(error);
                return;
            }

            if (stderr) {
                console.warn(`Stderr output: ${stderr}`);
            }

            console.log(`Stdout:\n${stdout}`);
            res()
        });
    })
}