const elasticsearch = require('@elastic/elasticsearch');

const esClient = new elasticsearch.Client({
    node: 'http://192.168.99.101:9200/',
    log: 'error'
  });

// checking status of esClient
  
function checkStatus(callback){
    esClient.cluster.health({},function(err,resp) {  
        callback(err, resp);
      });  
};


// creating index

function createChefIndex(indexName, callback){
    esClient.indices.create({
        index: indexName,
        body: {
            mappings: {
                properties: {
                    id: { type: "text" },
                    name: { type: "text" },
                    place: { type: "text" },
                    rating: { type: "float" },
                    workingStatus: {type: "boolean"},
                    // suggest: {
                    //     type: "completion",
                    //     analyzer: "simple",
                    //     search_analyzer: "simple",
                    //     contexts: { 
                    //         name: "location",
                    //         type: "geo",
                    //         precision: 3
                    //     }
                    // },
                    pin: {
                        properties: {
                            location: {
                                type: "geo_point"
                            }
                        }
                    }
                }
            }
        }
    }, (err, resp)=>{
        callback(err, resp);
    });    
} 

function createMenuIndex(indexName, callback){
    esClient.indices.create({
        index: indexName,
        body: {
            mappings: {
                properties: {
                    chefId: { type: "text" },
                    chefName: { type: "text" },
                    dishId: { type: "text" },
                    dishName: { type: "text" },
                    dishPic: {type: "text"},
                    
                    // suggest: {
                    //     type: "completion",
                    //     analyzer: "simple",
                    //     search_analyzer: "simple",
                    //     contexts: { 
                    //         name: "location",
                    //         type: "geo",
                    //         precision: "3km"
                    //     }
                    // },
                    pin: {
                        properties: {
                            location: {
                                type: "geo_point"
                            }
                        }
                    }
                }
            }
        }
    }, (err, resp, status)=>{
        callback(err, resp);
    });    
} 
// checking index existing

function checkIndex(indexName, callback){
   
    esClient.indices.exists({
        index: indexName
    }, (err, resp)=>{
        if(err){
            callback(err, null);
        }else {
            callback(null, resp);
        }
    });     
}

// update status Index
function updateStatus(indexName, Id, status, callback) {
    esClient.update({
        index: indexName,
        id: Id,
        
        body: {
            doc: {
                workingStatus: status
            }
        }
        }, (err, resp)=>{
            if(err){
                callback(err,null);
            }else {
                callback(null, resp);
            }
        });
}

// update address index
function updateAdress(indexName, Id, locality, callback) {
    esClient.update({
        index: indexName,
        id: Id,
        
        body: {
            doc: {
                place: locality
            }
        }
        }, (err, resp)=>{
            if(err){
                callback(err,null);
            }else {
                callback(null, resp);
            }
        });
}
// deleting index

function deleteIndex(indexName, callback){
    esClient.indices.delete({
        index: indexName
    }, (err, resp)=>{
        callback(err, resp);
    });    
}

// getmapping

function mappingDetails(indexName, callback){
    
    esClient.indices.getMapping({
        index: indexName
    }, (err, resp)=>{
        callback(err, resp);
    })
}

// adding document to index known as "indexing"

function indexing(indexName, Id, payload, callback){
    esClient.index({
        index: indexName,
        id: Id,
        body: payload
    }, (err, resp)=>{
        callback(err, resp);
    })
}

// find docs in index type

function findDocs(indexName, Id, callback){
    esClient.get({
        index: indexName,
        id: Id
        //type: docType
    }, (err, resp)=>{
        callback(err, resp);
    });
}

// delete doc in index type

function deleteDocs(indexName, Id, callback){
    esClient.delete({
        index: indexName,
        id: Id
    }, (err, resp)=>{
        callback(err, resp);
    });
}

// searching

function search(indexName, value, latitude, longitude, callback){
    esClient.search({
        index: indexName,
        body: {
            query: {
                bool : {
                    must : {
                        // match_all: {},
                        regexp: {"name": "[a-z]*"+value+"[a-z]*"}
                    },
                    filter : {
                        geo_distance : {
                            distance : "3km",
                            "pin.location" : {
                                lat : latitude,
                                lon : longitude
                            }
                        }
                    }
                }
            }    
        }
    }, (err, resp)=>{
        callback(err, resp);
    });
}

function autoSuggest(indexName, value, latitude, longitude, callback){
    esClient.search({
        index: indexName,
        body: {
            suggest: {
                restuarents: {
                    regex : "[a-z]*"+value+"[a-z]*", 
                    completion : { 
                        field : "suggest",
                        size : 10,
                        contexts: {
                            location:  {
                                lat: latitude,
                                lon: longitude
                            }
                        }
                    }
                }
            }
        }
    }, (err, resp)=>{
        callback(err, resp);
    })
}


module.exports= {
    checkStatus, 
    createChefIndex,
    createMenuIndex, 
    deleteIndex, 
    checkIndex, 
    indexing, 
    findDocs, 
    deleteDocs, 
    search, 
    autoSuggest, 
    mappingDetails,
    updateStatus,
    updateAdress
}