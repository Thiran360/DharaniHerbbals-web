import os
import requests
from PIL import Image, ImageFilter
from io import BytesIO

out_dir = r"c:\Users\manoj\Downloads\DharaniHerbbalsweb (3)\DharaniHerbbalsweb\DharaniHerbbalsweb\DharaniHerbbals\src\assets\brands_api"
os.makedirs(out_dir, exist_ok=True)

urls = [
    "https://vedanmart.com/images/brands/MAKIL.jpeg",
    "https://vedanmart.com/images/brands/Amuthu.jpeg",
    "https://vedanmart.com/images/brands/Ramcare.jpeg",
    "https://vedanmart.com/images/brands/VANA%20ARASI.jpeg",
    "https://vedanmart.com/images/brands/Divyam.jpeg",
    "https://vedanmart.com/images/brands/Athiyaman.jpeg",
    "https://vedanmart.com/images/brands/Vedan.jpeg"
]

for url in urls:
    name = url.split("/")[-1].replace("%20", " ").replace(".jpeg", "")
    res = requests.get(url)
    if res.status_code == 200:
        img = Image.open(BytesIO(res.content)).convert("RGBA")
        
        # Make pixels with luminance < 20 transparent
        datas = img.getdata()
        newData = []
        for item in datas:
            # item is (R, G, B, A)
            if item[0] < 20 and item[1] < 20 and item[2] < 20:
                newData.append((0, 0, 0, 0))
            else:
                newData.append(item)
                
        img.putdata(newData)
        
        out_path = os.path.join(out_dir, f"{name}.png")
        img.save(out_path, "PNG")
        print(f"Processed {name}")

