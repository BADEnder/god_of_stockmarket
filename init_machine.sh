
firewall-cmd --permanent --zone=public --add-service=http
firewall-cmd --permanent --zone=public --add-service=https
firewall-cmd --reload


snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot

ssh-keygen -t rsa -b 4096 -C "s10183001@gmail.com"

adduser ender777
usermod -aG sudo ender777
deluser ender777


# how to renew the ssl certificate ?
certbot certonly --standalone