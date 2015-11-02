(function() {
  'use strict';

  var BeforeAfter = function(args){
    var containerHeight;
    var containerWidth;
    var imageMask;
    var imageBackground;
    var maskWrapper;
    var backgroundWrapper;
    var mask;
    var background;
    var container;
    var wrapperElement;
    var options = {
      leftgap: 20,
      rightgap: 20,
      reveal: 0.5,
      button:true,
      responsive:true,
    };
    var init = function(){
      options =  extendOptions({}, options, args.options);
      container = args.el;
      imageMask = container.getElementsByClassName('js-image-mask')[0];
      imageBackground = container.getElementsByClassName('js-image-background')[0];
      containerWidth = imageMask.width;
      containerHeight = imageMask.height;
      imageBackground.style.display = 'none';
      imageMask.style.display = 'none';
      addEvents();
      wrapperElement = createWrapper();
      styleWrapper(wrapperElement, args.options);
      container.appendChild(wrapperElement);
      maskWrapper.style.width=options.reveal*100+'%';
      backgroundWrapper.style.width=(100-(options.reveal*100))+'%';
      handleResize();
    }
    var styleWrapper = function(element,options){
     var skew = options.skew|undefined;
     var border = options.border;
     var transition = options.transition;
     if(skew){
      styleWithVendorPrefixes('transform','skew('+skew+'deg)',mask);
      styleWithVendorPrefixes('transform','skew('+skew+'deg)',background);
      styleWithVendorPrefixes('transform','skew('+-skew+'deg)',maskWrapper);
      styleWithVendorPrefixes('transform','skew('+-skew+'deg)',backgroundWrapper);
    }
    if(transition){
      styleWithVendorPrefixes('transition', transition,mask);
      styleWithVendorPrefixes('transition', transition,background);
      styleWithVendorPrefixes('transition', transition,maskWrapper);
      styleWithVendorPrefixes('transition', transition,backgroundWrapper);
    }
    if(border){
      maskWrapper.style['border-right']= border;
    }
  };

  var styleWithVendorPrefixes=function(styleProperty, styleValue, element){
   var prefixes = ['-webkit','-moz','-ms',''];
   for(var i =0; i<prefixes.length;i++){
    var prefix = prefixes[i];
    element.style[prefix+styleProperty]=styleValue;
  }
};

var extendOptions = function(out) {
  out = out || {};
  for (var i = 1; i < arguments.length; i++) {
    var obj = arguments[i];
    if (!obj)
      continue;
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        out[key] = obj[key];
      }
    }
  }
  return out;
};
var getMousePosition = function(event){
  var tempX,tempY;
  if(event.touches!==undefined){
     if(event.originalEvent.touches.length == 1){ 
          var touch = event.originalEvent.touches[0];
          var node = touch.target; 
          node.style.position = 'absolute';
          tempX = touch.pageX;
          tempY = touch.pageY;
      return[tempX,tempY];
      }
  }
  event = event || window.event;
  var IE = document.all ? true : false;
  if (IE) {
    tempX = event.clientX + document.body.scrollLeft;
    tempY = event.clientY + document.body.scrollTop;
  }
  else { 
    tempX = event.pageX;
    tempY = event.pageY;
  }
  return[tempX,tempY];
};


var createWrapper = function(){
 var wrapperElement = document.createElement('div');
 wrapperElement.className = 'blueprint-wrapper';
 wrapperElement.style.height=containerHeight+'px';
 wrapperElement.style.width=containerWidth+'px';
 wrapperElement.style.height=containerHeight;

 maskWrapper = document.createElement('div');
 maskWrapper.className='ba-mask-wrapper';
 maskWrapper.style.height=containerHeight+'px';
 maskWrapper.style.width=containerWidth+'px';

 mask = document.createElement('div');
 mask.className='ba-mask';
 mask.style.height=containerHeight+'px';
 mask.style.width=containerWidth+'px';
 mask.style['background-size']= containerWidth+'px '+containerHeight+'px';
 mask.style.backgroundImage= 'url(' + imageMask.src + ')';

 maskWrapper.appendChild(mask);


 backgroundWrapper = document.createElement('div');
 backgroundWrapper.style.width=containerWidth+'px';
 backgroundWrapper.style.height=containerHeight+'px';
 backgroundWrapper.className='ba-bg-wrapper';

 background = document.createElement('div');
 background.className='ba-bg';
 background.style.width=containerWidth+'px';
 background.style.height=containerHeight+'px';
 background.style['background-size']= containerWidth+'px '+containerHeight+'px';
 background.style.backgroundImage= 'url(' + imageBackground.src + ')';
 backgroundWrapper.appendChild(background);

 wrapperElement.appendChild(maskWrapper);
 wrapperElement.appendChild(backgroundWrapper);

 return wrapperElement;
};

var handleMouseMove=function(event){
  var posImg =container.getBoundingClientRect().left + document.body.scrollLeft;
  var posMouse = getMousePosition(event); 
  var newWidth = posMouse[0]-posImg;
  if(options.button||!options.button){
    if (newWidth > options.leftgap && newWidth < (containerWidth - options.rightgap)) { 
      var percentage = (newWidth/containerWidth)*100;
      maskWrapper.style.width=percentage+'%';
      backgroundWrapper.style.width=(100-percentage)+'%';
    }
  }
};
var handleResize= function(){
  imageMask.style.display = 'block';
  containerWidth = imageMask.offsetWidth;
  containerHeight = imageMask.offsetHeight;
  imageMask.style.display = 'none';

  wrapperElement.style.width=containerWidth+'px';

  wrapperElement.style.height=containerHeight+'px';
  maskWrapper.style.height=containerHeight+'px';
  backgroundWrapper.style.height=containerHeight+'px';
  mask.style.height=containerHeight+'px';
  mask.style.width=containerWidth+'px';
  background.style.width=containerWidth+'px';
  background.style.height=containerHeight+'px';
  mask.style['background-size']= containerWidth+'px '+containerHeight+'px';
  background.style['background-size']= containerWidth+'px '+containerHeight+'px';

  backgroundWrapper.style.width=containerWidth/2+'px';
  maskWrapper.style.width=containerWidth/2+'px';
};

var addEvents = function(){
  container.addEventListener('mousemove', function(event){
    handleMouseMove(event);
  });
  container.addEventListener('touchmove', function(event){
    handleMouseMove(event);
  });  
  if(options.responsive){
   window.addEventListener('resize', function(){
    handleResize();
  });
 }
};
init();
};
if (typeof define === 'function' && define.amd) {
  define('beforeafter',[],function () {
    return BeforeAfter;
  });
}
else if (typeof module === 'object' && module.exports){
  module.exports = BeforeAfter;
}
else {
  window.BeforeAfter = BeforeAfter;
}
})();