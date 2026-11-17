import zipfile,re,sys,json
from xml.etree import ElementTree as ET
M='{http://schemas.openxmlformats.org/spreadsheetml/2006/main}'
z=zipfile.ZipFile(sys.argv[1])
ss=[''.join(t.text or '' for t in si.iter(M+'t')) for si in ET.fromstring(z.read('xl/sharedStrings.xml')).findall(M+'si')]
rows=[]
for r in ET.fromstring(z.read('xl/worksheets/sheet1.xml')).iter(M+'row'):
    d={}
    for c in r.findall(M+'c'):
        col=re.match('[A-Z]+',c.get('r')).group();v=c.find(M+'v')
        if v is not None: d[col]=ss[int(v.text)] if c.get('t')=='s' else v.text
    rows.append(d)
hdr=rows[0]
out=[{hdr[k].strip():v.strip() for k,v in r.items() if k in hdr} for r in rows[1:]]
json.dump(out,open(sys.argv[2],'w'),ensure_ascii=False,indent=1)
print(len(out),'rows; columns:',list(hdr.values()))
