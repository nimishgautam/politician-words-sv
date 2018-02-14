import os
from xml.dom import minidom
from xml.parsers.expat import ExpatError
from tqdm import tqdm

data_dir = "/home/nimishg/rikstag/XML/data"
output_dir = "/home/nimishg/rikstag/BY_PARTY"
for fname in tqdm(os.listdir(data_dir)):
    if os.path.isdir(os.path.join(data_dir, fname)):
        continue
    try:
        xmldoc = minidom.parse(os.path.join(data_dir, fname))
    except ExpatError:
        continue
    parti_tags = xmldoc.getElementsByTagName('parti')
    party = "OTHER"
    try:
        party = parti_tags[0].childNodes[0].nodeValue
    except IndexError:
        pass
    anforande_tags = xmldoc.getElementsByTagName('anforandetext')

    # some basic transforms
    try:
        speech_txt = anforande_tags[0].childNodes[0].nodeValue
    except IndexError:
        continue
    speech_txt = speech_txt.lower()
    speech_txt = speech_txt.replace(";",",")
    speech_txt = speech_txt.replace(","," ,")
    speech_txt = speech_txt.replace("!",".")
    speech_txt = speech_txt.replace("<p>"," ")
    speech_txt = speech_txt.replace("</p>"," ")
    speech_txt = speech_txt.replace("(applåder)"," ")

    party_dir = os.path.join(output_dir, party)
    if not os.path.exists(party_dir):
        os.makedirs(party_dir)
    f = open(os.path.join(party_dir, os.path.basename(fname)), 'a')
    f.write(speech_txt)
    f.close()
    os.remove(os.path.join(data_dir, fname))
