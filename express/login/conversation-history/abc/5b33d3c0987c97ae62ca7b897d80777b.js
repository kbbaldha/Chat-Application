var DEToolsClient = (function(options){
    'use strict';

    var client = {

          toolData : {
                1: {
                    toolId  : 1,
                    longKey : "CalculatorTraditional",
                    longName: "Calculator",
                    toolContainer: "modal-tool-1",
                    initialState: null
                },
                2: {
                    toolId  : 1,
                    longKey : "CalculatorScientific",
                    longName: "Scientific Calculator",
                    toolContainer: "modal-tool-1",
                    initialState: {"ndefaultView":2}
                },
                3: {
                    toolId  : 4,
                    longKey : "CalculatorGraphing",
                    longName: "Graphing Calculator",
                    toolContainer: "modal-tool-4",
                    initialState: null
                },
                4: {
                    toolId  : 7,
                    longKey : "WhiteBoardAnnotation",
                    longName: "Whiteboard",
                    toolContainer: "modal-tool-7",
                    initialState: null
                },
                5: {
                    toolId  : 8,
                    longKey : "DynamicGeometryTool",
                    longName: "Geometry",
                    toolContainer: "modal-tool-8",
                    initialState: null
                },
                6: {
                    toolId  : 2,
                    longKey : "UnitConverter",
                    longName: "Unit Converter",
                    toolContainer: "modal-tool-2",
                    initialState: null
                },
                7: {
                    toolId  : 3,
                    longKey : "ComputerAlgebraSystem",
                    longName: "Equation Solver",
                    toolContainer: "modal-tool-3",
                    initialState: null
                },
                8: {
                    toolId  : 6,
                    longKey : "MatrixTool",
                    longName: "Matrix Solver",
                    toolContainer: "modal-tool-6",
                    initialState: null
                }

            },

            api : {
                saveImage             : "/api:images/createFromBase64",
                retrieveToolSaveState : "/api:state/find",
                saveToolState         : "/api:state/save"
            },


        /**
         Init the Tools engine
         @method init
         @param options.basePath {String} The basePath of the engine. Engine dependencies are relative to this path.
         @param options.strPathToCommon {String} The path of the common files.
         @param options.success {function} The callback function to be called when engine initialization succeeds.
         @param options.error {function} The callback function to be called in case of error during engine initialization
         @param options.complete {function} The callback function called irrespective of error or success of engine initialization. This function is called after the `success` or `error` callbacks.
         @return {boolian}
         */
        init: function(options) {
            // if( client.isInitialized() === false ){
            var params = {
                onSuccess : client.initSuccess,
                onError   : client.initError,
                onComplete: client.initComplete,
                basePath : "/static/",
				minify:false,
                strPathToCommon: ""
            }
            $.extend(true, params, options);
            // init the engine and coach mode on call back
            window.DETools = new Tools(params);
            // } else {
            // Else just go to mode.engineLoadSuccess
            //    client.initSuccess();
            // }
            return;
        },
            initSuccess: function(callbackData){
                //console.log("DEToolsClient.initSuccess");

                return;
            },
            initError: function(callbackData){
                //console.log("DEToolsClient.initError");
                return;
            },
            initComplete: function(callbackData){
                //console.log("DEToolsClient.initComplete");
                return;
            },

            getToolData: function(){
                return client.toolData;
            },

            loadTool: function(options) {
                // adding spinner
                $.de.loading($('body'), {
                    left: ($(window).width() / 2) - 20,
                    top: $('#techbook').offset().top + 2,
                    color: '#978ee4'
                });
                //console.log("DEToolsClient.loadTool");
                var params = {
                    onSuccess  : client.loadToolSuccess,
                    onError    : client.loadToolError,
                    onComplete : client.loadToolComplete
                };
                $.extend(true, params, options);
                DETools.loadTool(params);
                return;
            },
            loadToolSuccess: function(callbackData) {

                // removing spinner
                $.de.loadingComplete($('body'));
                client.centerContainer( callbackData );
                return;
            },
            loadToolError: function(callbackData){
                //console.log( "DEToolsClient.loadToolError");
                return;
            },
            loadToolComplete: function(callbackData){
                //console.log( "DEToolsClient.loadToolComplete");
                return;
            },

            unloadTool: function(options){
                //console.log( "DEToolsClient.unloadTool");
                var params = {
                    success  : client.unloadToolSuccess,
                    error    : client.unloadToolError,
                    complete : client.unloadToolComplete,
                    callbackData: {
                    }
                };
                $.extend(true, params, options);
                DETools.unloadTool(params);
                return;
            },
            unloadToolSuccess: function(callbackData){
                //console.log( "DEToolsClient.unloadToolSuccess");
                return;
            },
            unloadToolError: function(callbackData){
                //console.log( "DEToolsClient.unloadToolError");
                return;
            },
            unloadToolComplete: function(callbackData){
                //console.log( "DEToolsClient.unloadToolComplete");
                return;
            },

            closeTool: function(options){

                var tool = client.getToolById(options.toolId);
                client.unloadTool(options);
                $('#'+tool.toolContainer).remove();

                return;
            },

            saveToolState: function(options){
                //console.log("DEToolsClient.saveToolState");
                var params = {
                    url      : client.api.saveToolState,
                    success  : client.saveToolStateSuccess,
                    error    : client.saveToolStateError,
                    complete : client.saveToolStateComplete,
                    data    : {
                        toolState: v
                    },
                    callbackData: {
                        toolGuid: v,
                        action: someAction
                    }
                };
                $.extend(true, params, options);
                de.AjaxHelper.AjaxRequest(params);
                return;
            },
            saveToolStateSuccess: function(callbackData){
                //console.log( "DEToolsClient.saveToolStateSuccess");
                return;
            },
            saveToolStateError: function(callbackData){
                //console.log( "DEToolsClient.saveToolStateError");
                return;
            },
            saveToolStateComplete: function(callbackData){
                //console.log( "DEToolsClient.saveToolStateComplete");
                return;
            },

            retrieveToolSaveState: function(options){
                //console.log("DEToolsClient.retrieveToolSaveState");
                // TODO method to update UI
                var params = {
                    url      : client.api.retrieveToolSaveState,
                    success  : client.retrieveToolSaveStateSuccess,
                    error    : client.retrieveToolSaveStateError,
                    complete : client.retrieveToolSaveStateComplete,
                    data    : {
                        toolState: v
                    },
                    callbackData: {
                        toolGuid: v,
                        action: someAction
                    }
                };
                $.extend(true, params, options);
                de.AjaxHelper.AjaxRequest(params);
                return;
            },
            retrieveToolSaveStateSuccess: function(callbackData){
                //console.log( "DEToolsClient.retrieveToolSaveStateSuccess");
                return;
            },
            retrieveToolSaveStateError: function(callbackData){
                //console.log( "DEToolsClient.retrieveToolSaveStateError");
                return;
            },
            retrieveToolSaveStateComplete: function(callbackData){
                //console.log( "DEToolsClient.retrieveToolSaveStateComplete");
                return;
            },

            saveImage: function(options){

               $("body").append("<form id=\"download-form\" method=\"POST\" action=\""+client.api.saveImage+"\">"+
                       "<input type=\"hidden\" name=\"content\" value=\""+options.data.content+"\">"+
                       "<input type=\"hidden\" name=\"name\" value=\""+options.data.name+"\">"+
                       "<input type=\"submit\">"+
                       "</form>");
               $("#download-form")
                   .submit()
                   .remove();

                return;
            },

            renderMenu: function(options){
               // console.log("renderMenu");

                var trigger = $(options.container),
                    target  = 'menu-tools',
                    data = DEToolsClient.getToolData();

                //console.log(trigger.children('#' + target).length);

                if( trigger.children('#' + target).length === 0 ){

                    trigger.append('<div id="'+target+'"></div>');

                    var options = {
                        context  : {
                            TOOLS: data
                        },
                        template : 'menu-math-tools',
                        target   :  '#'+target,
                        type     : 'prepend'
                    };

                    UIHandlebarsHelper.loadHandlebarsTemplate(options);

                    /*temporarily make the Equation Solver disabled*/
                    $('.tool-3').on('click', function(){
                        return false;
                    });

                    $('.loadTool:not(.tool-3)').on('click', function(e){

                        var self = $(this),
                            toolId = self.attr("data-tool-id"),
                            toolContainer = self.attr("data-target")
                            options = {
                                modalId: toolContainer,
                                objToolData: {
                                    "toolId": toolId,
                                    "strBasePath": "",
                                    "containerId": toolContainer+"-body",
                                    "callbackData" : {
                                        toolId: toolId
                                    }
                                }
                            };

                        if( self.attr("data-view") !== "" ){
							options.objToolData.initialState = {"ndefaultView":Number(self.attr("data-view"))};
                            //options.objToolData.ndefaultView = self.attr("data-view");
                        }

                        client.renderTool(options);

                    });

                } else {

                	$('#'+ target).toggle();

				}

                return;
            },

            getToolById: function(id){
                var item;
                $.each(client.toolData, function(idx, value){
                    if(id == value.toolId) item = value;
                    return;
                });
                return item;
            },

            centerContainer: function(callbackData){
                var container = $("div#"+callbackData[0].modalId+".tool-container"),
                    left = ( $(window).width() /2) - ( container.width() / 2),
                    top = ( $(window).height() /2) - ( container.height() / 2) ; // * 0.39; // Add an offset the height so it shows at eye level

                container.css("top", top+"px").css("left", left+"px");
            },

            renderTool: function(options){

                 var toolId = options.objToolData.toolId;

                 if( $.find( "#"+options.modalId).length < 1 ){

                     options.objToolData.callbackData = {
                         toolId: toolId,
                         modalId: options.modalId
                     };

                     $('#container').append('<div id=\"'+options.objToolData.callbackData.modalId+'\" data-id=\"'+
                         toolId+'\" tabindex=\"-1\" data-backdrop=\"false\" data-keyboard=\"false"class=\"tool-container tools-wrapper\"></div>');

                     var container = $('#'+options.objToolData.callbackData.modalId);
                     container.draggable({
                         handle: '.modal-tool-' + toolId + '-title',
                         stack : '.tools-wrapper',
                         containment: 'document'
                     });

                    UIHandlebarsHelper.loadHandlebarsTemplate({
                        context  : {
                            ID: options.modalId,
                            TOOLID: toolId
                        },
                        template : 'modal-math-tools',
                        target   :  '#'+options.objToolData.callbackData.modalId,
                        type     : 'append'
                    });

                    //console.log(options.objToolData);

                    DEToolsClient.loadTool(options.objToolData);



                 }

            }

        }

    return client;

})();

$(function() {
    DEToolsClient.init();
});