import express from 'express';
import axios from 'axios';


const url ="https://api.hatchways.io/assessment/blog/posts";

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
     var newurl = `${url}?tag=${tag}`; // add required query param to the base url 
     var errorMessage = "fail";
    try {
        if (tag==null) {
            errorMessage="Tags parameter is required ";
        }
        const result = await axios.get(newurl);
        
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


