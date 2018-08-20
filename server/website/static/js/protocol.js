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
    PLAYER: '2', //Can contain player object or play id or user
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
        //C->S if game is set change game parameters, if player is set either player parameteres are to be changed or orders are being sent or the session id is being sent
            //NOTE: id of playing making commands is not sent, it is known on server by session
        //S->C Update of gamestate from server some, all, or none of the game, player, unit, etc... infomation may be changed
    CHAT: '4',
        //C->S CHAT field contains MESSAGE and optional RECIPIENT
        //S->C CHAT field contains MESSAGE, RECIPIENT is set if it was a PM, PLAYER field contains ID of sender
    LIST_GAMES: '5',
        //C->S request list of aviable games
        //S->C GAME field contains list of aviable games that are objects containing ID, OWNER, PLAYERS as number of players, MAX_PLAYERS, NAME, and PASSWORD is set if there is a password
    ERROR: '6', //Error code
    VIEW_GAME: '7', 
        //C->S GAME.TURN contains turn to view and GAME.ID contains game ID
        //S->C GAME object contains TURN, and list of all PLAYERS that each have their TERRITORIES list and UNITS list compleate with their order for that turn
    LOGIN: '8',
        //C->S PLAYER field will contain user with username and password
        //S->C Response to login request, contains user info in PLAYER field if sucessful, PLAYER field not assigned if not
    LOGOUT: '9',
    REGISTER: '10'
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
    TIMER_START: '4', //When current phase started
    TIMER_DURATIONS: '5', //Object with the timer duration of each phase, object of PHASE
    CURRENT_PHASE: '6',
    MAX_PLAYERS: '7',
    NAME: '8',
    WINNERS: '9',
    MAP: '10',
    PASSWORD: '11', //Optioanl field, if set on server list then password is required
    PAUSE: '12' //By setting this field the game can be paused, value > 0 for timed pause (minutes), else to unpause
}
/**
 * Enum for player object
 * @readonly
 * @enum {string}
 */
const PLAYER = {
    USER: '0', //Object of USER or 0 if just a placeholder player
    COUNTRY: '1', //[] Country or contries player represents
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
    PHONE: '4', //optional
    PASSWORD: '5'
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
    ARMY: '0',
    FLEET: '1'
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

export {FIELD, ACTION, ERROR, GAME, PLAYER, USER, PHASE, UNIT, UNIT_TYPE, ORDER, CHAT};