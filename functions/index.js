const functions = require("firebase-functions");
import algoliasearch from "algoliasearch";

const env = functions.config()

const client = algoliasearch(env.algoli.app_id, env.algoli.admin_api_key)
const index = client.initIndex('products')

export const onPostCreated = functions.firestore.document('posts/{productId}').onCreate(
    ((snap, ctx) => {
        return index.saveObject({
            objectID: snap.id,
            ...snap.data()
        })
    }))

export const onPostDeleted = functions.firestore.document('posts/{productId}').onDelete(
    ((snap, ctx)=>{
        return index.deleteObject(snap.id)
    }))
