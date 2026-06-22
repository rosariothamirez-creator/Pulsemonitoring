## Hardware Subsystem

### Overview
The hardware subsystem is responsible for acquiring vibration signals and converting them into digital data suitable for software processing. The system is designed to provide a portable, low-cost, and scalable vibration monitoring solution that can adapt to various deployment scenarios, from industrial facilities to urban infrastructure.

### Key Functions
* **Vibration Acquisition:** Real-time capturing of high-frequency acceleration and motion data.
* **Local Processing:** Reading, parsing, and conditioning sensor data efficiently via the microcontroller.
* **Edge Storage:** Continuous logging of formatted telemetry data directly into `.csv` files on a non-volatile storage module.
* **Power Stability:** Delivering reliable, continuous power to ensure uninterrupted operation during long-term field deployments.

### Hardware Architecture
The physical subsystem data flow is structured as follows:

Digital Accelerometer ──(I2C/SPI)──> Raspberry Pi Pico ──(SPI)──> Micro SD Card Module (.csv)

### Main Components
* **Microcontroller:** **Raspberry Pi Pico** – Serves as the central processing unit, managing sensor communication protocols, data formatting, and file-writing operations to the SD card.
* **Vibration Sensor:** **Digital Accelerometer** – Captures dynamic motion data and transmits it directly via digital communication, eliminating the need for an external Analog-to-Digital Converter (ADC).
* **Storage Module:** **MH-SD Card Module** – Enables local, reliable storage for logging real-time data into comma-separated values (CSV) format.
* **Power Supply Unit (PSU):** **Switching Power Supply (SMPS)** – Regulates and converts grid voltage to a stable operating voltage required by the microcontroler and modules.
* **Enclosure:** **3D Printed Case** – A custom-designed, compact housing to protect electronic components from environmental hazards and facilitate easy transportation.

<img width="2048" height="1852" alt="image" src="https://github.com/user-attachments/assets/e183808c-88eb-4b68-88d0-627426d21cc4" />


### Design Objectives
* **Cost-Efficiency:** Built using readily available, off-the-shelf components to minimize production barriers.
* **Portability:** Compact footprint optimized for seamless deployment in tight or remote environments.
* **Ease of Assembly:** Utilizes standard connections to simplify replication and assembly without complex manufacturing infrastructure.
* **Modularity:** Designed to allow effortless swapping or upgrading of sensors and storage units based on project needs.
* **Open-Source Compatibility:** Fully developed on open architectures to encourage community contribution and collaboration.
