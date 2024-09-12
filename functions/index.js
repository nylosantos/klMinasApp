import express from "express";
import cors from "cors";
import { https } from "firebase-functions";
import { apps, initializeApp, auth, firestore } from "firebase-admin";

const app = express();
app.use(cors({ origin: true }));

if (apps.length === 0) {
  initializeApp();
}

export const createAppUser = https.onCall(async (data) => {
  return await auth()
    .createUser({
      email: data.email,
      displayName: data.name,
      password: data.password,
      phoneNumber: data.phone,
    })
    .then(async (user) => {
      await firestore().collection("appUsers").doc(user.uid).set({
        id: user.uid,
        name: user.displayName,
        email: user.email,
        phone: user.phoneNumber,
        role: data.role,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
      return user.uid;
    });
});

export const deleteAppUser = https.onCall((data) => {
  const deleteAllPlaces = async (data) => {
    await auth().deleteUser(data.id);
    await firestore().collection("appUsers").doc(data.id).delete();
  };
  return deleteAllPlaces(data);
});

export const updateAppUserWithoutPassword = https.onCall((data) => {
  const userData = auth()
    .getUser(data.id)
    .then(async (userRecord) => {
      await auth().updateUser(userRecord.uid, {
        email: data.email,
        displayName: data.name,
        phoneNumber: data.phone,
      });
      await firestore().collection("appUsers").doc(data.id).update({
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    });
  return userData;
});

export const updateAppUserWithPassword = https.onCall((data) => {
  const userData = auth()
    .getUser(data.id)
    .then(async (userRecord) => {
      await auth().updateUser(userRecord.uid, {
        email: data.email,
        displayName: data.name,
        phoneNumber: data.phone,
        password: data.password,
      });
      await firestore().collection("appUsers").doc(data.id).update({
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    });
  return userData;
});

export const getAuthUser = https.onCall(async (data) => {
  return await auth()
    .getUser(data)
    .then((userRecord) => {
      return userRecord;
    });
});
