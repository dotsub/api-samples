from BaseHTTPServer import BaseHTTPRequestHandler
from SocketServer import ThreadingMixIn
from BaseHTTPServer import HTTPServer, BaseHTTPRequestHandler
from smtplib import SMTPException
import smtplib
import cgi
#An example script that listens for HTTP media pings from the Dotsub API.

#Change these to your SMTP server login.
server = 'smtp.example.com'
username = 'example'
password = 'password'

#to and from addresses
sender = 'no-reply@dotsub.com'
receivers = ['user@example.com']

message = """From: Dotsub <no-reply@dotsub.com>
To: Dotsub User <user@example.com>
Subject: Dotsub Item Complete

The item %s in %s has been completed. You can view this video here: https://dotsub.com/view/%s
"""

class PostHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        # Parse the form data posted
        form = cgi.FieldStorage(
            fp=self.rfile,
            headers=self.headers,
            environ={'REQUEST_METHOD': 'POST',
                     'CONTENT_TYPE': self.headers['Content-Type'],
                     })
        #There are the 4 fields the Dotsub media Ping API posts in a callback.
        mediaId = form['uuid'].value
        externalIdentifier = form['externalIdentifier'].value
        language = form['language'].value
        state = form['state'].value
        #only send an email when the item has been published
        if state == 'TRANSLATION_PUBLISHED' or state == 'TRANSCRIPTION_PUBLISHED':
            try:
                stmp = smtplib.SMTP(server, 587)
                stmp.login(username, password)
                stmp.sendmail(sender, receivers, (message % (mediaId, language, mediaId)))
                stmp.quit()
                print "Sent notification email"
            except SMTPException:
                print "Error: could not send email"

        self.send_response(200)

class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    """Handle requests in a separate thread."""

if __name__ == '__main__':
    server = ThreadedHTTPServer(('', 8088), PostHandler)
    print 'Starting server, use <Ctrl-C> to stop'
    server.serve_forever()