# -*- coding: utf-8 -*-

from tweepy import Stream
from tweepy import OAuthHandler
from tweepy.streaming import StreamListener
import json
from textblob import TextBlob,Word
import matplotlib.pyplot as plt
import re
from socketIO_client_nexus import SocketIO
from wordcloud import WordCloud, ImageColorGenerator
import nltk
from nltk.corpus import stopwords
import numpy as np
from PIL import Image

socketIO = SocketIO('127.0.0.1', 8888)

positive=0
negative=0
compound=0
words=[]

ckey="HWSFGftVaRvoTF0yKIuHOtEud"
csecret="0anQAwfwyTpWKQGaQF0djXYZk42lvRlmjdoeHSjJ3ZYMT3GD5A"
atoken="3593929995-0IVIIdIhRjGcexKSLdeMKOzuQwnhXE4QPNZJm44"
asecret="clogdfHmXPdUXNAdwicLbginJy4sr6eufGv9diI1rCtwd"

class listener(StreamListener):
    
    def on_data(self,data):
        all_data=json.loads(data)
        tweet=all_data["text"]
        #username=all_data["user"]["screen_name"]

        #-------preprocessing-------
        #Utility function to clean tweet text by removing links, special characters
        tweet=" ".join(re.sub("(@[A-Za-z0-9]+)|([^0-9A-Za-z \t])|(\w+:\/\/\S+)", " ", tweet).split())
        txt=tweet.strip()

        #lowercase
        txt=txt.lower()

        #remove non alphabet chars
        txt = re.sub("[^a-z]+", " ", txt)

        #remove whitespaces
        txt=" ".join(txt.split())

        #tokenizing 
        nltk_tokens = nltk.word_tokenize(txt)

        txt=""
        #lemmatization
        for i in nltk_tokens:
            if(len(i)>2):
                v = Word(i)
                txt+=" "+v.lemmatize()

        #remove stopwords
        txt = ' '.join([word for word in txt.split() if word not in stopwords.words("english") + ["via", "bitcoin", "blockchain", "btc", "altcoin", "cryptocurrency", "crypto", "domain", "rt", "binance", "airdrop", "price", "exchange", "cryptocurrencies", "market", "forex", "donation", "symbol", "bitcoins", "analysis", "btcusd", "usd", "eur", "mining", "satoshi", "twitter", "data", "de", "coinbase", "retweet","retweets", "http", "https", "airdropping", "facebook", "whatsapp"]])

        #---------------------------
        
        blob=TextBlob(txt)

        global positive
        global negative     
        global compound  
        
        senti=0
        for sen in blob.sentences:
            senti=senti+sen.sentiment.polarity
            if sen.sentiment.polarity > 0:
                positive=positive+sen.sentiment.polarity   
            elif sen.sentiment.polarity < 0:
                negative=negative+sen.sentiment.polarity  
            else:
                compound=compound+senti        
	
        #emojis
        socketIO.emit('othermouse', str(senti))
        #wordcloud
        extract_words(txt)
		
        print(txt+"\nSentimento = "+str(senti)+"\n\n")  #texto dos tweets
        #print(str(positive) + ' ' + str(negative) + ' ' + str(compound)) #sentimento antes da subtracao 
    def on_error(self,status):
        print(status)
		

def extract_words(word):
	if len(words) <= 300:
		words.append(word)
	elif len(words) > 300:
		words.pop(0)
		words.append(word)
		generate_wordcloud()
	
def generate_wordcloud():
	text = str(words).lower()
	text = text.replace('[','').replace(']','').replace("'",'').replace(",", ' ')
	
	mask = np.array(Image.open("C:/xampp/htdocs/cripto/cloud.png"))
	cloud = WordCloud(background_color="#f7f9f9", mode="RGBA", mask=mask).generate(text), 
	image_colors = ImageColorGenerator(mask)
	plt.figure(figsize=[7,6.3], facecolor='#f7f9f9')
	plt.imshow(cloud.recolor(color_func=image_colors), interpolation="bilinear")
	plt.axis("off")
	plt.tight_layout(pad=0)
	plt.savefig("C:/xampp/htdocs/cripto/nuvem_palavras.png", format="png", facecolor='#f7f9f9', bbox_inches='tight')
	plt.close('all')
	words.clear()
		
auth=OAuthHandler(ckey,csecret)
auth.set_access_token(atoken,asecret)

if __name__ == '__main__':
	twitterStream = Stream(auth, listener())
	twitterStream.filter(track=["bitcoin","#bitcoin","$bitcoin","$BTC","#BTC"], languages=["en"])
