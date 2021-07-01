"use strict";

class Repository {
    constructor(Model) {
        this.Model = Model;
    }

    getModel(){
        return this.Model;
    }

    create(payload) {
        return this.Model.create(payload);
    }

    findById(id) {
        return this.Model.findOne({_id: id});
    }

    findOne(condition, sort = {}) {
        return this.Model.findOne(condition).sort(sort);
    }

    count (condition){
        return this.Model.countDocuments(condition);
    }

    all(condition, sort = {}, page = null, limit = 100) {
        try{
            if(page){
                delete condition.page;
                delete condition.limit;
                return this.Model.paginate(condition,{page, limit: parseInt(limit)});
            }else {
                return this.Model.find(condition).sort(sort);
            }
        }catch (e) {
            console.log(e);
            return this.Model.find(condition).sort(sort);
        }
    }

    truncate(condition = {}) {
        if (process.env.NODE_ENV == "development") {
            return this.Model.deleteMany(condition);
        }
    }

    deleteMany(condition = {}) {
        return this.Model.deleteMany(condition);
    }


    massInsert(data = []) {
        if (data.length === 0)
            return [];

        return this.Model.collection.insertMany(data);
    }

    updateMany(condition = null, update = {}){
        return this.Model.updateMany(condition, {$set: update});
    }

    upsert(condition, update){
        return this.Model.update(condition, update,{upsert: true, setDefaultsOnInsert: true});
    }
}


module.exports = Repository;
