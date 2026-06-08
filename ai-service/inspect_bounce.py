import zipfile
jar='lib/weka-stable-3.8.6.jar'
with zipfile.ZipFile(jar) as z:
    data = z.read('META-INF/maven/nz.ac.waikato.cms.weka/weka-stable/pom.xml').decode('utf-8', errors='ignore')
    for i, line in enumerate(data.splitlines()):
        if 'bounce' in line.lower():
            start = max(0, i-3)
            end = min(len(data.splitlines()), i+4)
            print('\n'.join(data.splitlines()[start:end]))
            print('---')
