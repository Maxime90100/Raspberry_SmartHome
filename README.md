Raspberry Pi 3 SmartHome
========================

# Table des Matières
1. [Installation](#1-installation)
2. [Local Configuration](#2-local-configuration)
3. [Licence](#licence)

# 1. Installation
<div class="flex-content">
  <img src="./README/raspberry.png" alt="Raspberry Logo"/>
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
  Replace `<username>` by your own username.


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
  And check filesystem mount:
  ```text
  df -h
  ```
  Now, your USB drive should now be available in the /mnt/usb folder and Raspberry Pi OS will mount it automatically at each boot.
  See more details on https://raspberrytips.com/mount-usb-drive-raspberry-pi/
</details>

<div class="flex-content">
  <img src="./README/docker.png" alt="Docker Logo"/>
  <h2 id="docker">Docker</h2>
</div>

Before continuing, make sure you have enabled and configured Docker Remote API on Raspberry Pi (see [3. Enable Docker Remote API](#enable-docker-remote-api)).

* **Docker Compose on Raspberry**:

Run this command in the root of the project that contains the [compose.yml](compose.yaml). Make sure to replace `<raspberry_pi_ip>` by your Raspberry Pi IP.
```text
docker-compose -H tcp://<raspberry_pi_ip>:2375 up -d
```

* **Show Raspberry Docker Containers**:

```text
docker -H tcp://<raspberry_pi_ip>:2375 ps
```

If there were no errors, you should see Docker containers enabled in the Raspberry and therefore be able to access the client in the same network at: `http://<raspberry_pi_ip>:8080`

# 2. Local Configuration
#### ⚠ This part is only useful for testing the project locally.

<div class="flex-content">
  <img src="./README/vite.png" alt="Vite Logo"/>
  <img src="./README/vue.png" alt="Vue Logo"/>
  <h2 id="vite-vue">Vite + Vue</h2>
</div>

1. Install dependencies
```bash
npm install --prefix ./client pkg.json
```
2. Build Vite client
```bash
npm run --prefix ./client build
```
3. Preview Vite client
```bash
npm run --prefix ./client preview
```

# Licence

This project is under MIT licence - see [LICENSE](LICENSE) file for more details.


<style>
summary{
    font-size: 15px;
    font-weight: bold;
}
img{
    width: 20px;
}
.flex-content{
    display: flex;
    align-items: baseline;
    gap: 10px;
}
</style>