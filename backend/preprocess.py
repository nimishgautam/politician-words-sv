import re
import os
import gensim
import tqdm

# https://rare-technologies.com/word2vec-tutorial/
#
parties_list =[
"KD",
"L",
"M",
"MP",
"S",
"SD",
"V",
"FP",
"C"
]

class MySentences(object):
    def __init__(self, dirname):
        self.dirname = dirname

    def __iter__(self):
        for fname in os.listdir(self.dirname):
            for line in open(os.path.join(self.dirname, fname)):
                for sentence in re.split("[?\.]+", line):
                    yield sentence.split()

home_dir = "/home/nimishg/rikstag/BY_PARTY"
model_dir = "/home/nimishg/rikstag/models/"

for party in parties_list:
    print("Now on party:" + party)
    path = os.path.join(home_dir, party)
    sentences = MySentences(path) # a memory-friendly iterator
    model = gensim.models.Word2Vec(sentences, size=500, window=5, min_count=5, workers=4, iter=50)
    model.save(model_dir + party + ".model")
