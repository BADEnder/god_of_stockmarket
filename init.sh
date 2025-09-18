#!/bin/sh


sudo apt update ;
sudo apt install nodejs ;
sudo apt install npm ;
sudo apt install python3-pip ;
sudo apt install python3.12-venv;

sudo apt install postgresql postgresql-contrib;
sudo systemctl start postgresql;
sudo systemctl enable postgresql;

alias python="python3";
python3 -m venv .pyvm ;
source .pyvm/bin/activate;

pip install -r py_package_req.txt --exists-action=i;
npm install -d 

deactivate
