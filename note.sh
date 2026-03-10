
firewall-cmd --permanent --zone=public --add-service=http
firewall-cmd --permanent --zone=public --add-service=https
firewall-cmd --reload

# apt install git
# apt install snapd
# apt install openssh-server
# sudo systemctl enable ssh --now

snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot

ssh-keygen -t rsa -b 4096 -C "s10183001@gmail.com"

adduser ender777
usermod -aG sudo ender777
deluser ender777


# how to renew the ssl certificate ?
certbot certonly --standalone

#!/bin/sh


sudo apt update ;
apt install net-tools;
# apt install firewalld;
sudo apt install nodejs ;
sudo apt install npm ;
sudo apt install python3-pip ;
sudo apt install python3-venv;

sudo apt install postgresql postgresql-contrib;
sudo systemctl start postgresql;
sudo systemctl enable postgresql;

alias python="python3";
python3 -m venv .pyvm ;
source .pyvm/bin/activate;

pip install setuptools wheel numpy pandas FinMind tqdm sklearn matplotlib psycopg2 scikit-learn seaborn dotenv;
pip install --only-binary=:all: "tensorflow==2.13.*";

# pip install -r py_package_req.txt --exists-action=i;
npm install -d 

deactivate
