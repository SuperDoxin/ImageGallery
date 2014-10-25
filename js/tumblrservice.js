angular.module('tumblrService',['ngResource'])

.value('apikey','gYF9A2rW4vyJjihRYnsTI6sHkwoAxGyqfL9Dwloal1sEgkiqTj')

.factory("TumblrInfo",function($resource,apikey){
    return $resource('http://api.tumblr.com/v2/blog/:basehostname/info',{api_key:apikey,callback:"JSON_CALLBACK"},{get:{method:"JSONP",cache:true}})
    })

.factory("TumblrPosts",function($resource,apikey){
    return $resource('http://api.tumblr.com/v2/blog/:basehostname/posts/photo',{api_key:apikey,callback:"JSON_CALLBACK",limit:20},{get:{method:"JSONP",cache:true}})
    })
