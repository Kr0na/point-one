import AbstractStorage from '../AbstractStorage'

export default class MongooseStorage extends AbstractStorage {

    constructor(key, options) {
        super(key, options)
        this.options = options
    }

    findBy(criteria) {
        return new Promise((resolve, reject) => {
            this.options.collection.find(criteria, (err, docs) => {
                if (err || !docs.length) {
                    reject(criteria)
                } else {
                    resolve(docs)
                }
            })
        })
    }

    save(data) {

    }
}