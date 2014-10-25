angular.module('components',[])

.directive('gimage',function(){
    return {
        restrict:'E',
        transclude:false,
        scope:{src:"=",onload:"=",oninit:"=",height:"@"},
        controller:function($scope){
            },
        link:function($scope,element,attrs){
            $scope.oninit(element)
            
            var img=new Image()
            img.height=0
            element.setheight=function(val){
                console.log("setheight "+val)
                img.height=val
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
        scope:{images:"=",isloading:"="},
        link:function($scope,element,attrs){
            $scope.element=element
            },
        controller:function($scope){
            $scope.image_elements=[]
            $scope.oninit=function(element){
                $scope.image_elements.push(element)
                }
            $scope.reflow=function(){
                var rowheight=Math.floor(window.innerHeight/3)
                var rowwidth=$scope.element[0].clientWidth-32
                
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
                            currentrow[j].setheight(rowheight/scalefactor)
                            }
                        
                        currentrowwidth=0
                        for(var j=0;j<currentrow.length;j++)
                            {
                            currentrowwidth+=currentrow[j][0].clientWidth
                            }
                        
                        
                        console.log(currentrowwidth)
                        
                        rows+=1
                        currentrow=[]
                        currentrowwidth=0
                        }
                    }
                }
            $scope.onload=function(){
                for(var i=0;i<$scope.image_elements.length;i++)
                    {
                    if($scope.image_elements[i].hasClass("loaded")==false)
                        return
                    }
                
                $scope.reflow()
                
                console.log("done loading.")
                $scope.isloading=false
                }
            },
        template:'<gimage src="src" onload="onload" oninit="oninit" ng-repeat="src in images"></gimage>',
        replace:false
        }
    })
