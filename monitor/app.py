import gevent
import yaml
import os

from datetime import datetime

from flask import Flask, render_template, request, Response
from gevent.queue import Queue
from gevent.wsgi import WSGIServer

app = Flask(__name__)

subscriptions = []
red_score = 0
white_score = 0
table_status = "Free"
busy_since = ''


class ServerSentEvent(object):

    def __init__(self, data):
        self.data = data
        self.event = None
        self.id = None
        self.desc_map = {
            self.data: "data",
            self.event: "event",
            self.id: "id"
        }

    def encode(self):
        if not self.data:
            return ""
        lines = ["%s: %s" % (v, k)
                 for k, v in self.desc_map.iteritems() if k]

        return "%s\n\n" % "\n".join(lines)


def save_status(data):
    global table_status
    global white_score
    global red_score
    global busy_since
    if data.get('event') == 'TableStatus':
        table_status = data.get('data')
        if table_status == 'Busy':
            busy_since = datetime.now().isoformat()
        else:
            busy_since = ''
    elif data.get('event') == 'RedCounter':
        red_score = data.get('data')
    elif data.get('event') == 'WhiteCounter':
        white_score = data.get('data')


@app.route("/publish", methods=['POST'])
def publish():
    data = yaml.safe_load(request.data)
    save_status(data)

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
        except GeneratorExit:  # Or maybe use flask signals
            subscriptions.remove(q)

    def notify():
        for sub in subscriptions[:]:
            sub.put("{ 'data': {} }")
    gevent.spawn(notify)

    return Response(gen(), mimetype="text/event-stream")


@app.route('/')
def index():
    if os.environ.get('ENV', 'development') == 'development':
        script_file = 'http://localhost:8889/app.js'
    else:
        script_file = '/static/app.js'

    return render_template('index.html', script_file=script_file,
                                         table_status=table_status,
                                         white_score=white_score,
                                         red_score=red_score,
                                         busy_since=busy_since)


if __name__ == "__main__":
    app.debug = True
    port = int(os.environ.get('PORT', 5000))
    server = WSGIServer(("", port), app)
    server.serve_forever()
