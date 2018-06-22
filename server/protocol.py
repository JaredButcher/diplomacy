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
    PREV_TURN = '7'   
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
    TIMER_START = '3', 
    TIMER_DURATIONS = '4', 
    CURRENT_PHASE = '5',
    MAX_PLAYERS = '6',
    NAME = '7',
    WINNERS = '8',
    MAP = '9',
    PASSWORD = '10', 
    PAUSE = '11' 
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
    PHONE = '4' 
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
class MAP:
    class DEFAULT:
        ID = '0'
        @unique
        class COUNTRIES(Enum): 
            AUSTRIA = '0',
            ENGLAND = '1',
            FRANCE = '2',
            GERMANY = '3',
            ITALY = '4',
            RUSSIA = '5',
            TURKEY = '6'
        @unique
        class TERRITORIES(Enum):
            ANKARA = '0', 
            BELGIUM = '1',
            BERLIN = '2',
            BREST = '3',
            BUDAPEST = '4',
            BULGARIA = '5',
            Constantinople = '6',
            DENMARK = '7',
            EDINBURGH = '8',
            GREECE = '9',
            HOLLAND  = '10',
            KIEL  = '11',
            LIVERPOOL = '12',
            LONDON = '13',
            MARSEILLES = '14',
            MOSCOW = '15',
            MUNICH = '16',
            NAPLES = '17',
            NORWAY = '18',
            PARIS = '19',
            PORTUGAL = '20',
            ROME = '21',
            RUMANIA = '22',
            SAINT_PETERSBURG = '23',
            SERBIA  = '24',
            SEVASTOPOL = '25',
            SMYRNA = '26',
            SPAIN = '27',
            SWEDEN = '28',
            TRIESTE = '29',
            TUNIS  = '30',
            VENICE  = '31',
            VIENNA = '32',
            WARSAW  = '33',
            CLYDE  = '34', 
            YORKSHIRE  = '35',
            WALES  = '36',
            PICARDY  = '37',
            GASCONY  = '38',
            BURGUNDY  = '39',
            NORTH_AFRICA = '40',
            RUHR = '41',
            PRUSSIA = '42',
            SILESIA  = '43',
            PIEDMONT = '44',
            TUSCANY = '45',
            APULIA = '46',
            TYROLIA = '47',
            GALICIA = '48',
            BOHEMIA = '49',
            FINLAND = '50',
            LIVONIA = '51',
            UKRAINE = '52',
            ALBANIA = '53',
            ARMENIA = '54',
            SYRIA = '55',
            NORTH_ATLANTIC_OCEAN = '56', 
            MID_ATLANTIC_OCEAN = '57',
            NORWEIGIAN_SEA = '58',
            NORTH_SEA = '59',
            ENGLISH_CHANNEL = '60',
            IRISH_SEA = '61',
            HELIGOLAND_BLIGHT = '62',
            SKAGERRAK = '63',
            BALTIC_SEA = '64',
            GULF_OF_BOTHNIA = '65',
            BERENTS_SEA = '66',
            WESTERN_MEDITERRANEAN = '67',
            GULF_OF_LYONSN = '68',
            TYRRHENIAN_SEA = '69',
            IONIAN_SEA = '70',
            ADRIATIC_SEA = '71',
            AEGEAN_SEA = '72',
            EASTERN_MEDITERRANEAN = '73',
            BLACK_SEA = '74'