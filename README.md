# my-simple-blog
This blog was maked when I learn nodejs && express.

## Environment
- Nodejs (recommended 5.0.0)
- Mongodb (**at least 3.0**, recommended 3.0.9)

## How to start 
1. Get the sourcecode 
> git clone git@github.com:novay55555/my-simple-blog.git

2. Install the dependencies
> npm install

3. Restore **mongo-backup/test ** to your Mongodb, sample like
> mongorestore -u username -p password  -d yourDb backupPath

4. Create a `credenticals.js` in the root path, the `credenticals.js` sample like
```javascript
module.exports = {
    cookieSecret: '***',
    email: {
        qq: {  // qqstmp config use by nodemailer
            user: '***',   
            password: '***'    
        }
    },
    mongo: {
        dep: { connectionString: 'mongodb://tester:tester@localhost/test' },  // connect the db you restore above
        pro: { connectionString: '' }
    }
};
```
<br />
5. Start the blog trip
> node app.js

## About Grunt Task
- I config a **dev task** after run the command `grunt dev` in the terminal , you can see the blog page changed when you press `ctrl` + `s` in `.handlebars` or `.scss`(now `F5` is free!!! =. =), **noted that you should install Ruby and Sass before you run this task**
- I also config a **test task** to test some API, but just some simple tests =. =

### Here is the old demo ;)
you can see old the **"demo"** by [http://aijiang.ml/](http://aijiang.ml/) 
Althrough it is really simple blog, I quite enjoy the process, so just have fun!!
