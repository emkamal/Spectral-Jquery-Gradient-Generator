(function($){

 	$.fn.extend({ 
 		
		//pass the options variable to the function
 		spectralGradientGenerator: function(options) {


			//Set the default values, use comma to separate the settings, example:
			var defaults = {
				gradientBoxWidth: 500,
				gradientBoxHeight: 20,
				targetTextArea: ""
			}
			var options =  $.extend(defaults, options);
			
			/* FUNCTIONS */
			/* Element sorter */
				jQuery.fn.sortElements=function(){var a=[].sort;return function(b,c){c=c||function(){return this};var d=this.map(function(){var a=c.call(this),b=a.parentNode,d=b.insertBefore(document.createTextNode(""),a.nextSibling);return function(){if(b===this){throw new Error("You can't sort elements if any one is a descendant of another.")}b.insertBefore(this,d);b.removeChild(d)}});return a.call(this,b).each(function(a){d[a].call(c.call(this))})}}() 
			/* RGB 2 HEX Converter */
				function rgb2hex(rgb){rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);function hex(x) { return ("0" + parseInt(x).toString(16)).slice(-2); }return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);}

    		return this.each(function() {
				var opt = options;
				
				widthRatio = opt.gradientBoxWidth/100;
				
				$(this).css({
					position: 'relative',
					width: opt.gradientBoxWidth,
					height: opt.gradientBoxHeight,
					border: '1px solid #000',
					textAlign: 'center',
					cursor: 'crosshair'
				});
				
				$(this).append('<div class="spectral"><div class="spectrumbox-gradient"></div><div class="gradient-stop-control-area"><ul><li class="gradient-stop ui-draggable" data-id="0" id="gradient-stop-0"><div class="gradient-stop-color"></div><a class="gradient-stop-pos"></a><div class="gradient-stop-pos-form"><input class="gradient-stop-pos-input" type="text" value="0" /><a class="gobutton">go <span class="ui-icon ui-icon-arrowthick-2-e-w"></span></a><a class="closebutton">&times;</a></div><span class="gradient-stop-icon ui-icon ui-icon-triangle-2-e-w"></span></li><li class="gradient-stop gradient-stop-2 ui-draggable" data-id="1" id="gradient-stop-1"><div class="gradient-stop-color"></div><a class="gradient-stop-pos"></a><div class="gradient-stop-pos-form"><input class="gradient-stop-pos-input" type="text" value="0" /><a class="gobutton">go <span class="ui-icon ui-icon-arrowthick-2-e-w"></span></a><a class="closebutton">&times;</a></div><span class="gradient-stop-icon ui-icon ui-icon-triangle-2-e-w"></span></li></ul></div></div><div id="spectral-cssplaceholder">');
				
				$(this).resizable({ maxWidth: opt.gradientBoxWidth, minWidth: opt.gradientBoxWidth, minHeight: opt.gradientBoxHeight });
			
				$(".spectral .gradient-stop-control-area").css("width", opt.gradientBoxWidth+26);
				
				/* All global live event handlers */
				jQuery(document).on("click", ".gradient-stop", function(){ $(this).siblings().find(".gradient-stop-pos-form").hide(); });
				jQuery(document).on("click", ".gradient-stop-pos", function(){ 
					$(this).siblings(".gradient-stop-pos-form").show(); 
				});
				jQuery(document).on("click", ".gradient-stop-pos-form .closebutton", function(){ $(this).parent().hide(); });
				jQuery(document).on("click", ".gobutton", function(){ 
					var inputval = parseInt($(this).siblings(".gradient-stop-pos-input").val());
					if(inputval >= 0 && inputval <= 100){ $(this).parent().parent().css("left", inputval*widthRatio ); } else { $(this).effect("highlight"); }
					$(this).parent().siblings(".gradient-stop-pos").html(inputval);
				});
				jQuery(document).on("keypress", ".gradient-stop-pos-input", function(e){ 
					if(e.which == 13){
						var inputval = parseInt($(this).val());
						if(inputval >= 0 && inputval <= 100){ $(this).parent().parent().css("left", inputval*widthRatio ); } else { $(this).effect("highlight"); }
						$(this).parent().siblings(".gradient-stop-pos").html(inputval);
						cssWrite();
					}
				});
				jQuery(document).on("keyup", ".gradient-stop-pos-input", function(){ 
					var inputval = parseInt($(this).val());
					var currentval = parseInt($(this).parent().siblings(".gradient-stop-pos").html());
					var arrow = $(this).siblings().children("span")
					arrow.removeClass();

					if(inputval == currentval ){ arrow.addClass("ui-icon ui-icon-arrowthick-2-e-w"); }
					else if(inputval >= 0 && inputval < currentval ){ arrow.addClass("ui-icon ui-icon-arrowthickstop-1-w"); }
					else if(inputval <= 100 && inputval > currentval ){ arrow.addClass("ui-icon ui-icon-arrowthickstop-1-e"); }
					else{ arrow.addClass("ui-icon ui-icon-alert"); $(this).effect("highlight"); }
				});
				jQuery(document).on("dragcreate", ".gradient-stop", function(){
					$(this).children(".gradient-stop-pos").html(Math.ceil( $(this).position().left/widthRatio ));
					$(this).find(".gradient-stop-pos-input").val(Math.ceil( $(this).position().left/widthRatio ));
					cssWrite();
				});
				/* Color picker activator */
				jQuery(document).on("hover", ".gradient-stop-color", function(){ 
					var abc = $(this);
					abc.ColorPicker({
						color: rgb2hex( abc.css("background-color")),
						onShow: function (colpkr) {
							$(colpkr).fadeIn(500);
							return false;
						},
						onHide: function (colpkr) {
							$(colpkr).fadeOut(500);
							return false;
						},
						onChange: function (hsb, hex, rgb) {
							abc.css('backgroundColor', '#'+hex);
							cssWrite();
						}
					});
				});
				
				/* Make color stop draggable */
				var draggableOptions = {
					axis: "x", containment: "parent",
					drag: function(event, ui){
						$(this).children(".gradient-stop-pos").html(Math.ceil( ui.position.left/widthRatio ));
						$(this).find(".gradient-stop-pos-input").val(Math.ceil( ui.position.left/widthRatio ));
						
						var parentOffset = $(this).offset(); 
						var relX = event.pageX - parentOffset.left;
						var relY = event.pageY - parentOffset.top;
						$("#placeholder").html("relX: "+relX+"   relY: "+relY);
						
						if(relY > 70 && $(".gradient-stop").length > 2 ){ 
							$(this).css( 'opacity', 0.75 ) ;
							if(relY > 80){ $(this).css( 'opacity', 0.5 ) }
							if(relY > 90){ $(this).css( 'opacity', 0.25 ) }
							if(relY > 100){ $(this).remove(); cssWrite(); }
						}	
						else{ $(this).css("opacity", 1) }
						cssWrite();
					},
					stop: function(event, ui){
						var parentOffset = $(this).offset(); 
						var relX = event.pageX - parentOffset.left;
						var relY = event.pageY - parentOffset.top;
						$("#placeholder").html("relX: "+relX+"   relY: "+relY);
						
						if(relY < 100){ 
							$(this).css( 'opacity', 1 ) ;
							if(relY > 100){ $(this).remove(); cssWrite(); }
						}	
						else{ $(this).css("opacity", 1) }
					}
				}
				$(".gradient-stop").draggable(draggableOptions);
				
				/* Create new color stop by clicking on the spectrum box */
				var gradIndex = 2;
				jQuery(document).on("click", ".spectrumbox-gradient", function(e){
					var parentOffset = $(this).offset(); 
					var relX = e.pageX - parentOffset.left;
					var stopLoc = ""; var i = 0;
					var stopLocDistance = 0;
					var shortestDistance = opt.gradientBoxWidth;
					var stopClone = "empty";
					
					$(".gradient-stop").each(function(){
						stopLocDistance = relX - $(this).position().left;
						if(stopLocDistance < 0 ){ stopLocDistance *= -1; }
						if(shortestDistance > stopLocDistance){ 
							shortestDistance = stopLocDistance;
							stopClone = $(this).clone();
						}
						stopClone.attr("id", "gradient-stop-"+gradIndex);
						stopClone.attr("data-id", gradIndex);
						stopClone.children(".gradient-stop-pos").html(Math.ceil( relX/widthRatio ));
						stopClone.find(".gradient-stop-pos-input").val(Math.ceil( relX/widthRatio ));
						stopClone.css("left", relX);
						
						i++;
					});
					gradIndex++;
					stopClone.draggable(draggableOptions);
					$(".gradient-stop-control-area ul").append(stopClone);
					
					cssWrite();
				});
				
				/* CSS Writer */
				function cssWrite(){
					cssFullText = "";
					cssWrapper = "<div class='cssWrapper'>";
					cssLineWrapper = "<div class='cssLineWrapper'>"; 
					cssWrapperEnd = cssLineWrapperEnd = "</div>";
					cssOpenBracket = "<span class='symbol'>(</span>";
					cssCloseBracket = "<span class='symbol'>)</span>";
					cssComma = "<span class='symbol'>,</span>";
					cssSemicolon = "<span class='symbol'>;</span>";
					cssPercent = "<span class='symbol'>%</span>";
					cssPrefix = "<span class='vendorPrefix'></span>";
					
					cssAttribute = "<span class='cssAttribute'>background</span><span class='symbol'>:</span> ";
					cssPieAttribute = "<span class='cssAttribute cssPieAttribute'><span class='vendorPrefix'>-pie-</span>background</span>: ";
					cssAttributeValue = "<span class='cssAttributeValue'>"; cssAttributeValueEnd = "</span>"

					if(jQuery.browser.mozilla) { vendor = "moz"; }
					else if(jQuery.browser.msie) { vendor = "default"; }
					else if(jQuery.browser.opera) { vendor = "o"; }
					else if(jQuery.browser.webkit || jQuery.browser.safari) { vendor = "webkit"; }
					else{ vendor = "default"; }
					
					cssGradientType = "<span class='cssGradientType'>linear-gradient</span>";
					cssOrientation = "<span class='cssOrientation'>left</span>";
					
					cssStopValues = "<span class='cssStopValues'></span>";
					
					if($("#spectral-cssplaceholder").html() == ""){
						cssFullText += cssWrapper;
						
						cssPreLine = cssAttribute + cssAttributeValue;
						cssPostLine = cssGradientType + cssOpenBracket + cssOrientation + cssComma + " " + cssStopValues + cssCloseBracket + cssAttributeValueEnd + cssSemicolon;
						
						cssFullText += "<div class='cssLineWrapper' id='cssLineWrapper-webkit' data-vendor='webkit'>" + cssPreLine + "<span class='vendorPrefix'>-webkit-</span>" + cssPostLine + "</div>";
						cssFullText += "<div class='cssLineWrapper' id='cssLineWrapper-moz' data-vendor='moz'>" + cssPreLine + "<span class='vendorPrefix'>-moz-</span>" + cssPostLine + "</div>";
						cssFullText += "<div class='cssLineWrapper' id='cssLineWrapper-o' data-vendor='o'>" + cssPreLine + "<span class='vendorPrefix'>-o-</span>" + cssPostLine + "</div>";
						cssFullText += "<div class='cssLineWrapper' id='cssLineWrapper-msie' data-vendor='ms'>" + cssPreLine + "<span class='vendorPrefix'>-ms-</span>" + cssPostLine + "</div>";
						cssFullText += "<div class='cssLineWrapper' id='cssLineWrapper-default' data-vendor='default'>" + cssPreLine + "<span class='vendorPrefix'></span>" + cssPostLine + "</div>";
						
						cssFullText += cssWrapperEnd;
						
						$("#spectral-cssplaceholder").html(cssFullText);
					}
					
					$(".gradient-stop").each(function(){
						stopColor = $(this).children(".gradient-stop-color").css("background-color");
						stopLoc = Math.ceil( $(this).position().left/widthRatio );
						
						cssStopColor = "<span class='cssColor' id='cssColor"+$(this).attr("data-id")+"'>"+stopColor+"</span>";
						cssStopLoc = "<span class='cssPosition' id='cssPos"+$(this).attr("data-id")+"'>"+stopLoc+"</span>" + cssPercent;
						
						cssStopValue = "<span class='cssStopValue' id='cssStopValue"+$(this).attr("data-id")+"' data-id='"+$(this).attr("data-id")+"' data-pos='"+stopLoc+"'>" + cssStopColor + " " + cssStopLoc + ", </span>";
						
						if($("#cssStopValue"+$(this).attr("data-id")).length == 0){ 
							$(".cssStopValues").append(cssStopValue); 
						}
						
						if($("#cssColor"+$(this).attr("data-id")).length){ $(".cssLineWrapper").find("#cssColor"+$(this).attr("data-id")).html(stopColor); }
						if($("#cssPos"+$(this).attr("data-id")).length){ $(".cssLineWrapper").find("#cssPos"+$(this).attr("data-id")).html(stopLoc); }
						if($("#cssStopValue"+$(this).attr("data-id")).length){ 
							$(".cssLineWrapper").find("#cssStopValue"+$(this).attr("data-id")).html(cssStopColor + " " + cssStopLoc + ", "); 
							$(".cssLineWrapper").find("#cssStopValue"+$(this).attr("data-id")).attr("data-pos", stopLoc); 
						}
					});
					
					$(".cssStopValue").each(function(){
						if($("#gradient-stop-"+$(this).attr("data-id")).length == 0){ $(this).remove(); }
					});
					
					if(opt.includePie){
						pieClone = $("#cssLineWrapper-default").clone();
						pieClone.attr("id", "cssLineWrapper-pie");
						pieClone.children('.cssAttribute').prepend("-pie-");
						if($("#cssLineWrapper-pie").length == 0){ $("#cssLineWrapper-default").before(pieClone); }
					}
					
					webkitClone = $("#cssLineWrapper-webkit").clone();
					webkitClone.attr("id", "cssLineWrapper-oldwebkit");
					webkitClone.find('.cssGradientType').html("gradient");
					webkitClone.find('.cssOrientation').html("linear, 0% 50%, 100% 50%");
					if($("#cssLineWrapper-oldwebkit").length == 0){ $("#cssLineWrapper-webkit").before(webkitClone); }
					$("#cssLineWrapper-oldwebkit").find('.cssStopValue').each(function(){
						thisColor = $(this).children(".cssColor").html();
						thisPosition = $(this).children(".cssPosition").html();
						$(this).html("");
						
						if($("oldWebKit"+$(this).attr("id")).length == 0){
							$(this).prepend("<span class='oldwebkitcolorstop'>color-stop</span>("+thisPosition+"%, "+thisColor + "), ");
						}
						$(this).addClass("oldWebKit"+$(this).attr("id"));
					});
					
					$(".cssLineWrapper").each(function(){
						$(this).find(".cssStopValue").sortElements(function(a, b){
							return parseInt($(a).attr("data-pos")) > parseInt($(b).attr("data-pos")) ? 1 : -1;
						});
						
						$(this).find(".cssStopValue").last().html( $(this).find(".cssStopValue").last().html().substring(0, $(this).find(".cssStopValue").last().html().length-2) );
					});
					
					$(".spectrumbox-gradient").css("background", $("#cssLineWrapper-"+vendor).children(".cssAttributeValue").text());
					$("#"+opt.targetTextArea).html($(".cssWrapper").text());
				}
				
    		});
    	}
	});
	
})(jQuery);