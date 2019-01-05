from enum import Enum, unique

@unique
class FIELD(Enum):
    ACTION = '0', 
    GAME = '1', 
    PLAYER = '2', 
    ERROR = '3', 
    CHAT = '4'
@unique
class ACTION(Enum):
    JOIN = '0', 
    QUIT = '1', 
    CREATE_GAME = '2', 
    UPDATE = '3',
    CHAT = '4',    
    LIST_GAMES = '5', 
    ERROR = '6', 
    VIEW_GAME = '7',
    LOGIN = '8',
    LOGOUT = '9',
    REGISTER = '10'
@unique
class ERROR(Enum):
    BAD_REQUEST = '0', 
    AUTH_REQUIRED = '1' 
@unique
class GAME(Enum):
    ID = '0',
    OWNER = '1', 
    PLAYERS = '2', 
    TURN = '3', 
    TIMER_START = '4', 
    TIMER_DURATIONS = '5', 
    CURRENT_PHASE = '6',
    MAX_PLAYERS = '7',
    NAME = '8',
    WINNERS = '9',
    MAP = '10',
    PASSWORD = '11', 
    PAUSE = '12' 
@unique
class PLAYER(Enum):
    USER = '0', 
    COUNTRY = '1', 
    UNITS = '2', 
    TERRITORIES = '3', 
    READY = '4' 
@unique
class USER(Enum):
    ID = '0',
    USERNAME = '1',
    NAME = '2', 
    EMAIL = '3', 
    PHONE = '4',
    PASSWORD = '5',
    SESSION = '6'
@unique
class PHASE(Enum):
    DIPLOMACY = '0', 
    RETREAT = '1', 
    ADJUST = '2', 
    GAME_END = '3' 
@unique
class UNIT(Enum): 
    TYPE = '0', 
    LOCATION = '1', 
    COAST = '2', 
    ORDER = '3', 
    TARGET = '4', 
    SOURCE = '5' 
@unique
class UNIT_TYPE(Enum):
    Army = '0',
    Fleet = '1'
@unique
class ORDER(Enum): 
    MOVE = '0', 
    SUPPORT = '1', 
    CONVOY = '2', 
    BUILD = '3', 
    DISBAND = '4'
@unique
class CHAT(Enum):
    MESSAGE = '0',
    RECIPIENT = '1' 