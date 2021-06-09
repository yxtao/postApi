import express from 'express';
import axios from 'axios'
import pkg from 'axios-cache-adapter';
const { setupCache  } = pkg;

const url ="https://api.hatchways.io/assessment/blog/posts" ;


export const getPing = async (req, res) => {
    try {
        res.status(200).json({success:"true"});
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}

export const getPosts = async (req, res) => { 
    var direction = req.query.direction ? req.query.direction : "desc"; // req.query.paramA
    var sortBy = req.query.sortBy ?  req.query.sortBy: "likes" ;
    const tag = req.query.tag;
    var errorMessage = "fail";
   try {
       if (tag==null) {
           errorMessage="Tags parameter is required ";
       }
       
       // Create `axios` instance passing the newly created `cache.adapter`
       const cache = setupCache({
        maxAge: 15 * 60 * 1000,
        debug: true,
        exclude: {
          query: false
        }
      })
      
      const api = axios.create({
        adapter: cache.adapter
      })

       const result = await api.get(url, {params: {tag: tag}});
      // Interacting with the store, see `localStorage` API.
       const cachedStorage = await cache.store;
       console.log(JSON.stringify(cachedStorage)) ;

       if (result.data.posts[0].hasOwnProperty(sortBy)){ // unpack result, there is a data property
          
           result.data.posts.sort(function(a,b){ //sort function 
               var compareA = a[sortBy];
               var compareB = b[sortBy];
               if(sortBy == "tags") {
                   compareA = a["tags"].length;
                   compareB = b["tags"].length;
               } 
               if (direction=="asc") { 
                   return compareA < compareB? -1: 1;
               }else{
                   return compareA > compareB? -1: 1;
               }
           });
           res.status(200).json( {query: req.query,result: result.data.posts});
        } else{
              errorMessage = " invalid sort paramater "
             res.status(404).json({message: errorMessage});
          }
     
   } catch (error) {
       res.status(404).json({message: error.message});
   }
}

export const router = express.Router();

router.get('/ping', getPing);
router.get('/posts', getPosts);


