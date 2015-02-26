(function () {
    'use strict';

    /**
    * Class for Overview Tab ,  contains properties and methods of Overview tab
    * @class Overview
    * @module CompoundFishtank
    * @namespace MathInteractives.Interactivities.CompoundFishtank.Views
    * @extends MathInteractives.Common.Player.Views.Base
    * @type Object
    * @constructor
    */
    MathInteractives.Interactivities.CompoundFishtank.Views.CatchFish = MathInteractives.Common.Player.Views.Base.extend({

        /**
        * Stores filepaths for resources , value set on initialize
        *   
        * @property filePath 
        * @type Object
        * @default null
        **/
        filePath: null,

        /**
        * Stores manager instance for using common level functions , value set on initialize
        *
        * @property manager 
        * @type Object
        * @default null
        **/
        manager: null,

        /**
        * Stores reference to player , value set on initialize
        * 
        * @property player 
        * @type Object
        * @default null
        **/
        player: null,

        /**
        * id-prefix of the interactive , value set on initialize
        * 
        * @property idPrefix 
        * @type String
        * @default null
        **/
        idPrefix: null,
        /**
        * catch fish model class reference from main model
        * 
        * @property catchFishTabModel 
        * @type Object
        * @default null
        **/
        catchFishTabModel: null,
        /**
        * container for fish and fishtank as idPrefix
        * 
        * @property container
        * @type String
        * @default null
        **/
        container: null,
        /**
        * contains no. of fishes to be catch by user
        * 
        * @property noOfFishesToCatch
        * @type Number
        * @default null
        **/
        noOfFishesToCatch: null,
        /**
        * view of tool tip for left input box
        * 
        * @property tooltipViewLeft
        * @type String
        * @default null
        **/
        tooltipViewLeft: null,
        /**
        * view of tool tip for both input boxes
        * 
        * @property tooltipViewBoth
        * @type String
        * @default null
        **/
        tooltipViewBoth: null,
        /**
        * view of tool tip for Right input box
        * 
        * @property tooltipViewRight
        * @type String
        * @default null
        **/
        tooltipViewRight: null,
        /**
        * flag to check game played by user or not
        * 
        * @property isGamePlayed
        * @type Boolean
        * @default null
        **/
        isGamePlayed: false,

        /**
       * Direction text object
       * @property catchFishDirectionText
       * @type Object
       * @default null
       **/
        catchFishDirectionText: null,

        /**
        * Object of drop down views & models 
        * @property dropDownObject
        * @type Object
        * @default null
        **/
        dropDownObject: null,

        /**
        * container for fish and fishtank as idPrefix
        * 
        * @property container
        * @type String
        * @default null
        **/
        isShowPopUp: true,

        /**
        * Initializes the overview tab
        *
        * @method initialize
        * @public 
        **/
        initialize: function () {
            this.filePath = this.model.get('path');
            this.manager = this.model.get('manager');
            this.player = this.model.get('player');
            this.idPrefix = this.player.getIDPrefix();
            this.catchFishTabModel = this.model.get('catchFishTab');
            this.loadScreen('catchfish-tab');
            this.loadScreen('catchfish-direction');

            this.container = MathInteractives.Interactivities.CompoundFishtank.Views.CatchFish.CONTAINER_PREFIX;
            this.render();

            this._setHelpElements();

            var isFirstLoad = true;

            this.player.bindTabChange(function () {


                if (this.catchFishDirectionText === null) {

                    this.catchFishDirectionText = MathInteractives.global.Theme2.DirectionText.generateDirectionText({
                        //screenId: 'catchfish-direction',
                        text: this.getMessage('catchfish-inequality-notification', 0, this.noOfFishesToCatch),
                        accText: this.getAccMessage('catchfish-inequality-notification', 0, this.noOfFishesToCatch),
                        idPrefix: this.idPrefix,
                        containerId: this.idPrefix + 'inequality-notification',
                        manager: this.manager,
                        path: this.filePath,
                        player: this.player,
                        textColor: '#ffffff',
                        containmentBGcolor: 'rgba(0,0,0,.341)',
                        showButton: true,
                        buttonText: this.getMessage('catchfish-inequality-notification', 1),
                        clickCallback: {
                            fnc: this.catchfishTryAnother,
                            scope: this
                        }
                    });


                }
                if (isFirstLoad) {

                    if (this.catchFishTabModel.getIsFishCatched()) {
                        var skipAnimation = true;
                        this.castNet(skipAnimation);
                    }
                    isFirstLoad = false;

                }
            }, this, 2);

        },

        /**
        * Renders the view of overview tab
        *
        * @method initialize
        * @public 
        **/
        render: function () {
            this.setAllImages();
            this.renderElements();
            this.renderScaleNumber();
            // create dropdowns
            this.generateTab3Dropdowns();
        },

        /**
        * Renders all UI elements
        *
        * @method renderElements
        * @public 
        **/
        renderElements: function renderElements() {
            var self = this,
                variable1 = this.catchFishTabModel.getEqNumber1(),
                variable2 = this.catchFishTabModel.getEqNumber2();

            if (variable1 === null) {
                variable1 = '';
            }
            else {
                variable1 = parseInt(variable1, 10);
            }
            if (variable2 === null) {
                variable2 = '';
            }
            else {
                variable2 = parseInt(variable2, 10);
            }

            this.$('#' + this.idPrefix + 'right-variable').html(this.getMessage('input-box-variable-text', 0));
            this.$('#' + this.idPrefix + 'variable-1').html(this.getMessage('input-box-variable-text', 0));

            this.leftInputBoxView = MathInteractives.global.Theme2.InputBox.createInputBox({
                containerId: this.idPrefix + 'left-input',
                filePath: this.filePath,
                manager: this.manager,
                player: this.player,
                idPrefix: this.idPrefix,             
                maxCharLength: 2,
                defaultValue: '',
                style: {
                    color: '#ffffff',
                    backgroundColor: 'rgb(61,61,61)',
                    borderColor: '#ffffff'
                },
                customClass:'white-input-box',
                inputType: MathInteractives.Common.Components.Theme2.Views.InputBox.INPUT_TYPE_INTEGER
            });
            this.leftInputBoxView.setCurrentInputValue(variable1);

            this.rightInputBoxView = MathInteractives.global.Theme2.InputBox.createInputBox({
                containerId: this.idPrefix + 'right-input',
                filePath: this.filePath,
                manager: this.manager,
                player: this.player,
                idPrefix: this.idPrefix,               
                maxCharLength: 2,
                defaultValue: '',
                style: {
                    color: '#ffffff',
                    backgroundColor: 'rgb(61,61,61)',
                    borderColor: '#ffffff'
                },
                customClass:'white-input-box',
                inputType: MathInteractives.Common.Components.Theme2.Views.InputBox.INPUT_TYPE_INTEGER
            });
            this.rightInputBoxView.setCurrentInputValue(variable2);

            var leftInputEvent = this.leftInputBoxView.containerId + MathInteractives.Common.Components.Theme2.Views.InputBox.INPUT_EVENT_NAME,
                rightInputEvent = this.rightInputBoxView.containerId + MathInteractives.Common.Components.Theme2.Views.InputBox.INPUT_EVENT_NAME,
                leftKeyPressEvent = this.leftInputBoxView.containerId + MathInteractives.Common.Components.Theme2.Views.InputBox.KEYPRESS_EVENT_NAME,
                rightKeyPressEvent = this.rightInputBoxView.containerId + MathInteractives.Common.Components.Theme2.Views.InputBox.KEYPRESS_EVENT_NAME;


            this.leftInputBoxView.on(leftKeyPressEvent, function (event) {
                var charCode = event.charCode ? event.charCode : event.keyCode;
                if ((self.leftInputBoxView.getCurrentInputValue() !== null && self.leftInputBoxView.getCurrentInputValue() !== undefined && self.leftInputBoxView.getCurrentInputValue() !== '-') && (self.rightInputBoxView.getCurrentInputValue() !== null && self.rightInputBoxView.getCurrentInputValue() !== undefined && self.rightInputBoxView.getCurrentInputValue() !== '-')) {
                    if (charCode == 13) {
                        self.castNetButton.$el.trigger('click');
                    }
                }
            });

            this.rightInputBoxView.on(rightKeyPressEvent, function (event) {
                var charCode = event.charCode ? event.charCode : event.keyCode;
                if ((self.leftInputBoxView.getCurrentInputValue() !== null && self.leftInputBoxView.getCurrentInputValue() !== undefined && self.leftInputBoxView.getCurrentInputValue() !== '-') && (self.rightInputBoxView.getCurrentInputValue() !== null && self.rightInputBoxView.getCurrentInputValue() !== undefined && self.rightInputBoxView.getCurrentInputValue() !== '-')) {
                    if (charCode == 13) {
                        self.castNetButton.$el.trigger('click');
                    }
                }
            });

            this.leftInputBoxView.on(leftInputEvent, function () {

                if ((self.leftInputBoxView.getCurrentInputValue() !== null && self.leftInputBoxView.getCurrentInputValue() !== undefined && self.leftInputBoxView.getCurrentInputValue() !== '-') && (self.rightInputBoxView.getCurrentInputValue() !== null && self.rightInputBoxView.getCurrentInputValue() !== undefined && self.rightInputBoxView.getCurrentInputValue() !== '-')) {
                    self.castNetButton.showButton();
                }
                else {
                    self.castNetButton.hideButton();

                }
                self.hideAllTooltip();

                if (self.leftInputBoxView.getCurrentInputValue() === null && self.rightInputBoxView.getCurrentInputValue() === null) {
                    self.isGamePlayed = false;
                }
                else {
                    self.isGamePlayed = true;
                }

                self.catchFishTabModel.setEqNumber1(self.leftInputBoxView.getCurrentInputValue());
            });

            this.rightInputBoxView.on(rightInputEvent, function () {

                if ((self.leftInputBoxView.getCurrentInputValue() !== null && self.leftInputBoxView.getCurrentInputValue() !== undefined && self.leftInputBoxView.getCurrentInputValue() !== '-') && (self.rightInputBoxView.getCurrentInputValue() !== null && self.rightInputBoxView.getCurrentInputValue() !== undefined && self.rightInputBoxView.getCurrentInputValue() !== '-')) {
                    self.castNetButton.showButton();
                }
                else {
                    self.castNetButton.hideButton();

                }
                self.hideAllTooltip();
                if (self.leftInputBoxView.getCurrentInputValue() === null && self.rightInputBoxView.getCurrentInputValue() === null) {
                    self.isGamePlayed = false;
                }
                else {
                    self.isGamePlayed = true;
                }

                self.catchFishTabModel.setEqNumber2(self.rightInputBoxView.getCurrentInputValue());
            });


            var modelClass = MathInteractives.Interactivities.CompoundFishtank.Models.FishtankData;
            this.noOfFishesToCatch = [this.catchFishTabModel.getFishToCatch()];

            //            this.inputBoxViewVariable1.disableInputBox();
            //            this.inputBoxViewVariable2.disableInputBox();


            this.castNetButton = MathInteractives.global.Theme2.Button.generateButton({
                data: {
                    id: this.idPrefix + 'inequality-btn',
                    text: this.getMessage('inequality-btn-text', 0),
                    type: MathInteractives.global.Theme2.Button.TYPE.TEXT
                },
                path: this.filePath,
                player: this.player
            });

            this.retryButton = MathInteractives.global.Theme2.Button.generateButton({
                data: {
                    id: this.idPrefix + 'retry-btn',
                    text: this.getMessage('inequality-btn-text', 1),
                    type: MathInteractives.global.Theme2.Button.TYPE.TEXT
                },
                path: this.filePath,
                player: this.player
            });

            this.newSolutionButton = MathInteractives.global.Theme2.Button.generateButton({
                data: {
                    id: this.idPrefix + 'new-solution-btn',
                    text: this.getMessage('inequality-btn-text', 2),
                    type: MathInteractives.global.Theme2.Button.TYPE.TEXT
                },
                path: this.filePath,
                player: this.player
            });

            this._renderFishtank();
            this._placeRandomFishes();

            this.castNetButton.$el.off('click').on('click', $.proxy(this.castNet, this));
            this.retryButton.$el.off('click').on('click', $.proxy(this.resetCatchFish, this))
            this.newSolutionButton.$el.off('click').on('click', $.proxy(this.resetCatchFish, this));
            this.retryButton.hideButton();
            this.newSolutionButton.hideButton();

            if (variable1 === '' || variable2 === '') {
                this.castNetButton.hideButton();
            }
            else if (this.catchFishTabModel.getIsFishCatched()) {
                this.castNetButton.hideButton();
                if (this.catchFishTabModel.get('isSuccess')) {
                    this.newSolutionButton.showButton();
                }
                else {
                    this.retryButton.showButton();
                }
            }
        },

        generateTab3Dropdowns: function () {
            var idPrefix, dropdownContainers, self, dropdownOptions;

            self = this;
            idPrefix = this.idPrefix;

            if (this.catchFishTabModel.getDropDownModels().length === 0) {
                dropdownOptions = [
                    {
                        'defaultOptionType': 1,
                        'options': ['>', '<'],
                        'selectedOptionData': '>'
                    },
                    {
                        'defaultOptionType': 1,
                        'options': ['>', '<'],
                        'selectedOptionData': '>'
                    },
                    {
                        'defaultOptionType': 1,
                        'options': ['AND', 'OR'],
                        'selectedOptionData': 'AND'
                    }
                ];
            }
            else {
                dropdownOptions = this.catchFishTabModel.getDropDownModels();
            }


            dropdownContainers = [self.idPrefix + 'left-inequality-wrapper', self.idPrefix + 'right-inequality-wrapper', self.idPrefix + 'conjunction-combo-wrapper'];

            this.dropDownObject = this.generateDropdown(dropdownOptions, dropdownContainers);

            return;
        },

        generateDropdown: function (dropdownOptions, dropdownContainers) {
            var len, self, dropdownModels, dropdownViews,
                returnObject, i;

            len = dropdownContainers.length;
            self = this;
            dropdownModels = [];
            dropdownViews = [];

            for (i = 0; i < len; i++) {
                dropdownModels[i] = new MathInteractives.Common.Components.Theme2.Models.Combobox(dropdownOptions[i]);

                dropdownModels[i].idPrefix = self.idPrefix;
                dropdownModels[i].path = self.path;
                dropdownModels[i].manager = self.manager;
                dropdownModels[i].player = self.player;

                dropdownViews[i] = new MathInteractives.Common.Components.Theme2.Views.Combobox({ el: '#' + dropdownContainers[i], model: dropdownModels[i] });
                dropdownViews[i].selectComboOption(dropdownOptions[i].selectedOptionData, dropdownOptions[i].selectedOptionIndex);
            }
            this.catchFishTabModel.setDropDownModels(dropdownModels);

            returnObject = {
                'models': dropdownModels,
                'views': dropdownViews
            }

            return returnObject;
        },



        /**
        * Calls on click of Try Another button in sort fish tab.
        * @method catchfishTryAnother
        */
        catchfishTryAnother: function catchfishTryAnother() {
            MathInteractives.global.SpeechStream.stopReading();

            if (this.isGamePlayed === false) {
                this.tryAnother();
            }
            else {
                MathInteractives.global.SpeechStream.stopReading();

                this.sortfishTryAnotherView = MathInteractives.global.Theme2.PopUpBox.createPopup({
                    text: this.getMessage('catchfish-try-another-text', 1),
                    accText: this.getMessage('catchfish-try-another-text', 1),
                    title: this.getMessage('catchfish-try-another-text', 0),
                    accTitle: this.getMessage('catchfish-try-another-text', 0),
                    manager: this.manager,
                    player: this.player,
                    path: this.filePath,
                    idPrefix: this.idPrefix,
                    closeCallback: {
                        fnc: this.resetAllPopUpAction,
                        scope: this
                    },
                    buttons: [{
                        id: this.idPrefix + 'yes-btn',
                        text: this.getMessage('catch-fish-confirm-popup-text', 0),
                        response: { isPositive: true, buttonClicked: this.idPrefix + 'yes-btn' }
                    },
                    {
                        id: this.idPrefix + 'cancel-btn',
                        text: this.getMessage('catch-fish-confirm-popup-text', 1),
                        response: { isPositive: false, buttonClicked: this.idPrefix + 'cancel-btn' }
                    }]
                });
            }
        },

        /**
        * get response from confirm popup box.
        * @method resetAllPopUpAction
        */
        resetAllPopUpAction: function resetAllPopUpAction(response) {

            if (response.isPositive) {
                this.tryAnother();
            }

        },


        tryAnother: function tryAnother() {
            this.catchFishTabModel.setFishCollection(new MathInteractives.Interactivities.CompoundFishtank.Models.FishtankData.FishCollection);
            this.catchFishTabModel.setNoOfOppositeFacedFishes(null);
            //this.unloadScreen('catchfish-direction');
            //this.loadScreen('catchfish-direction');

            this.catchFishTabModel.resetFishToCatch();
            this.hideAllTooltip();

            this.$('#' + this.idPrefix + 'catch-fishtank').children().each(function () {
                $(this).html('');
            });

            $(this.$('#' + this.idPrefix + 'line-container').children()[2]).remove();
            this.$('#' + this.idPrefix + 'fish-tank-box').html('');

            this.noOfFishesToCatch = [this.catchFishTabModel.getFishToCatch()];
            this._renderFishtank();
            this._placeRandomFishes();

            this.catchFishTabModel.generateScaleNumbers();
            this.renderScaleNumber();
            this.resetCatchFish();



            var dirMessage = this.getMessage('catchfish-inequality-notification', 0, this.noOfFishesToCatch);
            this.catchFishDirectionText.changeDirectionText(dirMessage,false);
        },

        resetCatchFish: function resetCatchFish() {
            MathInteractives.global.SpeechStream.stopReading();

            this.catchFishTabModel.setIsFishCatched(false);
            this.catchFishTabModel.setDropDownModels([]);

            this.catchFishTabModel.setEqNumber1(null);
            this.catchFishTabModel.setEqNumber2(null);

            this.$el.find('#' + this.idPrefix + 'line-1-wrapper').css({ 'visibility': 'hidden' });
            this.$el.find('#' + this.idPrefix + 'line-2-wrapper').css({ 'visibility': 'hidden' });
            var $fishnet_1 = this.$('#' + this.idPrefix + 'fishnet-1'),
            $fishnet_2 = this.$('#' + this.idPrefix + 'fishnet-2'),
            $fishnet_grid_1 = this.$('#' + this.idPrefix + 'fishnet-grid-1'),
            $fishnet_grid_2 = this.$('#' + this.idPrefix + 'fishnet-grid-2');

            $fishnet_1.css({ 'height': '0px', 'width': '0px' });
            $fishnet_2.css({ 'height': '0px', 'width': '0px' });
            $fishnet_grid_1.css({ 'height': '0px', 'width': '0px' });
            $fishnet_grid_2.css({ 'height': '0px', 'width': '0px' });

            this.hideAllTooltip();
            this.retryButton.hideButton();
            this.newSolutionButton.hideButton();
            this.leftInputBoxView.clearInputBox();
            this.rightInputBoxView.clearInputBox();
            this.rightInputBoxView.enableInputBox();
            this.leftInputBoxView.enableInputBox();

            this.dropDownObject.views[0].resetCombo();
            this.dropDownObject.views[1].resetCombo();
            this.dropDownObject.views[2].resetCombo();

            this.enableComboBox(true);


            this.isGamePlayed = false;
            this.isShowPopUp = true;

        },


        /**
        * Renders drag-drop fishtank.
        *
        * @method _renderFishtank
        * @private
        */
        _renderFishtank: function _renderFishtank() {
            var gridColumns = MathInteractives.Interactivities.CompoundFishtank.Models.FishtankData.GRID_COLUMNS,
                gridRows = MathInteractives.Interactivities.CompoundFishtank.Models.FishtankData.GRID_ROWS,
                templateData,
                grid = [],
                tankHtml,
                rowIndex,
                columnIndex;

            this.$('#' + this.idPrefix + 'fishtank-wrapper').css({
                'background-image': 'url("' + this.filePath.getImagePath('fishtank-images') + '")'
            });

            this.$('#' + this.idPrefix + 'fishtank-bottom').css({
                'background-image': 'url("' + this.filePath.getImagePath('fishtank-images') + '")'
            });

            this.gridColumns = gridColumns;
            this.gridRows = gridRows;

            for (rowIndex = 0; rowIndex < gridRows + 2; rowIndex++) {
                for (columnIndex = 0; columnIndex < gridColumns + 2; columnIndex++) {
                    grid.push({
                        idPrefix: this.idPrefix,
                        container: this.container,
                        elementNo: rowIndex + '-' + columnIndex,
                        gridRow: rowIndex,
                        gridColumn: columnIndex
                    });
                }
            }

            templateData = {
                idPrefix: this.idPrefix,
                container: this.container,
                grid: grid
            };

            tankHtml = MathInteractives.Interactivities.CompoundFishtank.templates.buildFishtank(templateData).trim();
            this.$('#' + this.idPrefix + 'fish-tank-box').html(tankHtml);
        },

        /**
        * places fishes randomly in fishtank.
        *
        * @method _placeRandomFishes
        * @private
        */
        _placeRandomFishes: function _placeRandomFishes() {
            var modelClass = MathInteractives.Interactivities.CompoundFishtank.Models.FishtankData,
                noOfFishes,
                percentOppositeFacedFishes,
                noOfOppositeFacedFishes,    // To get no of fishes opposite faced.
                $fish,
                fishIndex,
                randomFishData,
                fishRowNo,
                fishColumnNo,
                fishShape,
                fishPattern,
                fishColor,
                fishModel;

            this.fishCollection = this.catchFishTabModel.getFishCollection();

            if (this.fishCollection.length === 0) {
                noOfFishes = modelClass.getRandomNumberBetween(modelClass.catchFishModel.MIN_NO_OF_FISHES, modelClass.catchFishModel.MAX_NO_OF_FISHES);

                percentOppositeFacedFishes = (modelClass.getRandomNumberBetween(modelClass.sortFishModel.MIN_PERCENT_OPP_FACED_FISHES / 10, modelClass.sortFishModel.MAX_PERCENT_OPP_FACED_FISHES / 10) * 10);
                noOfOppositeFacedFishes = Math.round((percentOppositeFacedFishes / 100) * noOfFishes);
                this.catchFishTabModel.setNoOfOppositeFacedFishes(noOfOppositeFacedFishes);

                for (fishIndex = 0; fishIndex < noOfFishes; fishIndex++) {
                    $fish = $('<div/>', { id: this.idPrefix + this.container + 'fish-' + fishIndex, class: 'fish' });

                    randomFishData = this._getSpecificRandomFishData();

                    fishRowNo = randomFishData.rowNo;
                    fishColumnNo = randomFishData.colNo;
                    fishShape = randomFishData.shape;
                    fishPattern = randomFishData.pattern;
                    fishColor = randomFishData.color;

                    this.$('#' + this.idPrefix + this.container + 'grid-element-' + fishRowNo + '-' + fishColumnNo).append($fish);

                    //console.log('row col: ' + fishRowNo + '  ' + fishColumnNo);

                    $fish.attr({ 'row': fishRowNo, 'col': fishColumnNo });

                    if (fishIndex >= noOfOppositeFacedFishes) {
                        // flip fish horizontal or different image to show opposite face.
                        $fish.addClass('flip-fish');
                    }

                    $fish.css({ 'margin-left': randomFishData.leftMargin, 'margin-top': randomFishData.topMargin });

                    fishModel = new modelClass.Fish({
                        idPrefix: this.idPrefix,
                        colNo: fishColumnNo,
                        rowNo: fishRowNo,
                        shape: fishShape,
                        pattern: fishPattern,
                        enableHighLight: false,
                        color: fishColor,
                        fishNo: 'catch' + fishIndex,
                        topMargin: randomFishData.topMargin,
                        leftMargin: randomFishData.leftMargin
                    }
                    );

                    this.fishCollection.add(fishModel);
                    var $view = MathInteractives.global.CustomFish.generateCustomFish(fishModel, $fish);
                }
            }
            else {
                for (fishIndex = 0; fishIndex < this.fishCollection.length; fishIndex++) {
                    $fish = $('<div/>', { id: this.idPrefix + this.container + 'fish-' + fishIndex, class: 'fish' });

                    fishModel = this.fishCollection.models[fishIndex];

                    fishRowNo = fishModel.getRowNo();
                    fishColumnNo = fishModel.getColNo();
                    fishShape = fishModel.getShape();
                    fishPattern = fishModel.getPattern();
                    fishColor = fishModel.getColor();
                    noOfOppositeFacedFishes = this.catchFishTabModel.getNoOfOppositeFacedFishes();

                    this.$('#' + this.idPrefix + this.container + 'grid-element-' + fishRowNo + '-' + fishColumnNo).append($fish);

                    //console.log('row col: ' + fishRowNo + '  ' + fishColumnNo);

                    $fish.attr({ 'row': fishRowNo, 'col': fishColumnNo });

                    if (fishIndex >= noOfOppositeFacedFishes) {
                        // flip fish horizontal or different image to show opposite face.
                        $fish.addClass('flip-fish');
                    }

                    $fish.css({ 'margin-left': fishModel.getLeftMargin(), 'margin-top': fishModel.getTopMargin() });

                    var view = MathInteractives.global.CustomFish.generateCustomFish(fishModel, $fish);
                }
            }
        },

        /**
        * returns random fish data specific to the tab's instructions.
        *
        * @method _getSpecificRandomFishData
        * @return {Object} having random properties for fish model with conditions as specified.
        * @private
        */
        _getSpecificRandomFishData: function _getSpecificRandomFishData() {
            var modelClass = MathInteractives.Interactivities.CompoundFishtank.Models.FishtankData,
                randomFishData;

            randomFishData = modelClass.getRandomFishData(this.gridRows + 1, this.gridColumns + 1);

            // To leave 1st row empty for floating fishes and check if any fish is present in repective or its adjacent elements
            if (randomFishData.rowNo === 0
                || randomFishData.colNo === 0
                || this.fishCollection.where({ rowNo: randomFishData.rowNo, colNo: randomFishData.colNo }).length !== 0
                || this.fishCollection.where({ rowNo: randomFishData.rowNo, colNo: randomFishData.colNo + 1 }).length !== 0
                || this.fishCollection.where({ rowNo: randomFishData.rowNo, colNo: randomFishData.colNo - 1 }).length !== 0
                || (randomFishData.rowNo === 4
                    && (randomFishData.colNo === 2
                        || randomFishData.colNo === 3
                        || randomFishData.colNo === 4
                        || randomFishData.colNo === 5
                        || randomFishData.colNo === 14))) {
                randomFishData = this._getSpecificRandomFishData();
            }

            return {
                rowNo: randomFishData.rowNo,
                colNo: randomFishData.colNo,
                shape: randomFishData.shape,
                pattern: randomFishData.pattern,
                color: randomFishData.color,
                leftMargin: randomFishData.leftMargin,
                topMargin: randomFishData.topMargin
            }
        },

        /**
        * Set all images, used in writing inequalities tab
        *
        * @method setAllImages
        **/
        setAllImages: function setAllImages() {
            this.$el.css({
                'background-image': 'url("' + this.filePath.getImagePath('bg-img') + '")'
            });
            this.$('#' + this.idPrefix + 'line-container').css({
                'background-image': 'url("' + this.filePath.getImagePath('fishtank-images') + '")'
            });
        },

        /**
        * It renders scale no.s and dispalys
        *
        * @method renderScaleNumber
        **/
        renderScaleNumber: function renderScaleNumber() {
            var i = null,
            templateData = null,
            numbergrid = [],
            scaleNumbers = [],
            numberlineHtml = null;
            for (i = 0; i < 15; i++) {
                numbergrid.push({
                    idPrefix: this.idPrefix,
                    elementNo: (i + 1)
                });

            }
            templateData = {
                idPrefix: this.idPrefix,
                numbergrid: numbergrid
            };

            numberlineHtml = MathInteractives.Interactivities.CompoundFishtank.templates.numberline(templateData).trim();
            this.$('#' + this.idPrefix + 'line-container').append(numberlineHtml);

            scaleNumbers = this.catchFishTabModel.getScaleNumbers();

            for (i = 0; i < 15; i++) {
                //            if(scaleNumbers[i]<0) {
                //                this.$('#' + this.idPrefix + 'number-grid-element-' + (i + 1)).html(scaleNumbers[i]).css({'margin-left':'-5px'});
                //            }
                //            else{
                //                this.$('#' + this.idPrefix + 'number-grid-element-' + (i + 1)).html(scaleNumbers[i]);
                //                }

                this.$('#' + this.idPrefix + 'number-grid-element-' + (i + 1)).html(scaleNumbers[i]);
            }
        },


        /**
        * Cast net based on equation 
        *
        * @method castNet
        **/
        castNet: function castNet(skipAnimation) {
            MathInteractives.global.SpeechStream.stopReading();

            var firstInput = this.leftInputBoxView.getCurrentInputValue(),
            secondInput = this.rightInputBoxView.getCurrentInputValue(),
            leftInequality = this.dropDownObject.models[0].get('selectedOptionData'),
            rightInequality = this.dropDownObject.models[1].get('selectedOptionData'),
            inequality = this.dropDownObject.models[2].get('selectedOptionData'),
            $fishnet_1 = this.$('#' + this.idPrefix + 'fishnet-1'),
            $fishnet_2 = this.$('#' + this.idPrefix + 'fishnet-2'),

            $fishnet_grid_1 = this.$('#' + this.idPrefix + 'fishnet-grid-1'),
            $fishnet_grid_2 = this.$('#' + this.idPrefix + 'fishnet-grid-2'),
            scaleNumbers = this.catchFishTabModel.getScaleNumbers(),
            startNum = scaleNumbers[0],
            endNum = scaleNumbers[14],
            range = [],
            gridWidth = parseInt(this.$('#' + this.idPrefix + this.container + 'fishtank').css('width').replace('px', '')),
            fishtankWidth = parseInt(this.$('#' + this.idPrefix + 'fishtank-wrapper').css('width').replace('px', '')),
            self = this,
            fishnetMargin = (fishtankWidth - gridWidth) / 2,
            castNetAnimInterval = MathInteractives.Interactivities.CompoundFishtank.Views.CatchFish.CAST_NET_ANIM_INTERVAL,
            fishnetStart = MathInteractives.Interactivities.CompoundFishtank.Views.CatchFish.FISHNET_START;
            
            range[0] = startNum;
            range[1] = endNum;

            $fishnet_grid_1.css({
                'background-image': 'url("' + this.filePath.getImagePath('fishnet') + '")'
            });

            $fishnet_grid_2.css({
                'background-image': 'url("' + this.filePath.getImagePath('fishnet') + '")'
            });

            this.hideAllTooltip();

            this.$el.find('#' + this.idPrefix + 'line-1-wrapper').css({ 'visibility': 'hidden' });
            this.$el.find('#' + this.idPrefix + 'line-2-wrapper').css({ 'visibility': 'hidden' });

            this.catchFishTabModel.setIsFishCatched(true);

            if (skipAnimation === true) {
                this.isShowPopUp = false;
                castNetAnimInterval = 0;
            }

            if (parseInt(firstInput, 10) <= endNum && parseInt(firstInput, 10) >= startNum && parseInt(secondInput, 10) <= endNum && parseInt(secondInput, 10) >= startNum) {

                // Find left condition range points
                var leftRangePoints = [], leftRangeItems = [], rightRangePoints = [], rightRangeItems = [];
                if (leftInequality === '<') {
                    leftRangePoints = [startNum, parseInt(firstInput, 10)];
                }
                else {
                    leftRangePoints = [parseInt(firstInput, 10), endNum];
                }

                // Points included from left condition
                var j = 0;
                for (var i = leftRangePoints[0]; i <= leftRangePoints[1]; i++) {
                    leftRangeItems[j] = i;
                    j++;
                }

                // Find right condition range points
                if (rightInequality === '<') {
                    rightRangePoints = [startNum, parseInt(secondInput, 10)];
                }
                else {
                    rightRangePoints = [parseInt(secondInput, 10), endNum];
                }


                // Points included from right condition
                j = 0;
                for (var i = rightRangePoints[0]; i <= rightRangePoints[1]; i++) {
                    rightRangeItems[j] = i;
                    j++;
                }


                var mergedArray = [], sortedArray = [];
                if (inequality === 'AND') {

                    // Merge left & right array elements & Find common elements & sort common elements array
                    mergedArray = $.merge($.merge([], leftRangeItems), rightRangeItems)
                    sortedArray = this.commonArrayItems(leftRangeItems, rightRangeItems).sort(function (a, b) { return a - b });

                }
                else {
                    // Concat left & right array elements & Find common elements & sort common elements array
                    mergedArray = leftRangeItems.concat(rightRangeItems);
                    mergedArray = this.uniqueArrayItems(mergedArray);
                    sortedArray = mergedArray.sort(function (a, b) { return a - b });
                }

                var blankRange = [], sortArrraylen = sortedArray.length, j = sortedArray[0];
                if (sortArrraylen > 0) {

                    // Find Blank region where net is not required. If there is blank region, blank range array will have 2 elements, which will 
                    // specify start & end number of blank region.
                    blankRange[0] = sortedArray[sortArrraylen - 1];
                    for (var i = 0; i < sortArrraylen; i++) {
                        if (sortedArray[i] != j) {
                            blankRange[0] = j - 1;
                            j = sortedArray[i];
                            blankRange[1] = j;
                        }
                        j++;
                    }

                    if (inequality === 'OR') {

                        // Patch if following case encounter: e.g x > 2 || x<1 i.e x is not between 1 & 2. 

                        var condition1 = leftInequality === '>' && rightInequality == '<' && (parseInt(firstInput, 10) - parseInt(secondInput, 10)) == 1,
                            condition2 = leftInequality === '<' && rightInequality == '>' && (parseInt(secondInput, 10) - parseInt(firstInput, 10)) == 1;
                        if (condition1) {
                            blankRange[0] = secondInput;
                            blankRange[1] = firstInput;
                        }

                        else if (condition2) {
                            blankRange[0] = firstInput;
                            blankRange[1] = secondInput;
                        }


                        // Plant 2 nets for 'OR' condition

                        // Margin & Width of Net 1
                        var margin_1 = this.$el.find('#' + this.idPrefix + 'number-grid-element-' + (leftRangeItems[0] - (startNum - 1))).offset().left - this.$el.find('#' + this.idPrefix + 'number-grid-element-1').offset().left,
                         width_1 = this.$el.find('#' + this.idPrefix + 'number-grid-element-' + (leftRangeItems[leftRangeItems.length - 1] - (startNum - 1))).offset().left - this.$el.find('#' + this.idPrefix + 'number-grid-element-' + (leftRangeItems[0] - (startNum - 1))).offset().left;

                        // Margin & Width of Net 2
                        var margin_2 = this.$el.find('#' + this.idPrefix + 'number-grid-element-' + (rightRangeItems[0] - (startNum - 1))).offset().left - this.$el.find('#' + this.idPrefix + 'number-grid-element-1').offset().left,
                                width_2 = this.$el.find('#' + this.idPrefix + 'number-grid-element-' + (rightRangeItems[rightRangeItems.length - 1] - (startNum - 1))).offset().left - this.$el.find('#' + this.idPrefix + 'number-grid-element-' + (rightRangeItems[0] - (startNum - 1))).offset().left;

                        this.drawNetDirectionLines(margin_1, width_1, margin_2, width_2);

                        // Patch for case x< value1 || x>value1
                        var xPointPatchCondition = (firstInput == secondInput && ((leftInequality === '<' && rightInequality === '>') || (leftInequality === '>' && rightInequality === '<')) && inequality === 'OR');

                        if (xPointPatchCondition) {
                            width_1 = width_1 - 2;
                            width_2 = width_2 - 2;
                            if (leftInequality == '<') {
                                margin_2 = margin_2 + 2;
                            }
                            else {
                                margin_1 = margin_1 + 2;
                            }
                        }

                        // Patch End


                        $fishnet_2.css({ 'margin-left': (margin_2 + fishnetStart) + 'px', 'width': width_2 + 'px' });
                        $fishnet_2.animate({ 'height': '210px' }, castNetAnimInterval);



                        /******** Logic to Draw Net Grid ********/

                        if (blankRange.length <= 1 && !xPointPatchCondition) {
                            var marginGrid = this.$el.find('#' + this.idPrefix + 'number-grid-element-' + (sortedArray[0] - (startNum - 1))).offset().left - this.$el.find('#' + this.idPrefix + 'number-grid-element-1').offset().left,
                                widthGrid = this.$el.find('#' + this.idPrefix + 'number-grid-element-' + (sortedArray[sortedArray.length - 1] - (startNum - 1))).offset().left - this.$el.find('#' + this.idPrefix + 'number-grid-element-' + (sortedArray[0] - (startNum - 1))).offset().left;
                            $fishnet_grid_1.css({ 'margin-left': (marginGrid + fishnetStart) + 'px', 'width': widthGrid + 'px' });
                            $fishnet_grid_1.animate({ 'height': '210px' }, castNetAnimInterval);
                        }
                        else {
                            if (!xPointPatchCondition) {
                                var margin_1 = this.$el.find('#' + this.idPrefix + 'number-grid-element-' + (leftRangeItems[0] - (startNum - 1))).offset().left - this.$el.find('#' + this.idPrefix + 'number-grid-element-1').offset().left,
                                 width_1 = this.$el.find('#' + this.idPrefix + 'number-grid-element-' + (leftRangeItems[leftRangeItems.length - 1] - (startNum - 1))).offset().left - this.$el.find('#' + this.idPrefix + 'number-grid-element-' + (leftRangeItems[0] - (startNum - 1))).offset().left;

                                var margin_2 = this.$el.find('#' + this.idPrefix + 'number-grid-element-' + (rightRangeItems[0] - (startNum - 1))).offset().left - this.$el.find('#' + this.idPrefix + 'number-grid-element-1').offset().left,
                                        width_2 = this.$el.find('#' + this.idPrefix + 'number-grid-element-' + (rightRangeItems[rightRangeItems.length - 1] - (startNum - 1))).offset().left - this.$el.find('#' + this.idPrefix + 'number-grid-element-' + (rightRangeItems[0] - (startNum - 1))).offset().left;
                            }
                            $fishnet_grid_2.css({ 'margin-left': (margin_2 + fishnetStart) + 'px', 'width': width_2 + 'px' });
                            $fishnet_grid_2.animate({ 'height': '210px' }, castNetAnimInterval);
                            $fishnet_grid_1.css({ 'margin-left': (margin_1 + fishnetStart) + 'px', 'width': width_1 + 'px' });
                            $fishnet_grid_1.animate({ 'height': '210px' }, castNetAnimInterval);
                        }

                        /***********************************/
                    }

                    else {

                        // And condition requires only single net

                        var margin_1 = this.$el.find('#' + this.idPrefix + 'number-grid-element-' + (sortedArray[0] - (startNum - 1))).offset().left - this.$el.find('#' + this.idPrefix + 'number-grid-element-1').offset().left,
                            width_1 = this.$el.find('#' + this.idPrefix + 'number-grid-element-' + (blankRange[0] - (startNum - 1))).offset().left - this.$el.find('#' + this.idPrefix + 'number-grid-element-' + (sortedArray[0] - (startNum - 1))).offset().left;

                        this.drawNetDirectionLines(margin_1, width_1);

                        $fishnet_grid_1.css({ 'margin-left': (margin_1 + fishnetStart) + 'px', 'width': width_1 + 'px' });
                        $fishnet_grid_1.animate({ 'height': '210px' }, castNetAnimInterval);
                    }


                    /******** Logic to count fish catched in net********/

                    var startCol = sortedArray[0] - (startNum - 1),
                        endCol = sortedArray[sortedArray.length - 1] - startNum,
                        fishCount = this.fishCollection.length,
                        catchedFish = 0,
                        blankRangeStart = blankRange[0] - (startNum - 1),
                        blankRangeEnd = blankRange[1] - startNum;

                    // Count Fish
                    for (var i = 0; i < fishCount; i++) {
                        if (startCol <= this.fishCollection.models[i].get('colNo') && this.fishCollection.models[i].get('colNo') <= endCol) {
                            catchedFish++;
                        }
                    }

                    // Reducing count of blank region which is counted.
                    for (var i = 0; i < fishCount; i++) {
                        if (blankRangeStart <= this.fishCollection.models[i].get('colNo') && this.fishCollection.models[i].get('colNo') <= blankRangeEnd) {
                            catchedFish--;
                        }
                    }


                    $fishnet_1.css({ 'margin-left': (margin_1 + fishnetStart) + 'px', 'width': width_1 + 'px' });
                    $fishnet_1.animate({ 'height': '210px' }, castNetAnimInterval, $.proxy(this._adjustFishMargins, this, startCol, endCol, catchedFish, skipAnimation));

                    this.leftInputBoxView.disableInputBox();
                    this.rightInputBoxView.disableInputBox();
                    this.enableComboBox(false);

                }
                else {
                    // Net Range is 0
                    self.castNetButton.hideButton();
                    if (skipAnimation !== true) {
                        self.showPopup(false);
                    }
                    self.retryButton.showButton();
                    this.leftInputBoxView.disableInputBox();
                    this.rightInputBoxView.disableInputBox();
                    this.enableComboBox(false);
                }
            }
            else {
                var tooltipText = this.getMessage('tooltip-text', 0, range),
                commonTooltipText = '<ul><li>' + tooltipText + '</li><li>' + tooltipText + '</li></ul>';

                if ((firstInput < startNum || firstInput > endNum) && (secondInput < startNum || secondInput > endNum)) {
                    this.tooltipViewBoth = MathInteractives.global.Theme2.Tooltip.generateTooltip({
                        elementEl: this.idPrefix + 'inequality-selection-container',
                        idPrefix: this.idPrefix,
                        manager: this.manager,
                        _player: this._player,
                        type: MathInteractives.Common.Components.Theme2.Views.Tooltip.TYPE.FORM_VALIDATION,
                        arrowType: MathInteractives.Common.Components.Theme2.Views.Tooltip.ARROW_TYPE.TOP_MIDDLE,
                        path: this.filePath,
                        isTts: false,
                        containerHeight: 40,
                        containerWidth: 600,
                        isArrow: false,
                        text: commonTooltipText
                    });
                    this.tooltipViewBoth.showTooltip();
                    this.castNetButton.hideButton();
                }

                else {
                    if (firstInput < startNum || firstInput > endNum) {

                        this.tooltipViewLeft = MathInteractives.global.Theme2.Tooltip.generateTooltip({
                            elementEl: this.idPrefix + 'left-input',
                            idPrefix: this.idPrefix,
                            manager: this.manager,
                            _player: this._player,
                            type: MathInteractives.Common.Components.Theme2.Views.Tooltip.TYPE.FORM_VALIDATION,
                            arrowType: MathInteractives.Common.Components.Theme2.Views.Tooltip.ARROW_TYPE.TOP_MIDDLE,
                            path: this.filePath,
                            isTts: false,
                            text: this.getMessage('tooltip-text', 0, range)
                        });


                        this.tooltipViewLeft.showTooltip();
                        this.castNetButton.hideButton();
                    }

                    else if (secondInput < startNum || secondInput > endNum) {
                        this.tooltipViewRight = MathInteractives.global.Theme2.Tooltip.generateTooltip({
                            elementEl: this.idPrefix + 'right-input',
                            idPrefix: this.idPrefix,
                            manager: this.manager,
                            _player: this._player,
                            type: MathInteractives.Common.Components.Theme2.Views.Tooltip.TYPE.FORM_VALIDATION,
                            arrowType: MathInteractives.Common.Components.Theme2.Views.Tooltip.ARROW_TYPE.TOP_MIDDLE,
                            path: this.filePath,
                            isTts: false,
                            text: this.getMessage('tooltip-text', 0, range)
                        });

                        this.tooltipViewRight.showTooltip();
                        this.castNetButton.hideButton();
                    }
                }

            }

        },

        /**
       * Function to enable & disable combo boxes
       * @method enableComboBox
       **/
        enableComboBox: function enableComboBox(bEnable) {
            if (bEnable) {
                this.dropDownObject.models[0].set('bEnabled', true);
                this.dropDownObject.models[1].set('bEnabled', true);
                this.dropDownObject.models[2].set('bEnabled', true);
            }
            else {
                this.dropDownObject.models[0].set('bEnabled', false);
                this.dropDownObject.models[1].set('bEnabled', false);
                this.dropDownObject.models[2].set('bEnabled', false);
            }

        },

        /**
        * Function to draw bottom direction lines
        * @method drawNetDirectionLines
        **/
        drawNetDirectionLines: function drawNetDirectionLines(margin_1, width_1, margin_2, width_2) {

            var leftInequality = this.dropDownObject.models[0].get('selectedOptionData'),
            rightInequality = this.dropDownObject.models[1].get('selectedOptionData'),
            inequality = this.dropDownObject.models[2].get('selectedOptionData');

            if (inequality === 'OR') {

                // line width beyond boundaries condition
                var widthLine1 = width_1, widthLine2 = width_2;
                if (width_1 < 15) {
                    widthLine1 = 15;
                    if (leftInequality === '<') {
                        margin_1 = margin_1 - 14;
                    }
                }
                if (width_2 < 15) {
                    widthLine2 = 15;
                    if (rightInequality === '<') {
                        margin_2 = margin_2 - 14;
                    }
                }

                this.$el.find('#' + this.idPrefix + 'line-1-wrapper').css({ 'visibility': 'visible' });
                this.$el.find('#' + this.idPrefix + 'line-2-wrapper').css({ 'visibility': 'visible' });


                this.$el.find('#' + this.idPrefix + 'line-1').css({
                    'width': (widthLine1 - 5) + 'px', 'border-bottom': '3px solid rgb(163,12,196)', 'padding-top': '8px', 'float': 'left'
                });

                this.$el.find('#' + this.idPrefix + 'line-2').css({
                    'width': (widthLine2 - 10) + 'px', 'border-bottom': '3px solid rgb(251,213,0)', 'padding-top': '8px', 'float': 'left'
                });


                if (leftInequality === '<') {
                    this.$el.find('#' + this.idPrefix + 'line-1-head').css({
                        'margin-left': (margin_1 + 16) + 'px', 'height': '0px', 'border': '7px solid transparent', 'border-right': '7px solid rgb(163,12,196)', 'border-radius': '0px', 'width': '0px'
                    });
                    // compound-fishtank-line-2 width dec by 1
                    this.$el.find('#' + this.idPrefix + 'line-1').css({
                        'width': (widthLine1 - 6) + 'px'
                    });

                    this.$el.find('#' + this.idPrefix + 'line-1-tail').css({
                        'border-radius': '50%', 'border': '3px solid rgb(163,12,196)', 'width': '8px', 'height': '8px'
                    });
                }
                else {
                    this.$el.find('#' + this.idPrefix + 'line-1-head').css({
                        'margin-left': (margin_1 + 24) + 'px', 'border-radius': '50%', 'border': '3px solid rgb(163,12,196)', 'width': '8px', 'height': '8px'
                    });
                    // compound-fishtank-line-2 width dec by 3
                    this.$el.find('#' + this.idPrefix + 'line-1').css({
                        'width': (widthLine1 - 6) + 'px'
                    });
                    this.$el.find('#' + this.idPrefix + 'line-1-tail').css({
                        'width': '0px', 'height': '0px', 'border': '7px solid transparent', 'border-left': '7px solid rgb(163,12,196)', 'border-radius': '0px'
                    });
                }

                if (rightInequality === '<') {
                    this.$el.find('#' + this.idPrefix + 'line-2-head').css({
                        'margin-left': (margin_2 + 16) + 'px', 'height': '0px', 'border': '7px solid transparent', 'border-right': '7px solid rgb(251,213,0)', 'border-radius': '0px', 'width': '0px'
                    });
                    // compound-fishtank-line-2 width increase by 3
                    this.$el.find('#' + this.idPrefix + 'line-2').css({
                        'width': (widthLine2 - 7) + 'px'
                    });
                    this.$el.find('#' + this.idPrefix + 'line-2-tail').css({
                        'border-radius': '50%', 'border': '3px solid rgb(251,213,0)', 'width': '8px', 'height': '8px'
                    });
                }
                else {
                    this.$el.find('#' + this.idPrefix + 'line-2-head').css({
                        'margin-left': (margin_2 + 24) + 'px', 'border-radius': '50%', 'border': '3px solid rgb(251,213,0)', 'width': '8px', 'height': '8px'
                    });
                    // compound-fishtank-line-2 width increase by 2
                    this.$el.find('#' + this.idPrefix + 'line-2').css({
                        'width': (widthLine2 - 7) + 'px'
                    });
                    this.$el.find('#' + this.idPrefix + 'line-2-tail').css({
                        'width': '0px', 'height': '0px', 'border': '7px solid transparent', 'border-left': '7px solid rgb(251,213,0)', 'border-radius': '0px'
                    });
                }
            }
            else {

                if (width_1 > 20) {
                    this.$el.find('#' + this.idPrefix + 'line-1-head').css({
                        'margin-left': (margin_1 + 24) + 'px', 'border-radius': '50%', 'border': '3px solid rgb(163,12,196)', 'width': '8px', 'height': '8px'
                    });
                    this.$el.find('#' + this.idPrefix + 'line-1-tail').css({
                        'border-radius': '50%', 'border': '3px solid rgb(163,12,196)', 'width': '8px', 'height': '8px'
                    });

                    this.$el.find('#' + this.idPrefix + 'line-1-wrapper').css({ 'visibility': 'visible' });

                    this.$el.find('#' + this.idPrefix + 'line-1').css({
                        'width': (width_1 - 14) + 'px', 'border-bottom': '3px solid rgb(163,12,196)', 'padding-top': '8px', 'float': 'left'
                    });

                }

            }

        },


        /**
       * Function to hide all tool tips
       * @method hideAllTooltip
       **/
        hideAllTooltip: function hideAllTooltip() {

            if (this.tooltipViewLeft !== null) { this.tooltipViewLeft.hideTooltip(); }
            if (this.tooltipViewBoth !== null) { this.tooltipViewBoth.hideTooltip(); }
            if (this.tooltipViewRight !== null) { this.tooltipViewRight.hideTooltip(); }
        },
        _adjustFishMargins: function _adjustFishMargins(startCol, endCol, catchedFish, skipAnimation) {
            var self = this,
            
                $afterStartColFishes = $('.fish[col=' + startCol + '], .fish[col=' + (endCol + 1) + ']'),
                marginLeft=null,
                i=null,
                index=null,
                fishToAnimate=[],
               // $beforeStartColFishes = $('.fish[col=' + (startCol - 1) + ']'),
                //$afterEndColFishes = $('.fish[col=' + endCol + ']'),
                //$afterEndColFishes = $('.fish[col=' + (endCol + 1) + ']'),
                isFishPresent = false;
                debugger
            if ($afterStartColFishes.length > 0) {
                for(i=0;i<$afterStartColFishes.length;i++)
                {
                marginLeft = parseInt($($afterStartColFishes[i]).css('margin-left').replace('px', ''), 10);
                    if(marginLeft<0)
                    {
                        fishToAnimate.push($afterStartColFishes[i]);
                    }
                }
                isFishPresent = true;
            }

            if(fishToAnimate.length>0)
            {
            self._resetMargin(fishToAnimate, catchedFish, skipAnimation);
            
            }
//            if ($beforeStartColFishes.length > 0) {
//                $beforeStartColFishes.each(function () {
//                    self._resetMargin(this, catchedFish, skipAnimation)
//                });
//                isFishPresent = true;
//            }
//            if ($afterEndColFishes.length > 0) {
//                $afterEndColFishes.each(function () {
//                    self._resetMargin(this, catchedFish, skipAnimation)
//                });
//                isFishPresent = true;
//            }
//            if ($beforeEndColFishes.length > 0) {
//                $beforeEndColFishes.each(function () {
//                    self._resetMargin(this, catchedFish, skipAnimation);
//                });
//                isFishPresent = true;
//            }

            if (!isFishPresent) {
                this.showFeedback(catchedFish);
            }
        },

        _resetMargin: function _resetMargin(fish, catchedFish, skipAnimation) {
            var self = this,
                marginLeft = parseInt($(fish).css('margin-left').replace('px', ''), 10),
                animInterval = MathInteractives.Interactivities.CompoundFishtank.Views.CatchFish.PUSH_FISH_ANIM_INTERVAL;

            if (skipAnimation === true) {
                animInterval = 0;
            }

            
                $(fish).animate({ 'margin-left': '0px' }, animInterval, function () {
                    if (self.isShowPopUp) {
                        self.showFeedback(catchedFish);
                        self.isShowPopUp = false;
                    }
                });
           
        },

        showFeedback: function showFeedback(catchedFish) {
            this.castNetButton.hideButton();
            if (this.noOfFishesToCatch[0] !== catchedFish) {
                this.showPopup(false);
                this.retryButton.showButton();
            }
            else {
                this.showPopup(true);
                this.isGamePlayed = false;
                this.newSolutionButton.showButton()
                this.catchFishTabModel.set('isSuccess', true);
            }
        },

        /**
        * Function to show popup for feedback message
        *
        * @method showPopup
        **/
        showPopup: function (catchResult) {
            MathInteractives.global.SpeechStream.stopReading();

            var bgPositionX=null,
                bgPositionY=null,
                imageHeight = null,
                textElement = null,
                imageWidth = null;

            if (catchResult === true) {
                textElement = 'catch-fish-good-catch-popup-text';
                bgPositionX = 0;
                bgPositionY= 0;
                imageHeight = '599';
                imageWidth = '928';
            }
            else {
                textElement = 'catch-fish-fishy-popup-text';
                bgPositionX = 0;
                bgPositionY= -620;
                imageHeight = '599';
                imageWidth = '928';
            }

            MathInteractives.global.Theme2.PopUpBox.createPopup({
                text: this.getMessage(textElement, 'text'),
                accText: this.getAccMessage(textElement, 'text'),
                title: this.getMessage(textElement, 'title'),
                accTitle: this.getAccMessage(textElement, 'title'),
                manager: this.manager,
                player: this.player,
                path: this.filePath,
                idPrefix: this.idPrefix,
                backgroundImageBackgroundPositionX:bgPositionX,
                backgroundImageBackgroundPositionY:bgPositionY,
                backgroundImage: {
                    imageId: 'bg-img',
                    imageHeight: imageHeight,
                    imageWidth: imageWidth
                },
                closeCallback: {
                    fnc: function () { if (catchResult === false) { } },
                    scope: this
                }

            });

        },


        /**
       * Function to find intersecting elements in two arrays
       *
       * @method commonArrayItems
       **/
        commonArrayItems: function commonArrayItems(array1, array2) {
            var commonItems = array1.filter(function (el) {
                return array2.indexOf(el) != -1
            });
            return commonItems;
        },


        /**
       * Function returns array removing duplicate elements
       *
       * @method uniqueArrayItems
       **/
        uniqueArrayItems: function uniqueArrayItems(a) {
            for (var i = 0; i < a.length; ++i) {
                for (var j = i + 1; j < a.length; ++j) {
                    if (a[i] === a[j])
                        a.splice(j--, 1);
                }
            }
            return a;
        },

        _setHelpElements: function _setHelpElements() {
            var helpElements = this.model.get('helpElements');

            helpElements.push(
                { elementId: 'left-inequality-wrapper' },
                { elementId: 'right-input', position: 'top' },
                { elementId: 'conjunction-combo-wrapper', position: 'top' },
                { elementId: 'inequality-btn', position: 'top' },
                { elementId: 'retry-btn', position: 'top' },
                { elementId: 'new-solution-btn', position: 'top' },
                { elementId: 'inequality-notification-direction-text-buttonholder', position: 'left' }
                );
        }


    },
    {
        /**
        * container prefix for grid
        * 
        * @property CONTAINER_PREFIX
        * @type String
        * @final
        **/
        CONTAINER_PREFIX: 'catch-',
        /**
        * starting margin of fishnet
        * 
        * @property FISHNET_START
        * @type Number
        * @final
        **/
        FISHNET_START: 32,
        /**
        * fish animation time interval
        * 
        * @property PUSH_FISH_ANIM_INTERVAL
        * @type Number
        * @final
        **/
        PUSH_FISH_ANIM_INTERVAL: 500,

        /**
        * Cast net animation time interval
        * 
        * @property CAST_NET_ANIM_INTERVAL
        * @type Number
        * @final
        **/
        CAST_NET_ANIM_INTERVAL: 500,

    })
})()