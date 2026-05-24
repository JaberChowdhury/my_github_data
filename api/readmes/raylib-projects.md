## 1. Prerequisites

You need **CMake** and a **C++ Compiler** installed.

### Linux (Debian/Ubuntu/Mint)

You must install the system build tools and windowing libraries required by Raylib:

```bash
sudo apt update
sudo apt install build-essential git cmake
sudo apt install libasound2-dev mesa-common-dev libx11-dev libxrandr-dev libxi-dev xorg-dev libgl1-mesa-dev libglu1-mesa-dev

```

### macOS

```bash
brew install cmake

```

### Windows

- Install **Visual Studio 2022** (Desktop development with C++).
- Or use **MinGW** with CMake added to PATH.

---

## 2. Quick Start

Open your terminal in this folder and run:

```bash
# 1. Configure the project (downloads Raylib automatically)
cmake -S . -B build

# 2. Build the executable
cmake --build build

# 3. Run the game
./build/raylib-project

```

_Note: On Windows, the executable path will be `.\build\Debug\raylib-project.exe`._

---

## 3. How to Rename the Project

To change the project name from "raylib-project" to your own game name:

1. Open `CMakeLists.txt`.
2. Change line 2:

```cmake
project(MyAwesomeGame)

```

3. Re-run the build commands.

---
# raylib-projects
