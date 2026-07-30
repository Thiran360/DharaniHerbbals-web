import os
from PIL import Image

files = ['vanaarasi.png', 'ramcare.png', 'makil.png']
base_dir = r'c:\Users\manoj\Downloads\DharaniHerbbalsweb (3)\DharaniHerbbalsweb\DharaniHerbbalsweb\DharaniHerbbals\src\assets'

for file in files:
    path = os.path.join(base_dir, file)
    if not os.path.exists(path):
        print(f"Not found: {path}")
        continue
    
    try:
        img = Image.open(path).convert("RGBA")
        datas = img.getdata()
        
        newData = []
        for item in datas:
            # item is (R, G, B, A)
            # if black or very close to black, make it transparent
            if item[0] < 20 and item[1] < 20 and item[2] < 20:
                # To avoid harsh edges, we could make alpha proportional to brightness, 
                # but simple replacement might be enough if it's pure black
                newData.append((255, 255, 255, 0))
            else:
                newData.append(item)
                
        img.putdata(newData)
        # overwrite
        img.save(path, "PNG")
        print(f"Processed: {file}")
    except Exception as e:
        print(f"Error processing {file}: {e}")
