/**
 * Used for map interactins and drawing
 * @author Jared Butcher <jared.butcher1219@gmail.com>
 * @module diplomacy/defaultMap
 */

/**
 * Enum for playable contries for defalt map
 * @readonly
 * @namespace
 * @property {string} DEFAULT.ID Identifer for map
 * @property {enum} DEFAULT.COUNTRIES List of playable contries on default game board
 * @property {object} DEFAULT.TERRITORIES List of territories on default game board and theire markers and borders
 */
const MAP = {
    ID: '0',
    COUNTRY: { 
        AUSTRIA: '0',
        ENGLAND: '1',
        FRANCE: '2',
        GERMANY: '3',
        ITALY: '4',
        RUSSIA: '5',
        TURKEY: '6'
    },
    TERRITORY: {
        //-----------------Supply Centers--------------
        ANKARA: {
            ID: '0',
            MARKER: {
                X: 0,
                Y: 0
            },
            UNIT: [
                {
                    TYPE: UNIT_TYPE.ARMY,
                    X: 0,
                    Y: 0,
                    BORDER: [
                        'CONSTANTINOPLE',
                        'SMYRNA',
                        'ARMENIA',
                        'BLACK_SEA'
                    ]
                },
                {
                    TYPE: UNIT_TYPE.FLEET,
                    X: 0,
                    Y: 0,
                    BORDER: [
                        'CONSTANTINOPLE',
                        'ARMENIA',
                        'BLACK_SEA'
                    ]
                }
            ]
        }, 
        BELGIUM: '1',
        BERLIN: '2',
        BREST: '3',
        BUDAPEST: '4',
        BULGARIA: '5',
        CONSTANTINOPLE: '6',
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
        SPAIN: {
            ID: '27',
            MARKER: {
                X: 195,
                Y: 730
            },
            UNIT: [
                {
                    TYPE: UNIT_TYPE.ARMY,
                    X: 255,
                    Y: 705,
                    BORDER: [
                        'PORTUGAL',
                        'GASCONY',
                        'MARSEILLES',
                        'MID_ATLANTIC',
                        'WEST_MEDITERRANEAN',
                        'GULF_OF_LYON'
                    ]
                },
                {
                    TYPE: UNIT_TYPE.FLEET,
                    COAST: 0,
                    X: 205,
                    Y: 630,
                    BORDER: [
                        'PORTUGAL',
                        'GASCONY',
                        'MID_ATLANTIC'
                    ]
                },
                {
                    TYPE: UNIT_TYPE.FLEET,
                    COAST: 1,
                    X: 265,
                    Y: 800,
                    BORDER: [
                        'PORTUGAL',
                        'MARSEILLES',
                        'MID_ATLANTIC',
                        'WEST_MEDITERRANEAN',
                        'GULF_OF_LYON'
                    ]
                }
            ]
        },
        SWEDEN: '28',
        TRIESTE: '29',
        TUNIS : '30',
        VENICE : '31',
        VIENNA: '32',
        WARSAW : '33',
        //--------------------------Other Land------------
        CLYDE : '34', 
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
        BOHEMIA: {
            ID: '49',
            UNIT: [
                {
                    TYPE: UNIT_TYPE.ARMY,
                    X: 0,
                    Y: 0,
                    BORDER: [
                        'MUNICH',
                        'SILESIA',
                        'GALICIA',
                        'VIENNA',
                        'TYROLIA'
                    ]
                }
            ]
        },
        FINLAND: '50',
        LIVONIA: '51',
        UKRAINE: '52',
        ALBANIA: '53',
        ARMENIA: '54',
        SYRIA: '55',
        //-----------Water-------------------
        NORTH_ATLANTIC: {
            ID: '56',
            CONVOY: {
                X: 0,
                Y: 0
            },
            UNIT: [
                {
                    TYPE: UNIT_TYPE.FLEET,
                    X: 0,
                    Y: 0,
                    BORDER:[
                        'MID_ATLANTIC',
                        'IRISH_SEA',
                        'NORWEIGIAN_SEA',
                        'CLYDE',
                        'LIVERPOOL'
                    ]
                }
            ]
        },
        MID_ATLANTIC: {
            ID: '57',
            CONVOY: {
                X: 0,
                Y: 0
            },
            UNIT: [
                {
                    TYPE: UNIT_TYPE.FLEET,
                    X: 0,
                    Y: 0,
                    BORDER:[
                        'MID_ATLANTIC',
                        'IRISH_SEA',
                        'ENGLISH_CHANNEL',
                        'WEST_MEDITERRANEAN',
                        'BREST',
                        'GASCOY',
                        'PORTUGAL',
                        'NORTH_AFRICA',
                        {
                            TERRITORY: 'SPAIN',
                            COAST: 0
                        },
                        {
                            TERRITORY: 'SPAIN',
                            COAST: 1
                        }
                    ]
                }
            ]
        },
        NORWEIGIAN_SEA: '58',
        NORTH_SEA: '59',
        ENGLISH_CHANNEL: '60',
        IRISH_SEA: '61',
        HELIGOLAND_BLIGHT: '62',
        SKAGERRAK: '63',
        BALTIC_SEA: '64',
        GULF_OF_BOTHNIA: '65',
        BERENTS_SEA: '66',
        WEST_MEDITERRANEAN: '67',
        GULF_OF_LYONSN: '68',
        TYRRHENIAN_SEA: '69',
        IONIAN_SEA: '70',
        ADRIATIC_SEA: '71',
        AEGEAN_SEA: '72',
        EAST_MEDITERRANEAN: '73',
        BLACK_SEA: '74'
    }
}