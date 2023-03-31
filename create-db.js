"use strict";

const fs = require('fs');
const Sqlite = require('better-sqlite3');
const { loadavg } = require('os');

let db = new Sqlite('db.sqlite');

let entries = JSON.parse(fs.readFileSync('places.json').toString());

let load = function(filename) {
    const places = JSON.parse(fs.readFileSync(filename));
  
    db.prepare('DROP TABLE IF EXISTS place').run();
    db.prepare('CREATE TABLE place (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, address TEXT, img TEXT,  description TEXT)').run();

  
    let insert = db.prepare('INSERT INTO place VALUES (@id, @name, @address,  @img, @description)');

    let transaction = db.transaction((places) => {
  
      for (let id = 0 ; id < places.length ; id++) {
        let place = places[id];
        place.id = id;
        insert.run(place);
      }
    });
  
    transaction(places);
  }

load('places.json');