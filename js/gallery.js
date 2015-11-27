angular.module('gallery',['ngRoute','ngResource','tumblrService','components','infinite-scroll'])

.config(function($routeProvider){
    $routeProvider
    .when('/tumblr/:url',{controller:"tumblrGalleryCtrl",templateUrl:'templates/gallery.html'})
    .when('/',{controller:"pickSourceCtrl",templateUrl:'templates/picksource.html'})
    .otherwise({redirectTo:'/'})
    })

.controller('pickSourceCtrl',function($scope,$location,TumblrInfo){
    $scope.$watch("sourceurl",function(){
        if($scope.sourceurl===undefined || $scope.sourceurl.length==0)
            {
            $scope.message="please enter a source url"
            return
            }
        
        var m;
        m=$scope.sourceurl.match("(https?://)?(.+\.tumblr\.com)/?")
        if(m!==null)
            {
            $scope.message="checking url..."
            var bloginfo=TumblrInfo.get({basehostname:m[2]})
            bloginfo.$promise.then(function(data){
                if(data["meta"]["status"]==404)
                    {
                    $scope.message="Blog not found"
                    return
                    }
                else if(data["meta"]["status"]==200)
                    {
                    $scope.message="loading that right up!"
                    $location.path('/tumblr/'+m[2])
                    }
                else
                    {
                    $scope.message="unknown error: "+data["meta"]["msg"]
                    }
                })
            return
            }
        
        $scope.message="unsupported url"
        })
    })

.controller('tumblrGalleryCtrl',function($scope,$routeParams,$q,$http,TumblrInfo,TumblrPosts){
    $scope.images=[]
    $scope.postoffset=0
    $scope.isloading=false
    //$scope.loadpercentage=0
    $scope.onload=function(perc)
        {
        $scope.$apply(function(){
            $scope.loadpercentage=perc
            if($scope.loadpercentage==100)
                setTimeout(function(){$scope.$apply(function(){$scope.loadpercentage=0})},1500)
            })
        }
    
    var bloginfo=TumblrInfo.get({basehostname:$routeParams["url"]})
    bloginfo.$promise.then(function(data){
        $scope.title=data["response"]["blog"]["title"]
        })
    
    $scope.loadimages=function(){
        if($scope.isloading)
            return
        console.log("loading images")
        $scope.isloading=true
        var posts=TumblrPosts.get({basehostname:$routeParams["url"],offset:$scope.postoffset})
        posts.$promise.then(function(data){
            var lst=data["response"]["posts"]
            var promises=[]
            for(var i=0;i<lst.length;i++)
                {
                for(var j=0;j<lst[i]["photos"].length;j++)
                    {
                    var url=lst[i]["photos"][j]["original_size"]["url"]
                    if($scope.images.indexOf(url)==-1)
                        $scope.images.push(url)
                    }
                } 
            $scope.postoffset+=lst.length
            })
        }
    })
