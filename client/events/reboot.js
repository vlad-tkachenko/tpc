import { exec } from 'child_process';

export const reboot = () => {
    exec('shutdown /r /t 0', (error, stdout, stderr) => {
        if (error) {
            console.error(`Reboot error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Reboot stderr: ${stderr}`);
            return;
        }
        console.log(`Reboot output: ${stdout}`);
    });
}