from http.server import BaseHTTPRequestHandler, HTTPServer
from http import cookies
import mimetypes
from socketserver import ThreadingMixIn
from concurrent.futures import ThreadPoolExecutor
from threading import RLock
import random
import string

def start(port, maxThreads):
    """Start the http server, blocks thread until program stops
        
        Args:
            port (int): port for the http server to listen to
            maxThreads (int): Maximum number of threads to make
    """
    serverAddress = ('', port)
    httpd = ThreadPoolHTTPServer(serverAddress, HTTPHandler, maxThreads=maxThreads)
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

    defaultTitle = "Diplomacy"
    contentLocation = "server/website/"
    sessionData = {}
    sessionDataLock = RLock()

    def do_HEAD(self):
        self.mime = self.findMimeType(self.path)
        self.send_response(200)
        self.send_header("Content-type", self.mime)
        self._handleSession()
        self.end_headers()

    def do_GET(self):
        self.statusCode = 200
        self.usingSession = True
        body = bytes(self._route(self.path), "utf8")
        self.send_response(self.statusCode)
        self.send_header("Content-type", self.mime)
        if self.usingSession: self._handleSession()
        self.end_headers()
        self.wfile.write(body)

    def _route(self, path):
        '''Parse url and create the response body
        Args:
            path (string): url
        Returns: 
            (string): requested page
        '''
        path = path.split('/')
        if len(path) >= 2:
            if path[1] == 'home' or path[1] == '':
                if len(path) == 2 or path[2] == "" or path[2] =='index':
                    return self._layout(self._readFile("home/index.html"))
                elif path[2] =='about':
                    return self._layout(self._readFile("home/about.html"))
                else:
                    return self._route('error/404')
            elif path[1] == 'user' and len(path) > 2:
                if path[2] =='login':
                    return self._layout(self._readFile("user/login.html"))
                elif path[2] =='register':
                    return self._layout(self._readFile("user/register.html"))
                elif path[2] =='account':
                    return self._layout(self._readFile("user/account.html"))
                else:
                    return self._route('error/404')
            elif path[1] == 'diplomacy':
                if len(path) == 2 or path[2] == "" or path[2] =='searchGame':
                    return self._layout(self._readFile("diplomacy/searchGame.html"))
                elif path[2] =='makeGame':
                    return self._layout(self._readFile("diplomacy/makeGame.html"))
                elif path[2] =='myGames':
                    return self._layout(self._readFile("diplomacy/myGames.html"))
                elif path[2] =='game':
                    return self._layout(self._readFile("diplomacy/game.html"))
                else:
                    return self._route('error/404')
            elif path[1] == 'static':
                self.usingSession = False
                path = self.path[1:]
                try:
                    fileContent = self._readFile(path)
                    self.mime = self.findMimeType(path)
                    return fileContent
                except (IOError, KeyError) as e:
                    print("error: " + path)
                    return self._route("error/404")
            else:
                try:
                    self.statusCode = int(path[2])
                except (ValueError, IndexError) as e:
                    self.statusCode = 404
                fileContent = self._readFile("home/error.html")
                fileContent = fileContent.format(error = self.statusCode)
                return self._layout(fileContent)
        else:
            return self._route("error/404")

    def _layout(self, pageContent = None, pageTitle = None):
        '''Puts page content into a basic html frame that includes static features such as the navbar, and default css

        Args:
            pageContent (string): page content to put into the frame
            pageTitle (string): html title page should have

        Returns:
            (string): compeated html page to send to client
        '''
        pageTitle = pageTitle or self.defaultTitle
        layoutFile = self._readFile("layout.html")
        page = layoutFile.format(title = pageTitle, content = pageContent)
        self.mime = 'text/html'
        return page


    def findMimeType(self, path):
        '''Try to find the mime type of the request

            Args:
                path (string): url request

            Returns (string): mime type of response, octet-stream is default
        '''
        if not mimetypes.inited:
            mimetypes.init() #try to read system mime types
            mimetypes.add_type('text/html', '') #add a default type
        fileType, encoding = mimetypes.guess_type(path)
        if fileType is None:
            return mimetypes.types_map['']
        return fileType

    def _handleSession(self):
        '''Handles reading and createing cookies for sessions
        '''
        cookie = cookies.SimpleCookie()
        if "Cookie" in self.headers:
            cookie.load(self.headers["Cookie"])
            if "session" in cookie:
                if cookie['session'].value in self.sessionData:
                    print("found")
                    return
        key = ''.join(random.choice(string.ascii_letters + string.digits) for x in range(32))
        with self.sessionDataLock:
            self.sessionData[key] = {}
        cookie["session"] = key
        cookie["session"]["path"] = "/"
        cookie["session"]["max-age"] = 259200
        self.send_header('Set-Cookie', str(cookie)[12:])

    def log_message(self, format, *args):
        return

    def _readFile(self, filePath):
        with open(self.contentLocation + filePath) as f:
            fileContent = f.read()
            f.close()
            return fileContent

start(4242, 2)