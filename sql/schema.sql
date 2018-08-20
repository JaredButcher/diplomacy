CREATE TABLE user (
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(32) NOT NULL,
    hash CHAR(32) NOT NULL,
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
    diplomacyLength INT NOT NULL,
    retreatLength INT NOT NULL,
    adjustLength INT NOT NULL,
    pause DateTime,
    map Char(2) NOT NULL,
    winner INT,
    FOREIGN KEY (owner) REFERENCES user(id),
    FOREIGN KEY (winner) REFERENCES user(id),
    PRIMARY KEY (id)
);
CREATE TABLE gameChat (
    sender INT NOT NULL,
    game INT NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    FOREIGN KEY (sender) REFERENCES user(id),
    FOREIGN KEY (game) REFERENCES game(id) ON DELETE CASCADE
);
CREATE TABLE privateChat (
    sender INT NOT NULL,
    receiver INT NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    FOREIGN KEY (sender) REFERENCES user(id),
    FOREIGN KEY (receiver) REFERENCES user(id)
);
CREATE TABLE player (
    user INT NOT NULL,
    game INT NOT NULL,
    country VARCHAR(2),
    ready BOOL,
    FOREIGN KEY (user) REFERENCES user(id),
    FOREIGN KEY (game) REFERENCES game(id) ON DELETE CASCADE
);
CREATE TABLE supplyTerritories (
    user INT NOT NULL,
    game INT NOT NULL,
    territory VARCHAR(3) NOT NULL,
    FOREIGN KEY (user) REFERENCES user(id),
    FOREIGN KEY (game) REFERENCES game(id) ON DELETE CASCADE
);
CREATE TABLE unit (
    user INT NOT NULL,
    game INT NOT NULL,
    turn INT NOT NULL,
    territory VARCHAR(3) NOT NULL,
    type VARCHAR(2) NOT NULL,
    coast INT,
    command VARCHAR(2) NOT NULL,
    target VARCHAR(3),
    source VARCHAR(3),
    FOREIGN KEY (user) REFERENCES user(id),
    FOREIGN KEY (game) REFERENCES game(id) ON DELETE CASCADE
);
