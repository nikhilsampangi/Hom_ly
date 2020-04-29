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

function createIndex(indexName, callback){
    esClient.indices.create({
        index: indexName,
        body: {
            settings: {
                number_of_shards : 1
            },
            mappings: {
                properties: {
                    name: { type: "text" },
                    place: { type: "text" },
                    rating: { type: "text" },
                    suggest: {
                        type: "completion",
                        analyzer: "simple",
                        search_analyzer: "simple",
                        contexts: { 
                            name: "location",
                            type: "geo",
                            precision: "3km"
                        }
                    },
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
    }, (err, resp, status)=>{
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

function findDocs(indexName, docType, callback){
    esClient.count({
        index: indexName,
        type: docType
    }, (err, resp)=>{
        if(err){
            callback(err, null);
        }else {
            callback(null, resp);
        }
    });
}

// delete doc in index type

function deleteDocs(indexName, Id, docType, callback){
    esClient.count({
        index: indexName,
        id: Id,
        type: docType
    }, (err, resp)=>{
        if(err){
            callback(err, null);
        }else {
            callback(null, resp);
        }
    });
}

// searching

function search(indexName, latitude, longitude, callback){
    esClient.search({
        index: indexName,
        body: {
            query: {
                // regexp: {"name": "[a-z]"+value+"[a-z]*"}
                match_all : {}
            },
            filter : {
                geo_distance : {
                    distance : "3km",
                    pin : {
                        location: {
                            lat : latitude,
                            lon : longitude
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
    });
}

function autoSuggest(indexName, value, latitude, longitude, callback){
    esClient.search({
        index: indexName,
        body: {
            suggest: {
                restuarents: {
                    regex : "[a-z]"+value+"[a-z]*", 
                    completion : { 
                        field : "suggest",
                        size : 10,
                        contexts: {
                            location:  {
                                lat: latitude,
                                lon: longitude
                            }
                        },
                        fuzzy: {
                            fuzziness: 3
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
    createIndex, 
    deleteIndex, 
    checkIndex, 
    indexing, 
    findDocs, 
    deleteDocs, 
    search, 
    autoSuggest, 
    mappingDetails
}