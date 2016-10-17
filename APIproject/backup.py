from flask import Flask, render_template, request
import urllib2
import json

app = Flask(__name__)

def acafilter(a):
        if a.find('.org')>-1:
		
		return True
        if a.find('.edu')>-1:
                return True
        if a.find('.gov')>-1:
                return True
        if a.find('.com')>-1:
                if a.find('nytimes.com')>-1:
                        return True
                if a.find('wsj.com')>-1:
                        return True

        return False


#Returns all "academic" urls, query is a string.

def getAcademicUrls(query):
	query = query.replace(" ", "+")
        print "The query is " + query
        url="""
	http://ajax.googleapis.com/ajax/services/search/web?v=1.0&q="""+query+"""&safe=active
	"""

	request= urllib2.urlopen(url)
	result = request.read()
	d = json.loads(result)
	rlist = d['responseData']['results']
        urls = []

        print len(rlist)

	for item in rlist:
        	if acafilter(item['url']):
#                        print(item['url'])
                        urls.append(item['url'])
        
        for url in urls:
                print url
                
        return urls;
#print getAcademicUrls('abc')

@app.route("/", methods=["GET", "POST"])
def home():
        if request.method == 'POST':
                results = []
                results = getAcademicUrls(request.form['input'])
                return render_template("home.html", results = results)
        return render_template("home.html", results = '')


if __name__ == "__main__":
        app.debug = True
        app.run()
