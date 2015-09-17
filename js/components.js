angular.module('components',[])

.directive('gimage',function(){
    return {
        restrict:'E',
        transclude:false,
        scope:{src:"=",onload:"=",oninit:"=",height:"@",onpopup:"&onpopup"},
        controller:function($scope){
            },
        link:function($scope,element,attrs){
            $scope.oninit(element)
            
            var img=new Image()
            img.className="phantom_image"
            img.style.cursor="pointer"
            
            angular.element(img).on("click",function(){
                $scope.$apply(function(){
                    $scope.onpopup({"img":img.src})
                    })
                })
            
            element.setheight=function(val){
                img.height=val
                img.className=""
                }
            
            angular.element(img).on("load",function(){
                element.empty()
                element.append(img)
                element.attr("originalwidth",img.clientWidth)
                element.attr("originalheight",img.clientHeight)
                element.addClass("loaded")
                $scope.onload()
                })
                
            img.src=$scope.src
            },
        template:'<div class="gimage"></div>',
        replace:true
        }
    })

.directive('gallery',function(){
    return {
        restrict:'E',
        transclude:false,
        scope:{images:"=",isloading:"=",onloadchange:"="},
        link:function($scope,element,attrs){
            $scope.element=element
            },
        controller:function($scope){
            $scope.loadcount=0
            $scope.image_elements=[]
            $scope.oninit=function(element){
                $scope.image_elements.push(element)
                }
            $scope.reflow=function(){
                var rowheight=Math.floor(window.innerHeight/3)
                var rowwidth=$scope.element[0].clientWidth-32//-32
                
                for(var i=0;i<$scope.image_elements.length;i++)
                    {
                    element=$scope.image_elements[i]
                    element.setheight(rowheight)
                    }
                
                var currentrow=[]
                var currentrowwidth=0
                var rows=0
                
                for(var i=0;i<$scope.image_elements.length;i++)
                    {
                    element=$scope.image_elements[i]
                    currentrow.push(element)
                    currentrowwidth+=element.find("img")[0].clientWidth
                    if(currentrowwidth>=rowwidth)
                        {
                        var scalefactor=currentrowwidth/rowwidth
                        for(var j=0;j<currentrow.length;j++)
                            {
                            currentrow[j].setheight(Math.floor(rowheight/scalefactor))
                            }
                        
                        currentrowwidth=0
                        for(var j=0;j<currentrow.length;j++)
                            {
                            currentrowwidth+=currentrow[j][0].clientWidth
                            }
                        
                        rows+=1
                        currentrow=[]
                        currentrowwidth=0
                        }
                    }
                }
            $scope.$watchCollection('images',function(oldv,newv){
                $scope.loadcount+=Math.abs(oldv.length-newv.length)
                console.log("loading "+$scope.loadcount+" images")
                })
            
            $scope.onload=function(){
                var num=0
                for(var i=0;i<$scope.image_elements.length;i++)
                    {
                    if($scope.image_elements[i].hasClass("loaded")==false)
                        num+=1
                    }
                
                var perc=100-(num*100/$scope.loadcount)
                if(perc==100)
                    {
                    $scope.loadcount=0
                    console.log("fully loaded")
                    }
                $scope.onloadchange(perc)
                
                for(var i=0;i<$scope.image_elements.length;i++)
                    {
                    if($scope.image_elements[i].hasClass("loaded")==false)
                        return
                    }
                
                $scope.reflow()
                //setTimeout(function(){$scope.$apply($scope.reflow)},5000)
                
                console.log("done loading.")
                $scope.isloading=false
                }
            $scope.popupsrc=""
            $scope.unpopup=function(img)
                {
                $scope.popupsrc=""
                }
            $scope.popup=function(img)
                {
                console.log("popup:",img)
                $scope.popupsrc=img
                }
            },
        template:'<div class="popup" ng-class="{\'hidden\':popupsrc==\'\'}"><img class="closebtn" src="images/close.png" ng-click="unpopup()"><img ng-src="{{popupsrc}}"></div><gimage src="src" onpopup="popup(img)" onload="onload" oninit="oninit" ng-repeat="src in images"></gimage>',
        replace:false
        }
    })
