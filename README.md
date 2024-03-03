Raspberry Pi 3 SmartHome
========================

# Table des Matières
1. [Installation](#1-installation)
2. [Configuration](#2-configuration)

# 1. Installation
<div style="display: flex; align-items: baseline; gap: 10px">
  <img src="https://upload.wikimedia.org/wikipedia/fr/thumb/3/3b/Raspberry_Pi_logo.svg/711px-Raspberry_Pi_logo.svg.png" alt="Raspberry Logo" width="20"/>
  <h2 id="raspberry-pi-3">Raspberry Pi 3</h2>
</div>

This section assume that your Raspberry Pi 3 is available with Rasbian OS and have SSH connexion.
If not, please download OS on SD card with Raspberry Pi Imager on https://www.raspberrypi.com/software/ and then configure your WiFi and SSH connexion.

<details>
  <summary id="connect-to-raspberry">1. Connect to Raspberry</summary>

* Use SSH connection (with Putty for Windows)
</details>
<details>
  <summary id="install-docker">2. Install Docker</summary>

* Update Package Lists:
  ```text
  sudo apt update
  ```

* Install Required Packages:
  ```text
  sudo apt install -y apt-transport-https ca-certificates software-properties-common
  ```

* Add Docker's GPG Key:
  ```text
  curl -fsSL https://download.docker.com/linux/raspbian/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
  ```

* Set up the Docker Stable Repository:
  ```text
  echo "deb [signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/raspbian $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
  ```

* Update Package Lists Again:
  ```text
  sudo apt update
  ```

* Install Docker Engine:
  ```text
  sudo apt install -y docker-ce docker-ce-cli containerd.io
  ```

* Add Your User to the Docker Group:
  ```text
  sudo usermod -aG docker <username>
  ```

* Reboot Your Raspberry Pi:
  ```text
  sudo reboot
  ```

* Verify Docker Installation:
  ```text
  docker --version
  ```

</details>
<details>
  <summary id="enable-docker-remote-api">3. Enable Docker Remote API</summary>

* Edit the Docker daemon startup options:
  ```text
  sudo nano /lib/systemd/system/docker.service
  ```
  Find the ExecStart line, which starts with /usr/bin/dockerd, and remove the `-H fd://` part:
  ```text
  ExecStart=/usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock
  ```

* Save the file and reload daemon:
  ```text
  sudo systemctl daemon-reload
  ```

* Edit the Docker daemon configuration file:
  ```text
  sudo nano /etc/docker/daemon.json
  ```
  Update the file to include the following content, replacing `<raspberry_pi_ip>` with the actual IP address of your Raspberry Pi:
  ```json
  {
    "hosts": ["tcp://<raspberry_pi_ip>:2375", "unix:///var/run/docker.sock"]
  }
  ```
  ⚠ You can get your Raspberry IP with:
  ```text
  hostname -I
  ```

* Save the file and restart the Docker daemon:
  ```text
  sudo systemctl restart docker
  ```

* Ensure that the Docker daemon is running and listening for remote connections. Run the following command on your Raspberry Pi:
  ```text
  sudo systemctl status docker
  ```

</details>
<details>
  <summary id="mount-usb-drive-storage">4. Mount USB Drive Storage</summary>

* Find USB Device:
  ```text
  sudo fdisk -l
  ```
  ⚠ Remember the device path (something like `/dev/sda1`) and the file system format type (something like `FAT32`).


* Find Device UUID (last value before arrow):
  ```text
  sudo ls -l /dev/disk/by-uuid/
  ```
  ⚠ Remember the device UUID.


* Create the mount point directory:
  ```text
  sudo mkdir /mnt/usb
  ```

* Edit the Mount Point configuration file:
  ```text
  sudo nano /etc/fstab
  ```
  Update the file to include the following line:
  ```text
  UUID=<device_uuid> /mnt/usb <file_system> uid=<user>,gid=<user> 0 0
  ```
  ⚠ Replace `<device_uuid>` by your usb device uuid, `<file_sytem>` by your file system (vfat for FAT32) and `<user>` by the user (default pi).


* Mount Storage:
  ```text
  sudo mount -a
  ```
  Now, your USB drive should now be available in the /mnt/usb folder and Raspberry Pi OS will mount it automatically at each boot.
  See more details on https://raspberrytips.com/mount-usb-drive-raspberry-pi/
</details>

<div style="display: flex; align-items: baseline; gap: 10px">
  <img src="https://upload.wikimedia.org/wikipedia/commons/f/f1/Vitejs-logo.svg" alt="Vite Logo" width="20"/>
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/768px-Vue.js_Logo_2.svg.png" alt="Vue Logo" width="20"/>
  <h2 id="vite-vue">Vite + Vue</h2>
</div>

# 2. Configuration

<style>
summary{
    font-size: 15px;
    font-weight: bold;
}
</style>