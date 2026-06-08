import zipfile
jar='lib/weka-stable-3.8.6.jar'
with zipfile.ZipFile(jar) as z:
    for name in z.namelist():
        if 'META-INF' in name and ('pom' in name or 'MANIFEST' in name):
            print(name)
            print(z.read(name).decode('utf-8', errors='ignore'))
            print('---')
