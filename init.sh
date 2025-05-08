#!/bin/sh


sudo apt update ;
sudo apt install nodejs ;
sudo apt install npm ;
sudo apt install python3-pip ;
sudo apt install python3.12-venv;

alias python="python3";
python3 -m venv .pyvm ;
source .pyvm/bin/activate;

pip install -r py_package_req.txt;
npm install -d 

deactivate
