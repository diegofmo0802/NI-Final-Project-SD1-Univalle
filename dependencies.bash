#!/bin/bash
set -e

remove_build_dir() {
    if [ -d "$1" ]; then
        echo "Removing $1"
        rm -rf "$1"
    fi
}

clone_or_pull() {
    REPO=$1
    DIR=$2

    if [ -d "$DIR" ]; then
        echo "Updating $DIR"
        cd "$DIR"
        git pull || { echo "Failed to update $DIR"; exit 1; }
        cd ..
    else
        echo "Cloning $REPO into $DIR"
        git clone "$REPO" "$DIR" || { echo "Failed to clone $REPO"; exit 1; }
    fi
}

DB_REPO="https://github.com/diegofmo0802/db-manager.git"
WEBAPP_REPO="https://github.com/diegofmo0802/WebApp.git"
QRCODE_REPO="https://github.com/diegofmo0802/QR-Code.git"

remove_build_dir "src/DBManager"
remove_build_dir "client/logic/src/WebApp"
remove_build_dir "client/logic/src/QR-Code"
remove_build_dir "src/QR-Code"


clone_or_pull "$DB_REPO" ".DBManager"
clone_or_pull "$WEBAPP_REPO" ".WebApp"
clone_or_pull "$QRCODE_REPO" ".QR-Code"
(
    echo "Injecting dependency files from DBManager"
    if cp -r .DBManager/src src/DBManager; then
        echo "Successfully injected DBManager"
    else
        echo "Error: Failed to inject DBManager"
    fi
)
(
    echo "Injecting dependency files from WebApp"
    if cp -r .WebApp/src client/logic/src/WebApp; then
        echo "Successfully injected WebApp"
    else
        echo "Error: Failed to inject WebApp"
    fi
)
(
    echo "Injecting dependency files from QR-Code"
    if cp -r .QR-Code/src client/logic/src/QR-Code; then
        echo "Successfully injected QR-Code to client"
    else
        echo "Error: Failed to inject QR-Code to client"
    fi
    if cp -r .QR-Code/src src/QR-Code; then
        echo "Successfully injected QR-Code to src"
    else
        echo "Error: Failed to inject QR-Code to src"
    fi
)

echo "Dependencies injection completed"