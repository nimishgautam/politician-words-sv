### Building the models

To run this, you need the data from https://data.riksdagen.se/, specifically the speeches (Anföranden). Though the data is from 1994 onwards, the older formats might not be consistent with newer ones. I've used 2006 onwards, and even then, some of the parties are listed differently in the XML.

The first file 'build_data_raw.py', takes the speeches, parses the XML, cleans/normalizes a bit, and then saves every speech's raw text into a folder for the given political party. You need to unzip the speeches into a given folder, and create an empty folder for the political parties ('BY_PARTY'). It will delete the original XML after the data from it has been parsed.

Note that there will be some data cleanup needed afterwards that requires some knowledge of the political entities shown (for instance, 'c' and 'C' are the same party).

Once this is done, run 'preprocess.py', which will take all the text from each directory specified and create a gensim model out of it, and save the model in the specified directory ('models').


