from http.server import BaseHTTPRequestHandler, HTTPServer
from http import cookies
import mimetypes
#import os.path
from socketserver import ThreadingMixIn
from concurrent.futures import ThreadPoolExecutor

def start(port, maxThreads):
    """Start the http server, blocks thread until program stops
        
        Args:
            port (int): port for the http server to listen to
            maxThreads (int): Maximum number of threads to make
    """
    serverAddress = ('', port)
    httpd = ThreadPoolHTTPServer(serverAddress, BaseHTTPRequestHandler, maxThreads=maxThreads)
    httpd.serve_forever()

class ThreadPoolHTTPServer(ThreadingMixIn, HTTPServer):
    '''Overides ThreadingMixIns process_request to make it use a concurent.features thread pool instread of spawning a new thread for each request
    '''
    pool = ThreadPoolExecutor(max_workers=8)

    def __init__(self, args, kwargs, maxThreads=8):
        self.pool = ThreadPoolExecutor(max_workers=maxThreads)
        super().__init__(args, kwargs)

    def process_request(self, request, client_address):
        self.pool.submit(self.process_request_thread, request, client_address)

class HTTPHandler(BaseHTTPRequestHandler):
    '''Handles http requests'''

    def do_HEAD(self):
        pass

    def do_GET(self):
        self.statusCode = 200
        self.mime = self.findMimeType(self.path)
        self.sendCookies = True
        body = bytes(self.route(), "utf8")
        self.send_response(self.statusCode)
        self.send_header("Content-type", self.mime)
        if self.sendCookies: self.handleCookies()
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self):
        pass

    def findMimeType(self, path):
        '''Try to find the mime type of the request

            Args:
                path (string): url request

            Returns (string): mime type of response, octet-stream is default
        '''
        if not mimetypes.inited:
            mimetypes.init() #try to read system mime types
            mimetypes.add_type('application/octet-stream', '') #add a default type
        fileType, encoding = mimetypes.guess_type(path)
        if fileType is None:
            return mimetypes.types_map['']
        return fileType

"""
class HTTPHandler(BaseHTTPRequestHandler):

    content = "Server/Website/"
    defaultTitle = "Day of Sagittarius III"
    paths = {"home": "cHome", "user":None, "static":"cStatic", "sagittarius":"cSag"}

    def do_HEAD(self):
        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.handleCookies()
        self.end_headers()
    def do_GET(self):
        self.statusCode = 200
        self.mime = "text/html"
        self.sendCookies = True
        body = bytes(self.route(), "utf8")
        self.send_response(self.statusCode)
        self.send_header("Content-type", self.mime)
        if self.sendCookies: self.handleCookies()
        self.end_headers()
        self.wfile.write(body)

    def handleCookies(self):
        global dataStor
        cook = cookies.SimpleCookie()
        if "Cookie" in self.headers:
            cook.load(self.headers["Cookie"])
            if "session" in cook:
                print("session")
                self.user = dataStor.getUser(cook["session"].value)
                if self.user != None:
                    print(self.user)
                    return
        user = dataStor.makeUser()
        cook["session"] = user.getSession()
        cook["session"]["path"] = "/"
        cook["session"]["max-age"] = 259200
        self.send_header("Set-Cookie", str(cook["session"])[12:])
        self.user = user

    def log_message(self, format, *args):
        return
    
    def route(self):
        path = self.path.split('/')
        if self.path == "/":
            return self.cHome()
        elif path[1] in self.paths:
            if len(path) == 2 or path[2] == "":
                return getattr(self, self.paths[path[1]])()
            else:
                return getattr(self, self.paths[path[1]])(path[2])
        else:
            self.statusCode = 404
            return self.cHome("error")

    def cHome(self, view = "index"):
        if view == "index":
            return self.layout(self.readFile("home/index.html"))
        elif view == "about":
            return self.layout(self.readFile("home/about.html"))
        else:
            fContent = self.readFile("home/error.html")
            if(self.statusCode == 200):
                self.statusCode = 403
            fContent = fContent.format(error = self.statusCode)
            return self.layout(fContent)

    def cSag(self, view = "game"):
        if view == "game":
            return self.layout(self.readFile("sagittarius/game.html"))
        else:
            return self.cHome("error")

    def cStatic(self, unused):
        self.sendCookies = False
        path = self.path[len("/"):]
        try:
            print(path + str(path.rindex(".") + 1))
            fContent = self.readFile(path)
            self.mime = self.mimes[path[path.rindex(".") + 1:]]
            return fContent
        except (IOError, KeyError) as e:
            print("error: " + path)
            return self.cHome("error")

    def readFile(self, fPath):
        with open(self.content + fPath) as f:
            fContent = f.read()
            f.close()
            return fContent

    def layout(self, pContent = None, pTitle = None):
        pTitle = pTitle or self.defaultTitle
        with open(self.content + "layout.html") as f:
                fLayout = f.read()
                f.close()
                fLayout = fLayout.format(title = pTitle, content = pContent)
                return fLayout
"""
start(80)