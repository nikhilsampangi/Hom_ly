const elasticsearch = require('@elastic/elasticsearch');

const esClient = new elasticsearch.Client({
    node: 'http://localhost:9200/',
    log: 'error'
  });

// checking status of esClient
  
function checkStatus(callback){
    esClient.cluster.health({},function(err,resp,status) {  
        if(err){
            callback(err, null);
        }else {
            console.log("\nstatus\t:-"+status);
            callback(null, resp);
        };
      });  
};


// creating index

function createChefIndex(indexName, callback){
    esClient.indices.create({
        index: indexName,
        body: {
            settings: {
                index: {
                    blocks: {
                        read_only_allow_delete: null
                    }
                },
                number_of_shards : 1,

            },
            mappings: {
                properties: {
                    id: { type: "text" },
                    name: { type: "text" },
                    place: { type: "text" },
                    rating: { type: "float" },
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
    }, (err, resp, status)=>{
        if(err){
            callback(err,null);
        }else {
            callback(null, resp);
        }
    });    
} 

function createMenuIndex(indexName, callback){
    esClient.indices.create({
        index: indexName,
        body: {
            settings: {
                index: {
                    blocks: {
                        read_only_allow_delete: "false"
                    }
                },
                number_of_shards : 1
            },
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
        if(err){
            callback(err,null);
        }else {
            callback(null, resp);
        }
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

// deleting index

function deleteIndex(indexName, callback){
    esClient.indices.delete({
        index: indexName
    }, (err, resp)=>{
        if(err){
            callback(err,null);
        }else {
            callback(null, resp);
        }
    });    
}

// getmapping

function mappingDetails(indexName, callback){
    
    esClient.indices.getMapping({
        index: indexName
    }, (err, resp)=>{
        if(err){
            callback(err,null);
        }else {
            callback(null, resp);
        }
    })
}

// adding document to index known as "indexing"

function indexing(indexName, Id, payload, callback){
    esClient.index({
        index: indexName,
        id: Id,
        body: payload
    }, (err, resp)=>{
        if(err){
            callback(err, null);
        }else {
            callback(null, resp);
        }
    })
}

// find docs in index type

function findDocs(indexName, Id, callback){
    esClient.get({
        index: indexName,
        id: Id
        //type: docType
    }, (err, resp)=>{
        if(err){
            callback(err, null);
        }else {
            callback(null, resp);
        }
    });
}

// delete doc in index type

function deleteDocs(indexName, Id, callback){
    esClient.count({
        index: indexName,
        id: Id
    }, (err, resp)=>{
        if(err){
            callback(err, null);
        }else {
            callback(null, resp);
        }
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
                            distance : "30km",
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
        if(err){
            callback(err, null);
        }else {
            callback(null, resp);
        }
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
    mappingDetails
}