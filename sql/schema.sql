CREATE TABLE user (
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(32) NOT NULL,
    hash CHAR(128) NOT NULL,
    salt CHAR(32) NOT NULL,
    power INT NOT NULL DEFAULT 0,
    name VARCHAR(64),
    phone VARCHAR(12),
    email VARCHAR(64),
    PRIMARY KEY (id)
);
CREATE TABLE rememberUser (
    user INT NOT NULL,
    cookie CHAR(32) NOT NULL,
    created TIMESTAMP NOT NULL,
    FOREIGN KEY (user) REFERENCES user(id) ON DELETE CASCADE
);
CREATE TABLE game (
    id INT NOT NULL AUTO_INCREMENT,
    owner INT,
    password VARCHAR(32),
    name VARCHAR(64) NOT NULL,
    maxPlayers INT NOT NULL,
    turn INT NOT NULL DEFAULT 0,
    phase VARCHAR(1) NOT NULL,
    timerStart DateTime,
    phaseLength INT NOT NULL,
    pause DateTime,
    map VARCHAR(64) NOT NULL,
    winner INT,
    FOREIGN KEY (owner) REFERENCES user(id),
    FOREIGN KEY (winner) REFERENCES user(id),
    PRIMARY KEY (id)
);
CREATE TABLE chat (
    sender INT NOT NULL,
    receiver INT,
    game INT,
    message TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    beenRead BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (sender) REFERENCES user(id),
    FOREIGN KEY (sender) REFERENCES user(id),
    FOREIGN KEY (game) REFERENCES game(id) ON DELETE CASCADE
);
CREATE TABLE player (
    user INT NOT NULL,
    game INT NOT NULL,
    country VARCHAR(32),
    ready BOOL,
    FOREIGN KEY (user) REFERENCES user(id),
    FOREIGN KEY (game) REFERENCES game(id) ON DELETE CASCADE
);
CREATE TABLE supplyTerritories (
    user INT NOT NULL,
    game INT NOT NULL,
    territory VARCHAR(32) NOT NULL,
    FOREIGN KEY (user) REFERENCES user(id),
    FOREIGN KEY (game) REFERENCES game(id) ON DELETE CASCADE
);
CREATE TABLE unit (
    user INT NOT NULL,
    game INT NOT NULL,
    turn INT NOT NULL,
    territory VARCHAR(32) NOT NULL,
    type VARCHAR(2) NOT NULL,
    coast INT,
    command VARCHAR(2) NOT NULL,
    target VARCHAR(32),
    source VARCHAR(32),
    FOREIGN KEY (user) REFERENCES user(id),
    FOREIGN KEY (game) REFERENCES game(id) ON DELETE CASCADE
);
