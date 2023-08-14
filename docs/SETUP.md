# Setup a notification node

These are useful steps for if you want to run a specific computer to run the notification server to signal using colours. If you have some old kit lying around with very low spec then this could be a useful use for it. We did it with some old think clients from Dell where we installed Debian and given they are really low power are a nice solution to run a headless node with the notification service.


## Setup your linux based environment

> This can be done with Mac and Windows but given our low specc'd computers and only needing a terminal we chose to go with Debian

Our install was a minimal install due to the low hardware specifications. This means we needed to add missing applications and services.

### Sudo not installed

> You will need to be logged in as root.

`apt-get install sudo`

> Add existing user to sudo group

`adduser 'username' sudo`


### Setup the system to support any missing

> Logged in as 'username'

#### Verify sudo install

`sudo -v`

#### Update APT

`sudo apt update`

#### Install CURL

`sudo apt install curl`

#### Install NodeJS

`sudo apt install nodejs`

#### Install NPM

`sudo curl -L https://npmjs.org/install/sh | sudo sh`

#### Install GIT

`sudo apt install git`

#### Install Process Manager

`sudo npm install pm2 -g`



Prepare For Code Build

sudo apt install build-essential git pkg-config

sudo apt install libudev-dev


sudo apt install libusb-1.0-0 libusb-1.0-0-dev


Install HID dependency

sudo npm install node-hid --build-from-source





Move to Usr/Local folder

cd /usr/local


Get the latest Opticall code

sudo git clone https://github.com/davidtcb/opticall.git


Install dependencies

sudo npm install