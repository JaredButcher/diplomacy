/**
 * To be used to encode all socket communictions and game state infomation in storage.
 * The type of content of package fields can change depending on action context.
 * @author Jared Butcher <jared.butcher1219@gmail.com>
 * @module diplomacy/protocol
 */
/**
 * Enum for top level fields
 * @readonly
 * @enum {string}
 */
const FIELD = {
    ACTION: '0', //Contains action, only manditory field
    GAME: '1', //Can contain a game object or list of game objects
    PLAYER: '2', //Can contain player object or play id
    ERROR: '3', //Contains error
    CHAT: '4' //Contains chat object
}
/**
 * Enum for request actions
 * @readonly
 * @enum {string}
 */
const ACTION = {
    JOIN: '0', //C->S GAME field contains object with ID of game to join and optional PASSWORD
    QUIT: '1', //C->S GAME field contains id of game to leave
    CREATE_GAME: '2', //C->S GAME field contains object with the TIMER_DURATIONS object, MAX_PLAYERS, NAME, MAP, and optional PASSWORD
    UPDATE: '3',
        //C->S if game is set change game parameters, if player is set either player parameteres are to be changed or orders are being sent
            //NOTE: id of playing making commands is not sent, it is known on server by session
        //S->C Update of gamestate from server some, all, or none of the game, player, unit, etc... infomation may be changed
    CHAT: '4',
        //C->S CHAT field contains MESSAGE and optional RECIPIENT
        //S->C CHAT field contains MESSAGE, RECIPIENT is set if it was a PM, PLAYER field contains ID of sender
    LIST_GAMES: '5',
        //C->S request list of aviable games
        //S->C GAME field contains list of aviable games that are objects containing ID, OWNER, PLAYERS as number of players, MAX_PLAYERS, NAME, and PASSWORD is set if there is a password
    ERROR: '6', //Error code
    PREV_TURN: '7' 
        //C->S GAME.TURN contains turn to view
        //S->C GAME object contains TURN, and list of all PLAYERS that each have their TERRITORIES list and UNITS list compleate with their order for that turn
}
/**
 * Enum for errors
 * @readonly
 * @enum {string}
 */
const ERROR = {
    BAD_REQUEST: '0', //Request was malformed or unaccepted
    AUTH_REQUIRED: '1' //User is not authenicated, send to login page
}
/**
 * Enum for game object
 * @readonly
 * @enum {string}
 */
const GAME = {
    ID: '0',
    OWNER: '1', //USER.ID of owner
    PLAYERS: '2', //Either list of players or
    TURN: '3', //Current turn or turn to look back on
    TIMER_START: '3', //When current phase started
    TIMER_DURATIONS: '4', //Object with the timer duration of each phase, object of PHASE
    CURRENT_PHASE: '5',
    MAX_PLAYERS: '6',
    NAME: '7',
    WINNERS: '8',
    MAP: '9',
    PASSWORD: '10', //Optioanl field, if set on server list then password is required
    PAUSE: '11' //By setting this field the game can be paused, value > 0 for timed pause (minutes), else to unpause
}
/**
 * Enum for player object
 * @readonly
 * @enum {string}
 */
const PLAYER = {
    USER: '0', //Object of USER or 0 if just a placeholder player
    COUNTRY: '1', //Country or contries player represents
    UNITS: '2', //List of unit objects
    TERRITORIES: '3', //List of supply centers held and only supply centers
    READY: '4' //Specifies that player is ready for game to start or next turn
}
/**
 * Enum for user object
 * @readonly
 * @enum {string}
 */
const USER = {
    ID: '0',
    USERNAME: '1',
    NAME: '2', //optional
    EMAIL: '3', //optional
    PHONE: '4' //optional
}
/**
 * Enum for possable game phases
 * @readonly
 * @enum {string}
 */
const PHASE = {
    DIPLOMACY: '0', //Main phase of game
    RETREAT: '1', //Only occures after DIPLOMACY if one or more units need to retreat
    ADJUST: '2', //Occures after even numbered turnes (Fall turns) if units need to be created or disbaned
    GAME_END: '3' //Game is over
}
/**
 * Enum for game unit object
 * @readonly
 * @enum {string}
 */
const UNIT = { //Units are identifed by the territory they are located in
    TYPE: '0', //Army or fleet
    LOCATION: '1', //Territory unit is in
    COAST: '2', //Only used for territories that have multiple coasts (ex: Spain), labled sequentaily starting with North = 0 then traveling clockwise
    ORDER: '3', //Order to follow
    TARGET: '4', //Target territory order has target 
    SOURCE: '5' //Location of related unit for some support and convoy commands
}
/**
 * Enum for game unit types
 * @readonly
 * @enum {string}
 */
const UNIT_TYPE = {
    Army: '0',
    Fleet: '1'
}
/**
 * Enum for possable game orders
 * @readonly
 * @enum {string}
 */
const ORDER = { //No order means hold
    MOVE: '0', //TARGET contains territory to move to
    SUPPORT: '1', //TARGET contains territory to support, SOURCE contains supported unit's location and is not set if supporting a hold
    CONVOY: '2', //TARGET contains territory army wants move to and SOURCE contains the army's location
    BUILD: '3', //TARGET contains location to build new unit and TYPE contains the type.
    DISBAND: '4'
}
/**
 * Enum for chat object
 * @readonly
 * @enum {string}
 */
const CHAT = {
    MESSAGE: '0',
    RECIPIENT: '1' //C->S optional PM, S->C set if was PM
}
/**
 * Enum for playable contries for defalt map
 * @readonly
 * @namespace
 * @property {object} DEFAULT Default map
 * @property {string} DEFAULT.ID Identifer for map
 * @property {enum} DEFAULT.COUNTRIES List of playable contries on default game board
 * @property {enum} DEFAULT.TERRITORIES List of territories on default game board
 */
const MAP = {
    DEFAULT: {
        ID: '0',
        COUNTRIES: { 
            AUSTRIA: '0',
            ENGLAND: '1',
            FRANCE: '2',
            GERMANY: '3',
            ITALY: '4',
            RUSSIA: '5',
            TURKEY: '6'
        },
        TERRITORIES: { //
            ANKARA: '0', //-----------------Supply Centers--------------
            BELGIUM: '1',
            BERLIN: '2',
            BREST: '3',
            BUDAPEST: '4',
            BULGARIA: '5',
            Constantinople: '6',
            DENMARK: '7',
            EDINBURGH: '8',
            GREECE: '9',
            HOLLAND : '10',
            KIEL : '11',
            LIVERPOOL: '12',
            LONDON: '13',
            MARSEILLES: '14',
            MOSCOW: '15',
            MUNICH: '16',
            NAPLES: '17',
            NORWAY: '18',
            PARIS: '19',
            PORTUGAL: '20',
            ROME: '21',
            RUMANIA: '22',
            SAINT_PETERSBURG: '23',
            SERBIA : '24',
            SEVASTOPOL: '25',
            SMYRNA: '26',
            SPAIN: '27',
            SWEDEN: '28',
            TRIESTE: '29',
            TUNIS : '30',
            VENICE : '31',
            VIENNA: '32',
            WARSAW : '33',
            CLYDE : '34', //--------------------------Other Land------------
            YORKSHIRE : '35',
            WALES : '36',
            PICARDY : '37',
            GASCONY : '38',
            BURGUNDY : '39',
            NORTH_AFRICA: '40',
            RUHR: '41',
            PRUSSIA: '42',
            SILESIA : '43',
            PIEDMONT: '44',
            TUSCANY: '45',
            APULIA: '46',
            TYROLIA: '47',
            GALICIA: '48',
            BOHEMIA: '49',
            FINLAND: '50',
            LIVONIA: '51',
            UKRAINE: '52',
            ALBANIA: '53',
            ARMENIA: '54',
            SYRIA: '55',
            NORTH_ATLANTIC_OCEAN: '56', //-----------Water-------------------
            MID_ATLANTIC_OCEAN: '57',
            NORWEIGIAN_SEA: '58',
            NORTH_SEA: '59',
            ENGLISH_CHANNEL: '60',
            IRISH_SEA: '61',
            HELIGOLAND_BLIGHT: '62',
            SKAGERRAK: '63',
            BALTIC_SEA: '64',
            GULF_OF_BOTHNIA: '65',
            BERENTS_SEA: '66',
            WESTERN_MEDITERRANEAN: '67',
            GULF_OF_LYONSN: '68',
            TYRRHENIAN_SEA: '69',
            IONIAN_SEA: '70',
            ADRIATIC_SEA: '71',
            AEGEAN_SEA: '72',
            EASTERN_MEDITERRANEAN: '73',
            BLACK_SEA: '74'
        }
    }
}
export {FIELD, ACTION, ERROR, GAME, MAP, PLAYER, USER, PHASE, UNIT, UNIT_TYPE, ORDER, CHAT};