class resModle{
    constructor(data,message){
        if(typeof data == 'string'){
            this.message = data;
            data = null;
            message = null;
            return;
        }
        if(data){
            this.data = data;
        }
        if(message){
            this.message = message;
        }
    }
}

class SuccessModle extends resModle{
    constructor(data,message){
        super(data,message);
        this.error = 0;
    }
}

class ErrorModle extends resModle{
    constructor(data,message){
        super(data,message);
        this.error = 1;
    }
}

module.exports = {
    SuccessModle,
    ErrorModle
}