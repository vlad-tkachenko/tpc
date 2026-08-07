import { execFile } from 'child_process';
import { getInstalledApps } from 'get-installed-apps';

export const Apps = {
    uninstallAppByName: async (appName) => {
        const psScript = `
    $app = Get-ItemProperty HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*,
                            HKLM:\\Software\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*,
                            HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* |
           Where-Object { $_.DisplayName -like '*${appName}*' } |
           Select-Object -First 1

    if ($app) {
      $cmd = if ($app.QuietUninstallString) { $app.QuietUninstallString } else { $app.UninstallString }
      Write-Output "RUNNING: $cmd"
      Start-Process cmd.exe -ArgumentList "/c $cmd" -Wait -NoNewWindow
    } else {
      Write-Error "Application not found."
    }
  `;

        console.log(`Uninstalling ${appName}`)
        await new Promise((res, rej) => {
            execFile('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', psScript], (error, stdout, stderr) => {
                if (error) {
                    rej(error)
                    return;
                }
                if (stderr) {
                    console.warn(`Stderr: ${stderr}`);
                }
                console.log(`Stdout: ${stdout}`);
                res()
            });
        })
        console.log(`${appName} uninstalled`)
    },

    quietUninstall: async (cmd) => {
        console.log(`Executing quiet uninstall...`);
        const resp = await fetch("http://localhost:23473/exec", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                cmd,
            })
        })

        if (resp.ok) {
            console.log(`App uninstalled`)
        } else {
            console.error(`Failed to uninstall app`)
        }
    },

    getInstalled: async () => {
        const result = await getInstalledApps()
        return result.map(r => ({
            app: r.DisplayName,
            version: r.DisplayVersion,
            publisher: r.Publisher,
            location: r.InstallLocation,
            uninstall: {
                automatic: r.QuietUninstallString,
                manual: r.UninstallString,
            },
        }))
    }
}