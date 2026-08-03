# 

## TPC - Client

### PM2


- Open Command Prompt as Administrator.
- Run:

```bash
setx TPC_CLIENT_NAME "PC-1" /M
```


```bash
cd tpc/client
pm2 start ecosystem.config.js
pm2 save
```

- Press Win + R, type `shell:startup`, and press Enter.
- Create a batch file inside this folder named `pm2-autostart.bat`

```
@echo off
pm2 resurrect
```