#!/bin/bash

echo "Setup backend Kelarin..."

# membuat virtual environment
python -m venv venv

# aktifkan virtual environment
source venv/bin/activate

# install dependency
pip install -r requirements.txt

echo "Setup selesai!"