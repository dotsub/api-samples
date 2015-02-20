from BaseHTTPServer import BaseHTTPRequestHandler
from SocketServer import ThreadingMixIn
from BaseHTTPServer import HTTPServer, BaseHTTPRequestHandler
import base64
import urllib2
import cgi
#An example script that listens for HTTP order pings from the Dotsub API.

username = "username"
password = "password"

auth_header = base64.b64encode(("%s:%s" % (username, password)))

download_url = "https://dotsub.com/api/order/%s/items/%s/download"

class PostHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        # Parse the form data posted
        form = cgi.FieldStorage(
            fp=self.rfile,
            headers=self.headers,
            environ={'REQUEST_METHOD': 'POST',
                     'CONTENT_TYPE': self.headers['Content-Type'],
                     })
        #There are the 4 fields the Dotsub Order Ping API posts in a callback.
        orderId = form['orderId'].value
        itemId = form['itemId'].value
        language = form['language'].value
        state = form['state'].value
        #only download an item when the item has been completed
        if state == 'ITEM_COMPLETE':
            file_url = download_url % (orderId, itemId)
            sub_req = urllib2.Request(file_url)
            sub_req.add_header('Authorization', 'Basic %s' % auth_header)
            u = urllib2.urlopen(sub_req)
            filename =  "%s_%s.srt" % (itemId, language)
            localFile = open( filename, 'w')
            localFile.write(u.read())
            localFile.close()
        self.send_response(200)

class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    """Handle requests in a separate thread."""

if __name__ == '__main__':
    server = ThreadedHTTPServer(('', 9088), PostHandler)
    print 'Starting server, use <Ctrl-C> to stop'
    server.serve_forever()