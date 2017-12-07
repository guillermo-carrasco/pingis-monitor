import gevent
import yaml
import os

from flask import Flask, render_template, request, Response
from gevent.queue import Queue
from gevent.wsgi import WSGIServer

app = Flask(__name__)

subscriptions = []

#######################
## Server Sent Events #
#######################

class ServerSentEvent(object):

    def __init__(self, data):
        self.data = data
        self.event = None
        self.id = None
        self.desc_map = {
            self.data : "data",
            self.event : "event",
            self.id : "id"
        }

    def encode(self):
        if not self.data:
            return ""
        lines = ["%s: %s" % (v, k)
                 for k, v in self.desc_map.iteritems() if k]

        return "%s\n\n" % "\n".join(lines)


@app.route("/publish", methods=['POST'])
def publish():
    data = yaml.safe_load(request.data)
    def notify():
        for sub in subscriptions[:]:
            sub.put(data)
    gevent.spawn(notify)

    return "OK"


@app.route("/subscribe")
def subscribe():
    def gen():
        q = Queue()
        subscriptions.append(q)
        try:
            while True:
                result = q.get()
                ev = ServerSentEvent(str(result))
                yield ev.encode()
        except GeneratorExit: # Or maybe use flask signals
            subscriptions.remove(q)

    return Response(gen(), mimetype="text/event-stream")


@app.route('/')
def index():
    if os.environ.get('ENV', 'development') == 'development':
        scriptFile = 'http://localhost:8889/app.js'
    else:
        scriptFile = '/static/app.js'

    return render_template('index.html', scriptFile = scriptFile)

if __name__ == "__main__":
    app.debug = True
    server = WSGIServer(("", 5000), app)
    server.serve_forever()
