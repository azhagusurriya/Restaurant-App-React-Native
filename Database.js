import React,{useEffect} from 'react';
import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase('db.restaurant');

const createTable = async () => {
  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'create table if not exists restaurant_table (username primary key not null,name text, password text, contact int, address text, email text, latitude decimal, longitude decimal);'
      );
    });
  })
}

const insert = (username, name, password, address, contact, email, latitude, longitude) => {
  db.transaction(
    tx => {
      tx.executeSql(
        'insert into restaurant_table (username, name, password, contact, address, email, latitude, longitude) values (?, ?, ?, ?, ?, ?, ?, ?)', [username, name, password, contact, address, email, latitude, longitude]);
    },
    null
  );
}

const getData = (setItems) => {
  db.transaction(tx => {
    tx.executeSql(
      'select * from restaurant_table;',null,
      (_, { rows: { _array } }) => setItems(_array),
      (_, error) => onError
    );
  });
}

const getUser = (setItems, username) => {
  db.transaction(tx => {
    tx.executeSql(
      'select * from restaurant_table where username = ?;',[username],
      (_, { rows: { _array } }) => setItems(_array),
      (_, error) => onError
    );
  });
}

const removeData = (username) => {
  db.transaction(tx => {
    tx.executeSql('delete from restaurant_table where username = ?;', [username],
      (_, error) => onError
    );
  });
}

const updateProfile = (username, name, password, contact, address, email, latitude, longitude) => {
    db.transaction(tx => {
      tx.executeSql('update restaurant_table set name = ?,'+
      'password = ?, contact = ?, address = ?, email = ?, latitude = ?, longitude = ? where username = ?;',
      [name, password, contact, address, email, latitude, longitude, username],
      (_, error) => onError);
    })
}
const onError = (_, error) => {
    console.log(error);
}

export const Database = {
    createTable,
    insert,
    getData,
    getUser,
    updateProfile,
    removeData
}
