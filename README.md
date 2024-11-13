pm2 is a node app manager
app is runnig on google compute engine
ssh into it and cd to /home/sebastianzeed/RadioK-Bryr-Sig-2023-shoppify-connection-api
us pm2 to manage the deployment

nginx is used as reverse proxy

.env is located in /home/sebastianzeed

## initial app launch
cd ~/YOUR_PROJECT_FOLDER

sudo su root //change to root user

pm2 start V.2/index.js

## check logs
cd ~/YOUR_PROJECT_FOLDER

sudo su root //change to root user

pm2 logs

## check app start/stop/restart
cd ~/YOUR_PROJECT_FOLDER

sudo su root //change to root user

pm2 ls //list all running apps

  $ pm2 stop app
  $ pm2 start app
  $ pm2 restart app


# refs
https://medium.com/@s.mehrotrasahil/from-code-to-cloud-deploying-node-js-applications-on-google-cloud-compute-engine-bba17e80a826
https://certbot.eff.org/instructions?ws=nginx&os=pip
