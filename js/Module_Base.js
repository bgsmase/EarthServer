//Namespace
var EarthServerGenericClient = EarthServerGenericClient || {};

/**
 * @class Abstract base class for scene models.
 */
EarthServerGenericClient.AbstractSceneModel = function(){
    /**
     * Sets the name of the scene model.
     * @param modelName - Name of the model.
     */
    this.setName = function(modelName){
        this.name = String(modelName);
    };

    /**
     * Returns the name of the model.
     * @returns {String}
     */
    this.getName = function()
    {
        return this.name;
    };

    /**
     * Sets the area of interest for the model. (Lower Corner, Upper Corner)
     * @param minx - Minimum/Lower Latitude
     * @param miny - Minimum/Lower Longitude
     * @param maxx - Maximum/Upper Latitude
     * @param maxy - Maximum/Upper Longitude
     * @param minh - Minimum/Lower Height
     * @param maxh - Maximum/Upper Height
     */
    this.setAreaOfInterest = function(minx,miny,maxx,maxy,minh,maxh){
        this.minx = minx;
        this.miny = miny;
        this.maxx = maxx;
        this.maxy = maxy;
        this.minh = minh;
        this.maxh = maxh;
    };

    /**
     * Returns object with the area of interest of the model. (minx,miny,maxx,maxy)
     * @returns {{}}
     */
    this.getAreaOfInterest = function()
    {
        var aoi = {};
        aoi.minx = this.minx;
        aoi.miny = this.miny;
        aoi.maxx = this.maxx;
        aoi.maxy = this.maxy;

        return aoi;
    };

    /**
     * Set the axis label to be used for the X axis in WCS and WCPS queries 
     */
    this.setXAxisLabel = function( label )
    {
        this.xAxisLabel = label;
    };

    /**
     * Set the axis label to be used for the Y axis in WCS and WCPS queries 
     */
    this.setYAxisLabel = function( label )
    {
        this.yAxisLabel = label;
    };

    /**
     * Set the axis label to be used for the Z axis in WCS and WCPS queries 
     */
    this.setZAxisLabel = function( label )
    {
        this.zAxisLabel = label;
    };

    /**
     * Sets the height resolution of the model. This effects the scaling of the elevation of the model.
     * The parameter should be the difference between the smallest and biggest value of the DEM.
     * Setting the same value for this and setHeightMinimum for all models puts them on the same scale.
     * Make the sure the value fits to the model's size.
     * @param value
     */
    this.setHeightResolution = function( value )
    {
        if( !isNaN(value) ) // has to be a number or undefined behavior will occur
        {
            this.YResolution = value;
        }
    };

    /**
     * Sets the minimum height of the model. This affects the scaling of the elevation of the model.
     * The parameter should be less than the minimum value of the DEM.
     * Setting the same value for this and setHeightResolution for all models puts them on the same scale.
     * Make the sure the value fits to the model's size.
     * @param value
     */
    this.setHeightMinimum = function( value )
    {
        if( !isNaN(value) ) // has to be a number or undefined behavior will occur
        {
            this.YMinimum = value;
        }
    };

    /**
     * Sets the resolution of the scene model (if possible).
     * @param xRes - Resolution on the x-axis/Latitude
     * @param zRes - Resolution on the z-axis/Longitude
     */
    this.setResolution = function(xRes,zRes){
        this.XResolution = parseInt(xRes);
        this.ZResolution = parseInt(zRes);

        var maxResolution = EarthServerGenericClient.MainScene.getMaxResolution();
        if( this.XResolution > maxResolution )
        {   this.XResolution = maxResolution;   }
        if( this.ZResolution > maxResolution )
        {   this.ZResolution = maxResolution;   }

    };

    /**
     * Sets the position of the scene model within the fishtank/cube. Values between [0-1]
     * @param xOffset - Offset on the x-axis/width  Default:0
     * @param yOffset - Offset on the y-axis/height Default:0
     * @param zOffset - Offset on the z-axis/depth  Default:0
     */
    this.setOffset = function( xOffset, yOffset, zOffset){
        this.xOffset = parseFloat(xOffset);
        this.yOffset = parseFloat(yOffset);
        this.zOffset = parseFloat(zOffset);
    };
    /**
     * Sets the size of the scene model compared to the fishtank/cube. Values between 0 - 1.
     * @param xScale - Size of the model on the x-axis/width  Default:1   (whole cube)
     * @param yScale - Size of the model on the y-axis/height Default:0.3 (30% of the cube)
     * @param zScale - Size of the model on the x-axis/width  Default:1   (whole cube)
     */
    this.setScale = function( xScale, yScale, zScale){
        this.xScale = parseFloat(xScale);
        this.yScale = parseFloat(yScale);
        this.zScale = parseFloat(zScale);
    };

    /**
     * Sets the image format for the server request.
     * @param imageFormat - Default "png".
     */
    this.setImageFormat = function( imageFormat){
        this.imageFormat = String(imageFormat);
    };

    /**
     * Sets the initial transparency of the scene model.
     * The function accepts a parameter value in the range of 0 (fully opaque) and 1(fully transparent).
     * @param transparency - Value of transparency.
     */
    this.setTransparency = function( transparency ){
        this.transparency = parseFloat(transparency);
    };

    /**
     * Sets the specular color for the scene model.
     * @param color - Color in rgb.
     */
    this.setSpecularColor = function( color )
    {
        this.specularColor = color;
    };

    /**
     * Sets the diffuse color for the scene model.
     * @param color - Color in rgb.
     */
    this.setDiffuseColor = function( color )
    {
        this.diffuseColor = color;
    };

    /**
     * Sets if side panels should be added to the model.
     * @param value
     */
    this.setSidePanels = function( value )
    {
        this.sidePanels = value;
    };



    /**
     * Sets the queries for the four side panels' textures.
     * @param links - Array with four image links.
     */
    this.setSidePanelsImageLinks = function( links )
    {
        if( links.length !== 4)
        {
            console.log("EarthServerClient::ModuleBase: Links array for side panels needs exact 4 queries.");
        }
        else
        {
            this.sidePanelsLinks = links;
        }
    };

    /**
     * Updates the transparency during runtime of the scene model.
     * The function accepts a value in the range of 0 (fully opaque) and 1(fully transparent).
     * @param transparency - Value of transparency.
     */
    this.updateTransparency = function( transparency ){
        this.terrain.setTransparency(transparency);
    };

    /**
     * Calls the light update function of the model's terrain.
     * @param lightDomElement - The light dom element.
     */
    this.lightUpdate = function(lightDomElement)
    {
        this.terrain.lightUpdate(lightDomElement);
    };

    /**
     * Returns the minimum value of the models data at the given axis.
     * @param axis - 0=x 1=y= 2=z
     */
    this.getMinDataValueAtAxis = function(axis)
    {
        if( this.terrain)
            return this.terrain.getMinDataValueAtAxis( axis);
        else
        {
            console.log("EarthServerGenericClient::Module_Base::getMinDataValueAtAxis(): this.terrain is not defined");
            return 0;
        }
    };

    /**
     * Modules report their loading progress with this function which reports to the main scene.
     */
    this.reportProgress = function()
    {
        // The total progress of this module depends on the number of requests it does.
        // The progress parameter is the progress of ONE request.
        // ReceivedDataCount is the number of already received responses.
        // it is doubled because for each request one terrain will be build.
        EarthServerGenericClient.MainScene.reportProgress(this.index);
    };

    /**
     * Sets the RGB value to be considered as NODATA in the TEXTURE. All pixels with this RGB value will be drawn transparent.
     * @param red - Value for the red channel.
     * @param green - Value for the green channel.
     * @param blue - Value for the blue channel.
     */
    this.setTextureNoDataValue = function(red,green,blue)
    {
        this.noData = [];
        this.noData[0] = parseInt(red);
        this.noData[1] = parseInt(green);
        this.noData[2] = parseInt(blue);
    };

    /**
     * Sets the DEM value to be considered as NODATA in the DEM. No Faces will be drawn having a vertex with that value.
     * @param value - No data value
     */
    this.setDemNoDataValue = function( value )
    {
        this.demNoData = value;
    };

    /**
     * Returns the noData Value for the DEM or undefined if not set.
     * @returns {float}
     */
    this.getDemNoDataValue = function()
    {
        return this.demNoData;
    };

    /**
     * Replaces all $xx symbols with the value-
     * @param inputString - Input WCPS query string.
     * @returns {String} - String with symbols replaced by values.
     */
    this.replaceSymbolsInString = function(inputString)
    {
        var out;
        out = EarthServerGenericClient.replaceAllFindsInString(inputString,"$CI",this.coverageImage);
        out = EarthServerGenericClient.replaceAllFindsInString(out,"$CD",this.coverageDEM);
        out = EarthServerGenericClient.replaceAllFindsInString(out,"$CT",this.coverageTime);
        out = EarthServerGenericClient.replaceAllFindsInString(out,"$MINX",this.minx);
        out = EarthServerGenericClient.replaceAllFindsInString(out,"$MINY",this.miny);
        out = EarthServerGenericClient.replaceAllFindsInString(out,"$MAXX",this.maxx);
        out = EarthServerGenericClient.replaceAllFindsInString(out,"$MAXY",this.maxy);
        out = EarthServerGenericClient.replaceAllFindsInString(out,"$CRS" ,this.CRS);
        out = EarthServerGenericClient.replaceAllFindsInString(out,"$RESX",this.XResolution);
        // allows users to use either $RESY or $RESZ
        out = EarthServerGenericClient.replaceAllFindsInString(out,"$RESZ",this.ZResolution);
        out = EarthServerGenericClient.replaceAllFindsInString(out,"$RESY",this.ZResolution);

        return out;
    };

    /**
     * sets if no texture shall be used. If true the terrain uses the default or specified color only.
     * @param value
     */
    this.setColorOnly = function(value)
    {
        this.colorOnly = value;
    };

    /**
     * Validates the received data from the server request.
     * Checks if a texture and a heightmap are available at the moment.
     * @param data - Received data from the server request.
     * @returns {boolean} - TRUE if OK, FALSE if some data is missing
     */
    this.checkReceivedData = function( data)
    {
        this.receivedDataCount++;
        this.reportProgress();

        // No texture whished?
        if( this.colorOnly && data !== null && data !== undefined)
        {
            data.validateTexture = false; // disable check for texture
            data.texture = undefined;
        }

        if( data === null || !data.validate() )
        {
            alert(this.name +": Request not successful.");
            console.log(data);
            this.reportProgress();//NO Terrain will be built so report the progress here
            this.removePlaceHolder();//Remove the placeHolder.

            //delete UI elements
            var header = document.getElementById("EarthServerGenericClient_ModelHeader_"+this.index);
            var div = document.getElementById("EarthServerGenericClient_ModelDiv_"+this.index);

            if(header && div)
            {
                var parent = div.parentNode;

                if(parent)
                {
                    parent.removeChild(div);
                    parent.removeChild(header);
                }
            }
            return false;
        }

        // add module specific values
        data.transparency =  this.transparency;
        data.specularColor = this.specularColor || EarthServerGenericClient.MainScene.getDefaultSpecularColor();
        data.diffuseColor = this.diffuseColor || EarthServerGenericClient.MainScene.getDefaultDiffuseColor();

        return true;
    };

    /**
     * Add this module as a child of the module with the parameter parentName.
     * @param parentName
     */
    this.addAsChildOf = function( parentName )
    {
        this.isChildOf = parentName;
    };

    /**
     * Returns a list of all children (including children of children).
     * Used to detect loops.
     */
    this.getChildList = function()
    {
        var children = [];

        for(var i=0; i<this.bindings.length;i++)
        {
            // add name of every child
            children.push(this.bindings[i].name );
            // add list of child names of every child
            var tmp = this.bindings[i].getChildList();
            children = children.concat(tmp);
        }

        return children;
    };

    /**
     * Adds an Object that will be informed about movements and alterations of the model.
     * @param bindingObject - Object that will receive the notification.
     */
    this.addBinding = function(bindingObject)
    {
        for(var i=0; i<this.bindings.length;i++)
        {
            if(this.bindings[i] == bindingObject)
            {
                console.log(this.name + "::addBinding: Object already registered.");
                return;
            }
        }
        this.bindings.push(bindingObject);
        bindingObject.setBoundModuleIndex(this.index);
    };

    /**
     * Removes an Object that will be informed about movements and alterations of the model.
     * @param bindingObject - Object that will no longer receive the notification.
     */
    this.removeBinding = function(bindingObject)
    {
        for(var i=0; i<this.bindings.length;i++)
        {
            if( this.bindings[i] === bindingObject)
            {
                this.bindings[i].releaseBinding();
                this.bindings = EarthServerGenericClient.arrayRemove(this.bindings,i,i);
                return;
            }
        }
    };

    /**
     * This function is called if the model is moved in the scene.
     * All bindings will also get the movement update.
     * @param movementType - Type of the movement: xAxis,zAxis,elevation...
     * @param value - Updated position
     */
    this.movementUpdateBindings = function(movementType,value)
    {
        this.updateLock = true;
        for(var i=0; i<this.bindings.length;i++)
        {
            this.bindings[i].movementUpdateBoundModule(movementType,value);
        }
        this.updateLock = false;
    };

    /**
     * This function calls every binding object that the elevation of the models was changed.
     * @param value - This is the value the that was given to SceneManager::updateElevation().
     */
    this.elevationUpdateBinding = function(value)
    {
        this.updateLock = true;
        if(value === undefined)
        {   value = 10; }//TODO DEFINE some basic start values for UI etc.

        for(var i=0; i<this.bindings.length;i++)
        {
            this.bindings[i].elevationUpdateBoundModule(value);
        }
        this.updateLock = false;
    };

    /**
     * Sets the index of the scene model the sharad module is bound to.
     * @param index - Index of the scene model.
     */
    this.setBoundModuleIndex = function(index)
    {
        if(index === this.index)//prevent to bind this module to itself
        {
            console.log("Module_Base: Can't bind module to itself.");
        }
        else
        {
            this.boundModelIndex = index;
        }
    };

    /**
     * Returns the index of the model sharad module is bound to.
     * @returns {number} - Index of the model or -1 if unbound.
     */
    this.getBoundModuleIndex = function()
    {
        return this.boundModelIndex;
    };

    /**
     * Resets the modelIndex sharad module is bound to back to -1 and marks it as unbound.
     */
    this.releaseBinding = function()
    {
        this.boundModelIndex = -1;
    };

    /**
     * If the module is bound to another module the module shall move when the other module is moved.
     * This function shall receive the delta of the positions every time the module is moved.
     * @param axis - Axis of the movement.
     * @param delta - Delta to the last position.
     */
    this.movementUpdateBoundModule = function(axis,delta)
    {
        if( !this.updateLock )
            EarthServerGenericClient.MainScene.updateOffsetByDelta(this.index,axis,delta);
        else
            console.log("ModuleBase: Model " + this.name +" locked. Potential loop in child/parent structure.");
    };

    /**
     * This function notifies the module that the bound module's elevation was changed.
     * All annotation will be checked and altered in their position.
     */
    this.elevationUpdateBoundModule = function(value)
    {
        if( !this.updateLock )
            EarthServerGenericClient.MainScene.updateElevation(this.index,value);
        else
            console.log("ModuleBase: Model " + this.name +" locked. Potential loop in child/parent structure.");
    };

    /**
     * Returns the elevation value of it's terrain at a specific point in the 3D scene.
     * @param xPos - Position on the x-axis.
     * @param zPos - Position on the z-axis.
     * @returns {number} - The height on the y-axis.
     */
    this.getHeightAt3DPosition = function(xPos,zPos)
    {
        if( this.terrain)
        {
            return this.terrain.getHeightAt3DPosition(xPos,zPos);
        }
        else
        {   return 0; }
    };

    /**
     * Returns the dem value of it's terrain at a specific point in the 3D scene.
     * @param xPos - Position on the x-axis.
     * @param zPos - Position on the z-axis.
     * @returns {number} - The height of the dem.
     */
    this.getDemValueAt3DPosition = function(xPos,zPos)
    {
        if( this.terrain)
        {
            return this.terrain.getDemValueAt3DPosition(xPos,zPos);
        }
        else
        {   return 0; }
    };

    /**
     * This creates a placeholder Element for the model. It consists of an simple quad.
     * Models that use this placeholder should remove it of course.
     */
    this.createPlaceHolder = function()
    {
        var appearance = document.createElement('Appearance');
        var material = document.createElement('Material');
        material.setAttribute("emissiveColor","0.4 0.4 0.4");

        var trans = document.createElement('Transform');
        var yoff = (this.cubeSizeY * this.yOffset);
        trans.setAttribute("translation", "0 "+ yoff  + " 0");

        var shape = document.createElement('shape');
        var triangleset = document.createElement('IndexedFaceSet');
        triangleset.setAttribute("colorPerVertex", "false");
        triangleset.setAttribute("coordindex","0 1 2 3 -1");

        var coords = document.createElement('Coordinate');

        var cubeX = this.cubeSizeX/2.0;
        var cubeZ = this.cubeSizeZ/2.0;
        var cubeXNeg = -this.cubeSizeX/2.0;
        var cubeYNeg = -this.cubeSizeY/2.0;
        var cubeZNeg = -this.cubeSizeZ/2.0;

        var p = {};
        p[0] = ""+ cubeXNeg + " " + cubeYNeg + " " + cubeZNeg + " ";
        p[1] = ""+ cubeXNeg + " " + cubeYNeg + " " + cubeZ + " ";
        p[2] = ""+ cubeX    + " " + cubeYNeg + " " + cubeZ    + " ";
        p[3] = ""+ cubeX    + " " + cubeYNeg + " " + cubeZNeg;

        var points="";
        for(var i=0; i<4;i++)
        {   points = points+p[i];   }
        coords.setAttribute("point", points);

        triangleset.appendChild(coords);
        appearance.appendChild(material);
        shape.appendChild(appearance);
        shape.appendChild(triangleset);
        trans.appendChild(shape);

        this.placeHolder = trans;
        this.root.appendChild( this.placeHolder );

        appearance = null;
        material = null;
        shape = null;
        triangleset = null;
        coords = null;
        points = null;
        trans = null;
    };

    /**
     * Removes the PlaceHolder created in createPlaceHolder(). If already deleted nothing happens.
     */
    this.removePlaceHolder = function()
    {
        if( this.placeHolder !== null && this.placeHolder !== undefined )
        {
            this.root.removeChild( this.placeHolder);
            this.placeHolder = null;
        }
    };

    /**
     * Creates the transform for the scene model to fit into the fishtank/cube. This is done automatically by
     * the scene model.
     * @param xRes - Size of the received data on the x-axis (e.g. the requested DEM )
     * @param yRes - Size of the received data on the y-axis
     * @param zRes - Size of the received data on the z-axis
     * @param minHeightvalue - Minimum Value along the y-axis (e.g. minimum value in a DEM, so the model starts at it's wished location)
     * @param minXvalue - Minimum Value along the x-axis
     * @param minZvalue - Minimum Value along the z-axis
     * @return {Element}
     */
    this.createTransform = function(xRes,yRes,zRes,minHeightvalue,minXvalue,minZvalue){
        var trans = document.createElement('Transform');
        trans.setAttribute("id", "EarthServerGenericClient_modelTransform"+this.index);
        trans.setAttribute("onclick","EarthServerGenericClient.MainScene.OnClickFunction("+this.index+",event.hitPnt);");

        this.YResolution = yRes;
        this.minValue = minHeightvalue;

        if(zRes<1) zRes = 2;

       // var scaleX = (this.cubeSizeX*this.xScale)/(Math.ceil(xRes)-1);
        var scaleX = (this.cubeSizeX*this.xScale)/(xRes-1);
        var scaleY = (this.cubeSizeY*this.yScale)/this.YResolution;
        //var scaleZ = (this.cubeSizeZ*this.zScale)/(Math.ceil(zRes)-1);
        var scaleZ = (this.cubeSizeZ*this.zScale)/(zRes-1);
        trans.setAttribute("scale", "" + scaleX + " " + scaleY + " " + scaleZ);

        var xoff = (this.cubeSizeX * this.xOffset) - (this.cubeSizeX/2.0) - (scaleX * minXvalue);
        var yoff = (this.cubeSizeY * this.yOffset) - (minHeightvalue*scaleY) - (this.cubeSizeY/2.0);
        var zoff = (this.cubeSizeZ * this.zOffset) - (this.cubeSizeZ/2.0) - (scaleZ * minZvalue);
        trans.setAttribute("translation", "" + xoff+ " " + yoff  + " " + zoff);

        return trans;
    };

    /**
     * Updates the translation on the y-axis after the elevation was updated
     * so the model will stay in place.
     * @param newScale - The new scale value for the y-axis.
     */
    this.updateTranslationForElevation = function(newScale)
    {
        var trans = document.getElementById("EarthServerGenericClient_modelTransform"+this.index);

        if(trans)
        {
            var yoff = (this.cubeSizeY * this.yOffset) - ( this.minValue*newScale) - (this.cubeSizeY/2.0);
            var translation = trans.getAttribute("translation");
            var values = translation.split(" ");

            trans.setAttribute("translation", "" + values[0]+ " " + yoff  + " " + values[2]);
        }
        else
        {   console.log("EarthServerGenericClient::Module::updateTranslationForElevation " + this.index + ": Can't find transform.");    }

    };

    /**
     * Sets the default values. This is done automatically by the scene model.
     */
    this.setDefaults = function(){
        /**
         * Name of the model. This will be display in the UI.
         * @default Name is given by the module
         * @type {String}
         */
        this.name = "No name given";

        /**
         * All objects that are bound to the module. The will be noticed if the models is moved or altered.
         * Example: Annotation layers should be moved with the module and change the height when the elevation changes.
         * @type {Array}
         */
        this.bindings = [];

        /**
         * Default axis labels if not set explicitly (values used by rasdaman before v9)
         * (Not quite sure about 'Height'
         */
        this.xAxisLabel = 'x';
        this.yAxisLabel = 'Height';
        this.zAxisLabel = 'y';

        /**
         * Resolution for the latitude.
         * @default 500
         * @type {Number}
         */
        this.XResolution = 500;

        /**
         * Resolution for the longitude
         * @default 500
         * @type {Number}
         */
        this.ZResolution = 500;

        /**
         * Offset on the X-Axis for the model.
         * @default 0
         * @type {Number}
         */
        this.xOffset = 0;

        /**
         * Offset on the Y-Axis for the model.
         * @default 0
         * @type {Number}
         */
        this.yOffset = 0;

        /**
         * Offset on the Z-Axis for the model.
         * @default 0
         * @type {Number}
         */
        this.zOffset = 0;

        /**
         * The models dimension compared to the whole cube on the X-Axis.
         * @default 1
         * @type {Number}
         */
        this.xScale = 1;

        /**
         * The models dimension compared to the whole cube on the Y-Axis.
         * @default 0.3
         * @type {Number}
         */
        this.yScale = 0.3;

        /**
         * The models dimension compared to the whole cube on the Z-Axis.
         * @default 1
         * @type {Number}
         */
        this.zScale = 1;

        /**
         * The used Image format (if one is used)
         * @default "png"
         * @type {String}
         */
        this.imageFormat = "png";

        /**
         * The amount of requests the model do. It is needed to keep track of the loading progress.
         * @default 1
         * @type {number}
         */
        this.requests = 1;

        /**
         * The amount of already received responses. Along with requests this is used to keep track of the loading progress.
         * @default 0
         * @type {number}
         */
        this.receivedDataCount = 0;

        /**
         * The Transparency of the model.
         * @default 0
         * @type {Number}
         */
        this.transparency = 0;

        /**
         * Flag if side panels should be added to the terrain.
         * @default false
         * @type {boolean}
         */
        this.sidePanels = false;

        /**
         * Flag if no texture shall be used. If true the terrain uses the default or specified color only.
         * @default false
         * @type {boolean}
         */
        this.colorOnly = false;

        /**
         * Terrain of the module.
         */
        this.terrain = null;

        /**
         * Index aka. ID of the module.#
         * @type {Number}
         */
        this.index = -1;

        /**
         * Stores the name of the parent node.
         * @type {String}
         */
        this.isChildOf = null;

        /**
         * Lock while updating movement of it's children.
         * @type {boolean}
         */
        this.updateLock = false;
    };
};
