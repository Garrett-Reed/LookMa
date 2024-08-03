# LookMa needs to run these first
python -m venv venv
venv\Scripts\activate.bat
pip install -r requirements.txt

# Open powershell and run website
cd my-camera-app-vite\src
npm run dev

# In powershell python venv run API
fastapi run apirework.py