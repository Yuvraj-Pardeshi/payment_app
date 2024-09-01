import jwt from 'jsonwebtoken'
import JWT_SECRET from './config.js'

const authMiddleware = (req,res,next)=>{
    const auth_header = req.headers.authorization;
    if(!auth_header){
        res.json({'msg' : 'no access'})
    }
    try{
        const decode = jwt.verify(auth_header,JWT_SECRET);
        req.userId = decode.user_id
        next();
    }
    catch(err){
        return res.status(403).json({"msg" : "BAD Request"});
    }
}

export default authMiddleware;