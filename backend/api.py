"""API for getting political word associations"""
import hug
import gensim

model_dir = "/opt/sv_polit_word/models/"
valid_parties =[ "KD", "L", "M", "MP", "S", "SD", "V", "FP", "C" ]

#@hug.local()
@hug.get('/sv_polit_word', output=hug.output_format.json, examples="party=S&word=sverige")
def sv_polit_word(party:hug.types.one_of(valid_parties), word:hug.types.text):
    """ Political word associations by party"""
    mdl = gensim.models.Word2Vec.load(model_dir + party + ".model")
    initial_word_list = ""
    try:
        initial_word_list = mdl.most_similar(word, topn=25)
    except:
        return {'errors': ("'" + word + "': not enough data for model " + party + "")}
    result_words = []
    for result in initial_word_list:
        # eg: [ {'text': 'landet', 'size': 57 } , {'text':'framtiden', 'size': 30} ]
        result_words.append( {'text': result[0], 'size': round(result[1] * 100) } )
    return { 'result': result_words }

